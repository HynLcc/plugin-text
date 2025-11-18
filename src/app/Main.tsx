'use client';
import { getQueryClient } from '@/components/context/get-query-client';
import { TextPages } from '@/components/TextPages';
import { TextProvider, useTextContext } from '@/components/context/TextProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@teable/next-themes';

function ThemeWrapper({ theme, children }: { theme: string; children: React.ReactNode }) {
  const { uiConfig } = useTextContext();
  return (
    <ThemeProvider attribute="class" forcedTheme={uiConfig?.theme ?? theme}>
      {children}
    </ThemeProvider>
  );
}

export default function Main({ theme }: { theme: string }) {
  const queryClient = getQueryClient();

  return (
    <TextProvider>
      <ThemeWrapper theme={theme}>
        <QueryClientProvider client={queryClient}>
          <TextPages />
        </QueryClientProvider>
      </ThemeWrapper>
    </TextProvider>
  );
}
