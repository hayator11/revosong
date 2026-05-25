'use client';

import { useState } from 'react';

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

interface ThemeProposerChoiceProps {
  submissions: Submission[];
  campaignId: number;
  onSubmit: (submissionId: number) => void;
}

export function ThemeProposerChoice({
  submissions,
  campaignId,
  onSubmit,
}: ThemeProposerChoiceProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  const handleSubmit = async () => {
    if (!selectedId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/award`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submission_id: selectedId,
        }),
      });

      if (response.ok) {
        onSubmit(selectedId);
      } else {
        alert('選択に失敗しました');
      }
    } catch (error) {
      console.error('Error submitting choice:', error);
      alert('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        このテーマには投稿がまだありません
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-bold text-slate-900 mb-4">
        🎁 あなたのお気に入りの応援歌を選んでください
      </h3>
      <p className="text-sm text-slate-600 mb-6">
        投稿された全ての曲の中から、あなたの心に最も響いた1曲を選んでください。
        選んだ曲はあなたのメッセージと共に「応援ソング殿堂入り」に掲載されます。
      </p>

      <div className="space-y-3 mb-6">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            onClick={() => handleSelect(submission.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedId === submission.id
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 bg-white hover:border-pink-300'
            }`}
          >
            <div className="flex items-start gap-4">
              {submission.photo_url && (
                <img
                  src={submission.photo_url}
                  alt={submission.track_title}
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 truncate">
                  {submission.track_title}
                </h4>
                <p className="text-sm text-slate-600 truncate">
                  @{submission.artist_username}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  ❤️ {submission.campaign_likes} いいね
                </p>
              </div>
              {selectedId === submission.id && (
                <div className="flex-shrink-0">
                  <span className="text-pink-500 text-xl">✓</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedId || isLoading}
        className={`w-full py-3 px-4 rounded-lg font-bold transition-all ${
          selectedId && !isLoading
            ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isLoading ? '保存中...' : '🎁 この曲を選びます'}
      </button>
    </div>
  );
}
