/**
 * コメント安全性フィルタ（完全無料版）
 * キーワードベースの簡単な判定
 */

// 禁止ワード（暴言・差別表現）
const BANNED_WORDS = [
  // 強い暴言
  /死ね|殺す|キモい|気持ち悪い|ゴミ|クズ|バカ|アホ|馬鹿|糞/gi,
  // 差別表現
  /障害者|精神病|キチガイ|乞食|貧困層|上級国民/gi,
  // その他不適切
  /ヤク|麻薬|援交|売春|児童|ポルノ/gi,
];

// スパム検出パターン
const SPAM_PATTERNS = [
  // URL
  /https?:\/\/|www\.|\.com|\.jp|\.co/gi,
  // 電話番号
  /\d{3}-\d{3,4}-\d{4}|\d{10,11}/g,
  // メールアドレス
  /.+@.+\..+/g,
  // 過度な大文字（シャウティング）
  /^([A-Z\s！？。]{20,})+$/g,
  // 過度な記号
  /[!！？？]{5,}/g,
  // 同じ文字の繰り返し
  /(.)\1{9,}/g,
];

export interface CommentCheckResult {
  is_appropriate: boolean;
  reason?: string;
  category?: "spam" | "banned-word" | "safe" | "suspicious";
  severity: number; // 0-10
}

/**
 * コメントが安全かどうかを判定（無料）
 */
export function checkCommentSafety(content: string): CommentCheckResult {
  if (!content || content.length === 0) {
    return {
      is_appropriate: false,
      reason: "コメントが空です",
      category: "suspicious",
      severity: 1,
    };
  }

  // 長さチェック
  if (content.length > 500) {
    return {
      is_appropriate: false,
      reason: "コメントが長すぎます（最大500文字）",
      category: "suspicious",
      severity: 3,
    };
  }

  // 禁止ワードチェック
  for (const pattern of BANNED_WORDS) {
    if (pattern.test(content)) {
      return {
        is_appropriate: false,
        reason: "不適切な言葉が含まれています",
        category: "banned-word",
        severity: 8,
      };
    }
  }

  // スパムチェック
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(content)) {
      return {
        is_appropriate: false,
        reason: "スパムと思われる内容が含まれています",
        category: "spam",
        severity: 7,
      };
    }
  }

  // 安全なコメント
  return {
    is_appropriate: true,
    category: "safe",
    severity: 0,
  };
}

/**
 * 複数のコメントから危険度スコアを集計
 * （ユーザーの信頼度判定に使用）
 */
export function calculateTrustScore(
  commentCount: number,
  rejectedCount: number
): number {
  if (commentCount === 0) return 100;

  const rejectionRate = rejectedCount / commentCount;
  const penalty = rejectionRate * 50; // 最大 -50
  return Math.max(50, 100 - penalty);
}
