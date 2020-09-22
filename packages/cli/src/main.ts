#!/usr/bin/env node
import * as Webpack from 'webpack';
import * as Config from 'webpack-chain';
import { join } from 'path';
import * as WebpackDevServer from 'webpack-dev-server';
import { presetBabelReact } from './config/babel';
import { presetCss, presetLess } from './config/styles';
import { presetEntry } from './config/entry';
import { writeRouteFile, timefixWebpack } from './config/utils';

const getConfig = () => {
    const config = new Config();
    presetEntry(config);
    presetBabelReact(config);
    presetCss(config);
    presetLess(config);
    return config;
};

if (process.argv.length === 3) {
    const config = getConfig();

    // dev 表示开发 build 表示编译
    const status = process.argv[2];
    // 开发环境, 运行webpack
    if (status === 'dev') {
        config.mode('development');
        const { devServer: webpackServer, ...webpackConfig } = config.toConfig();
        const compiler = Webpack(webpackConfig);
        timefixWebpack(compiler);
        compiler.hooks.afterCompile.tapAsync('@rwp/cli', (compilation, callback) => {
            compilation.contextDependencies.add(join(process.cwd(), 'src'));
            callback();
        });

        compiler.hooks.beforeCompile.tapAsync('@rwp/cli', (_compilation, callback) => {
            writeRouteFile();
            callback();
        });

        const devServer = new WebpackDevServer(compiler, webpackServer);
        const port = process.env.PORT ?? '1996';
        devServer.listen(Number.parseInt(port, 10), () => {
        });
    } else if (status === 'build') {
        const webpackConfig = config.toConfig();
        config.mode('production');
        const compiler = Webpack(webpackConfig);
        compiler.run(() => {});
    }
} else {
    throw new Error('The parameter is incorrect.');
}
