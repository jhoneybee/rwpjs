export default {
  target: 'browser',
  esm: { type: 'rollup', file: 'index.esm' },
  cjs: { type: 'rollup', file: 'index' },
  typescriptOpts: {
    include: [/\.tsx?$/],
    exclude: [/\.d\.ts$/],
  },
};
