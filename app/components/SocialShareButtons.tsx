'use client';

import { useState } from 'react';

interface SocialShareButtonsProps {
  title: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  hashtags?: string[];
  showLabel?: boolean;
  variant?: 'compact' | 'expanded';
}

export function SocialShareButtons({
  title,
  description,
  url,
  imageUrl,
  hashtags = [],
  showLabel = false,
  variant = 'compact',
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // 現在のページURLを取得（クライアント側でのみ実行）
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);
  const hashtagString = hashtags.length > 0 ? encodeURIComponent(hashtags.join(' ')) : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleTwitterShare = () => {
    const text = `${title}${description ? '\n' + description : ''}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodedUrl}&hashtags=${hashtagString}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  const handleLineShare = () => {
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`;
    window.open(lineUrl, '_blank', 'width=500,height=500');
  };

  const handleWhatsappShare = () => {
    const text = `${title}${description ? ' - ' + description : ''}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (variant === 'expanded') {
    return (
      <div className="w-full">
        <div className="flex flex-col gap-3">
          {/* Twitter/X */}
          <button
            onClick={handleTwitterShare}
            className="flex items-center gap-3 w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.868 6.75h-3.308l7.732-8.835L.424 2.25h6.679l4.882 6.479 5.541-6.479zM17.474 20.451h1.896L6.822 3.75H4.765l12.709 16.701z" />
            </svg>
            <span>𝕏 で共有</span>
          </button>

          {/* Facebook */}
          <button
            onClick={handleFacebookShare}
            className="flex items-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook で共有</span>
          </button>

          {/* LINE */}
          <button
            onClick={handleLineShare}
            className="flex items-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.372 0 0 4.201 0 9.5c0 4.062 3.215 7.584 7.563 8.778-.084.73-.537 3.156-1.023 4.717-.07.295.218.555.51.456 3.15-1.134 7.57-3.825 10.33-6.566 2.12-1.964 3.62-4.798 3.62-8.385C24 4.201 18.628 0 12 0z" />
            </svg>
            <span>LINE で共有</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsappShare}
            className="flex items-center gap-3 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.429.738 4.779 2.124 6.778l-2.213 3.926c-.125.213-.112.541.034.758.149.217.435.283.66.172l3.853-1.977c1.997 1.144 4.25 1.753 6.583 1.753 5.468 0 9.922-4.453 9.922-9.922s-4.454-9.922-9.922-9.922" />
            </svg>
            <span>WhatsApp で共有</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-3 w-full font-bold py-3 px-6 rounded-lg transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-slate-900'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span>{copied ? 'コピーしました！' : 'リンクをコピー'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Compact variant (inline buttons)
  return (
    <div className="flex gap-2 flex-wrap items-center">
      {showLabel && <span className="text-sm font-semibold text-slate-700">共有:</span>}

      {/* Twitter/X */}
      <button
        onClick={handleTwitterShare}
        title="𝕏 で共有"
        className="flex items-center justify-center gap-1 bg-black hover:bg-gray-800 text-white font-bold py-2 px-3 rounded-lg transition-all text-sm"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.868 6.75h-3.308l7.732-8.835L.424 2.25h6.679l4.882 6.479 5.541-6.479zM17.474 20.451h1.896L6.822 3.75H4.765l12.709 16.701z" />
        </svg>
        {showLabel && <span>𝕏</span>}
      </button>

      {/* Facebook */}
      <button
        onClick={handleFacebookShare}
        title="Facebook で共有"
        className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg transition-all text-sm"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        {showLabel && <span>FB</span>}
      </button>

      {/* LINE */}
      <button
        onClick={handleLineShare}
        title="LINE で共有"
        className="flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg transition-all text-sm"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.372 0 0 4.201 0 9.5c0 4.062 3.215 7.584 7.563 8.778-.084.73-.537 3.156-1.023 4.717-.07.295.218.555.51.456 3.15-1.134 7.57-3.825 10.33-6.566 2.12-1.964 3.62-4.798 3.62-8.385C24 4.201 18.628 0 12 0z" />
        </svg>
        {showLabel && <span>LINE</span>}
      </button>

      {/* WhatsApp */}
      <button
        onClick={handleWhatsappShare}
        title="WhatsApp で共有"
        className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg transition-all text-sm"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.429.738 4.779 2.124 6.778l-2.213 3.926c-.125.213-.112.541.034.758.149.217.435.283.66.172l3.853-1.977c1.997 1.144 4.25 1.753 6.583 1.753 5.468 0 9.922-4.453 9.922-9.922s-4.454-9.922-9.922-9.922" />
        </svg>
        {showLabel && <span>WhatsApp</span>}
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        title={copied ? 'コピーしました！' : 'リンクをコピー'}
        className={`flex items-center justify-center gap-1 font-bold py-2 px-3 rounded-lg transition-all text-sm ${
          copied
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-slate-900'
        }`}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </button>
    </div>
  );
}
