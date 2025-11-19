# Text Plugin API Usage Guide

## Overview

This guide provides comprehensive documentation for using the Text Plugin API, including components, hooks, utilities, and best practices for integration with Teable.

## Table of Contents

- [Component Architecture](#component-architecture)
- [Context Provider](#context-provider)
- [Custom Hooks](#custom-hooks)
- [Utility Functions](#utility-functions)
- [Plugin Types](#plugin-types)
- [Storage Management](#storage-management)
- [Internationalization](#internationalization)
- [Development Guidelines](#development-guidelines)

## Component Architecture

### Core Components

#### `TextPages` (Main Router)
```typescript
/**
 * Main routing component that delegates to appropriate plugin type
 * Determines whether to use ViewTypePlugin or DashboardPlugin based on position type
 */
import { TextPages } from '@/components/TextPages';
```

**Usage:**
```tsx
<TextPages />
```

#### `ViewTypePlugin` (View-type Plugins)
```typescript
interface ViewTypePluginProps {
  initialEditMode?: boolean; // Default: false
}

/**
 * Component for View-type plugin with local edit mode management
 * Handles inline editing with header controls for alignment and save functionality
 */
import { ViewTypePlugin } from '@/components/ViewTypePlugin';
```

**Usage:**
```tsx
<ViewTypePlugin initialEditMode={true} />
```

#### `DashboardPlugin` (Dashboard/Panel Plugins)
```typescript
interface DashboardPluginProps {
  isShowingSettings: boolean;
  onExpandPlugin?: () => void;
}

/**
 * Component for Dashboard/Panel-type plugins with settings panel integration
 * Uses parent's settings panel for editing with header controls
 */
import { DashboardPlugin } from '@/components/DashboardPlugin';
```

**Usage:**
```tsx
<DashboardPlugin
  isShowingSettings={true}
  onExpandPlugin={() => console.log('expand plugin')}
/>
```

#### `TextViewer` (Display Component)
```typescript
interface TextViewerProps {
  onEdit?: () => void;           // Edit callback
  showEditButton?: boolean;    // Show edit button
}

/**
 * TextViewer component for displaying markdown content with horizontal alignment support
 * Renders markdown text with proper styling and alignment for text, images, and lists
 */
import { TextViewer } from '@/components/TextViewer';
```

#### `TextConfig` (Editor Component)
```typescript
/**
 * TextConfig component with content length validation
 * Provides a textarea for editing markdown content with length restrictions
 */
import { TextConfig } from '@/components/TextConfig';
```

#### `AlignmentControls` (UI Component)
```typescript
interface AlignmentControlsProps {
  horizontalAlign: HorizontalAlign;
  onAlignChange: (align: HorizontalAlign) => void;
  className?: string;
}

/**
 * Reusable component for horizontal alignment controls
 * Provides buttons for left, center, and right text alignment
 */
import { AlignmentControls } from '@/components/AlignmentControls';
```

#### `SaveButton` (UI Component)
```typescript
interface SaveButtonProps {
  onSaveComplete?: () => void;
  className?: string;
  showCancel?: boolean;
  onCancel?: () => void;
}

/**
 * Reusable save button component with loading state
 * Handles save operations and displays loading indicators
 */
import { SaveButton } from '@/components/SaveButton';
```

## Context Provider

### `TextProvider`
```typescript
interface ITextContext {
  // Storage management
  storage?: ITextStorage | null;
  onStorageChange: (storage: ITextStorage) => Promise<unknown>;

  // Content management
  content: string;
  setContent: (content: string) => void;

  // Alignment management
  horizontalAlign: HorizontalAlign;
  setHorizontalAlign: (align: HorizontalAlign) => void;

  // Save operations
  handleSave: () => Promise<void>;
  isSaving: boolean;

  // Loading state
  isLoading: boolean;

  // UI configuration
  uiConfig?: IUIConfig;
  parentBridgeMethods?: IParentBridgeMethods;
}
```

**Usage:**
```tsx
import { TextProvider } from '@/components/context/TextProvider';

function App() {
  return (
    <TextProvider>
      <YourComponents />
    </TextProvider>
  );
}
```

## Custom Hooks

### `useTextContext`
```typescript
/**
 * Hook to access text plugin context
 * @returns ITextContext - Current text context state and methods
 */
const {
  storage, content, horizontalAlign,
  setContent, setHorizontalAlign,
  handleSave, isSaving, isLoading
} = useTextContext();
```

### `usePluginStorage`
```typescript
interface UsePluginStorageReturn {
  storage: ITextStorage | null | undefined;
  isLoading: boolean;
  updateStorage: (storage: ITextStorage) => Promise<ITextStorage>;
}

/**
 * Custom hook for managing plugin storage with Teable SDK integration
 * Provides unified interface for storage operations across different plugin types
 */
const { storage, isLoading, updateStorage } = usePluginStorage();
```

**Storage States:**
- `undefined`: Not loaded yet
- `null`: Loaded but no storage exists (new plugin)
- `ITextStorage`: Storage exists with content

## Utility Functions

### Alignment Utilities (`utils/alignment.ts`)

```typescript
// Type definitions
export type HorizontalAlign = 'left' | 'center' | 'right';

// CSS class utilities
export const getAlignmentClass = (align: HorizontalAlign): string;
export const getImageAlignmentClass = (align: HorizontalAlign): string;

// Constants
export const ALIGNMENT_OPTIONS: Array<{
  value: HorizontalAlign;
  label: string;
}>;

export const MAX_CONTENT_LENGTH = 10240; // 10KB
```

**Example Usage:**
```typescript
import { getAlignmentClass, getImageAlignmentClass } from '@/utils/alignment';

const textClass = getAlignmentClass('center'); // 'text-center'
const imageClass = getImageAlignmentClass('right'); // 'ml-auto block'
```

## Plugin Types

### Supported Plugin Positions

1. **View Plugin** (`PluginPosition.View`)
   - Uses local edit mode with inline controls
   - Storage via API endpoints
   - Example: Integrated into table views

2. **Dashboard Plugin** (`PluginPosition.Dashboard`)
   - Uses settings panel integration
   - Storage via bridge methods
   - Example: Dashboard widgets

3. **Panel Plugin** (`PluginPosition.Panel`)
   - Similar to Dashboard but in panel context
   - Storage via bridge methods
   - Example: Side panel plugins

## Storage Management

### Storage Interface
```typescript
interface ITextStorage {
  content: string;
  horizontalAlign?: 'left' | 'center' | 'right';
}
```

### Storage Operations

#### Fetch Storage
```typescript
// Automatic via usePluginStorage hook
const { storage, isLoading } = usePluginStorage();

// Manual fetch (if needed)
import { fetchStorageFromApi } from '@/utils/storageApi';

const storage = await fetchStorageFromApi({
  positionType: PluginPosition.View,
  baseId: 'your-base-id',
  tableId: 'your-table-id',
  viewId: 'your-view-id',
  pluginInstallId: 'your-plugin-install-id'
});
```

#### Update Storage
```typescript
// Automatic via context
const { handleSave } = useTextContext();
await handleSave();

// Manual update (if needed)
import { updateStorageViaApi } from '@/utils/storageApi';

const updatedStorage = await updateStorageViaApi(params, {
  content: 'New content',
  horizontalAlign: 'center'
});
```

## Internationalization

### Translation Keys
```typescript
// Available translation keys
interface TranslationKeys {
  'editText': string;
  'viewEditText': string;
  'save': string;
  'saving': string;
  'saveSuccess': string;
  'saveError': string;
  'cancel': string;
  'textPlaceholder': string;
  'initializing': string;
  'contentTooLong': string;
  'align.horizontal': string;
  'align.left': string;
  'align.center': string;
  'align.right': string;
}
```

### Usage in Components
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

const saveButtonText = t('save');
const errorMessage = t('contentTooLong', { maxLength: 10240 });
```

## Development Guidelines

### Best Practices

1. **Component Structure**
   - Keep components focused on single responsibilities
   - Use TypeScript interfaces for props
   - Add comprehensive JSDoc documentation

2. **State Management**
   - Use Context API for global state
   - Leverage `useCallback` and `useMemo` for performance
   - Handle loading states properly

3. **Error Handling**
   - Implement proper error boundaries
   - Use try-catch blocks for async operations
   - Provide user-friendly error messages

4. **Performance**
   - Memoize expensive calculations
   - Optimize re-renders with React.memo
   - Use code splitting for large dependencies

### Common Patterns

#### Conditional Rendering Based on Plugin Type
```typescript
const { positionType } = useContext(EvnContext);
const isViewTypePlugin = positionType === PluginPosition.View;

if (isViewTypePlugin) {
  return <ViewTypePlugin />;
} else {
  return <DashboardPlugin />;
}
```

#### Storage State Handling
```typescript
if (storage === undefined) {
  // Loading state
  return <div>Loading...</div>;
}

if (storage === null || !storage.content) {
  // Empty state
  return <div>No content</div>;
}

// Has content
return <TextViewer content={storage.content} />;
```

#### Alignment Integration
```typescript
// Using AlignmentControls component
<AlignmentControls
  horizontalAlign={horizontalAlign}
  onAlignChange={setHorizontalAlign}
/>

// Using alignment utilities
const alignmentClass = getAlignmentClass(horizontalAlign);
<div className={alignmentClass}>Content</div>
```

## Troubleshooting

### Common Issues

1. **Storage Not Loading**
   - Check baseURL configuration in `usePluginStorage.ts`
   - Verify plugin parameters in URL search params
   - Check browser console for authentication errors

2. **Alignment Not Working**
   - Ensure `horizontalAlign` is included in storage updates
   - Check that alignment utilities are imported correctly
   - Verify CSS class application

3. **Translation Issues**
   - Ensure language is properly set in URL params
   - Check that translation keys exist in both locale files
   - Verify i18n provider initialization

4. **Content Validation**
   - Check `MAX_CONTENT_LENGTH` constant
   - Verify error message translations exist
   - Test content length boundaries

### Debug Mode
```typescript
// Enable debug logging
console.log('Storage state:', storage);
console.log('Alignment state:', horizontalAlign);
console.log('Plugin type:', positionType);
```

## Examples

### Basic Plugin Integration
```tsx
import { TextPages } from '@/components/TextPages';
import { TextProvider } from '@/components/context/TextProvider';

function MyPlugin() {
  return (
    <TextProvider>
      <TextPages />
    </TextProvider>
  );
}
```

### Custom Alignment Component
```tsx
import { AlignmentControls } from '@/components/AlignmentControls';
import { useTextContext } from '@/components/context/TextProvider';

function CustomAlignmentControls() {
  const { horizontalAlign, setHorizontalAlign } = useTextContext();

  return (
    <AlignmentControls
      horizontalAlign={horizontalAlign}
      onAlignChange={setHorizontalAlign}
      className="mb-4"
    />
  );
}
```

### Content Validation
```tsx
import { MAX_CONTENT_LENGTH } from '@/utils/alignment';

function validateContent(content: string): boolean {
  return content.length <= MAX_CONTENT_LENGTH;
}

function getCharacterCount(content: string): string {
  return `${content.length.toLocaleString()} / ${MAX_CONTENT_LENGTH.toLocaleString()}`;
}
```

## API Reference

For detailed API documentation, refer to the TypeScript interfaces and JSDoc comments in each component and utility file.