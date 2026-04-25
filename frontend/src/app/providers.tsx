'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { RefreshCw, X } from 'lucide-react';

function ServiceWorkerInit() {
  const { updateAvailable, applyUpdate } = useServiceWorker();

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl pointer-events-auto animate-slide-up max-w-sm w-full">
        <RefreshCw className="w-4 h-4 shrink-0" />
        <p className="text-sm font-medium flex-1">Update available</p>
        <button
          onClick={applyUpdate}
          className="text-xs font-bold bg-white dark:bg-stone-900 text-stone-900 dark:text-white px-3 py-1.5 rounded-xl"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ServiceWorkerInit />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
