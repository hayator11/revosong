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
  created_at: string;
};

const CATEGORY_LABELS = {
  model: '公式モデル',
  dancer: '公式ダンサー',
  performer: '公式パフォーマー',
  talent: '公式タレント',
};

const CATEGORY_COLORS = {
  model: { border: 'rgba(255,192,203,0.3)', bg: 'rgba(255,192,203,0.05)', color: '#ffc0cb' },
  dancer: { border: 'rgba(100,200,255,0.3)', bg: 'rgba(100,200,255,0.05)', color: '#64c8ff' },
  performer: { border: 'rgba(138,43,226,0.3)', bg: 'rgba(138,43,226,0.05)', color: '#8a2be2' },
  talent: { border: 'rgba(255,165,0,0.3)', bg: 'rgba(255,165,0,0.05)', color: '#ffa500' },
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
          .order('created_at', { ascending: true });

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

  const revolistLabArtists = artists.filter(a => a.project === 'revolist-lab');
  const bosaiArtists = artists.filter(a => a.project === 'bosai-bosai');

  const renderArtistGrid = (projectArtists: Artist[]) => {
    const categories = ['model', 'dancer', 'performer', 'talent'] as const;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {categories.map(category => {
          const categoryArtists = projectArtists.filter(a => a.category === category);
          if (categoryArtists.length === 0) return null;

          const colors = CATEGORY_COLORS[category];
          return (
            <div
              key={category}
              style={{
                border: `1px solid ${colors.border}`,
                background: colors.bg,
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: colors.color,
                  marginBottom: '16px',
                }}
              >
                {CATEGORY_LABELS[category]}
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '12px',
                }}
              >
                {categoryArtists.map(artist => (
                  <div
                    key={artist.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {artist.photo_url ? (
                      <img
                        src={artist.photo_url}
                        alt={artist.name}
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: `2px solid ${colors.color}`,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px',
                        }}
                      >
                        🎭
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#fff',
                        textAlign: 'center',
                        wordBreak: 'break-word',
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
                          width: '28px',
                          height: '28px',
                          background: 'rgba(0,0,0,0.3)',
                          borderRadius: '50%',
                          color: '#fff',
                          fontSize: '14px',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                        }}
                        title={`@${artist.x_handle}`}
                      >
                        𝕏
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
          marginBottom: '20px',
        }}
      >
        🎩 レボハットアーティスト一覧
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
          読み込み中...
        </div>
      ) : (
        <>
          {/* レボリストLab */}
          <div style={{ marginBottom: '40px' }}>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#ffa500',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(255,165,0,0.2)',
              }}
            >
              🔬 レボリストLab
            </h3>
            {revolistLabArtists.length === 0 ? (
              <div
                style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px',
                  border: '1px dashed rgba(255,255,255,0.1)',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>📋</div>
                <div style={{ fontSize: '14px' }}>
                  公式アーティスト登録予定<br />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                    今後、公式モデル・ダンサー・パフォーマー・タレントを掲載予定です
                  </span>
                </div>
              </div>
            ) : (
              renderArtistGrid(revolistLabArtists)
            )}
          </div>

          {/* 防災×帽祭 */}
          <div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#dc143c',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(220,20,60,0.2)',
              }}
            >
              🎩 防災×帽祭
            </h3>
            {bosaiArtists.length === 0 ? (
              <div
                style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px',
                  border: '1px dashed rgba(255,255,255,0.1)',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>📋</div>
                <div style={{ fontSize: '14px' }}>
                  公式アーティスト登録予定<br />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                    今後、公式モデル・ダンサー・パフォーマー・タレントを掲載予定です
                  </span>
                </div>
              </div>
            ) : (
              renderArtistGrid(bosaiArtists)
            )}
          </div>
        </>
      )}

      {/* 登録情報 */}
      <div
        style={{
          marginTop: '32px',
          padding: '16px',
          background: 'rgba(0,212,255,0.05)',
          border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: '12px',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: '#00d4ff' }}>💡 従事登録について</strong><br />
        レボリストLab および防災×帽祭の公式モデル・ダンサー・パフォーマー・タレントとして従事される方は、運営までお問い合わせください。プロフィール画像とXアカウントをご登録いただくと、このページに掲載されます。
      </div>
    </section>
  );
}
