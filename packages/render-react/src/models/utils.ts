/* eslint-disable */
export function webpackTimefix(compiler) {
    const timefix = 200;
    let watching: any = {};
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

export const discardSuffix = (path: string) => {
    if(path) return path.replace(/(\.(j|t)sx)$/, '')
    return path
}

export const discardSuffixRoute = (path: string) => {
    if(path) return path.replace(/(\.route\.(j|t)sx)$/, '')
    return path
}

export const discardSuffixStore = (path: string) => {
    if(path) return path.replace(/(\.route\.(j|t)sx)$/, '')
    return path
}