const { mergeConfig } = require('vite')
const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
  },
  features: {
    storyStoreV7: true,
  },
  // 配置 @ 别名
  async viteFinal(config) {
    console.log('🚀 ~ config', config)
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      resolve: {
        ...config.resolve,
        alias: {
          '@': path.resolve(__dirname, '../src'),
        },
      },
    })
  },
}
