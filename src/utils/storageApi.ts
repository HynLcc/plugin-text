import { axios } from '@teable/openapi';
import { PluginPosition } from '@teable/openapi';
import type { ITextStorage } from '@/components/context/types';

interface StorageApiParams {
  positionType: PluginPosition;
  baseId?: string;
  tableId?: string;
  positionId?: string;
  pluginInstallId?: string;
  viewId?: string;
}

/**
 * 根据 positionType 构建 API 路径
 */
const buildStorageApiPath = (params: StorageApiParams): string => {
  const { positionType, baseId, tableId, positionId, pluginInstallId, viewId } = params;

  switch (positionType) {
    case PluginPosition.Dashboard:
      if (!baseId || !positionId || !pluginInstallId) {
        throw new Error('Missing required parameters for Dashboard plugin');
      }
      return `/base/${baseId}/dashboard/${positionId}/plugin/${pluginInstallId}`;

    case PluginPosition.Panel:
      if (!tableId || !positionId || !pluginInstallId) {
        throw new Error('Missing required parameters for Panel plugin');
      }
      return `/table/${tableId}/plugin-panel/${positionId}/plugin/${pluginInstallId}`;

    case PluginPosition.View:
      if (!tableId || !viewId) {
        throw new Error('Missing required parameters for View plugin');
      }
      return `/table/${tableId}/view/${viewId}/plugin`;

    default:
      throw new Error(`Unsupported plugin position type: ${positionType}`);
  }
};

/**
 * 通过 API 获取 Storage
 */
export const fetchStorageFromApi = async (params: StorageApiParams): Promise<ITextStorage | null> => {
  try {
    const apiPath = buildStorageApiPath(params);
    const response = await axios.get(apiPath);
    
    // 假设 API 返回的数据结构包含 storage 字段
    const storageData = response.data?.storage || response.data;
    
    if (storageData && typeof storageData === 'object') {
      return {
        content: (storageData.content as string) || '',
      };
    }
    
    return null;
  } catch (error: any) {
    // 如果返回 404，说明还没有存储数据，返回 null
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Failed to fetch storage from API', error);
    throw error;
  }
};

/**
 * 通过 API 更新 Storage
 */
export const updateStorageViaApi = async (
  params: StorageApiParams,
  storage: ITextStorage
): Promise<ITextStorage> => {
  try {
    const apiPath = buildStorageApiPath(params);
    const response = await axios.put(apiPath, { storage });
    
    const storageData = response.data?.storage || response.data;
    
    if (storageData && typeof storageData === 'object') {
      return {
        content: (storageData.content as string) || '',
      };
    }
    
    return storage;
  } catch (error) {
    console.error('Failed to update storage via API', error);
    throw error;
  }
};
