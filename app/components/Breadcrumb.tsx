'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav
      className={`flex items-center gap-2 text-sm text-slate-600 mb-6 ${className}`}
      aria-label="breadcrumb"
    >
      <Link
        href="/"
        className="hover:text-slate-900 transition-colors flex items-center gap-1"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        <span className="hidden sm:inline">ホーム</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-slate-400">/</span>
          {item.current ? (
            <span className="text-slate-900 font-semibold">{item.label}</span>
          ) : item.href ? (
            <Link
              href={item.href}
              className="hover:text-slate-900 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
