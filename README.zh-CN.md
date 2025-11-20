# Teable 文本插件

![仪表盘/插件面板](/docs/images/20251119213837_rec_-convert.gif)

![视图](/docs/images/20251119214210_rec_-convert.gif)

本项目是基于 [Next.js](https://nextjs.org) 和 [Teable](https://teable.ai) 的文本插件，用于在 Teable 中显示和管理文本内容。

## 功能特性
- 📝 文本查看和编辑功能
- ⚡️ 集成 Teable 插件开发环境
- 🌈 支持多主题（暗黑/明亮）
- 🌍 多语言支持（中文/英文）
- 🪄 便于扩展和二次开发
- 💾 支持可配置 API 的文本存储
- 📏 内容长度验证 (最大128KB)
- 🎯 水平对齐控制 (左对齐/居中/右对齐)
- 🔌 视图、仪表盘、面板三种插件模式

## ⚠️ 配置要求

使用此插件前，需要在 `src/hooks/useTextStorage.ts` 文件修改 baseURL。

For example:
```typescript
config.baseURL = 'https://your-api-server.com/api';
```

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
- `src/components/TextViewer.tsx`：主要文本查看组件
- `src/components/TextConfig.tsx`：文本配置组件
- `src/components/TextPages.tsx`：文本页面管理
- `src/hooks/useTextStorage.ts`：文本存储 hook，包含 API 配置 ⚠️ **需要配置 baseURL**
- `src/utils/storageApi.ts`：存储 API 工具
- `src/components/context/EnvProvider.tsx`：环境变量注入
- `src/components/context/I18nProvider.tsx`：多语言支持
- `src/components/context/TextProvider.tsx`：文本上下文提供者

## API 集成
此插件需要外部 API 服务器进行文本存储和检索。请确保您的 API 服务器：
1. 可以从配置的 baseURL 访问
2. 支持文本操作所需的端点
3. 如果托管在不同的域，正确处理 CORS

## 开发说明
- 插件使用 React Query 进行数据获取和缓存
- 所有文本操作都通过存储 API 处理
- UI 响应式设计，支持明亮和暗黑主题
- 支持中文和英文国际化
