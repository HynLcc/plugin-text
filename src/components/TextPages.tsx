'use client';
import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react';
import { EvnContext } from './context/EnvProvider';
import { TextConfig } from './TextConfig';
import { TextViewer } from './TextViewer';
import { useTextContext } from './context/TextProvider';
import { Button } from '@teable/ui-lib';
import { PluginPosition } from '@teable/openapi';

export const TextPages = () => {
  const { t } = useTranslation();
  const { pluginInstallId, positionType } = useContext(EvnContext);
  const { storage, uiConfig, isLoading, parentBridgeMethods } = useTextContext();
  const isShowingSettings = uiConfig?.isShowingSettings;
  const [isEditMode, setIsEditMode] = useState(false);

  // Check if this is a View-type plugin
  const isViewTypePlugin = positionType === PluginPosition.View;

  // For View-type plugins: show edit button in viewer when not empty
  // For other plugins: use settings panel logic
  if (isViewTypePlugin) {
    // Wait for storage to be determined (not undefined) before showing content
    // This prevents showing edit button first, then switching to text viewer
    if (storage === undefined) {
      // While storage is undefined, show loading state
      return <div className="flex items-center justify-center h-full text-muted-foreground">{t('initializing')}</div>;
    }

    // View-type plugin: check if storage is empty (null or content is empty string)
    const isEmpty = storage === null || !storage.content || storage.content.trim().length === 0;
    // View-type plugin: use local edit mode
    return (
      <div className="flex flex-col h-full">
        {/* Header - show when in edit mode */}
        {isEditMode && (
          <div className="flex items-center justify-end px-1 py-1 pr-4 flex-shrink-0">
            {/* Save and Cancel buttons */}
            <div className="flex gap-2">
              <Button
                size="xs"
                variant="outline"
                onClick={() => setIsEditMode(false)}
                className="text-xs"
              >
                {t('cancel')}
              </Button>
              <TextHeaderSaveButton onSaveComplete={() => setIsEditMode(false)} />
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 overflow-hidden">
          {isEditMode ? (
            <TextConfig />
          ) : isEmpty ? (
            <div className="flex items-center justify-center h-full">
              <Button
                size="xs"
                onClick={() => setIsEditMode(true)}
                className="text-xs"
              >
                {t('editText')}
              </Button>
            </div>
          ) : (
            <TextViewer
              onEdit={() => setIsEditMode(true)}
              showEditButton={true}
            />
          )}
        </div>
      </div>
    );
  }

  // Non-View-type plugins (Dashboard/Panel): use settings panel logic
  // After API returns:
  // - storage === null or storage.content === "" → show edit button
  // - storage.content has content → show text viewer
  
  // If settings panel is open, show TextConfig
  if (isShowingSettings) {
    return (
      <div className="flex flex-col h-full">
        {/* Header - show when settings panel is open */}
        <div className="flex items-center justify-end px-1 py-1 pr-3 flex-shrink-0">
          {/* Save button */}
          <TextHeaderSaveButton />
        </div>
        {/* Main content area */}
        <div className="flex-1 overflow-hidden">
          <TextConfig />
        </div>
      </div>
    );
  }
  
  // Wait for storage to be determined (not undefined) before showing content
  // This prevents showing edit button first, then switching to text viewer
  if (storage === undefined) {
    // While storage is undefined, show loading state
    return <div className="flex items-center justify-center h-full text-muted-foreground">{t('initializing')}</div>;
  }
  
  // After loading completes, check if storage has content (non-empty string)
  // storage is guaranteed to be non-undefined here, so we only need to check null
  const hasContent = storage !== null && storage.content && storage.content.trim().length > 0;
  
  // If storage has content, show TextViewer
  if (hasContent) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <TextViewer />
        </div>
      </div>
    );
  }
  
  // Otherwise (storage === null or storage.content === ""), show edit button
  return (
    <div className="flex items-center justify-center h-full">
      <Button
        size="xs"
        onClick={() => {
          // Trigger expandPlugin to open settings panel
          parentBridgeMethods?.expandPlugin?.();
        }}
        className="text-xs"
      >
        {t('editText')}
      </Button>
    </div>
  );
};

// Save button component for header
const TextHeaderSaveButton = ({ onSaveComplete }: { onSaveComplete?: () => void }) => {
  const { t } = useTranslation();
  const { handleSave, isSaving } = useTextContext();

  const handleClick = async () => {
    try {
      await handleSave();
      onSaveComplete?.();
    } catch (error) {
      // Error handling is done in handleSave
    }
  };

  return (
    <Button size="xs" onClick={handleClick} disabled={isSaving} className="text-xs">
      {isSaving ? t('saving') : t('save')}
    </Button>
  );
};

