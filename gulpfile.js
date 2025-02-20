const { series } = require('gulp');
const { exec } = require('child_process');
const { readdirSync, rmSync, copyFileSync } = require('fs');
const chalk = require('chalk');
const path = require("path");

const paths = {
    src: ['src/**', 'test/**', './*.ts'],
    out: './lib',
    test: './lib/test/**/*.js',
    publish: './publish',
    coverage: './coverage',
    copy: ['./LICENSE', './README.md', './lib/src/example.js', './lib/src/progress.js', './package.json', './ts-progress.d.ts'],
};

function run(cmd, onClose){

    exec(cmd, function (err, stdout, stderr) {
        if(err){
            console.log();
            console.log(chalk.red(stdout));
            if(stderr){
                console.log();
                console.log(chalk.red(stderr));
            }
            throw err;
        }
        console.log(stdout);
        onClose();
    });
}

function build(cb) {
    run('tsc', cb)
}

function clean(cb) {
    readdirSync(paths.out).forEach(f => rmSync(`${paths.out}/${f}`, {recursive: true}));
    readdirSync(paths.coverage).forEach(f => rmSync(`${paths.coverage}/${f}`, {recursive: true}));
    readdirSync(paths.publish).forEach(f => rmSync(`${paths.publish}/${f}`, {recursive: true}));
    cb();
}

function copy(cb) {
    paths.copy.forEach(f => copyFileSync(`${f}`, `${paths.publish}/${path.basename(f)}`));
    cb();
}

exports.clean = clean;
exports.copy = copy;

