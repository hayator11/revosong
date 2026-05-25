'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BackButton } from '@/app/components/BackButton';
import { Breadcrumb } from '@/app/components/Breadcrumb';

export default function CampaignThemesApplyPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // TODO: メールアドレスを登録（後で実装）
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* ナビゲーション */}
      <div className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb
            items={[
              { label: 'テーマ募集', href: '/campaign-themes' },
              { label: '応募準備', current: true },
            ]}
          />
          <BackButton href="/campaign-themes" label="テーマ募集に戻る" />
        </div>
      </div>

      {/* Hero Section - Coming Soon */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-16 px-4 md:py-24 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-2 rounded-full font-bold mb-6">
            🚀 準備中
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            ✨ 応援テーマ応募ページ ✨
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            あなたの想いをテーマにして、<br />
            新しいキャンペーンが生まれる瞬間
          </p>
          <p className="text-lg opacity-80">
            応募ページはもうすぐ公開予定です
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Concept Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            🎨 このプロジェクトのコンセプト
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Revo Art Concept */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  🎵 Revo Art Project
                </h3>
                <p className="text-sm text-slate-600 italic">
                  見るアートではなく、関わるアート
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  「街にいろどりを。地域に記憶を。アーティストに社会的な役割を。」
                </p>

                <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded">
                  <h4 className="font-bold text-slate-900 mb-2">3つの実現</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>✓ ウォールアート - 地域の壁が作品に</li>
                    <li>✓ アートカー - 走るギャラリー</li>
                    <li>✓ コラボレーション - みんなで創造</li>
                  </ul>
                </div>

                <p className="text-slate-600 text-sm italic">
                  参加者たちが協力して街をアート化するイニシアティブ
                </p>
              </div>
            </div>

            {/* Onokun Art Caravan Concept */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  🚐 Onokun Art Caravan
                </h3>
                <p className="text-sm text-slate-600 italic">
                  街にいろどりを ― 共創型アートプロジェクト
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  参加者が「自分の街をもっと好きになるきっかけ」と「新しい自分に出会うきっかけ」を得るプロジェクト
                </p>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                  <h4 className="font-bold text-slate-900 mb-2">プロジェクト目標</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>✓ 月ごとのワークショップ開催</li>
                    <li>✓ 四季ごとのメイン企画</li>
                    <li>✓ 被災地支援からイベント開催まで</li>
                  </ul>
                </div>

                <p className="text-slate-600 text-sm italic">
                  地域住民による体験型・共創プロジェクト
                </p>
              </div>
            </div>
          </div>

          {/* How REVOSONG Applies These Concepts */}
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-8 md:p-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              🎵 REVOSONG が取り入れるコンセプト
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🤝</div>
                <h4 className="font-bold text-slate-900 mb-2">共創と参加</h4>
                <p className="text-slate-700 text-sm">
                  あなたの応援したい想いをテーマとして提案。アーティストたちが応えます。
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3">🎨</div>
                <h4 className="font-bold text-slate-900 mb-2">街に色を加える</h4>
                <p className="text-slate-700 text-sm">
                  応援の力で音楽が生まれ、コミュニティが彩られます。
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3">🏆</div>
                <h4 className="font-bold text-slate-900 mb-2">社会的な役割</h4>
                <p className="text-slate-700 text-sm">
                  アーティストと応援者が共に社会に貢献する仕組み。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            📅 応募スケジュール
          </h2>

          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-pink-500 text-white font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">
                    準備フェーズ（現在）
                  </h4>
                  <p className="text-slate-600">
                    アプリケーションの最終調整と、コミュニティの準備を進めています。
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-500 text-white font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">
                    ベータ版公開（間もなく）
                  </h4>
                  <p className="text-slate-600">
                    限定的なテスト運用を開始します。早期参加者向けの特別イベントも予定。
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">
                    正式公開
                  </h4>
                  <p className="text-slate-600">
                    誰でも応援テーマを応募できるようになります。最初のキャンペーンスタート予定。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            🌟 応募ページで実現する機能
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
              <h4 className="font-bold text-slate-900 mb-3">💬 テーマ応募</h4>
              <p className="text-slate-600 text-sm">
                あなたの応援したい想いをテーマとして自由に応募。詳しい説明やメッセージも含められます。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <h4 className="font-bold text-slate-900 mb-3">👍 投票・応援</h4>
              <p className="text-slate-600 text-sm">
                気に入ったテーマに投票して応援。投票が多いテーマほどキャンペーン化される可能性が高まります。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <h4 className="font-bold text-slate-900 mb-3">🎵 キャンペーン化</h4>
              <p className="text-slate-600 text-sm">
                テーマが選ばれるとキャンペーンになり、アーティストたちが応援歌を制作・投稿します。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <h4 className="font-bold text-slate-900 mb-3">🏆 殿堂入り</h4>
              <p className="text-slate-600 text-sm">
                投票で選ばれた応援歌とテーマプロポーザーの推薦曲が「応援ソング殿堂入り」として記録されます。
              </p>
            </div>
          </div>
        </section>

        {/* Waitlist CTA */}
        <section className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg shadow-xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            📬 応募開始をお知らせします
          </h2>
          <p className="text-lg text-center mb-8 opacity-90">
            応募ページの公開と、最初のキャンペーン開始を心待ちにしてくださっている方へ。<br />
            メールアドレスをご登録いただくと、公開のお知らせをいち早くお送りします。
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレスを入力"
                className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="bg-white text-pink-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition-all whitespace-nowrap"
              >
                {submitted ? '✓ 登録完了' : '登録'}
              </button>
            </div>
            {submitted && (
              <p className="text-center mt-4 text-sm opacity-90">
                ご登録ありがとうございます！公開のお知らせをお送りします。
              </p>
            )}
          </form>
        </section>

        {/* Value Proposition */}
        <section className="mt-16 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            🌍 このプロジェクトが実現する世界
          </h2>

          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none text-slate-700 space-y-6">
              <p>
                <strong>「応援の力で、音楽が生まれる」</strong>
              </p>

              <p>
                地元の活動を応援したい。誰かの人生の応援歌が欲しい。新しい一歩を踏み出す人を応援したい。
              </p>

              <p>
                そんなあなたの想いが、テーマになり、キャンペーンになり、複数の応援歌が生まれます。
              </p>

              <p>
                Revo Art Project の「街にいろどりを」と Onokun Art Caravan の「共創型プロジェクト」の精神を受け継ぎながら、REVOSONG は応援と音楽を通じて、コミュニティをつなぎ、アーティストに社会的な役割を与え、誰もが「応援される」「応援する」体験ができる世界を目指しています。
              </p>

              <p className="text-center italic text-slate-600 pt-4">
                準備がほぼ整いました。もうすぐあなたの想いを世界にテーマとして発信できます。
              </p>
            </div>
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
                開催中のキャンペーン
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
                REVOSONG について
              </p>
            </Link>

            <Link
              href="/campaigns/awards"
              className="group bg-white rounded-lg shadow-md hover:shadow-lg p-6 text-center transition-all border-2 border-transparent hover:border-orange-500"
            >
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-orange-600">
                応援ソング殿堂入り
              </h3>
              <p className="text-sm text-slate-600">
                過去の受賞曲
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
                応援テーマを投票
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
