import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'RWP.JS',
  favicon: 'https://user-images.githubusercontent.com/24241052/87370901-bdf6a880-c5b6-11ea-9237-56625c403237.png',
  logo: 'https://user-images.githubusercontent.com/24241052/87370901-bdf6a880-c5b6-11ea-9237-56625c403237.png',
  outputPath: 'docs-dist',
  mode: 'site',
  metas: [{
    name: 'keywords',
    content: 'rwp, rwpjs, RWP, RWPJS'
  }, {
      name: 'description',
      content: '☘ 企业级的React开发的解决方案'
  }],
  targets: {
    ie: 11,
  },
  navs: [
    null,
    { title: 'GitHub', path: 'https://github.com/jhoneybee/rwpjs' },
  ]
});
