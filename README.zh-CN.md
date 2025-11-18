# Teable Todo List 插件模板

本项目是基于 [Next.js](https://nextjs.org) 和 [Teable](https://teable.io) 的 Todo List 插件模板，适用于二次开发和自定义你的 Teable 插件。

## 功能特性
- 📝 基础待办事项（Todo List）功能
- ⚡️ 集成 Teable 插件开发环境
- 🌈 支持多主题（暗黑/明亮）
- 🌍 多语言支持
- 🪄 便于扩展和二次开发

## 依赖
- [Next.js](https://nextjs.org)
- [@teable/core](https://www.npmjs.com/package/@teable/core)
- [@teable/sdk](https://www.npmjs.com/package/@teable/sdk)
- [@teable/openapi](https://www.npmjs.com/package/@teable/openapi)
- [@teable/ui-lib](https://www.npmjs.com/package/@teable/ui-lib)
- [@teable/next-themes](https://www.npmjs.com/package/@teable/next-themes)
- [@tanstack/react-query](https://tanstack.com/query/latest)

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发环境
```bash
npm run dev
```
访问 [http://localhost:3000](http://localhost:3000) 查看效果。

### 3. 构建生产包
```bash
npm run build
```

### 4. 启动生产环境
```bash
npm start
```

## 目录结构
- `src/app/page.tsx`：应用入口，集成多语言、环境变量、主题等
- `src/app/Main.tsx`：主业务入口，集成 Teable SDK、主题、QueryClient
- `src/components/TodoListPages.tsx`：待办事项页面主逻辑
- `src/components/context/EnvProvider.tsx`：环境变量注入
- `src/components/context/I18nProvider.tsx`：多语言支持

## 环境变量与插件参数
通过 `EnvProvider` 组件自动从 URL 获取插件运行所需参数（如 `lang`、`baseId`、`pluginId` 等），无需手动配置。
