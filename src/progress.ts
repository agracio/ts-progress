const numeral = require('numeral');
import * as chalk from 'chalk';
import * as readline from 'readline';
var charm = require('charm')();
charm.pipe(process.stdout);

class Progress{
    private _start: any;
    private _progress: number = 0;
    private _progressChunk: number = 0;
    private _current: number = 0;
    private _done: boolean = false;

    private _barSize: number = 20;


    private _padding: string;

    private _processing: string;

    private _patternMapping: any = {
        '{bar}': this.createBar.bind(this),
        '{time.elapsed}': this.createElapsed.bind(this),
        '{time.remaining}': this.createRemaining.bind(this),
        '{memory}': this.createMemory.bind(this),
        '{percent}': this.createPercent.bind(this),
        '{item.current}': this.createItemCurrent.bind(this),
        '{item.total}': this.createItemTotal.bind(this),
        '{processing}': this.createProcessing.bind(this),
    };

    constructor(private _items: number, private _pattern: string = 'Progress: {bar} | Elapsed: {time.elapsed} | Remaining: {time.remaining}', private _title?: string){
        this._progressChunk = 100/_items;
        this._padding = new Array(this._barSize * 2).join(' ');
        //process.stdout.write('sdhgsdhsdhdshdsh')
    }

    public start(processing?: string){
        charm.write("\n\n");
        this._start = new Date().getTime();
        this._processing = processing;
        this.write();
    }

    public update(processing?: string){
        this._processing = processing;
        if(this._current === this._items - 1){
            this.stop();
        }else{
            this._current++;
            this._progress = this._progress + this._progressChunk;
            this.write();
        }
    }

    private stop(){
        this._progress = 100;
        this._current++;
        this._done = true;
        this.write();
        charm.write("\n");
        charm.display('reset').down(1).left(100);
    }

    private write(){
        this.clear();
        var now: any = new Date().getTime();

        this.createTitle();

        var regex = /(.*?)({.*?})/g;
        var match;
        while (match = regex.exec(this._pattern)) {
            charm.display('bright').write(match[1]);
            charm.display('reset');
            var itemFunction = this._patternMapping[match[2]];
            if(itemFunction) {
                itemFunction(now);
            }else{
                charm.write(match[2]);
            }
        }

        charm.display('reset').down(2).left(100);
    }

    private createTitle(){
        if(this._title) {
            charm.display('bright').write(this._title);
            charm.display('reset').down(1).left(100);
            //charm.write("\n\n");
        }
    }

    private createElapsed(now){
        charm.write(this.pad(numeral(((now - this._start)/1000)).format('0.0') + 's'));
    }

    private createRemaining(now){
        var str: string = this.pad('NaN', 6);
        if(this._current != 0){
            var elapsed = ((now - this._start)/1000);
            var remaining  = (elapsed/this._current * (this._items - this._current));
            str = this.pad(numeral(remaining).format('0.0') + 's');
        }

        charm.write(str);

    }

    private createMemory(){
        charm.write(this.pad(numeral(process.memoryUsage().rss/1024/1024).format('0.0') + 'M'));
    }

    private createPercent(){
        charm.write(this.pad(`${numeral(this._progress).format('0')}%`));
    }

    private createItemCurrent(){
        charm.write(this.pad(this._current.toString()));
    }

    private createItemTotal(){
        charm.write(this.pad(this._items.toString()));
    }

    private createProcessing(){
        charm.write(this.pad(this._processing));
    }

    private createBar(){
        charm.foreground('green').background('green');
        var done = Math.ceil(((this._current / this._items) * this._barSize));

        charm.write(this._padding.substr(0, done));

        charm.foreground('white').background('white');
        charm.write(this._padding.substr(0, this._barSize - done));
        charm.display('reset');
    }

    private clear(){
        // readline.clearLine(process.stdout, 0);
        // readline.cursorTo(process.stdout, 0, null);
        charm.erase('line').up(1).erase('line').write("\r");
    }

    private pad(value: string, length: number = 0){
        var pad = new Array(length + 1).join(' ');
        return (pad + value).slice(-pad.length);
    }

    private format(value: number, format: string){

    }

}

export {Progress}