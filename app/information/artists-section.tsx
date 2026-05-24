'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Artist = {
  id: number;
  name: string;
  category: 'model' | 'dancer' | 'performer' | 'talent';
  project: 'revolist-lab' | 'bosai-bosai';
  photo_url: string | null;
  x_handle: string | null;
  order: number;
  created_at: string;
};

const CATEGORY_LABELS = {
  model: '公式モデル',
  dancer: '公式ダンサー',
  performer: '公式パフォーマー',
  talent: '公式タレント',
};

const CATEGORY_COLORS = {
  model: { border: 'rgba(255,192,203,0.3)', color: '#ffc0cb' },
  dancer: { border: 'rgba(100,200,255,0.3)', color: '#64c8ff' },
  performer: { border: 'rgba(138,43,226,0.3)', color: '#8a2be2' },
  talent: { border: 'rgba(255,165,0,0.3)', color: '#ffa500' },
};

const PROJECT_LOGOS = {
  'revolist-lab': '/revolislab.jpg',
  'bosai-bosai': '/bosai-bosai-logo.png',
};

const PROJECT_NAMES = {
  'revolist-lab': 'レボリストLab',
  'bosai-bosai': '防災×帽祭',
};

export function ArtistsSection() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const { data, error } = await supabase
          .from('artists')
          .select('*')
          .order('order', { ascending: true });

        if (error) {
          console.error('アーティスト取得エラー:', error);
        } else {
          setArtists(data || []);
        }
      } catch (err) {
        console.error('アーティスト取得失敗:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const renderCategoryGroup = (categoryArtists: Artist[], category: 'model' | 'dancer' | 'performer' | 'talent') => {
    if (categoryArtists.length === 0) return null;

    const colors = CATEGORY_COLORS[category];

    return (
      <div key={category}>
        <h4
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: colors.color,
            marginBottom: '16px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          {CATEGORY_LABELS[category]}
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          {categoryArtists.map(artist => (
            <div
              key={artist.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                border: `1px solid ${colors.border}`,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = colors.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = colors.border;
              }}
            >
              {artist.photo_url ? (
                <img
                  src={artist.photo_url}
                  alt={artist.name}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `3px solid ${colors.color}`,
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.color}22, ${colors.color}11)`,
                    border: `3px solid ${colors.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                  }}
                >
                  🎭
                </div>
              )}
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#fff',
                  textAlign: 'center',
                }}
              >
                {artist.name}
              </div>
              {artist.x_handle && (
                <a
                  href={`https://x.com/${artist.x_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '20px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.color;
                    e.currentTarget.style.borderColor = colors.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  }}
                >
                  <span>𝕏</span>
                  <span>@{artist.x_handle}</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjectArtists = (project: 'revolist-lab' | 'bosai-bosai') => {
    const projectArtists = artists.filter(a => a.project === project);

    if (projectArtists.length === 0) {
      return null;
    }

    const categories = ['model', 'dancer', 'performer', 'talent'] as const;

    return (
      <div style={{ marginBottom: '40px' }}>
        {categories.map(cat => {
          const categoryArtists = projectArtists.filter(a => a.category === cat);
          return renderCategoryGroup(categoryArtists, cat);
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <section style={{ marginBottom: '48px' }}>
        <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
          読み込み中...
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        background: 'rgba(0,212,255,0.08)',
        border: '1px solid rgba(0,212,255,0.2)',
        borderRadius: '16px',
        padding: '32px 28px',
        marginBottom: '48px',
      }}
    >
      <h2
        style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#00d4ff',
          marginBottom: '24px',
        }}
      >
        🎩 レボハットアーティスト
      </h2>

      {/* 準備中プレースホルダー3枚 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        {[0, 1, 2].map(idx => (
          <div
            key={`placeholder-${idx}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '3px solid rgba(0,212,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <img
                src={PROJECT_LOGOS['revolist-lab']}
                alt="準備中"
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'contain',
                  opacity: 0.5,
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.4)',
                textAlign: 'center',
              }}
            >
              準備中
            </div>
          </div>
        ))}
      </div>

      {/* リンクボタン */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px' }}>
        <a
          href="https://revolist.earth/revolist-lab"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '12px 16px',
            background: 'rgba(0,212,255,0.15)',
            border: '1px solid rgba(0,212,255,0.3)',
            borderRadius: '8px',
            color: '#00d4ff',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 600,
            textAlign: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0,212,255,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,212,255,0.15)';
          }}
        >
          🌐 公式サイト
        </a>
        <a
          href="https://x.com/REVOLIST11"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '12px 16px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 600,
            textAlign: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
          }}
        >
          𝕏 レボリストLab
        </a>
        <a
          href="https://x.com/Hayator"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '12px 16px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 600,
            textAlign: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
          }}
        >
          𝕏 @hayator
        </a>
      </div>

      {/* レボリストLab アーティスト */}
      {renderProjectArtists('revolist-lab')}

      {/* 防災×帽祭 アーティスト */}
      {renderProjectArtists('bosai-bosai')}

      {/* 登録情報 */}
      <div
        style={{
          padding: '16px 20px',
          background: 'rgba(100,200,255,0.05)',
          border: '1px solid rgba(100,200,255,0.15)',
          borderRadius: '10px',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.7,
        }}
      >
        <strong style={{ color: '#00d4ff', display: 'block', marginBottom: '6px' }}>
          💡 アーティスト従事登録について
        </strong>
        <div>
          レボリストLab および防災×帽祭の公式モデル・ダンサー・パフォーマー・タレントとして従事される方は、運営までお問い合わせください。
        </div>
      </div>
    </section>
  );
}
