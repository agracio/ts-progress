import {Progress} from './progress';
//var charm = require('charm')();
//charm.pipe(process.stdout);
//charm.reset();

function test(){
    var count = 0;
    var items = ['a', 'b', 'c', 'd', 'f'];
    var progress = new Progress('title 1', items);
    var interval = setInterval(function () {
        count++;
        progress.update();
        if(count == items.length){
            stop(interval);
            test2();
        }
    }, 100);

}

function test2(){
    //console.log(chalk.reset('a'));
    var count = 0;
    var items = ['aaa', 'bbb', 'ccc', 'ddd', 'fff'];
    var progress = new Progress('title 2', items);
    var interval = setInterval(function () {
        count++;
        progress.update();
        if(count == items.length){
            stop(interval);
        }
    }, 100);

}

function stop(interval){
    clearInterval(interval);
}

test();