'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BackButton } from '@/app/components/BackButton';
import { Breadcrumb } from '@/app/components/Breadcrumb';

interface Theme {
  id: number;
  title: string;
  description: string;
  votes_count: number;
  submitted_by: string;
  status: string;
  created_at: string;
}

export default function CampaignThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const res = await fetch(`/api/campaign-themes?status=${filter}`);
        const data = await res.json();
        setThemes(data.themes || []);
      } catch (error) {
        console.error('Failed to fetch themes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, [filter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* ナビゲーション */}
      <div className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb
            items={[
              { label: 'キャンペーン テーマ募集', current: true },
            ]}
          />
          <BackButton href="/" label="トップページに戻る" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-16 px-4 md:py-20 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            ✨ 応援の力で、音楽が生まれる ✨
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            あなたの想いをテーマにして、新しいキャンペーンになるかもしれない。<br />
            みんなで支え合える音楽の世界を一緒に作りませんか？
          </p>
          <Link
            href="/campaign-themes/submit"
            className="inline-block bg-white text-pink-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl"
          >
            💬 新しいテーマを申請する
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Vision Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                「応援する」の力
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                誰かを応援したい。何かを応援したい。その想いが音楽になる時、何かが変わる。あなたの応援メッセージを、テーマとして提案してください。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                「共創」の価値
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                あなたが提案したテーマに、アーティストたちが応えます。投票をして、応援の輪を広げます。1つのテーマから、複数の応援歌が生まれます。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                「受賞」と認定
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                投票で選ばれた応援歌と、あなたが選んだテーマプロポーザーの推薦曲が、「応援ソング殿堂入り」として永遠に刻まれます。
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            📋 応援テーマ募集の流れ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-pink-500 to-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 mb-2">テーマ提案</h3>
              <p className="text-sm text-slate-600">
                あなたの応援したい想いをテーマとして提案します
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 mb-2">投票・支持</h3>
              <p className="text-sm text-slate-600">
                他のユーザーがテーマに投票して、応援の輪が広がります
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 mb-2">キャンペーン化</h3>
              <p className="text-sm text-slate-600">
                投票が多いテーマがキャンペーン化され、アーティストが応えます
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-yellow-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                4
              </div>
              <h3 className="font-bold text-slate-900 mb-2">殿堂入り</h3>
              <p className="text-sm text-slate-600">
                投票で選ばれた応援歌が「殿堂入り」として永遠に記録されます
              </p>
            </div>
          </div>
        </section>

        {/* Submitted Themes Section */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            🎯 応援テーマ一覧
          </h2>

          {/* Filter Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                  : 'bg-white text-slate-900 border-2 border-gray-300 hover:border-pink-500'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                filter === 'pending'
                  ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                  : 'bg-white text-slate-900 border-2 border-gray-300 hover:border-pink-500'
              }`}
            >
              募集中
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                filter === 'approved'
                  ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                  : 'bg-white text-slate-900 border-2 border-gray-300 hover:border-pink-500'
              }`}
            >
              承認済み
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">読み込み中...</p>
            </div>
          ) : themes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 mb-4">
                {filter === 'all' && 'まだテーマが提案されていません'}
                {filter === 'pending' && '募集中のテーマはありません'}
                {filter === 'approved' && '承認済みのテーマはありません'}
              </p>
              <Link
                href="/campaign-themes/submit"
                className="inline-block bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-lg transition-all"
              >
                💬 最初のテーマを申請する
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 border-l-4 border-pink-500"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-slate-900 flex-1">
                      {theme.title}
                    </h3>
                    <span className="bg-pink-100 text-pink-800 text-xs font-bold px-3 py-1 rounded-full ml-2">
                      {theme.status === 'pending'
                        ? '募集中'
                        : theme.status === 'approved'
                        ? '承認済み'
                        : 'その他'}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {theme.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">❤️</span>
                      <span className="font-bold text-slate-900">
                        {theme.votes_count}
                      </span>
                      <span className="text-slate-600 text-sm">投票</span>
                    </div>
                    <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm">
                      👍 応援する
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="mt-16 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg shadow-lg p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            🌟 あなたの想いを、応援歌に変えよう
          </h2>
          <p className="text-lg mb-8 opacity-90 leading-relaxed">
            地元の活動を応援したい。誰かの人生の応援歌が欲しい。<br />
            新しい一歩を踏み出す人を応援したい。<br />
            <br />
            そんなあなたの想いが、新しいキャンペーンになるかもしれません。
          </p>
          <Link
            href="/campaign-themes/submit"
            className="inline-block bg-white text-pink-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl"
          >
            💬 新しいテーマを申請する
          </Link>
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
              href="/campaign-themes/apply"
              className="group bg-white rounded-lg shadow-md hover:shadow-lg p-6 text-center transition-all border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600">
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
        <p>© 2026 REVOSONG Campaign. 応援の力で、音楽が生まれる。</p>
      </div>
    </div>
  );
}
