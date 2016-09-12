import {Progress} from './progress';

var charm = require('charm')();
//charm.pipe(process.stdout);

var items = 5;
var interval = 150;

function withDefaultSettings(){
    var progress = new Progress(items);
    run(progress, withPattern);
}
function withPattern(){
    var progress = new Progress(items, 'Progress: {bar} | Elapsed: {elapsed} | Remaining: {remaining} | {percent} | {current}/{total}', 'Progress bar with pattern and title');
    run(progress, withPatternAndColors);

}

function withPatternAndColors(){
    var progress = new Progress(items, 'Progress: {bar.white.yellow.25} | Elapsed: {elapsed.green} | Remaining: {remaining} | {percent.red} | {current}/{total}', 'Progress bar with pattern, colors and title');
    run(progress);
}

function run(progress: Progress, continueWith?: Function){
    progress.start();
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

function logStart(message: string){
    console.log();
    console.log('----------------------------------------------------------------');
    console.log(`${message}. `);
    console.log(`items: ${items}, update interval: ${interval}ms`);
}

withDefaultSettings();