import {Progress} from './progress';

var charm = require('charm')();
//charm.pipe(process.stdout);

function test(){
    var count = 0;
    var items = 50;
    var progress = new Progress(items, 'Progress: {bar} | Elapsed: {time.elapsed} | Remaining: {time.remaining} | {percent} | {item.current}/{item.total}', 'title');
    var interval: any = setInterval(function () {
        count++;
        progress.update();
        if(count == items){
            clearInterval(interval);
            console.log('done')
        }
    }, 3000);

    progress.start();

}

function testCharm(){
    console.log(new Date().getTime());
    charm.write("\n");

    var current = 2;
    var total = 10;
    var size = 25;
    charm.erase('line').write("\r");

    charm.display('bright').write('Processing: ');
    charm.foreground('green').background('green');
    for (var i = 0; i < ((current / total) * size) - 1 ; i++) {
        //for (var i = 0; i < 20 ; i++) {
        charm.write(' ');
    }
    charm.foreground('white').background('white');
    while (i < size - 1) {
        charm.write(' ');
        i++;
    }

    charm.display('reset').down(1).left(500);

    charm.write(Math.ceil((new Date().getTime()/ 1000) % 60).toString());
    //console.log(Math.ceil((new Date().getTime()/ 1000) % 60))
}

test();