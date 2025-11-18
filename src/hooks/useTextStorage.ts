import { usePluginBridge } from '@teable/sdk';
import { useEffect, useState, useCallback, useContext } from 'react';
import { PluginPosition } from '@teable/openapi';
import { axios } from '@teable/openapi';
import { EvnContext } from '@/components/context/EnvProvider';
import { fetchStorageFromApi, updateStorageViaApi } from '@/utils/storageApi';
import type { ITextStorage, IParentBridgeMethods } from '@/components/context/types';

export const useTextStorage = () => {
  const bridge = usePluginBridge();
  const envParams = useContext(EvnContext);
  const [storage, setStorage] = useState<ITextStorage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewId, setViewId] = useState<string>();
  const [parentBridgeMethods, setParentBridgeMethods] = useState<IParentBridgeMethods | undefined>();

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

    const { positionType, baseId, tableId, positionId, pluginInstallId } = envParams;

    // 对于 View 类型，需要等待 viewId
    if (positionType === PluginPosition.View && !viewId) {
      setIsLoading(true);
      return;
    }

    // 获取父窗口的 bridge 方法
    const methods: IParentBridgeMethods = {
      updateStorage: async (storageData: Record<string, unknown>) => {
        // 优先使用 API 更新
        try {
          const updatedStorage = await updateStorageViaApi(
            {
              positionType,
              baseId,
              tableId,
              positionId,
              pluginInstallId,
              viewId,
            },
            storageData as unknown as ITextStorage
          );
          return updatedStorage;
        } catch (error) {
          console.error('Failed to update storage via API, trying bridge method', error);
          // 如果 API 失败，尝试使用 bridge 方法
          if (bridge && typeof (bridge as any).updateStorage === 'function') {
            return await (bridge as any).updateStorage(storageData);
          }
          throw error;
        }
      },
      getStorage: async () => {
        // 优先使用 API 获取
        try {
          const result = await fetchStorageFromApi({
            positionType,
            baseId,
            tableId,
            positionId,
            pluginInstallId,
            viewId,
          });
          return result ? (result as unknown as Record<string, unknown>) : null;
        } catch (error) {
          console.error('Failed to get storage via API, trying bridge method', error);
          // 如果 API 失败，尝试使用 bridge 方法
          if (bridge && typeof (bridge as any).getStorage === 'function') {
            return await (bridge as any).getStorage();
          }
          return null;
        }
      },
    };

    setParentBridgeMethods(methods);

    // 监听 storage 同步事件
    const syncStorageListener = (storageData: Record<string, unknown>) => {
      if (storageData && typeof storageData === 'object') {
        const textStorage: ITextStorage = {
          content: (storageData.content as string) || '',
        };
        setStorage(textStorage);
      }
    };

    // 监听 syncStorage 事件
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
        const result = await parentBridgeMethods?.updateStorage?.(newStorage as unknown as Record<string, unknown>);
        setStorage(newStorage);
        return result;
      } catch (error) {
        console.error('Failed to update storage', error);
        throw error;
      }
    },
    [parentBridgeMethods]
  );

  return {
    storage,
    isLoading,
    updateStorage,
    parentBridgeMethods,
  };
};

