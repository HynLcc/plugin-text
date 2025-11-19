# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based text plugin for Teable, designed as a plugin system for displaying and managing text content with Markdown support. The plugin supports multiple plugin types (Dashboard, Panel, View) with different integration patterns and storage strategies.

## Development Setup & Scripts

### Available Scripts
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### ⚠️ Critical Configuration Requirement
**Before development**, you must modify the baseURL in `src/hooks/usePluginStorage.ts` line 56:
```typescript
config.baseURL = 'http://127.0.0.1:3000/api'; // Change to your API server
```

## Core Architecture

### Context Provider System (`src/components/context/`)

**TextProvider** (`TextProvider.tsx`):
- Central state management for text content and UI configuration
- Handles storage synchronization with three-state pattern:
  - `undefined`: Not loaded yet
  - `null`: Loaded but no storage exists (new plugin)
  - `ITextStorage`: Storage exists with content
- Provides optimistic updates with rollback on error
- Manages save/cancel functionality with loading states

**EnvProvider** (`EnvProvider.tsx`):
- Extracts plugin parameters from URL search params using `useSearchParams`
- Provides: `lang`, `baseId`, `pluginId`, `pluginInstallId`, `positionType`, `theme`

**I18nProvider** (`I18nProvider.tsx`):
- Manages internationalization with i18next
- Supports two namespaces: `sdk` (Teable SDK) + `common` (plugin-specific)
- Fallback to English for missing translations

### Storage Management (`src/hooks/usePluginStorage.ts`)

**Critical Hook**: This is the core of plugin storage abstraction:
- **View plugins**: API endpoints (`/table/{tableId}/view/{viewId}/plugin`)
- **Dashboard/Panel**: Bridge methods (`bridge.updateStorage()`)
- **Fallback**: postMessage communication
- Automatic authentication via axios interceptors
- Real-time synchronization via bridge events (`syncStorage`, `syncUIConfig`, `syncUrlParams`)

### Component Architecture

**TextPages** (`TextPages.tsx`):
- Main routing logic based on `PluginPosition.View` vs others
- **View plugins**: Local edit mode with header controls (`isEditMode` state)
- **Dashboard/Panel**: Settings panel integration (`isShowingSettings` from parent)
- Handles empty states differently for each plugin type

**TextViewer** (`TextViewer.tsx`):
- Markdown rendering using react-markdown + remark-gfm
- Optional edit button (`showEditButton` prop) for in-place editing
- No longer handles empty content (that's done by TextPages)

**TextConfig** (`TextConfig.tsx`):
- Simple textarea with Markdown placeholder
- Controlled component pattern using TextProvider

## Plugin Type Integration Patterns

### 1. View Plugin Integration
- **Storage**: API-based via `usePluginStorage` with View endpoints
- **UI Pattern**: Embedded edit mode with local header controls
- **Empty State**: Shows `{t('viewEditText')}` button when content is empty
- **Edit Mode**: Shows save/cancel buttons in header, uses `TextConfig`

### 2. Dashboard/Panel Plugin Integration
- **Storage**: Bridge method via `parentBridgeMethods.expandPlugin()`
- **UI Pattern**: Settings panel integration
- **Empty State**: Shows `{t('editText')}` button that expands plugin
- **Edit Mode**: Uses parent's settings panel, save button only

## State Management Patterns

### Storage State Handling
The three-state storage system is crucial:
```typescript
// In TextPages.tsx:
if (storage === undefined) {
  // Loading state - show {t('initializing')}
}

const isEmpty = storage === null || !storage.content || storage.content.trim().length === 0;
// Empty vs content logic
```

### Performance Optimizations
- Heavy use of `useMemo` in TextProvider to prevent unnecessary re-renders
- Ref-based tracking for state changes
- React Query with 10-second stale time and no retries

## Internationalization

### Translation Keys (currently 10 active keys)
- `editText`, `viewEditText`, `save`, `saving`, `saveSuccess`, `saveError`, `cancel`, `textPlaceholder`, `initializing`
- **Note**: Only keys actively used in code should exist in translation files
- Check usage with `grep` before adding new translation keys

### Namespace Separation
- `common` namespace: Plugin-specific translations
- `sdk` namespace: Teable SDK translations (auto-loaded)

## Important Development Notes

### Theme System
- Uses Next-themes integration with Teable theme system
- Forced theme propagation from parent Teable application
- Tailwind classes for theme switching: `dark:prose-invert`, `text-muted-foreground`, etc.

### Markdown Rendering
- React-markdown with remark-gfm for GitHub Flavored Markdown
- Tailwind typography plugin for consistent styling
- Prose classes: `prose prose-sm max-w-none text-foreground` with extensive color theming

### Bridge Communication
- Uses `usePluginBridge()` hook for Teable integration
- Temporary token authentication via `getSelfTempToken()`
- Event listeners for real-time updates from parent system

### Error Handling
- Graceful fallbacks for missing storage (returns `null` for 404s)
- Toast notifications for save success/failure
- Optimistic updates with automatic rollback on save errors

## Common Issues & Solutions

### Storage Not Loading
- Check baseURL configuration in `usePluginStorage.ts`
- Verify plugin parameters in URL search params
- Check browser console for authentication errors

### Edit Mode Not Working
- Verify `isShowingSettings` is properly passed from parent for Dashboard/Panel plugins
- Check that `storage` is not `undefined` before accessing content
- Ensure proper plugin position type is detected

### Translation Issues
- Verify language is properly set in URL params and passed to I18nProvider
- Check that both `common` and `sdk` namespaces are loaded
- Ensure translation keys exist in both `en.json` and `zh.json`

## Testing Notes
- No explicit test framework configured - manual testing required
- Test with different plugin types (View vs Dashboard/Panel)
- Test authentication flows with various user permissions
- Verify storage persistence across browser sessions