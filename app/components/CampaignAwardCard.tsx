'use client';

interface AwardedTrack {
  id: number;
  title: string;
  artist_name: string;
  photo_url?: string;
  external_url?: string;
}

interface ThemeProposer {
  username: string;
  avatar_url?: string;
}

interface CampaignAwardCardProps {
  campaignTitle: string;
  awardedTrack: AwardedTrack;
  themeProposer: ThemeProposer;
  proposerComment: string;
  ogpImageUrl?: string;
}

export function CampaignAwardCard({
  campaignTitle,
  awardedTrack,
  themeProposer,
  proposerComment,
  ogpImageUrl,
}: CampaignAwardCardProps) {
  const handleShare = (platform: 'twitter' | 'facebook' | 'copy') => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `🎁 ${campaignTitle} - 応援ソング殿堂入り: ${awardedTrack.title} by ${awardedTrack.artist_name}`;

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('リンクをコピーしました!');
        break;
    }
  };

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-lg p-8 mb-8 border-2 border-yellow-200">
      {/* Award Badge */}
      <div className="flex items-center justify-center mb-6">
        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full font-bold text-lg flex items-center gap-2">
          🏆 応援ソング殿堂入り
        </span>
      </div>

      {/* Campaign Title */}
      <h2 className="text-center text-2xl font-bold text-slate-900 mb-6">
        {campaignTitle}
      </h2>

      {/* OGP Image Preview */}
      {ogpImageUrl && (
        <div className="mb-6 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={ogpImageUrl}
            alt="Award OGP Image"
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Track Info */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex items-start gap-6">
          {awardedTrack.photo_url && (
            <img
              src={awardedTrack.photo_url}
              alt={awardedTrack.title}
              className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {awardedTrack.title}
            </h3>
            <p className="text-lg text-slate-600 mb-3">
              🎵 {awardedTrack.artist_name}
            </p>
            {awardedTrack.external_url && (
              <a
                href={awardedTrack.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
              >
                🎵 曲を聴く
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Theme Proposer Message */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          {themeProposer.avatar_url && (
            <img
              src={themeProposer.avatar_url}
              alt={themeProposer.username}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <p className="font-bold text-slate-900">
            👤 {themeProposer.username} からのメッセージ
          </p>
        </div>
        <p className="text-slate-700 leading-relaxed italic border-l-4 border-pink-500 pl-4">
          「{proposerComment}」
        </p>
      </div>

      {/* Share Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => handleShare('twitter')}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-all"
        >
          <span>𝕏</span> Twitter
        </button>
        <button
          onClick={() => handleShare('facebook')}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg transition-all"
        >
          📘 Facebook
        </button>
        <button
          onClick={() => handleShare('copy')}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-all"
        >
          🔗 リンク
        </button>
      </div>
    </div>
  );
}
