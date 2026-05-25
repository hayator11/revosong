'use client';

export default function CampaignThemeSubmitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <a href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← トップページに戻る
          </a>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            キャンペーンテーマを申請する
          </h1>
          <p className="text-slate-600">
            REVOSONGのキャンペーン企画に参加したいテーマを申請してください。
            <br />
            あなたのアイデアが選ばれて、新しいキャンペーンになるかもしれません！
          </p>
        </div>

        {/* 情報ボックス */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-8">
          <h2 className="font-semibold text-blue-900 mb-2">📝 申請について</h2>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• テーマは「～を応援する曲」という形式で申請してください</li>
            <li>• 詳しい説明があるとスタッフが選考しやすくなります</li>
            <li>• 申請後、スタッフがレビューしてからキャンペーン化します</li>
            <li>• あなたが申請したテーマが選ばれた場合、テーマの提案者として記録されます</li>
          </ul>
        </div>

        {/* Googleフォーム埋め込み */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSf9zfMceWqEJehj7PRnHVtz-Zsns9F4fBXTl4eVVzVdwNQldw/viewform?embedded=true"
            width="100%"
            height="1200"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            className="rounded"
          >
            読み込み中...
          </iframe>
        </div>

        {/* フッター情報 */}
        <div className="mt-8 text-center text-slate-600 text-sm">
          <p>質問や問題がある場合は、サイト内のお問い合わせからご連絡ください。</p>
        </div>
      </div>
    </div>
  );
}
