import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { content, user_id } = await request.json();

    if (!content || !user_id) {
      return NextResponse.json(
        { error: "コンテンツと user_id が必要です" },
        { status: 400 }
      );
    }

    // Claude API を呼び出して不適切さを判定
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-1-20250805",
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: `以下のコメントが不適切（暴言、差別、スパム、下品な内容など）かどうかを判定してください。

コメント: "${content}"

JSONで回答してください（日本語で）:
{
  "is_inappropriate": true/false,
  "severity": 0-10 (0=問題なし, 10=非常に不適切),
  "reason": "理由（不適切な場合のみ）",
  "category": "暴言|差別|スパム|下品|その他|問題なし"
}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Claude API エラー:", errorData);
      throw new Error(`Claude API エラー: ${response.status}`);
    }

    const apiResponse = await response.json();
    const textContent = apiResponse.content[0].text;

    // JSON を抽出
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Claude API からの応答が JSON 形式ではありません");
    }

    const judgment = JSON.parse(jsonMatch[0]);

    console.log("AI 判定結果:", {
      content: content.substring(0, 50) + "...",
      is_inappropriate: judgment.is_inappropriate,
      severity: judgment.severity,
      reason: judgment.reason,
    });

    return NextResponse.json({
      is_inappropriate: judgment.is_inappropriate,
      severity: judgment.severity,
      reason: judgment.reason || "不適切な内容が含まれています",
      category: judgment.category,
    });
  } catch (error) {
    console.error("AI 判定エラー:", error);

    // エラー時は安全側に倒す（ブロックしない）
    return NextResponse.json(
      {
        is_inappropriate: false,
        reason: "判定エラーが発生しました",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 } // クライアント側で処理可能に
    );
  }
}
