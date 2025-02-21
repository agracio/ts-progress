const { series } = require('gulp');
const { exec } = require('child_process');
const { readdirSync, rmSync, copyFileSync, readFileSync, writeFileSync } = require('fs');
const chalk = require('chalk');
const path = require("path");

const paths = {
    src: ['src/**', 'test/**', './*.ts'],
    out: './lib',
    test: './lib/test/**/*.js',
    publish: './publish',
    coverage: './coverage',
    copy: ['./LICENSE', './README.md', './lib/src/example.js', './lib/src/progress.js', './ts-progress.d.ts'],
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
    let json = JSON.parse(readFileSync('package.json', 'utf8'));
    json.main = 'progress.js';
    writeFileSync(`${paths.publish}/package.json`,  JSON.stringify(json, null, 2), 'utf8');
    cb();
}

function pack(cb) {
    run('npm pack ' + paths.publish, cb)
}

function publish(cb) {
    run('npm publish ' + paths.publish, cb)
}

exports.copy = series(clean, build, copy);
exports.pack = series(copy, pack);
exports.clean = clean;

