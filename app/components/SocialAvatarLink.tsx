'use client';

import { useState, useEffect } from 'react';

const platformLabels: Record<string, string> = {
  'x': 'X',
  'twitter': 'X',
  'instagram': 'Instagram',
  'facebook': 'Facebook',
  'youtube': 'YouTube',
  'tiktok': 'TikTok',
  'discord': 'Discord',
  'threads': 'Threads'
};

const fallbackIcons: Record<string, string> = {
  'x': '𝕏',
  'twitter': '𝕏',
  'instagram': '📷',
  'facebook': 'f',
  'youtube': '▶️',
  'tiktok': '♪',
  'discord': '💬',
  'threads': '@'
};

export function SocialAvatarLink({ platform, url }: { platform: string; url: string }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const cacheKey = `avatar_${platform}_${url}`;
        const cachedUrl = localStorage.getItem(cacheKey);

        if (cachedUrl) {
          setAvatarUrl(cachedUrl);
          setLoading(false);
          setError(false);
          return;
        }

        const response = await fetch('/api/get-social-avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url, platform })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.avatarUrl) {
            localStorage.setItem(cacheKey, data.avatarUrl);
            setAvatarUrl(data.avatarUrl);
            setError(false);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(`Failed to fetch avatar for ${platform}:`, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatar();
  }, [url, platform]);

  const label = platformLabels[platform] || platform;
  const fallbackIcon = fallbackIcons[platform] || '🔗';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        textDecoration: 'none',
        transition: 'all 0.2s',
        border: '1px solid rgba(255,255,255,0.2)',
        flexShrink: 0,
        overflow: 'hidden',
        fontSize: '14px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
        e.currentTarget.style.transform = 'scale(1.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      title={label}
    >
      {!loading && avatarUrl && !error ? (
        <img
          src={avatarUrl}
          alt={label}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%'
          }}
          onError={() => setError(true)}
        />
      ) : (
        <span style={{ fontWeight: 'bold', color: '#fff' }}>{fallbackIcon}</span>
      )}
    </a>
  );
}
