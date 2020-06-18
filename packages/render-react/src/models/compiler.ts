import { readFileSync, writeFileSync, utimesSync } from 'fs'
import * as path from 'path'
import { getRoutersText, getLayoutCode, getRealRouters } from './routers'


function timefix(compiler) {
    const timefix = 100;
    let watching: { startTime?: number} = {};
    const onWatchRun = function (c, callback) {
        watching.startTime += timefix;
        callback && callback();
    };
    const onDone = function (stats, callback) {
        stats.startTime -= timefix;
        callback && callback();
    };
    const aspectWatch = compiler.watch;
    compiler.watch = function () {
        watching = aspectWatch.apply(compiler, arguments);
        return watching;
    };
    compiler.hooks.watchRun.tapAsync('@rwp/render-react', onWatchRun);
    compiler.hooks.done.tapAsync('@rwp/render-react', onDone);
}



export default (compiler) => {
    timefix(compiler)
    
    compiler.hooks.afterCompile.tapAsync("@rwp/render-react", function (compilation, callback) {
        compilation.contextDependencies.add(path.join(process.cwd(), 'src'));
        callback();
    });
    
    compiler.hooks.beforeCompile.tapAsync('@rwp/render-react', function (compilation, callback) {
        const source = readFileSync(path.join(__dirname, '..', 'template', 'temp' ,'router.js')).toString()
        let code = source.replace(/\/\/\s*@RWP-TEMPLATE\s+ROUTES\s*/g,
            `const routes = ${getRoutersText(getRealRouters())};`)
        code = code.replace(/\/\/\s*@RWP-TEMPLATE\s+LAYOUT\s*/g, getLayoutCode())
        writeFileSync(path.join(process.cwd(), 'src', 'pages', '.rwp', 'router.js'), code)
        utimesSync(path.join(process.cwd(), 'src', 'pages', '.rwp', 'router.js'), ((Date.now() - 10 * 1000)) / 1000, (Date.now() - 10 * 1000) / 1000);
        callback()
    })
}