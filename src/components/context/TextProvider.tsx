'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePluginBridge } from '@teable/sdk';
import type { IUIConfig } from '@teable/sdk';
import type { ITextContext, ITextStorage } from './types';
import { useTextStorage } from '@/hooks/useTextStorage';

const TextContext = createContext<ITextContext | null>(null);

export const useTextContext = () => {
  const context = useContext(TextContext);
  if (!context) {
    throw new Error('useTextContext must be used within TextProvider');
  }
  return context;
};

export const TextProvider = ({ children }: { children: React.ReactNode }) => {
  const bridge = usePluginBridge();
  const [tab, setTab] = useState<'text' | 'setting'>('text');
  const [uiConfig, setUIConfig] = useState<IUIConfig | undefined>();
  const { storage, isLoading, updateStorage, parentBridgeMethods } = useTextStorage();

  // 监听 UI 配置变化
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

  // Tab 切换处理
  const onTabChange = useCallback((newTab: 'text' | 'setting') => {
    setTab(newTab);
  }, []);

  // 存储变化处理
  const onStorageChange = useCallback(
    async (newStorage: ITextStorage) => {
      try {
        await updateStorage(newStorage);
      } catch (error) {
        console.error('Failed to update storage in context', error);
        throw error;
      }
    },
    [updateStorage]
  );

  const value: ITextContext = {
    tab,
    storage: isLoading ? undefined : storage,
    uiConfig,
    onTabChange,
    onStorageChange,
    parentBridgeMethods,
  };

  return <TextContext.Provider value={value}>{children}</TextContext.Provider>;
};

