/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webpack 配置
  webpack: (config, { isServer }) => {
    // 修复 Teable SDK 模块导入路径问题
    config.resolve.alias = {
      ...config.resolve.alias,
      // 修复 @teable/openapi 的 src 路径导入问题
      '@teable/openapi/src/record/button-click': '@teable/openapi/dist/record/button-click',
      // 修复 @teable/ui-lib 的 src 路径导入问题
      '@teable/ui-lib/src/shadcn/ui/sonner': '@teable/ui-lib/dist/shadcn/ui/sonner',
      // 使用包的导出路径 @teable/ui-lib/shadcn，确保与包的版本更新兼容
      '@teable/ui-lib/shadcn': '@teable/ui-lib/dist/shadcn',
    };
    return config;
  },
};

export default nextConfig;