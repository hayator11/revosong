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

  const renderProjectSection = (project: 'revolist-lab' | 'bosai-bosai') => {
    const projectArtists = artists.filter(a => a.project === project);

    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
          読み込み中...
        </div>
      );
    }

    if (projectArtists.length === 0) {
      return (
        <div
          style={{
            padding: '48px 32px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.4)',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '12px',
            border: '1px dashed rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎭</div>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>
            公式アーティスト掲載予定
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
            公式モデル・ダンサー・パフォーマー・タレント<br />
            今後、順次掲載予定です
          </div>
        </div>
      );
    }

    // カテゴリーごとにグループ化
    const categories = ['model', 'dancer', 'performer', 'talent'] as const;
    const categoryGroups = categories.map(cat => ({
      category: cat,
      artists: projectArtists.filter(a => a.category === cat),
    })).filter(g => g.artists.length > 0);

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        {categoryGroups.map(group => {
          const colors = CATEGORY_COLORS[group.category];
          return (
            <div key={group.category}>
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
                {CATEGORY_LABELS[group.category]}
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '20px',
                }}
              >
                {group.artists.map(artist => (
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
        })}
      </div>
    );
  };

  return (
    <section style={{ marginBottom: '48px' }}>
      <h2
        style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#fff',
          marginBottom: '32px',
        }}
      >
        🎩 レボハットアーティスト一覧
      </h2>

      {/* レボリストLab */}
      <div style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#ffa500',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(255,165,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🔬</span>
          レボリストLab
        </h3>
        {renderProjectSection('revolist-lab')}
      </div>

      {/* 防災×帽祭 */}
      <div style={{ marginBottom: '40px' }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#dc143c',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(220,20,60,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🎩</span>
          防災×帽祭
        </h3>
        {renderProjectSection('bosai-bosai')}
      </div>

      {/* 登録情報 */}
      <div
        style={{
          padding: '20px 24px',
          background: 'rgba(0,212,255,0.05)',
          border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: '12px',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.8,
        }}
      >
        <strong style={{ color: '#00d4ff', display: 'block', marginBottom: '8px' }}>
          💡 アーティスト従事登録について
        </strong>
        <div style={{ marginBottom: '8px' }}>
          レボリストLab および防災×帽祭の公式モデル・ダンサー・パフォーマー・タレントとして従事される方は、運営までお問い合わせください。
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
          ※ 表示順序は運営側で管理しています
        </div>
      </div>
    </section>
  );
}
