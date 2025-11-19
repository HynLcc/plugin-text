'use client';
import { useTextContext } from './context/TextProvider';
import { TextConfig } from './TextConfig';
import { TextViewer } from './TextViewer';
import { AlignmentControls } from './AlignmentControls';
import { SaveButton } from './SaveButton';

/**
 * Props for DashboardPlugin component
 */
interface DashboardPluginProps {
  /** Whether settings panel is currently shown */
  isShowingSettings: boolean;
  /** Callback function to expand plugin (open settings) */
  onExpandPlugin?: () => void;
}

/**
 * Component for Dashboard/Panel-type plugins with settings panel integration
 * Uses parent's settings panel for editing with header controls
 *
 * @param props - Component props
 * @returns DashboardPlugin component
 */
export const DashboardPlugin = ({ isShowingSettings, onExpandPlugin }: DashboardPluginProps) => {
  const { storage, horizontalAlign, setHorizontalAlign } = useTextContext();

  // Non-View-type plugins (Dashboard/Panel): use settings panel logic
  // After API returns:
  // - storage === null or storage.content === "" → show edit button
  // - storage.content has content → show text viewer

  // If settings panel is open, show TextConfig
  if (isShowingSettings) {
    return (
      <div className="flex flex-col h-full">
        {/* Header - show when settings panel is open */}
        <div className="flex flex-col flex-shrink-0">
          {/* Controls Row */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            {/* Alignment Controls */}
            <AlignmentControls
              horizontalAlign={horizontalAlign}
              onAlignChange={setHorizontalAlign}
            />
            {/* Action Buttons */}
            <SaveButton />
          </div>
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
    return <div className="flex items-center justify-center h-full text-muted-foreground">Initializing...</div>;
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
      <button
        onClick={() => {
          // Trigger expandPlugin to open settings panel
          onExpandPlugin?.();
        }}
        className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Edit Text
      </button>
    </div>
  );
};