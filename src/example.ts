'use strict';

var Progress = require('./progress');
var items = 10;
var interval = 100;

function withDefaultSettings(){
    var progress = Progress.create({total: items});
    run(progress, withPattern);
}

function withPattern(){
    var progress = Progress.create({total: items, pattern: 'Progress: {bar} | Elapsed: {elapsed} | Remaining: {remaining} | {percent} | {current}/{total}'});
    run(progress, withPatternAndColors);

}

function withPatternAndColors(){
    var progress = Progress.create({total: items, pattern: 'Progress: {bar.white.cyan.25} | Elapsed: {elapsed.green} | Remaining: {remaining.blue} | {percent.magenta} | {current.red}/{total.yellow}'});
    run(progress);
}

function run(progress, continueWith?: Function){
    var count = 0;
    var iv: any = setInterval(function () {
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