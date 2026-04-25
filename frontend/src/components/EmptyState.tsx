import Link from 'next/link';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta?: string;
  ctaHref?: string;
  ctaOnClick?: () => void;
  className?: string;
}

export function EmptyState({ icon, title, body, cta, ctaHref, ctaOnClick, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6 gap-4 animate-fade-in', className)}>
      <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 dark:text-stone-500">
        {icon}
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50">{title}</h3>
        <p className="text-sm text-stone-400 dark:text-stone-500 max-w-xs">{body}</p>
      </div>
      {cta && ctaHref && (
        <Link href={ctaHref} className="btn-primary px-6 py-2.5 text-sm mt-2">
          {cta}
        </Link>
      )}
      {cta && ctaOnClick && (
        <button onClick={ctaOnClick} className="btn-primary px-6 py-2.5 text-sm mt-2">
          {cta}
        </button>
      )}
    </div>
  );
}
