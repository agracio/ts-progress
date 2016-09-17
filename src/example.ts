import {Progress} from './progress';

var items = 7;
var interval = 200;

function withDefaultSettings(){
    var progress = new Progress(items);
    run(progress, withPattern);
}

function withPattern(){
    var progress = new Progress(items, 'Progress: {bar} | Elapsed: {elapsed} | Remaining: {remaining} | {percent} | {current}/{total}');
    run(progress, withPattern2);

}

function withPattern2(){
    var progress = new Progress(items, 'Downloading {bar} {percent} {elapsed}');
    run(progress, withPatternAndColors);
}

function withPatternAndColors(){
    var progress = new Progress(items, 'Downloading {bar.white.cyan.25} | Elapsed: {elapsed.green} | Remaining: {remaining.blue} | {percent.magenta} | {current.red}/{total.yellow}');
    run(progress, withPatternAndTextColors);
}

function withPatternAndTextColors(){
    var progress = new Progress(items, 'Downloading {bar.white.green.25} | Elapsed: {elapsed} | Remaining: {remaining} | {percent} | {current}/{total}', 'yellow');
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