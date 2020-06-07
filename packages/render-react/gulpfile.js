const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('build-ts', function () {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest('lib'));
})

gulp.task('copy-template',  function() {
    return gulp.src('src/template/**/*').pipe(gulp.dest('lib/template'))
});