import {Progress} from './progress';

var items = 10;
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
    var progress = new Progress(items, 'Progress: {bar.white.cyan.25} | Elapsed: {elapsed.green} | Remaining: {remaining.blue} | {percent.magenta} | {current.red}/{total.yellow}', 'Progress bar with pattern, title and colors');
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
withDefaultSettings();