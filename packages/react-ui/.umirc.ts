import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'RWP.JS',
  favicon: 'https://user-images.githubusercontent.com/24241052/87370901-bdf6a880-c5b6-11ea-9237-56625c403237.png',
  logo: 'https://user-images.githubusercontent.com/24241052/87370901-bdf6a880-c5b6-11ea-9237-56625c403237.png',
  outputPath: 'docs-dist',
  mode: 'site',
  targets: {
    ie: 11,
  },
  navs: [
    null,
    { title: 'GitHub', path: 'https://github.com/jhoneybee/rwpjs' },
    
  ],
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
