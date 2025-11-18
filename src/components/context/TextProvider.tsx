'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { IUIConfig, usePluginBridge } from '@teable/sdk';
import { sonner } from '@teable/ui-lib'
import { useTranslation } from 'react-i18next';
import { usePluginStorage } from '@/hooks/usePluginStorage';
import type { ITextContext, ITextStorage, IParentBridgeMethods } from './types';

const { toast } = sonner;  

export const TextContext = createContext<ITextContext>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onStorageChange: (storage: ITextStorage) => Promise.resolve(storage),
  content: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setContent: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleSave: async () => {},
  isSaving: false,
  isLoading: true,
});

export const useTextContext = () => {
  const context = useContext(TextContext);
  if (!context) {
    throw new Error('useTextContext must be used within TextProvider');
  }
  return context;
};

export const TextProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const bridge = usePluginBridge();
  const { storage, isLoading, updateStorage } = usePluginStorage();
  const [uiConfig, setUIConfig] = useState<IUIConfig | undefined>();
  const [storageState, setStorageState] = useState<ITextStorage | null | undefined>(
    storage
  );
  const preStorage = useRef<ITextStorage | undefined>();
  // Content state for TextConfig
  const [content, setContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Update storageState and content when storage changes
  useEffect(() => {
    // Keep null as null (don't convert to undefined)
    // null means storage was loaded but doesn't exist (new plugin)
    // undefined means storage hasn't been loaded yet
    setStorageState(storage);
    
    // Update content when storage changes
    if (storage?.content !== undefined) {
      setContent(storage.content);
    } else if (storage === null) {
      // When storage is null, reset content to empty string
      setContent('');
    }
  }, [storage]);

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

  const onStorageChange = useCallback(
    async (newStorage: ITextStorage): Promise<unknown> => {
      try {
        preStorage.current = newStorage;
        setStorageState(newStorage);
        const result = await updateStorage(newStorage);
        return result;
      } catch (error) {
        console.error('Failed to update storage', error);
        // Revert to previous storage on error
        if (preStorage.current) {
          setStorageState(preStorage.current);
        }
        throw error;
      }
    },
    [updateStorage]
  );

  // Handle save for TextConfig
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onStorageChange({ content });
      // Show success toast
      toast.success(t('saveSuccess'));
    } catch (error) {
      console.error('Failed to save content', error);
      // Show error toast
      toast.error(t('saveError') || 'Failed to save content');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [content, onStorageChange, t]);

  // Get parentBridgeMethods from bridge
  const parentBridgeMethods: IParentBridgeMethods | undefined = bridge
    ? {
        expandPlugin: () => {
          if (bridge && typeof (bridge as any).expandPlugin === 'function') {
            (bridge as any).expandPlugin();
          }
        },
      }
    : undefined;

  const value: ITextContext = {
    // Pass undefined when storage is null, so TextPages can detect no storage
    storage: storageState,
    uiConfig,
    parentBridgeMethods,
    onStorageChange,
    content,
    setContent,
    handleSave,
    isSaving,
    isLoading,
  };

  return <TextContext.Provider value={value}>{children}</TextContext.Provider>;
};

