var gulp = require('gulp');
var del = require('del');
var mocha = require('gulp-mocha');
var tsb = require('gulp-tsb');
var chalk = require('chalk');

var buildDone = false;

var paths = {
    src: ['src/**', 'test/**', './*.ts', 'typings/*.d.ts'],
    out: './build',
    test: './build/test/**/*.js'
};

var compilation = createCompilation();

function createCompilation(){
    return tsb.create({
        target: 'es5',
        module: 'commonjs',
        outDir: paths.out,
        sourceMap: true,
        declaration: false,
        noEmitOnError: false
    }, false, null, function(error){handleBuildError(error)});
}


function handleBuildError (error) {
    console.log(chalk.red(error.toString()));
    buildDone = false;
}

function logBuildResult(){
    console.log(buildDone ? chalk.green('Build succeeded.') : chalk.red('Build failed.'));
}

gulp.task('build', function() {
    console.log(chalk.blue('Typescript compile.'));
    buildDone = true;
    return gulp.src(paths.src, {base: '.'})
        .pipe(createCompilation()())
        // .pipe(compilation())
        .pipe(gulp.dest(paths.out));
});

gulp.task('test', ['build'], function() {
    logBuildResult();
    if(buildDone){
        console.log(chalk.blue('Running tests in', paths.test));
        return gulp.src(paths.test, {read: false})
            .pipe(mocha({
                reporter: 'spec'
            }));
    }
});

gulp.task('clean', function() {
    console.log(chalk.blue('Cleaning'));
    return del([paths.out + '/**/*', paths.bundle + '/**/*']);
});

gulp.task('ci', ['test'], function() {
    gulp.watch(paths.src, ['test']);
});
