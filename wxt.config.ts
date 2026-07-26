import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'AI Code Extractor Pro',
    description: 'Extract AI-generated code into complete downloadable projects.',
    permissions: ['storage', 'downloads', 'activeTab', 'scripting'],
    host_permissions: ['<all_urls>'],
    action: {
      default_popup: 'entrypoints/popup/index.html',
      default_icon: 'public/icon.svg'
    },
    icons: {
      '16': 'public/icon-16.png',
      '48': 'public/icon-48.png',
      '128': 'public/icon-128.png'
    }
  }
});