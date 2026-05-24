'use client';

import { useState, useEffect } from 'react';

interface CategoryFilterProps {
  onFilterChange?: (filter: string) => void;
  initialFilter?: string;
}

const CATEGORIES = ['すべて', '🎵 音源', '🎬 動画'];

export function CategoryFilter({
  onFilterChange,
  initialFilter = 'すべて'
}: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialFilter);

  useEffect(() => {
    const savedCategory = localStorage.getItem('musicTypeFilter');
    if (savedCategory) {
      setSelectedCategory(savedCategory);
    }
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    localStorage.setItem('musicTypeFilter', category);
    onFilterChange?.(category);
  };

  const getCategoryValue = (label: string): 'audio' | 'video' | null => {
    if (label === '🎵 音源') return 'audio';
    if (label === '🎬 動画') return 'video';
    return null;
  };

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          style={{
            padding: '8px 16px',
            background: selectedCategory === category
              ? '#ff2d55'
              : 'rgba(255, 255, 255, 0.08)',
            color: '#fff',
            border: '1px solid transparent',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            opacity: selectedCategory === category ? 1 : 0.7
          }}
          onMouseEnter={(e) => {
            if (selectedCategory !== category) {
              (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.12)';
              (e.target as HTMLButtonElement).style.opacity = '1';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedCategory !== category) {
              (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.08)';
              (e.target as HTMLButtonElement).style.opacity = '0.7';
            }
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
