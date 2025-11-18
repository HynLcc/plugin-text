'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IUIConfig, usePluginBridge } from '@teable/sdk';
import { useTextStorage } from '@/hooks/useTextStorage';
import type { ITextContext, ITextStorage } from './types';

export const TextContext = createContext<ITextContext | null>(null);

export const useTextContext = () => {
  const context = useContext(TextContext);
  if (!context) {
    throw new Error('useTextContext must be used within TextProvider');
  }
  return context;
};

export const TextProvider = ({ children }: { children: React.ReactNode }) => {
  const bridge = usePluginBridge();
  const { storage, isLoading, updateStorage } = useTextStorage();
  const [tab, setTab] = useState<'text' | 'setting'>('text');
  const [uiConfig, setUIConfig] = useState<IUIConfig | undefined>();

  useEffect(() => {
    if (!bridge) {
      return;
    }
    const uiConfigListener = (config: IUIConfig) => {
      setUIConfig(config);
    };
    bridge.on('syncUIConfig', uiConfigListener);
    return () => {
      bridge.removeListener('syncUIConfig', uiConfigListener);
    };
  }, [bridge]);

  const onTabChange = useCallback((newTab: 'text' | 'setting') => {
    setTab(newTab);
  }, []);

  const onStorageChange = useCallback(
    async (newStorage: ITextStorage): Promise<unknown> => {
      return await updateStorage(newStorage);
    },
    [updateStorage]
  );

  const value: ITextContext = {
    tab,
    storage: storage || undefined,
    uiConfig,
    onTabChange,
    onStorageChange,
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return <TextContext.Provider value={value}>{children}</TextContext.Provider>;
};

