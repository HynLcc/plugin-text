'use client';
import { useContext } from 'react';
import { EvnContext } from './context/EnvProvider';
import { useTextContext } from './context/TextProvider';
import { PluginPosition } from '@teable/openapi';
import { ViewTypePlugin } from './ViewTypePlugin';
import { DashboardPlugin } from './DashboardPlugin';

/**
 * Main routing component that delegates to appropriate plugin type
 * Determines whether to use ViewTypePlugin or DashboardPlugin based on position type
 *
 * @returns Appropriate plugin component for the current position type
 */
export const TextPages = () => {
  const { positionType } = useContext(EvnContext);
  const { uiConfig, parentBridgeMethods } = useTextContext();
  const isShowingSettings = uiConfig?.isShowingSettings;

  // Check if this is a View-type plugin
  const isViewTypePlugin = positionType === PluginPosition.View;

  // Route to appropriate component based on plugin type
  if (isViewTypePlugin) {
    // View-type plugins use local edit mode with inline controls
    return <ViewTypePlugin />;
  } else {
    // Dashboard/Panel plugins use settings panel integration
    return (
      <DashboardPlugin
        isShowingSettings={!!isShowingSettings}
        onExpandPlugin={parentBridgeMethods?.expandPlugin}
      />
    );
  }
};

