'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextConfig } from './TextConfig';
import { TextViewer } from './TextViewer';
import { useTextContext } from './context/TextProvider';
import { AlignmentControls } from './AlignmentControls';
import { SaveButton } from './SaveButton';

/**
 * Props for ViewTypePlugin component
 */
interface ViewTypePluginProps {
  /** Initial edit mode state */
  initialEditMode?: boolean;
}

/**
 * Component for View-type plugin with local edit mode management
 * Handles inline editing with header controls for alignment and save functionality
 *
 * @param props - Component props
 * @returns ViewTypePlugin component
 */
export const ViewTypePlugin = ({ initialEditMode = false }: ViewTypePluginProps) => {
  const { t } = useTranslation();
  const { storage, horizontalAlign, setHorizontalAlign } = useTextContext();
  const [isEditMode, setIsEditMode] = useState(initialEditMode);

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
        <div className="flex flex-col flex-shrink-0">
          {/* Controls Row */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            {/* Alignment Controls */}
            <AlignmentControls
              horizontalAlign={horizontalAlign}
              onAlignChange={setHorizontalAlign}
            />
            {/* Action Buttons */}
            <SaveButton
              onSaveComplete={() => setIsEditMode(false)}
              showCancel={true}
              onCancel={() => setIsEditMode(false)}
            />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {isEditMode ? (
          <TextConfig />
        ) : isEmpty ? (
          <div className="flex items-center justify-center h-full">
            <button
              onClick={() => setIsEditMode(true)}
              className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t('viewEditText')}
            </button>
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
};