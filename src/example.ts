'use strict';

const Progress = require('./progress');

const items = 10;
const interval = 100;

function withDefaultSettings(){
    const progress: Progress = Progress.create({total: items});
    run(progress, withDone);
}

function withPattern(){
    const progress: Progress = Progress.create({total: items, pattern: 'Progress: {bar} | Elapsed: {elapsed} | Remaining: {remaining} | {percent} | {current}/{total}'});
    run(progress, withPatternAndColors);
}

function withDone(){
    const progress: Progress = Progress.create({total: items});
    progress.done();
    console.log();
    withUpdate()
}

function withUpdate(){
    const progress: Progress = Progress.create({total: items});
    let count = 0;
    const iv: any = setInterval(function () {
        count++;
        progress.update();
        if(count == items * 2){
            clearInterval(iv);
            console.log();
            withPattern();
        }
    }, interval);
}

function withPatternAndColors(){
    const progress: Progress = Progress.create({total: items, pattern: 'Progress: {bar.white.cyan.25} | Elapsed: {elapsed.green} | Remaining: {remaining.blue} | {percent.magenta} | {current.red}/{total.yellow}'});
    run(progress, withTitle);
}

function withTitle(){
    const progress: Progress = Progress.create({total: items, pattern: 'Progress: {bar.white.cyan.25} | Elapsed: {elapsed.green} | Remaining: {remaining.blue} | {percent.magenta} | {current.red}/{total.yellow}', title: 'Doing some work'});
    run(progress);
}

function run(progress: Progress, continueWith?: Function){
    let count = 0;
    const iv: any = setInterval(function () {
        count++;
        progress.update();
        if(count == items){
            clearInterval(iv);
            console.log();
            if(continueWith) continueWith();
        }
    }, interval);
}

withDefaultSettings();