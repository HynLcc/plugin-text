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

export interface IParentBridgeMethods {
  expandPlugin?: () => void;
}

export interface ITextContext {
  // storage can be:
  // - undefined: not loaded yet
  // - null: loaded but no storage exists (new plugin)
  // - ITextStorage: storage exists
  storage?: ITextStorage | null;
  uiConfig?: IUIConfig;
  parentBridgeMethods?: IParentBridgeMethods;
  onStorageChange: (storage: ITextStorage) => Promise<unknown>;
  // For TextConfig
  content: string;
  setContent: (content: string) => void;
  handleSave: () => Promise<void>;
  isSaving: boolean;
  // Loading state
  isLoading: boolean;
}
