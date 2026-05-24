'use client';

import { useState } from 'react';

interface PlaylistFormProps {
  onSubmit: (data: { title: string; description?: string; is_public?: boolean }) => Promise<void>;
  onCancel: () => void;
  initialData?: { title: string; description?: string; is_public?: boolean };
  isLoading?: boolean;
  title?: string;
}

export function PlaylistForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  title = 'プレイリストを作成'
}: PlaylistFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    is_public: initialData?.is_public || false
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('タイトルは必須です');
      return;
    }

    try {
      await onSubmit({
        title: formData.title,
        description: formData.description || undefined,
        is_public: formData.is_public
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1420 100%)',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '500px',
          width: '90%',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: '24px',
            fontSize: '20px',
            fontWeight: 700,
            color: '#fff'
          }}
        >
          {title}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#fff'
              }}
            >
              タイトル *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="プレイリスト名"
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.background = 'rgba(255, 255, 255, 0.08)';
                (e.target as HTMLInputElement).style.borderColor = 'rgba(255, 45, 85, 0.5)';
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.background = 'rgba(255, 255, 255, 0.05)';
                (e.target as HTMLInputElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
              disabled={isLoading}
            />
          </div>

          {/* Description Input */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#fff'
              }}
            >
              説明（オプション）
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="このプレイリストについて..."
              rows={4}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                resize: 'vertical',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                (e.target as HTMLTextAreaElement).style.background = 'rgba(255, 255, 255, 0.08)';
                (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255, 45, 85, 0.5)';
              }}
              onBlur={(e) => {
                (e.target as HTMLTextAreaElement).style.background = 'rgba(255, 255, 255, 0.05)';
                (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
              disabled={isLoading}
            />
          </div>

          {/* Privacy Toggle */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#fff'
              }}
            >
              公開設定
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_public: false })}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: !formData.is_public ? '#ff2d55' : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (formData.is_public) (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  if (formData.is_public) (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                disabled={isLoading}
              >
                🔒 プライベート
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_public: true })}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: formData.is_public ? '#00d4ff' : 'rgba(255, 255, 255, 0.1)',
                  color: formData.is_public ? '#000' : '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!formData.is_public) (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  if (!formData.is_public) (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                disabled={isLoading}
              >
                🌐 公開
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: '12px',
                background: 'rgba(255, 100, 100, 0.2)',
                border: '1px solid rgba(255, 100, 100, 0.5)',
                borderRadius: '6px',
                color: '#ffcccc',
                fontSize: '14px',
                marginBottom: '20px'
              }}
            >
              {error}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              style={{
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s',
                opacity: isLoading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                if (!isLoading) (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '10px 20px',
                background: '#ff2d55',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s',
                opacity: isLoading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) (e.target as HTMLButtonElement).style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                if (!isLoading) (e.target as HTMLButtonElement).style.opacity = '1';
              }}
            >
              {isLoading ? '作成中...' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
