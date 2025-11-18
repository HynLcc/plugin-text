import type { PluginPosition } from '@teable/openapi';
import type { IUIConfig } from '@teable/sdk';

export interface IPageParams {
  lang: string;
  baseId: string;
  pluginInstallId: string;
  positionId: string;
  positionType: PluginPosition;
  pluginId: string;
  theme: string;
  tableId?: string;
  shareId?: string;
}

export interface ITextStorage {
  content: string;
}

export interface ITextContext {
  storage?: ITextStorage;
  uiConfig?: IUIConfig;
  onStorageChange: (storage: ITextStorage) => Promise<unknown>;
}
