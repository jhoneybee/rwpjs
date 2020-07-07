import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'RWP.JS',
  favicon: '',
  logo: '',
  outputPath: 'docs-dist',
  mode: 'site',
  publicPath: '/rwpjs/',
  base: '/rwpjs',
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      },
    ]
  ],
});
