const numeral = require('numeral');
import * as chalk from 'chalk';
import * as moment from 'moment';
import * as readline from 'readline';

interface ColorScheme{
    titleColor: Function,
    itemTitleColor: Function,
    itemColor: Function;
}

class Progress{
    private _start: any;
    private _progress: number = 0;
    private _progressChunk: number = 0;
    private _current: number = 0;
    private _done: boolean = false;

    private _color = chalk.cyan.bold;
    private _colorItem = chalk.white.bold;

    private _colorScheme: ColorScheme = <ColorScheme>{};

    constructor(private _title: string, private _items: string[]){
        this._progressChunk = 100/_items.length;
        this.startProgress();
    }

    private startProgress(){
        if(this._title) console.log(this._colorItem(this._title));

        this._start = moment();
        this.write();
    }

    public update(){
        if(this._current === this._items.length - 1){
            this.stop();
        }else{
            this._current++;
            this._progress = this._progress + this._progressChunk;
            this.write();
        }
    }

    private stop(){
        this._progress = 100;
        this._done = true;
        this.write();
        console.log();
    }

    private write(){
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0, null);


        this.writeMemory();
        this.writeElapsed();

        var processing = this._current !== this._items.length -1 || !this._done ? this._items[this._current] : '----------';

        this.writeItem('processing', processing, 5);

        process.stdout.write(this._colorItem(`${numeral(this._progress).format('0')}%`));
    }

    private writeElapsed(){
        var now: any = moment();
        var elapsed = numeral((now - this._start)/1000).format('0.0') + 's';
        this.writeItem('elapsed', elapsed, 6);
    }

    private writeMemory(){
        var memory = numeral(process.memoryUsage().rss/1024/1024).format('0.0') + 'M';
        this.writeItem('memory', memory, 6);
    }

    private writeItem(name: string, value: any, length: number = 0){
        var pad = new Array(length + 1).join(' ');
        value = (pad + value).slice(-pad.length);
        process.stdout.write(String.prototype.concat(this._color(`${name}: `),this._colorItem(value)));
        process.stdout.write(' | ');
    }

    private createDefaultColorScheme(): ColorScheme{
        return {
            titleColor: String.prototype.toString,
            itemTitleColor: String.prototype.toString,
            itemColor: String.prototype.toString
        };
    }

}

export {Progress}