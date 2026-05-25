'use client';

import { useState } from 'react';

interface AwardCommentFormProps {
  campaignId: number;
  submissionId: number;
  onSubmit: (comment: string) => void;
  isLoading?: boolean;
}

export function AwardCommentForm({
  campaignId,
  submissionId,
  onSubmit,
  isLoading = false,
}: AwardCommentFormProps) {
  const [comment, setComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const maxLength = 300;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/award`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme_proposer_comment: comment.trim(),
        }),
      });

      if (response.ok) {
        onSubmit(comment);
        setComment('');
      } else {
        alert('保存に失敗しました');
      }
    } catch (error) {
      console.error('Error saving comment:', error);
      alert('エラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        💬 あなたのメッセージを書いてください
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        選んだ曲があなたの心に響いた理由や、テーマを提案した背景、
        そしてこの曲への思いを自由に書いてください。
      </p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, maxLength))}
          placeholder="例：この曲を聞いた時、あなたの応援メッセージが心に響きました。特に〜の部分で..."
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 resize-none"
          rows={5}
        />

        <div className="flex justify-between items-center mt-2 mb-4">
          <p className="text-xs text-slate-500">
            {comment.length} / {maxLength} 文字
          </p>
          {comment.length === maxLength && (
            <p className="text-xs text-pink-600">
              最大文字数に達しました
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!comment.trim() || isSaving || isLoading}
          className={`w-full py-3 px-4 rounded-lg font-bold transition-all ${
            comment.trim() && !isSaving && !isLoading
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSaving ? '保存中...' : '✨ メッセージを保存'}
        </button>
      </form>
    </div>
  );
}
