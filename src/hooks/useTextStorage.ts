import { usePluginBridge } from '@teable/sdk';
import { useEffect, useState, useCallback } from 'react';
import type { ITextStorage, IParentBridgeMethods } from '@/components/context/types';

const DEFAULT_STORAGE: ITextStorage = {
  content: '',
};

export const useTextStorage = () => {
  const bridge = usePluginBridge();
  const [storage, setStorage] = useState<ITextStorage>(DEFAULT_STORAGE);
  const [isLoading, setIsLoading] = useState(true);

  const parentBridgeMethods: IParentBridgeMethods = {
    updateStorage: bridge?.updateStorage?.bind(bridge),
    getStorage: bridge?.getStorage?.bind(bridge),
  };

  // 加载存储数据
  const loadStorage = useCallback(async () => {
    if (!bridge?.getStorage) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await bridge.getStorage();
      if (data && typeof data === 'object') {
        const textStorage: ITextStorage = {
          content: (data.content as string) || '',
        };
        setStorage(textStorage);
      }
    } catch (error) {
      console.error('Failed to load storage', error);
    } finally {
      setIsLoading(false);
    }
  }, [bridge]);

  // 更新存储数据
  const updateStorage = useCallback(
    async (newStorage: ITextStorage) => {
      if (!bridge?.updateStorage) {
        // 如果没有 bridge 方法，使用 localStorage 作为降级方案
        localStorage.setItem('teable-text-plugin-storage', JSON.stringify(newStorage));
        setStorage(newStorage);
        return;
      }

      try {
        await bridge.updateStorage(newStorage as Record<string, unknown>);
        setStorage(newStorage);
      } catch (error) {
        console.error('Failed to update storage', error);
        throw error;
      }
    },
    [bridge]
  );

  // 监听存储变化
  useEffect(() => {
    if (!bridge) {
      setIsLoading(false);
      return;
    }

    // 初始加载
    loadStorage();

    // 监听存储同步事件
    const storageListener = (data: Record<string, unknown>) => {
      if (data && typeof data === 'object') {
        const textStorage: ITextStorage = {
          content: (data.content as string) || '',
        };
        setStorage(textStorage);
      }
    };

    bridge.on('syncStorage', storageListener);

    return () => {
      bridge.removeListener('syncStorage', storageListener);
    };
  }, [bridge, loadStorage]);

  return {
    storage,
    isLoading,
    updateStorage,
    parentBridgeMethods,
  };
};

