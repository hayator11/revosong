'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { TrackCard } from '@/app/components/TrackCard';
import { CampaignComment } from '@/app/components/CampaignComment';
import { BackButton } from '@/app/components/BackButton';
import { Breadcrumb } from '@/app/components/Breadcrumb';
import { SocialShareButtons } from '@/app/components/SocialShareButtons';
import { ThemeProposerChoice } from '@/app/components/ThemeProposerChoice';
import { AwardCommentForm } from '@/app/components/AwardCommentForm';
import { CampaignAwardCard } from '@/app/components/CampaignAwardCard';
import { supabase } from '@/lib/supabase';

interface CampaignData {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  participant_count: number;
  submission_count: number;
  awarded_submission_id?: number;
  theme_proposer_comment?: string;
  ogp_image_url?: string;
  theme?: {
    submitted_by: string;
  };
  proposer_name?: string;
  proposer_message?: string;
}

interface RankingItem {
  rank: number;
  track: any;
  artist: any;
  votes: number;
}

interface Submission {
  id: number;
  track_id: number;
  track_title: string;
  artist_name: string;
  artist_avatar?: string;
  artist_username: string;
  campaign_likes: number;
  submitted_by: string;
  photo_url?: string;
}

interface AwardData {
  awarded_submission_id?: number;
  award?: {
    id: number;
    track_id: number;
    submitted_by: string;
    track: {
      id: number;
      title: string;
      artist_name: string;
      photo_url?: string;
      external_url?: string;
    };
    submitter: {
      username: string;
      avatar_url?: string;
    };
  };
  theme_proposer_comment?: string;
  ogp_image_url?: string;
}

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [award, setAward] = useState<AwardData | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isThemeProposer, setIsThemeProposer] = useState(false);
  const [campaignEnded, setCampaignEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAwardId, setSelectedAwardId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id || null;
        setCurrentUser(userId);

        // Fetch campaign detail
        const campaignRes = await fetch(`/api/campaigns/${id}`);
        const campaignData = await campaignRes.json();

        if (campaignData.campaign) {
          const campaign = {
            ...campaignData.campaign,
            proposer_name: campaignData.campaign.proposer_name || '@unknown',
            proposer_message: 'テーマ提案者からのメッセージ',
            status: campaignData.campaign.status || '募集中',
            participant_count: campaignData.campaign.participant_count || 0,
            submission_count: campaignData.campaign.submission_count || 0,
          };
          setCampaign(campaign);

          // Check if campaign has ended
          const campaignEnded = new Date(campaign.end_date) < new Date();
          setCampaignEnded(campaignEnded);

          // Check if user is theme proposer by fetching theme data
          if (campaign.theme_id && userId) {
            const { data: theme } = await supabase
              .from('campaign_themes')
              .select('submitted_by')
              .eq('id', campaign.theme_id)
              .single();

            if (theme?.submitted_by === userId) {
              setIsThemeProposer(true);
            }
          }
        }

        // Fetch campaign ranking
        const rankingRes = await fetch(`/api/campaigns/${id}/ranking`);
        const rankingData = await rankingRes.json();

        // Transform ranking data to match TrackCard props format
        const transformedRanking = (rankingData.ranking || []).map((item: any) => ({
          rank: item.rank,
          track: {
            id: item.track_id,
            title: item.track_title,
            artist_name: item.artist_name,
            external_url: item.external_url,
            photo_url: item.photo_url,
          },
          artist: {
            username: item.artist_username,
            avatar_url: item.artist_avatar,
            social_links: item.artist_social_links || {},
          },
          votes: item.campaign_likes,
        }));

        setRankings(transformedRanking);

        // Fetch submissions if campaign has ended
        const submissionsRes = await fetch(`/api/campaigns/${id}/submissions`);
        const submissionsData = await submissionsRes.json();

        if (submissionsData.themes && submissionsData.themes.length > 0) {
          const allSubmissions: Submission[] = [];
          submissionsData.themes.forEach((themeGroup: any) => {
            themeGroup.submissions?.forEach((sub: any) => {
              allSubmissions.push({
                id: sub.id,
                track_id: sub.track_id,
                track_title: sub.track?.title || '',
                artist_name: sub.track?.artist_name || '',
                artist_avatar: sub.submitter?.avatar_url,
                artist_username: sub.submitter?.username || '',
                campaign_likes: sub.campaign_likes || 0,
                submitted_by: sub.submitted_by,
                photo_url: sub.track?.photo_url,
              });
            });
          });
          setSubmissions(allSubmissions);
        }

        // Fetch award data if campaign has ended
        if (new Date(campaignData.campaign.end_date) < new Date()) {
          const awardRes = await fetch(`/api/campaigns/${id}/award`);
          const awardData = await awardRes.json();
          setAward(awardData);
          if (awardData.awarded_submission_id) {
            setSelectedAwardId(awardData.awarded_submission_id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch campaign data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">キャンペーン情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">キャンペーンが見つかりません</p>
          <Link href="/campaigns" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            ← キャンペーン一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const handlePlayTrack = (trackId: number) => {
    setSelectedTrack(trackId);
  };

  const handleVote = (trackId: number) => {
    alert(`トラック ${trackId} に投票しました！`);
  };

  const handleComment = (trackId: number) => {
    alert(`トラック ${trackId} へのコメント機能は準備中です`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* パンくずナビゲーション */}
        <Breadcrumb
          items={[
            { label: 'キャンペーン', href: '/campaigns' },
            { label: campaign.title, current: true },
          ]}
        />

        {/* 戻るボタン */}
        <BackButton href="/campaigns" label="キャンペーン一覧に戻る" />

        {/* キャンペーン情報ボックス */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-xl p-8 text-white mb-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-4">🎵 {campaign.title}</h1>

          <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-6 mb-4">
            <p className="text-lg font-semibold mb-2">💬 テーマ提案者からのメッセージ：</p>
            <p className="text-base mb-4 leading-relaxed">
              「{campaign.proposer_message}」
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <p className="opacity-80">提案者</p>
                <p className="font-bold">{campaign.proposer_name}</p>
              </div>
              <div>
                <p className="opacity-80">期間</p>
                <p className="font-bold">
                  {campaign.start_date.split('T')[0]} ～ {campaign.end_date.split('T')[0]}
                </p>
              </div>
              <div>
                <p className="opacity-80">ステータス</p>
                <p className="font-bold">{campaign.status}</p>
              </div>
            </div>
          </div>

          {/* シェアボタン */}
          <div className="mt-6 pt-6 border-t border-white border-opacity-30">
            <p className="text-sm font-semibold mb-3 opacity-90">このキャンペーンをシェア：</p>
            <SocialShareButtons
              title={campaign.title}
              description={campaign.proposer_message}
              variant="compact"
            />
          </div>
        </div>

        {/* キャンペーン詳細 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">📋 キャンペーン詳細</h2>
          <p className="text-slate-700 mb-6">{campaign.description}</p>

          {/* 投稿ガイド */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">💪 このテーマに応えて曲を投稿する</h3>
            <Link
              href="/campaign-themes/submit"
              className="inline-block bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-2 px-6 rounded-lg transition-all"
            >
              🎵 あなたの曲をアップロード
            </Link>

            <p className="text-sm text-blue-800 mt-4 mb-2">投稿ガイドライン：</p>
            <ul className="text-sm text-blue-800 space-y-1 ml-4">
              <li>• テーマに合った応援メッセージが込められた曲</li>
              <li>• オリジナル作品またはREVOSONGの曲から選択</li>
              <li>• 最大3曲まで投稿可能</li>
            </ul>
          </div>
        </section>

        {/* ランキング */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            🎶 応援ソングランキング
          </h2>

          {rankings.length > 0 ? (
            <div className="space-y-4">
              {rankings.map((item) => (
                <TrackCard
                  key={item.track.id}
                  rank={item.rank}
                  track={item.track}
                  artist={item.artist}
                  votes={item.votes}
                  onPlay={() => handlePlayTrack(item.track.id)}
                  onVote={() => handleVote(item.track.id)}
                  onComment={() => handleComment(item.track.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
              <p>このキャンペーンにはまだ投稿がありません</p>
            </div>
          )}
        </section>

        {/* Award Section - Display award if selected */}
        {award && award.award && (
          <section className="mb-8">
            <CampaignAwardCard
              campaignTitle={campaign.title}
              awardedTrack={{
                id: award.award.track_id,
                title: award.award.track.title,
                artist_name: award.award.track.artist_name,
                photo_url: award.award.track.photo_url,
                external_url: award.award.track.external_url,
              }}
              themeProposer={{
                username: award.award.submitter.username,
                avatar_url: award.award.submitter.avatar_url,
              }}
              proposerComment={award.theme_proposer_comment || 'テーマ提案者からのメッセージ'}
              ogpImageUrl={award.ogp_image_url}
            />
          </section>
        )}

        {/* Theme Proposer Choice - Show if campaign ended, user is proposer, and no award selected */}
        {campaignEnded && isThemeProposer && !selectedAwardId && submissions.length > 0 && (
          <section className="mb-8">
            <ThemeProposerChoice
              submissions={submissions}
              campaignId={campaign.id}
              onSubmit={(submissionId) => {
                setSelectedAwardId(submissionId);
                // Refresh award data
                fetch(`/api/campaigns/${id}/award`)
                  .then(res => res.json())
                  .then(data => setAward(data));
              }}
            />
          </section>
        )}

        {/* Award Comment Form - Show if award is selected and user is proposer but no comment yet */}
        {selectedAwardId && isThemeProposer && !award?.theme_proposer_comment && (
          <section className="mb-8">
            <AwardCommentForm
              campaignId={campaign.id}
              submissionId={selectedAwardId}
              onSubmit={(comment) => {
                // Refresh award data to show updated comment
                fetch(`/api/campaigns/${id}/award`)
                  .then(res => res.json())
                  .then(data => setAward(data));
              }}
            />
          </section>
        )}

        {/* 統計情報 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">📊 キャンペーン統計</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-lg p-4">
              <p className="text-slate-600 text-sm">参加アーティスト</p>
              <p className="text-3xl font-bold text-pink-600">{campaign.participant_count}</p>
              <p className="text-xs text-slate-500 mt-1">名</p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-4">
              <p className="text-slate-600 text-sm">投稿曲数</p>
              <p className="text-3xl font-bold text-purple-600">{campaign.submission_count}</p>
              <p className="text-xs text-slate-500 mt-1">曲</p>
            </div>

            <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-lg p-4">
              <p className="text-slate-600 text-sm">総投票数</p>
              <p className="text-3xl font-bold text-red-600">{rankings.reduce((sum, item) => sum + item.votes, 0).toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">票</p>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-4">
              <p className="text-slate-600 text-sm">総投稿数</p>
              <p className="text-3xl font-bold text-blue-600">{rankings.length}</p>
              <p className="text-xs text-slate-500 mt-1">曲</p>
            </div>
          </div>
        </section>

        {/* コメントセクション */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">💬 応援コメント（新着）</h2>

          <div className="space-y-4">
            <CampaignComment
              author={{
                username: 'user_123',
                social_links: {
                  'twitter': 'https://twitter.com/user123',
                  'instagram': 'https://instagram.com/user123'
                }
              }}
              text="こんな応援企画があるなんて素晴らしい！"
              borderColor="border-pink-500"
            />

            <CampaignComment
              author={{
                username: 'music_lover',
                social_links: {
                  'x': 'https://x.com/musiclover'
                }
              }}
              text="1位の曲、本当に心に来る。このテーマの提案者の想いが伝わってくる"
              borderColor="border-purple-500"
            />

            <CampaignComment
              author={{
                username: 'local_team_fan'
              }}
              text="地元を応援できてうれしい。こういう企画大好きです！"
              borderColor="border-blue-500"
            />
          </div>

          <button className="w-full mt-6 py-2 border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-semibold rounded-lg transition-colors">
            💬 コメントを見る・投稿する
          </button>
        </section>

        {/* 関連ページ */}
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
                応援テーマの投票
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
