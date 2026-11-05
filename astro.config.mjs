import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { viteSingleFile } from 'vite-plugin-singlefile';
import remarkPersianDigits from './src/plugins/remark-persian-digits.mjs';

export default defineConfig({
  output: 'static',
  integrations: [mdx({ remarkPlugins: [remarkPersianDigits] })],
  build: {
    assetsInlineLimit: Infinity,
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [viteSingleFile({ removeViteModuleLoader: true })],
    build: {
      assetsInlineLimit: Infinity,
      cssCodeSplit: false,
    },
  },
  compressHTML: true,
  devToolbar: { enabled: false },
});
