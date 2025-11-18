import { usePluginBridge } from '@teable/sdk';
import { useEffect, useState, useCallback, useContext } from 'react';
import { PluginPosition } from '@teable/openapi';
import { axios } from '@teable/openapi';
import { EvnContext } from '@/components/context/EnvProvider';
import { fetchStorageFromApi, updateStorageViaApi } from '@/utils/storageApi';
import type { ITextStorage } from '@/components/context/types';

/**
 * Custom hook for managing plugin storage with Teable SDK integration
 * 
 * This hook provides a unified interface for storage operations across different plugin types:
 * - Dashboard plugins: Uses bridge.updateStorage() method
 * - Panel plugins: Uses bridge.updateStorage() method  
 * - View plugins: Uses API endpoints (GET for fetch, PATCH for update)
 * 
 * Features:
 * - Automatic axios configuration with authentication token
 * - View ID synchronization for View-type plugins
 * - Storage synchronization via bridge events
 * - Initial storage loading from API
 * - Type-specific update strategies
 * 
 * @returns {Object} Storage management interface
 * @returns {ITextStorage | null} storage - Current storage data
 * @returns {boolean} isLoading - Loading state indicator
 * @returns {Function} updateStorage - Function to update storage
 */
export const usePluginStorage = () => {
  const bridge = usePluginBridge();
  const envParams = useContext(EvnContext);
  const [storage, setStorage] = useState<ITextStorage | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [viewId, setViewId] = useState<string>();

  /**
   * Initialize axios interceptor for API requests
   * 
   * This effect sets up axios to automatically:
   * - Configure baseURL for Teable API
   * - Add Authorization header with temporary token from bridge.getSelfTempToken()
   * 
   * The interceptor is cleaned up when the component unmounts or bridge changes.
   * 
   * Note: getSelfTempToken() is called on every request to ensure fresh authentication.
   * Consider implementing token caching if performance becomes an issue.
   */
  useEffect(() => {
    if (!bridge) {
      return;
    }
    const interceptorId = axios.interceptors.request.use(async (config) => {
      config.baseURL = 'http://127.0.0.1:3000/api';
      config.headers.Authorization = `Bearer ${await bridge.getSelfTempToken().then(res => res.accessToken)}`;
      return config;
    });
    
    return () => {
      axios.interceptors.request.eject(interceptorId);
    };
  }, [bridge]);

  /**
   * Listen for viewId changes (required for View-type plugins)
   * 
   * View-type plugins need the viewId parameter to construct API endpoints.
   * This effect listens to 'syncUrlParams' events from the bridge to get the current viewId.
   * 
   * The viewId is used in:
   * - Storage fetch API: /table/{tableId}/view/{viewId}/plugin
   * - Storage update API: /table/{tableId}/view/{viewId}/plugin/{pluginId}
   */
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

  /**
   * Initialize storage: load from API and set up synchronization
   * 
   * This effect handles:
   * 1. Waiting for viewId if plugin type is View
   * 2. Listening to 'syncStorage' events for real-time updates from other instances
   * 3. Loading initial storage data from API using fetchStorageFromApi()
   * 
   * Storage loading strategy:
   * - All plugin types use API GET request to fetch initial storage
   * - API endpoints vary by plugin type (see storageApi.ts for details)
   * - On 404 error, storage is set to null (no data exists yet)
   * 
   * Real-time sync:
   * - Listens to bridge 'syncStorage' events
   * - Updates local state when storage changes externally
   * - Useful for multi-tab scenarios or external updates
   */
  useEffect(() => {
    if (!bridge) {
      setIsLoading(false);
      return;
    }

    const { positionType, baseId, tableId, positionId, pluginInstallId, pluginId } = envParams;

    // Wait for viewId if this is a View-type plugin
    if (positionType === PluginPosition.View && !viewId) {
      setIsLoading(true);
      return;
    }

    // Listen for storage synchronization events
    const syncStorageListener = (storageData: Record<string, unknown>) => {
      if (storageData && typeof storageData === 'object') {
        const textStorage: ITextStorage = {
          content: (storageData.content as string) || '',
        };
        setStorage(textStorage);
      }
    };

    bridge.on('syncStorage' as any, syncStorageListener);

    // Load initial storage from API
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
        } else {
          setStorage(null);
        }
      } catch (error) {
        console.error('[usePluginStorage] Failed to load storage', error);
        setStorage(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorage();

    return () => {
      bridge.removeListener('syncStorage' as any, syncStorageListener);
    };
  }, [bridge, envParams, viewId]);

  /**
   * Update storage with type-specific strategy
   *
   * This function implements different update strategies based on plugin type:
   *
   * 1. View plugins:
   *    - Uses API PATCH request: /table/{tableId}/view/{viewId}/plugin/{pluginId}
   *    - Requires: tableId, viewId, pluginId
   *    - Updates storage via updateStorageViaApi()
   *
   * 2. Dashboard/Panel plugins:
   *    - Uses bridge.updateStorage() method (recommended)
   *    - Falls back to postMessage if bridge method unavailable
   *
   * Error handling:
   * - Validates required parameters before API calls
   * - Throws descriptive errors for missing parameters
   * - Logs errors for debugging
   *
   * @param {ITextStorage} newStorage - Storage data to save
   * @returns {Promise<unknown>} Updated storage data or result from bridge
   * @throws {Error} If required parameters are missing or update fails
   */
  const updateStorage = useCallback(
    async (newStorage: ITextStorage): Promise<unknown> => {
      try {
        const { positionType, baseId, tableId, positionId, pluginInstallId, pluginId } = envParams;

        // View-type plugins: Use API PATCH request
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

        // Dashboard/Panel plugins: Use bridge.updateStorage() method
        if (bridge && typeof (bridge as any).updateStorage === 'function') {
          const result = await (bridge as any).updateStorage(newStorage);
          setStorage(newStorage);
          return result;
        }

        // Fallback: Use postMessage for cross-window communication
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

