import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'RWP.JS',
  hash: true,
  favicon: 'https://user-images.githubusercontent.com/24241052/87370901-bdf6a880-c5b6-11ea-9237-56625c403237.png',
  logo: 'https://user-images.githubusercontent.com/24241052/87370901-bdf6a880-c5b6-11ea-9237-56625c403237.png',
  outputPath: 'docs-dist',
  mode: 'site',
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
