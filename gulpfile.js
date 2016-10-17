var gulp = require('gulp');
var del = require('del');
var mocha = require('gulp-mocha');
var tsb = require('gulp-tsb');
var chalk = require('chalk');
var run = require('gulp-run');
var jeditor = require("gulp-json-editor");
var bump = require('gulp-bump');
var sequence = require('run-sequence');

var buildDone = false;

var paths = {
    src: ['src/**', 'test/**', './*.ts', 'typings/*.d.ts'],
    out: './dist',
    test: './dist/test/**/*.js',
    publish: './publish'
};

function handleBuildError (error) {
    console.log(chalk.red(error.toString()));
    buildDone = false;
}

function createCompilation(){
    return tsb.create({
        target: 'es5',
        module: 'commonjs',
        outDir: paths.out,
        sourceMap: true,
        declaration: false,
        noEmitOnError: false,
        removeComments: false
    }, false, null, function(error){handleBuildError(error)});
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

gulp.task('package_clean', function() {
    var clean = [paths.publish + '/**/*'];
    console.log(chalk.blue('Cleaning ' + clean));
    return del(clean);
});

gulp.task('cb', ['build'], function() {
    return gulp.watch(paths.src, ['build']);
});

gulp.task('ci', ['test'], function() {
    return gulp.watch(paths.src, ['test']);
});

gulp.task('package_definition', function() {
    return gulp.src("./package.json")
        .pipe(jeditor(function(json) {
            json.devDependencies = "";
            json.main = 'progress.js';
            return json;
        }))
        .pipe(gulp.dest(paths.publish));
});

gulp.task('package_copy', function() {
    return gulp.src([paths.out + '/**/*.js', './README.md', './src/ts-progress.d.ts']).pipe(gulp.dest(paths.publish));
});

gulp.task('package_npm', function() {
    run('npm publish ' + paths.publish).exec();
});

gulp.task('package_bump', function() {
    return gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

gulp.task('package_pack', function() {
    run('npm pack ' + paths.publish).exec();
});

gulp.task('publish_pack', function() {
    sequence('build', 'package_clean', 'package_copy', 'package_definition', 'package_pack');
});

gulp.task('publish', function() {
    sequence('build', 'package_clean', 'package_copy', 'package_definition', 'package_npm', 'package_bump');
});

