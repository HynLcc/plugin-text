import { usePluginBridge } from '@teable/sdk';
import { useEffect, useState, useCallback, useContext } from 'react';
import { PluginPosition } from '@teable/openapi';
import { axios } from '@teable/openapi';
import { EvnContext } from '@/components/context/EnvProvider';
import { fetchStorageFromApi, updateStorageViaApi } from '@/utils/storageApi';
import type { ITextStorage } from '@/components/context/types';

export const useTextStorage = () => {
  const bridge = usePluginBridge();
  const envParams = useContext(EvnContext);
  const [storage, setStorage] = useState<ITextStorage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewId, setViewId] = useState<string>();

  // 初始化 axios 配置（只执行一次）
  useEffect(() => {
    if (!bridge) {
      return;
    }
    // 检查是否已经配置过拦截器
    const interceptorId = axios.interceptors.request.use(async (config) => {
      config.baseURL = 'http://127.0.0.1:3000/api';
      config.headers.Authorization = `Bearer ${await bridge.getSelfTempToken().then(res => res.accessToken)}`;
      return config;
    });
    
    return () => {
      // 清理拦截器
      axios.interceptors.request.eject(interceptorId);
    };
  }, [bridge]);

  // 获取 viewId（View 类型插件需要）
  useEffect(() => {
    if (!bridge) {
      return;
    }
    const syncUrlParamsListener = (params: any) => {
      setViewId(params.viewId);
    };
    bridge.on('syncUrlParams', syncUrlParamsListener);
    
    return () => {
      bridge.removeListener('syncUrlParams', syncUrlParamsListener);
    };
  }, [bridge]);

  useEffect(() => {
    if (!bridge) {
      setIsLoading(false);
      return;
    }

    const { positionType, baseId, tableId, positionId, pluginInstallId, pluginId } = envParams;

    // 对于 View 类型，需要等待 viewId
    if (positionType === PluginPosition.View && !viewId) {
      setIsLoading(true);
      return;
    }

    // 监听 storage 同步事件
    const syncStorageListener = (storageData: Record<string, unknown>) => {
      if (storageData && typeof storageData === 'object') {
        const textStorage: ITextStorage = {
          content: (storageData.content as string) || '',
        };
        setStorage(textStorage);
      }
    };

    bridge.on('syncStorage' as any, syncStorageListener);

    // 初始化时通过 API 获取 storage
    const loadStorage = async () => {
      try {
        const result = await fetchStorageFromApi({
          positionType,
          baseId,
          tableId,
          positionId,
          pluginInstallId,
          pluginId,
          viewId,
        });
        if (result) {
          setStorage(result);
        }
      } catch (error) {
        console.error('Failed to load storage', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorage();

    return () => {
      bridge.removeListener('syncStorage' as any, syncStorageListener);
    };
  }, [bridge, envParams, viewId]);

  const updateStorage = useCallback(
    async (newStorage: ITextStorage): Promise<unknown> => {
      try {
        const { positionType, baseId, tableId, positionId, pluginInstallId, pluginId } = envParams;
        
        // View 类型使用 API 更新（PATCH）
        if (positionType === PluginPosition.View) {
          if (!tableId || !viewId || !pluginId) {
            throw new Error('Missing required parameters for View plugin storage update');
          }
          const updatedStorage = await updateStorageViaApi(
            {
              positionType,
              baseId,
              tableId,
              positionId,
              pluginInstallId,
              pluginId,
              viewId,
            },
            newStorage
          );
          setStorage(updatedStorage);
          return updatedStorage;
        }
        
        // 其他类型（Dashboard/Panel）使用 bridge 方法更新
        if (bridge && typeof (bridge as any).updateStorage === 'function') {
          const result = await (bridge as any).updateStorage(newStorage);
          setStorage(newStorage);
          return result;
        }
        
        // 降级方案：通过 postMessage 通信
        if (window.parent) {
          window.parent.postMessage(
            {
              type: 'updateStorage',
              storage: newStorage,
            },
            '*'
          );
          setStorage(newStorage);
          return newStorage;
        }
        
        throw new Error('No storage update method available');
      } catch (error) {
        console.error('Failed to update storage', error);
        throw error;
      }
    },
    [envParams, viewId, bridge]
  );

  return {
    storage,
    isLoading,
    updateStorage,
  };
};

