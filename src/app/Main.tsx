'use client';
import { getQueryClient } from '@/components/context/get-query-client';
import { TextPages } from '@/components/TextPages';
import { TextProvider, useTextContext } from '@/components/context/TextProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@teable/next-themes';
// Import Toaster from @teable/ui-lib
import { sonner as sonnerLib } from '@teable/ui-lib';

// Get Toaster component from sonnerLib
const ToasterComponent = (sonnerLib as any)?.Toaster;

function ThemedContent({ theme }: { theme: string }) {
  const { uiConfig } = useTextContext();
  return (
    <ThemeProvider attribute="class" forcedTheme={uiConfig?.theme ?? theme}>
      <TextPages />
    </ThemeProvider>
  );
}

export default function Main({ theme }: { theme: string }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TextProvider>
        <ThemedContent theme={theme} />
        {ToasterComponent && <ToasterComponent />}
      </TextProvider>
    </QueryClientProvider>
  );
}
