'use client';

import Link from 'next/link';
import { BackButton } from '@/app/components/BackButton';
import { Breadcrumb } from '@/app/components/Breadcrumb';

export default function AwardsPage() {
  // TODO: データベースから過去の受賞曲を取得

  const awards = [
    {
      id: 1,
      campaignTitle: '🎨 Revo Art Project - 見るアートではなく、関わるアート',
      trackTitle: 'Colors of Hope',
      artistName: 'REVO ARTIST 001',
      proposerName: '@ffdca163',
      proposerComment: '街にいろどりを。地域に記憶を。このアーティストの表現がまさにそれを実現しています。',
      thumbnailUrl: '/placeholder-music.jpg',
      awardedDate: '2026-06-24',
    },
    {
      id: 2,
      campaignTitle: '🚐 Onokun Art Caravan - 街にいろどりを',
      trackTitle: 'New Horizon',
      artistName: 'REVO ARTIST 002',
      proposerName: '@onokun_admin',
      proposerComment: 'この曲を聴いていると、自分の街への新しい見方が生まれてくる。まさに共創の力を感じます。',
      thumbnailUrl: '/placeholder-music.jpg',
      awardedDate: '2026-06-22',
    },
  ];

  const handleShare = (platform: string, award: typeof awards[0]) => {
    const text = `🎁 ${award.campaignTitle}\n応援ソング殿堂入り: ${award.trackTitle} by ${award.artistName}\n${window.location.href}`;

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
          '_blank'
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
          '_blank'
        );
        break;
      case 'copy':
        navigator.clipboard.writeText(window.location.href);
        alert('リンクをコピーしました！');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* ナビゲーション */}
      <div className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb
            items={[
              { label: 'キャンペーン', href: '/campaigns' },
              { label: '応援ソング殿堂入り', current: true },
            ]}
          />
          <BackButton href="/campaigns" label="キャンペーン一覧に戻る" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full font-bold text-lg mb-6">
            🏆 応援ソング殿堂入り
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            過去のキャンペーン受賞曲たち
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            テーマ提案者が選んだ「応援ソング」として認定された、心に残る曲たちの記録。
            これらの曲は、応援する側と応援される側の想いが最も美しく結ばれた瞬間を表現しています。
          </p>
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {awards.length > 0 ? (
            awards.map((award) => (
              <div
                key={award.id}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-lg p-8 border-2 border-yellow-200 hover:shadow-xl transition-shadow"
              >
                {/* Award Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-1 rounded-full font-bold text-sm flex items-center gap-2">
                    🎁 受賞曲
                  </span>
                  <span className="text-sm text-slate-600">{award.awardedDate}</span>
                </div>

                {/* Campaign Title */}
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  {award.campaignTitle}
                </h2>

                {/* Track Info */}
                <div className="bg-white rounded-lg p-6 mb-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex-shrink-0 flex items-center justify-center text-3xl">
                      🎵
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {award.trackTitle}
                      </h3>
                      <p className="text-slate-600 font-semibold">
                        🎤 {award.artistName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Proposer Message */}
                <div className="bg-white rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">👤</span>
                    <p className="font-bold text-slate-900">
                      {award.proposerName} からのメッセージ
                    </p>
                  </div>
                  <p className="text-slate-700 italic border-l-4 border-pink-500 pl-4">
                    「{award.proposerComment}」
                  </p>
                </div>

                {/* Share Buttons */}
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => handleShare('twitter', award)}
                    className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.868 6.75h-3.308l7.732-8.835L.424 2.25h6.679l4.882 6.479 5.541-6.479zM17.474 20.451h1.896L6.822 3.75H4.765l12.709 16.701z" />
                    </svg>
                    𝕏
                  </button>
                  <button
                    onClick={() => handleShare('facebook', award)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    FB
                  </button>
                  <button
                    onClick={() => handleShare('copy', award)}
                    className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    シェア
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg">
                応援ソング殿堂入りの曲はまだ記録されていません。
              </p>
              <p className="text-gray-500 text-sm mt-2">
                キャンペーンが終了し、テーマ提案者が受賞曲を選ぶと、ここに記録されます。
              </p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <section className="mt-16 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-xl shadow-lg p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            あなたも応援ソング殿堂入りを目指そう
          </h2>
          <p className="text-lg mb-8 opacity-90 leading-relaxed">
            キャンペーンに参加して、テーマ提案者の心に響く曲を作ろう。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/campaigns"
              className="inline-block bg-white text-pink-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-all"
            >
              🎵 今開催中のキャンペーン
            </Link>
            <Link
              href="/campaign-themes"
              className="inline-block bg-white bg-opacity-20 text-white border-2 border-white hover:bg-opacity-30 font-bold py-3 px-8 rounded-lg transition-all"
            >
              💬 テーマを募集する
            </Link>
          </div>
        </section>

        {/* Related Pages Section */}
        <section className="mt-16 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            📍 関連ページ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/campaigns"
              className="group bg-white rounded-lg shadow-md hover:shadow-lg p-6 text-center transition-all border-2 border-transparent hover:border-pink-500"
            >
              <div className="text-4xl mb-3">🎵</div>
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-pink-600">
                キャンペーン一覧
              </h3>
              <p className="text-sm text-slate-600">
                開催中のキャンペーンを表示
              </p>
            </Link>

            <Link
              href="/campaigns/about"
              className="group bg-white rounded-lg shadow-md hover:shadow-lg p-6 text-center transition-all border-2 border-transparent hover:border-purple-500"
            >
              <div className="text-4xl mb-3">📖</div>
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-purple-600">
                プロジェクト説明
              </h3>
              <p className="text-sm text-slate-600">
                REVOSONG の理念を知る
              </p>
            </Link>

            <Link
              href="/campaign-themes"
              className="group bg-white rounded-lg shadow-md hover:shadow-lg p-6 text-center transition-all border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600">
                テーマ募集
              </h3>
              <p className="text-sm text-slate-600">
                応援テーマの投票
              </p>
            </Link>

            <Link
              href="/campaign-themes/apply"
              className="group bg-white rounded-lg shadow-md hover:shadow-lg p-6 text-center transition-all border-2 border-transparent hover:border-orange-500"
            >
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-orange-600">
                応募準備
              </h3>
              <p className="text-sm text-slate-600">
                応募ページの準備中
              </p>
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white py-8 px-4 text-center text-sm mt-16">
        <p>© 2026 REVOSONG Campaign.</p>
        <p className="mt-2 opacity-75">応援の力で、音楽が生まれる。</p>
      </div>
    </div>
  );
}
