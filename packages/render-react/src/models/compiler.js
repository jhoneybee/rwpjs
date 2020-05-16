const fs = require('fs');
const path = require('path')
const Routers = require('./routers')

function timefix(compiler) {
    const timefix = 100;
    let watching = {};
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

exports.default = function (compiler) {
    timefix(compiler)
    
    compiler.plugin("after-compile", function (compilation, callback) {
        compilation.contextDependencies.add(path.join(process.cwd(), 'src'));
        callback();
    });
    compiler.hooks.beforeCompile.tapAsync('@rwp/render-react', function (compilation, callback) {
        const source = fs.readFileSync(path.join(__dirname, '..', 'template', 'router.js')).toString()
        const code = source.replace(/\/\/\s*@RWP-TEMPLATE\s+ROUTES\s*/g,
            `const RWP = {}; RWP.routes = ${Routers.getRoutersText(Routers.getRealRouters())};`)
            
        fs.writeFileSync(path.join(process.cwd(), 'src', 'pages', '.rwp', 'router.js'), code)
        fs.utimesSync(path.join(process.cwd(), 'src', 'pages', '.rwp', 'router.js'), ((Date.now() - 10 * 1000)) / 1000, (Date.now() - 10 * 1000) / 1000);
        callback()
    })
}