import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as Config from 'webpack-chain';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';

import { copyFileTo } from './utils';

export const presetEntry = (config: Config) => {
    const entry = join(process.cwd(), 'src', '.rwp', 'entry.tsx');

    if (!existsSync(join(process.cwd(), 'src', 'layouts', 'index.tsx'))) {
        const layoutDir = join(process.cwd(), 'src', '.rwp');
        if (!existsSync(layoutDir)) {
            mkdirSync(layoutDir, {
                recursive: true,
            });
        }
        const path = join(__dirname, '..', '..', 'template', 'layouts', 'index.tsx');
        copyFileTo(path, join(process.cwd(), 'src', 'layouts', 'index.tsx'));
    }

    if (!existsSync(entry)) {
        const path = join(__dirname, '..', '..', 'template', '.rwp', 'entry.tsx');
        const rwpDir = join(process.cwd(), 'src', '.rwp');
        if (!existsSync(rwpDir)) {
            mkdirSync(rwpDir, {
                recursive: true,
            });
        }
        copyFileTo(path, entry);
    }

    config.resolve.extensions
        .add('.wasm')
        .add('.tsx')
        .add('.ts')
        .add('.mjs')
        .add('.cjs')
        .add('.js')
        .add('.json')
        .end();
    config.entry('entry').add(entry).end();

    const documentEjs = join(process.cwd(), 'src', 'document.ejs');
    if (!existsSync(documentEjs)) {
        copyFileTo(join(__dirname, '..', '..', 'template', 'document.ejs'), documentEjs);
    }

    config.plugin('html-webpack-plugin').use(HtmlWebpackPlugin, [{
        hash: true,
        template: join(process.cwd(), 'src', 'document.ejs'),
    }]).end();

    config.mode('development');
    config.devServer.stats('errors-only');
    // see https://github.com/facebook/react/issues/2402
    // see https://github.com/facebook/react/issues/13991#issuecomment-435587809
    config.resolve.alias.set('react', join(process.cwd(), 'node_modules', 'react'));
    config.resolve.alias.set('react-dom', join(process.cwd(), 'node_modules', 'react-dom')).end();
};
