const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('build-ts', function () {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest('lib'));
})