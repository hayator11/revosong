'use client';

import { SocialAvatarLink } from './SocialAvatarLink';

export interface CommentAuthor {
  username: string;
  avatar_url?: string;
  social_links?: Record<string, string>;
}

export interface CampaignCommentProps {
  author: CommentAuthor;
  text: string;
  timestamp?: string;
  borderColor?: string;
}

export function CampaignComment({
  author,
  text,
  timestamp,
  borderColor = 'border-pink-500'
}: CampaignCommentProps) {
  // ソーシャルリンクをフィルタリング
  const socialLinks = author.social_links ? Object.entries(author.social_links).filter(([_, url]) => url) : [];

  return (
    <div className={`border-l-4 ${borderColor} pl-4 py-3`}>
      <div className="flex items-center gap-2 mb-2">
        <p className="font-semibold text-slate-900">@{author.username}</p>
        {timestamp && (
          <p className="text-xs text-slate-500">{timestamp}</p>
        )}
      </div>

      {/* SNS プロフィール情報 */}
      {socialLinks.length > 0 && (
        <div className="flex gap-1 mb-2">
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

      <p className="text-sm text-slate-700 leading-relaxed">
        「{text}」
      </p>
    </div>
  );
}
