'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BackButtonProps {
  href?: string;
  label?: string;
  showIcon?: boolean;
}

export function BackButton({
  href,
  label = '戻る',
  showIcon = true,
}: BackButtonProps) {
  const router = useRouter();

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors mb-4"
      >
        {showIcon && <span>←</span>}
        {label}
      </Link>
    );
  }

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors mb-4"
    >
      {showIcon && <span>←</span>}
      {label}
    </button>
  );
}
