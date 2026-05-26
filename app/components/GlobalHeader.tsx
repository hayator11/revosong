'use client';

import Link from 'next/link';
import { useState } from 'react';

export function GlobalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <span className="text-2xl">🎵</span>
            <span>REVOSONG</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              ランキング
            </Link>
            <Link
              href="/campaigns"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              キャンペーン
            </Link>
            <Link
              href="/campaign-themes"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              テーマ募集
            </Link>
            <Link
              href="/campaigns/awards"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              殿堂入り
            </Link>
            <Link
              href="/playlists"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              プレイリスト
            </Link>
            <Link
              href="/campaigns/about"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              について
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <Link
              href="/"
              className="block py-2 px-0 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              ランキング
            </Link>
            <Link
              href="/campaigns"
              className="block py-2 px-0 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              キャンペーン
            </Link>
            <Link
              href="/campaign-themes"
              className="block py-2 px-0 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              テーマ募集
            </Link>
            <Link
              href="/campaigns/awards"
              className="block py-2 px-0 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              殿堂入り
            </Link>
            <Link
              href="/playlists"
              className="block py-2 px-0 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              プレイリスト
            </Link>
            <Link
              href="/campaigns/about"
              className="block py-2 px-0 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              について
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
