var gulp = require('gulp');
var del = require('del');
var mocha = require('gulp-mocha');
var tsb = require('gulp-tsb');
var chalk = require('chalk');
var run = require('gulp-run');
var jeditor = require("gulp-json-editor");
var bump = require('gulp-bump');
var sequence = require('run-sequence');
var istanbul = require('gulp-istanbul');
var coveralls = require('gulp-coveralls');
var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');

var buildDone = false;

var paths = {
    src: ['src/**', 'test/**', './*.ts', 'typings/*.d.ts'],
    out: './lib',
    test: './lib/test/**/*.js',
    publish: './publish',
    coverage: './coverage',
};

function handleBuildError (error) {
    console.log(chalk.red(error.toString()));
    buildDone = false;
}

function createCompilation(){
    return tsb.create('tsconfig.json', false, null, function(error){handleBuildError(error)});
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

gulp.task('pre-coverage', ['build'], function () {
    logBuildResult();
    if(buildDone) {
        console.log(chalk.blue('Preparing coverage', paths.test));
        return gulp.src(paths.out + '/src/progress.js')
            .pipe(istanbul({includeUntested: true}))
            .pipe(istanbul.hookRequire());
    }
});

gulp.task('istanbul', ['pre-coverage'], function () {
    if(buildDone) {
        console.log(chalk.blue('Running tests with coverage in', paths.test));
        return gulp.src(paths.test, {read: false})
            .pipe(mocha({reporter: 'spec'}))
            .pipe(istanbul.writeReports({
                dir: paths.coverage,
                reporters: [ 'json' ],
                reportOpts: { dir: paths.coverage}
            }));
    }
});

gulp.task('remap', ['istanbul'], function () {
    if(buildDone) {
        return gulp.src(paths.coverage + '/coverage-final.json')
            .pipe(remapIstanbul({
                reports: {
                    'json': paths.coverage + '/coverage.json',
                    //'html': 'html-report'
                }
            }));
    }
});

gulp.task('coverage', ['remap'], function () {
    if(buildDone) {
        return gulp.src('./')
            .pipe(run('istanbul report lcov'))
    }
});

gulp.task('coveralls-export', function() {
    if(buildDone) {
        console.log(chalk.blue('Exporting lcov.info to coveralls.io'));
        return gulp.src(paths.coverage + '/**/lcov.info')
            .pipe(coveralls());
    }
});

gulp.task('coveralls', function() {
    return sequence('coverage', 'coveralls-export')
    if(buildDone) {

    }
});

gulp.task('appveyor', ['build'], function() {
    logBuildResult();
    if(buildDone){
        console.log(chalk.blue('Running tests in', paths.test));
        return gulp.src(paths.test, {read: false})
            .pipe(mocha({
                reporter: "mocha-jenkins-reporter",
                reporterOptions: {
                    "junit_report_name": "ts-progress",
                    "junit_report_path": paths.coverage + "/JUnit.xml",
                    "junit_report_stack": 1
                }
            }));
    }
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
    return gulp.src([paths.out + '/src/**/*.js', './README.md', './src/ts-progress.d.ts']).pipe(gulp.dest(paths.publish));
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

gulp.task('pack', function() {
    sequence('build', 'package_clean', 'package_copy', 'package_definition', 'package_pack');
});

gulp.task('publish', function() {
    sequence('build', 'package_clean', 'package_copy', 'package_definition', 'package_npm', 'package_bump');
});

