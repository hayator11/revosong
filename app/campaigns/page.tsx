'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BackButton } from '@/app/components/BackButton';
import { Breadcrumb } from '@/app/components/Breadcrumb';
import { SocialShareButtons } from '@/app/components/SocialShareButtons';

interface Campaign {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status?: string;
  theme?: {
    submitted_by: string;
  };
  theme_id?: number;
  proposer_name?: string;
  proposer_message?: string;
  participant_count?: number;
  submission_count?: number;
  awarded_submission_id?: number;
  award_track_title?: string;
  award_artist?: string;
  theme_proposer_comment?: string;
}

export default function CampaignsPage() {
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [pastCampaigns, setPastCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Fetch active campaigns
        const activeRes = await fetch('/api/campaigns?status=active&limit=20');
        const activeData = await activeRes.json();
        setActiveCampaigns(activeData.campaigns || []);

        // Fetch past campaigns
        const pastRes = await fetch('/api/campaigns?status=past&limit=20');
        const pastData = await pastRes.json();
        setPastCampaigns(pastData.campaigns || []);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* パンくずナビゲーション */}
        <Breadcrumb
          items={[
            { label: 'キャンペーン', current: true },
          ]}
        />

        {/* ヘッダー */}
        <div className="mb-8">
          <BackButton href="/" label="トップページに戻る" />

          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-xl p-8 text-white mb-8">
            <h1 className="text-4xl font-bold mb-2">✨ REVOSONG キャンペーン ✨</h1>
            <p className="text-lg mb-4">「応援の力で、音楽が生まれる」</p>
            <p className="text-sm opacity-90">
              あなたが提案したテーマが、<br />
              新しいキャンペーンになるかもしれない！
            </p>
          </div>

          {/* 申請ボタン */}
          <Link
            href="/campaign-themes/submit"
            className="inline-block bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl"
          >
            💬 新しいテーマを申請する
          </Link>
        </div>

        {/* 開催中のキャンペーン */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            🎵 開催中のキャンペーン
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeCampaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 h-full border-l-4 border-pink-500 hover:border-pink-600">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-pink-600 transition-colors">
                      🎁 {campaign.title}
                    </h3>
                    <span className="bg-pink-100 text-pink-800 text-xs font-bold px-3 py-1 rounded-full">
                      {campaign.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mb-4">
                    {campaign.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-slate-500">期間</p>
                      <p className="font-semibold text-slate-900">
                        {campaign.start_date.split('-').slice(1).join('/')} ~ {campaign.end_date.split('-').slice(1).join('/')}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">提案者</p>
                      <p className="font-semibold text-slate-900">{campaign.proposer_name}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">参加者</p>
                      <p className="font-semibold text-slate-900">{campaign.participant_count}名</p>
                    </div>
                    <div>
                      <p className="text-slate-500">投稿曲</p>
                      <p className="font-semibold text-slate-900">{campaign.submission_count}曲</p>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all">
                    📊 詳細を見る →
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 過去のキャンペーン */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            🏆 応援ソング殿堂入り（受賞曲）
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {pastCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-lg text-slate-900">
                    ✨ {campaign.title}
                  </h3>
                  <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
                    終了
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">{campaign.description}</p>
                    <p className="text-xs text-slate-500">
                      終了日：{campaign.end_date.split('-').slice(1).join('/')}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-slate-700 mb-2">🎵 受賞曲</p>
                    <p className="font-bold text-lg text-slate-900 mb-1">{campaign.award_track_title}</p>
                    <p className="text-sm text-slate-600 mb-3">🎵 {campaign.award_artist}</p>

                    <p className="text-sm font-semibold text-slate-700 mb-2">👤 提案者からのメッセージ</p>
                    <p className="text-sm text-slate-700 italic">
                      「{campaign.proposer_message}」
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 関連ページ */}
        <section className="mt-16 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            📍 関連ページ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                応援テーマの投票
              </p>
            </Link>

            <Link
              href="/campaign-themes/apply"
              className="group bg-white rounded-lg shadow-md hover:shadow-lg p-6 text-center transition-all border-2 border-transparent hover:border-pink-500"
            >
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-pink-600">
                応募準備
              </h3>
              <p className="text-sm text-slate-600">
                応募ページの準備中
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
