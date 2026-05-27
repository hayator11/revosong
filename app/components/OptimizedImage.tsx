'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  fallbackSrc?: string;
}

/**
 * 最適化された画像コンポーネント
 * Next.js Image コンポーネントを使用して自動的に最適化
 * - WebP フォーマットでの配信
 * - 遅延読み込み（lazy loading）
 * - 自動キャッシング
 */
export function OptimizedImage({
  src,
  alt,
  width = 200,
  height = 200,
  quality = 75,
  priority = false,
  className = '',
  objectFit = 'cover',
  fallbackSrc = '/placeholder.png',
}: OptimizedImageProps) {
  const [isError, setIsError] = useState(false);

  // 外部 URL の場合、src をそのまま使用（Next.js は自動的に最適化）
  // 相対パスの場合も同様

  const imageSrc = isError ? fallbackSrc : src;

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        onError={() => setIsError(true)}
        style={{
          objectFit,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}

/**
 * アバター画像専用コンポーネント
 * プロフィール画像やアーティスト写真用
 */
export function AvatarImage({
  src: initialSrc,
  alt,
  size = 32,
  quality = 75,
  className = '',
}: {
  src: string;
  alt: string;
  size?: number;
  quality?: number;
  className?: string;
}) {
  const [isError, setIsError] = useState(false);
  const src = isError ? '/placeholder-avatar.png' : initialSrc;

  return (
    <div className={className} style={{ width: size, height: size }}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        quality={quality}
        priority={false}
        loading="lazy"
        onError={() => setIsError(true)}
        style={{
          borderRadius: '50%',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}

/**
 * トラック用サムネイル画像コンポーネント
 */
export function TrackThumbnail({
  src: initialSrc,
  alt,
  width = 200,
  height = 200,
  quality = 70,
  priority = false,
  className = '',
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  className?: string;
}) {
  const [isError, setIsError] = useState(false);
  const src = isError ? '/placeholder-track.png' : initialSrc;

  return (
    <div className={className} style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        onError={() => setIsError(true)}
        style={{
          borderRadius: '8px',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}
