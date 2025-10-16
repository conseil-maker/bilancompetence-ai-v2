'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Données considérées fraîches pendant 1 minute
            staleTime: 60 * 1000,
            // Données gardées en cache pendant 5 minutes
            gcTime: 5 * 60 * 1000,
            // Retry automatique 3 fois
            retry: 3,
            // Backoff exponentiel : 1s, 2s, 4s (max 30s)
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Ne pas refetch au focus de la fenêtre (évite les requêtes inutiles)
            refetchOnWindowFocus: false,
            // Refetch au reconnect réseau
            refetchOnReconnect: true,
            // Ne pas refetch au mount si données fraîches
            refetchOnMount: false,
          },
          mutations: {
            // Retry 1 fois pour les mutations
            retry: 1,
            // Pas de retry pour les erreurs 4xx (client)
            retryDelay: 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
}

