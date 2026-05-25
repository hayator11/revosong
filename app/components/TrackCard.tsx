'use client';

import { useState } from 'react';
import { getMediaService, getMediaIcon, getMediaServiceName, getThumbnail, getSNSInfo } from '@/lib/media-utils';
import { SocialAvatarLink } from './SocialAvatarLink';

export interface TrackCardProps {
  rank: number;
  track: {
    id: number;
    title: string;
    artist_name: string;
    external_url: string;
    photo_url?: string;
    music_type?: string;
  };
  artist: {
    username?: string;
    avatar_url?: string;
    social_links?: Record<string, string>;
    artist_social_url?: string;
  };
  votes: number;
  onPlay?: () => void;
  onVote?: () => void;
  onComment?: () => void;
}

export function TrackCard({
  rank,
  track,
  artist,
  votes,
  onPlay,
  onVote,
  onComment
}: TrackCardProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(track.photo_url || null);
  const [thumbnailLoading, setThumbnailLoading] = useState(!track.photo_url);

  // サムネイル読み込み
  if (thumbnailLoading && !thumbnail && track.external_url) {
    getThumbnail(track.external_url).then((url) => {
      if (url) setThumbnail(url);
      setThumbnailLoading(false);
    }).catch(() => {
      setThumbnailLoading(false);
    });
  }

  const mediaService = getMediaService(track.external_url);
  const mediaIcon = getMediaIcon(mediaService);
  const serviceName = getMediaServiceName(mediaService);

  // ランク表示用のメダルアイコン
  const getRankMedal = () => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `${rank}`;
    }
  };

  // ランク背景色
  const getRankColor = () => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 border-yellow-200';
      case 2:
        return 'bg-gray-50 border-gray-200';
      case 3:
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  // SNS リンク整理
  const socialLinks = artist.social_links ? Object.entries(artist.social_links).filter(([_, url]) => url) : [];
  if (artist.artist_social_url && !socialLinks.some(([_, url]) => url === artist.artist_social_url)) {
    socialLinks.push(['artist_url', artist.artist_social_url]);
  }

  return (
    <div className={`border rounded-lg p-4 mb-4 transition-all hover:shadow-lg ${getRankColor()}`}>
      <div className="flex gap-4">
        {/* ランク & サムネイル */}
        <div className="flex-shrink-0">
          <div className="text-2xl font-bold text-center mb-2">
            {getRankMedal()}
          </div>

          {/* サムネイル */}
          {thumbnail ? (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 group">
              <img
                src={thumbnail}
                alt={track.title}
                className="w-full h-full object-cover"
              />
              {/* メディアアイコン */}
              <div className="absolute bottom-1 right-1 bg-black rounded-full p-1 text-white text-xs">
                {mediaIcon}
              </div>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-lg bg-gray-300 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">{mediaIcon}</span>
            </div>
          )}
        </div>

        {/* 曲情報 */}
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">
                {track.title}
              </h3>
              <p className="text-sm text-slate-600">
                🎵 {track.artist_name}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xl font-bold text-red-600">
                ♥️ {votes.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500">{serviceName}</p>
            </div>
          </div>

          {/* アーティスト SNS情報 */}
          {socialLinks.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap items-center">
              {socialLinks.map(([platform, url]) => {
                if (!url) return null;
                // プラットフォーム名の正規化（TwitterはXに統一）
                const normalizedPlatform = platform === 'twitter' ? 'x' : platform;
                return (
                  <SocialAvatarLink
                    key={platform}
                    platform={normalizedPlatform}
                    url={url}
                  />
                );
              })}
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex gap-2 flex-wrap">
            {onPlay && (
              <button
                onClick={onPlay}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
              >
                🎵 再生
              </button>
            )}
            {onVote && (
              <button
                onClick={onVote}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
              >
                👍 投票
              </button>
            )}
            {onComment && (
              <button
                onClick={onComment}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
              >
                💬 コメント
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
