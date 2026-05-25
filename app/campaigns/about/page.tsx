'use client';

import Link from 'next/link';
import { BackButton } from '@/app/components/BackButton';
import { Breadcrumb } from '@/app/components/Breadcrumb';

export default function CampaignsAboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* ナビゲーション */}
      <div className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb
            items={[
              { label: 'キャンペーン', href: '/campaigns' },
              { label: 'プロジェクト説明', current: true },
            ]}
          />
          <BackButton href="/campaigns" label="キャンペーン一覧に戻る" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-16 px-4 md:py-24 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            ✨ REVOSONG キャンペーン ✨
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            応援の力で、音楽が生まれる。<br />
            参加型・共創型の音楽プロジェクト
          </p>
          <p className="text-lg opacity-80 mb-8">
            Revo Art Project と Onokun Art Caravan の理念を受け継ぎながら、<br />
            REVOSONG が新しい応援文化を創造します
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* What is REVOSONG Campaign? */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            🎵 REVOSONG キャンペーンとは？
          </h2>

          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              REVOSONG キャンペーンは、単なるランキングサイトではなく、<strong>参加型・共創型の音楽プロジェクト</strong>です。
            </p>

            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              あなたが「応援したい」という想いを<strong>テーマ</strong>として提案すると、
              アーティストたちがそのテーマに応えて曲を制作し、
              コミュニティの投票で選ばれた「応援歌」が生まれます。
            </p>

            <p className="text-lg text-slate-700 leading-relaxed">
              これは、音楽を通じて、<br />
              <strong>「応援する側」と「応援される側」</strong>が共に幸せになれる、<br />
              新しい文化を作るプロジェクトです。
            </p>
          </div>
        </section>

        {/* Core Concepts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            🎨 参考にしたプロジェクトの理念
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Revo Art */}
            <div className="bg-gradient-to-br from-pink-100 to-red-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                🎨 Revo Art Project
              </h3>
              <p className="text-sm text-slate-600 italic mb-4">
                見るアートではなく、関わるアート
              </p>

              <div className="space-y-3">
                <p className="text-slate-700 font-bold">
                  「街にいろどりを。地域に記憶を。アーティストに社会的な役割を。」
                </p>

                <div className="bg-white bg-opacity-60 p-3 rounded">
                  <p className="text-sm text-slate-700 mb-2">
                    <strong>✓ 参加型</strong> - 見る側が創造に参加
                  </p>
                  <p className="text-sm text-slate-700 mb-2">
                    <strong>✓ 地域貢献</strong> - 街に色を加える
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>✓ 社会的役割</strong> - アーティストの新しい位置づけ
                  </p>
                </div>
              </div>

              <p className="text-slate-700 text-sm mt-4 italic">
                REVOSONG では、この「参加型」と「アーティストへの社会的役割付与」を、
                音楽とテーマ提案を通じて実現しています。
              </p>
            </div>

            {/* Onokun Art Caravan */}
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                🚐 Onokun Art Caravan
              </h3>
              <p className="text-sm text-slate-600 italic mb-4">
                街にいろどりを ― 共創型アートプロジェクト
              </p>

              <div className="space-y-3">
                <p className="text-slate-700 font-bold">
                  参加者が「自分の街をもっと好きになるきっかけ」と<br />
                  「新しい自分に出会うきっかけ」を得るプロジェクト
                </p>

                <div className="bg-white bg-opacity-60 p-3 rounded">
                  <p className="text-sm text-slate-700 mb-2">
                    <strong>✓ 共創</strong> - みんなで一緒に作る
                  </p>
                  <p className="text-sm text-slate-700 mb-2">
                    <strong>✓ 地域愛</strong> - 街への愛着を深める
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>✓ 自己発見</strong> - 新しい自分に出会う
                  </p>
                </div>
              </div>

              <p className="text-slate-700 text-sm mt-4 italic">
                REVOSONG では、この「共創」と「地域愛」を、
                テーマ応募と投票、そしてコミュニティの形成を通じて実現しています。
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            🎵 REVOSONG の流れ
          </h2>

          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 to-red-500 text-white font-bold text-xl">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    💬 テーマを提案する
                  </h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    あなたが応援したい想いをテーマとして提案します。
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• 「地元のスポーツチームを応援する曲」</li>
                    <li>• 「新しい一歩を踏み出す自分への応援歌」</li>
                    <li>• など、自由なテーマが可能</li>
                  </ul>
                  <div className="mt-4">
                    <Link
                      href="/campaign-themes/apply"
                      className="inline-block text-pink-600 hover:text-pink-700 font-bold text-sm"
                    >
                      → テーマ応募ページを見る
                    </Link>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-xl">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    👍 投票で応援する
                  </h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    他のユーザーが提案されたテーマに投票して、応援の輪が広がります。
                  </p>
                  <p className="text-slate-600">
                    投票が多いテーマほど、キャンペーン化される可能性が高まります。
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xl">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    🎵 キャンペーンが開始される
                  </h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    テーマが選ばれるとキャンペーン化され、アーティストたちが応答します。
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• アーティストが曲を提出</li>
                    <li>• コミュニティが投票</li>
                    <li>• ランキング形成</li>
                  </ul>
                  <div className="mt-4">
                    <Link
                      href="/campaigns"
                      className="inline-block text-blue-600 hover:text-blue-700 font-bold text-sm"
                    >
                      → キャンペーン一覧を見る
                    </Link>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-white font-bold text-xl">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    🏆 応援ソング殿堂入り
                  </h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    投票で選ばれた応援歌が「応援ソング殿堂入り」として永遠に記録されます。
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• テーマプロポーザーが好きな曲を選択</li>
                    <li>• 応援メッセージとともに記録</li>
                    <li>• 過去の受賞曲が見られるギャラリー</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            ✨ REVOSONG の特徴
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
              <div className="text-3xl mb-3">🤝</div>
              <h4 className="font-bold text-slate-900 mb-2">参加型</h4>
              <p className="text-slate-600 text-sm">
                観客から参加者へ。あなたの想いがテーマになり、キャンペーンが生まれます。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="text-3xl mb-3">🎨</div>
              <h4 className="font-bold text-slate-900 mb-2">共創</h4>
              <p className="text-slate-600 text-sm">
                提案者、アーティスト、投票者、すべてが協力して応援の音楽を作ります。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="text-3xl mb-3">🌍</div>
              <h4 className="font-bold text-slate-900 mb-2">地域と社会への貢献</h4>
              <p className="text-slate-600 text-sm">
                応援テーマは地元の活動や地域課題など、社会的な意義を持つことが多いです。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <div className="text-3xl mb-3">🏆</div>
              <h4 className="font-bold text-slate-900 mb-2">永遠の記録</h4>
              <p className="text-slate-600 text-sm">
                選ばれた応援歌は「殿堂入り」として永遠に記録・祝福されます。
              </p>
            </div>
          </div>
        </section>

        {/* Who Should Participate */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            👥 こんな人に参加してほしい
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-pink-100 to-red-100 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">💬</div>
              <h4 className="font-bold text-slate-900 mb-2">テーマ提案者</h4>
              <p className="text-slate-700 text-sm">
                「こんな応援歌が欲しい」「こんなテーマの曲を聞きたい」という想いを持つあなた
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">🎵</div>
              <h4 className="font-bold text-slate-900 mb-2">アーティスト</h4>
              <p className="text-slate-700 text-sm">
                テーマに応えて曲を作りたい、社会的な役割を持ちたいと考えるアーティスト
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">👍</div>
              <h4 className="font-bold text-slate-900 mb-2">投票者・応援者</h4>
              <p className="text-slate-700 text-sm">
                応援歌を聞いて投票し、コミュニティを支援したいあなた
              </p>
            </div>
          </div>
        </section>

        {/* Pages Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            📍 各ページの説明
          </h2>

          <div className="space-y-6">
            {/* Page 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-pink-500 text-white font-bold">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    🎯 応援テーマ募集ランディングページ
                  </h4>
                  <p className="text-slate-600 mb-3">
                    REVOSONG キャンペーンの参加方法を案内。テーマ募集の流れ、投票機能、過去のテーマを紹介。
                  </p>
                  <Link
                    href="/campaign-themes"
                    className="inline-block text-pink-600 hover:text-pink-700 font-bold"
                  >
                    → ページを見る
                  </Link>
                </div>
              </div>
            </div>

            {/* Page 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-500 text-white font-bold">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    🚀 応募ページ準備中ランディングページ
                  </h4>
                  <p className="text-slate-600 mb-3">
                    Revo Art と Onokun のコンセプトを詳しく説明し、応募開始までの期待を高める。ウェイトリスト登録機能も搭載。
                  </p>
                  <Link
                    href="/campaign-themes/apply"
                    className="inline-block text-purple-600 hover:text-purple-700 font-bold"
                  >
                    → ページを見る
                  </Link>
                </div>
              </div>
            </div>

            {/* Page 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white font-bold">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    📖 このプロジェクト紹介ページ
                  </h4>
                  <p className="text-slate-600 mb-3">
                    REVOSONG キャンペーン全体のビジョン、参考にしたプロジェクト、流れ、特徴を総合的に説明。
                  </p>
                  <p className="text-slate-500 italic text-sm">
                    ← 今見ているページです
                  </p>
                </div>
              </div>
            </div>

            {/* Page 4 */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-500 text-white font-bold">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    🎵 キャンペーン一覧ページ
                  </h4>
                  <p className="text-slate-600 mb-3">
                    開催中のキャンペーン、過去の受賞曲を表示。各キャンペーンの詳細ページへリンク。
                  </p>
                  <Link
                    href="/campaigns"
                    className="inline-block text-orange-600 hover:text-orange-700 font-bold"
                  >
                    → ページを見る
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg shadow-xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-6">
            🌟 さあ、始めましょう
          </h2>
          <p className="text-lg mb-8 opacity-90 leading-relaxed">
            あなたの応援テーマが、新しいキャンペーンになるかもしれません。<br />
            地域の活動、誰かの夢、新しい自分への応援。<br />
            <br />
            応援の力で、音楽を生み出そう。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/campaign-themes"
              className="inline-block bg-white text-pink-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              📖 テーマを見る
            </Link>
            <Link
              href="/campaign-themes/apply"
              className="inline-block bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-4 px-10 rounded-lg transition-all border-2 border-white"
            >
              🚀 応募ページを見る
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
              href="/campaigns/awards"
              className="group bg-white rounded-lg shadow-md hover:shadow-lg p-6 text-center transition-all border-2 border-transparent hover:border-orange-500"
            >
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-orange-600">
                応援ソング殿堂入り
              </h3>
              <p className="text-sm text-slate-600">
                過去の受賞曲を表示
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
              className="group bg-white rounded-lg shadow-md hover:shadow-lg p-6 text-center transition-all border-2 border-transparent hover:border-purple-500"
            >
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-purple-600">
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
      <div className="bg-slate-900 text-white py-12 px-4 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-3">🎵 REVOSONG</h4>
              <p className="text-sm opacity-75">応援の力で、音楽が生まれる</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">📍 ページ</h4>
              <ul className="text-sm space-y-1 opacity-75">
                <li><Link href="/campaigns" className="hover:opacity-100">キャンペーン一覧</Link></li>
                <li><Link href="/campaign-themes" className="hover:opacity-100">テーマ募集</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">📚 参考</h4>
              <ul className="text-sm space-y-1 opacity-75">
                <li><a href="https://hayator11.github.io/revofunding/revo-art.html" target="_blank" rel="noopener noreferrer" className="hover:opacity-100">Revo Art</a></li>
                <li><a href="https://onokun.com/art-project/" target="_blank" rel="noopener noreferrer" className="hover:opacity-100">Onokun Art</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">✨ ビジョン</h4>
              <p className="text-sm opacity-75">参加型・共創型の音楽プロジェクト</p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 text-center text-sm opacity-75">
            <p>© 2026 REVOSONG Campaign.</p>
            <p className="mt-2">応援の力で、音楽が生まれる。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
