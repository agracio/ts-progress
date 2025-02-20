'use strict';

const Progress = require('./progress');

const items = 10;
const interval = 100;

function withDefaultSettings(){
    let progress = Progress.create({total: items});
    runProgress(progress, withDone);
}

function withPattern(){
    let progress = Progress.create({total: items, pattern: 'Progress: {bar} | Elapsed: {elapsed} | Remaining: {remaining} | {percent} | {current}/{total}'});
    runProgress(progress, withPatternAndColors);
}

function withDone(){
    let progress = Progress.create({total: items});
    progress.done();
    console.log();
    withUpdate()
}

function withUpdate(){
    let progress = Progress.create({total: items});
    let count = 0;
    let iv: any = setInterval(function () {
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
    let progress = Progress.create({total: items, pattern: 'Progress: {bar.white.cyan.25} | Elapsed: {elapsed.green} | Remaining: {remaining.blue} | {percent.magenta} | {current.red}/{total.yellow}'});
    runProgress(progress, withTitle);
}

function withTitle(){
    let progress = Progress.create({total: items, pattern: 'Progress: {bar.white.cyan.25} | Elapsed: {elapsed.green} | Remaining: {remaining.blue} | {percent.magenta} | {current.red}/{total.yellow}', title: 'Doing some work'});
    runProgress(progress);
}

function runProgress(progress: Progress, continueWith?: Function){
    let count = 0;
    let iv: any = setInterval(function () {
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