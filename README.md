# Teable Todo List Plugin Template

This project is a Todo List plugin template based on [Next.js](https://nextjs.org) and [Teable](https://teable.io), designed for secondary development and customization of your own Teable plugin.

## Features
- 📝 Basic Todo List functionality
- ⚡️ Integrated Teable plugin development environment
- 🌈 Multi-theme support (light/dark)
- 🌍 Internationalization (i18n) support
- 🪄 Easy to extend and customize

## Dependencies
- [Next.js](https://nextjs.org)
- [@teable/core](https://www.npmjs.com/package/@teable/core)
- [@teable/sdk](https://www.npmjs.com/package/@teable/sdk)
- [@teable/openapi](https://www.npmjs.com/package/@teable/openapi)
- [@teable/ui-lib](https://www.npmjs.com/package/@teable/ui-lib)
- [@teable/next-themes](https://www.npmjs.com/package/@teable/next-themes)
- [@tanstack/react-query](https://tanstack.com/query/latest)

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the app.

### 3. Build for production
```bash
npm run build
```

### 4. Start in production mode
```bash
npm start
```

## Project Structure
- `src/app/page.tsx`: App entry, integrates i18n, environment, theme, etc.
- `src/app/Main.tsx`: Main business entry, integrates Teable SDK, theme, QueryClient
- `src/components/TodoListPages.tsx`: Main logic for the Todo List page
- `src/components/context/EnvProvider.tsx`: Injects environment variables
- `src/components/context/I18nProvider.tsx`: Internationalization support

## Environment Variables & Plugin Parameters
The `EnvProvider` component automatically reads plugin parameters (such as `lang`, `baseId`, `pluginId`, etc.) from the URL, no manual configuration required.
