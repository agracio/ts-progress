
//const readline = require('readline');
const numeral = require('numeral');
import * as chalk from 'chalk';
import * as moment from 'moment';
import * as readline from 'readline';

class Progress{
    private _start: any;
    private _progress: number = 0;
    private _progressChunk: number = 0;
    private _current: number = 0;
    private _done: boolean = false;

    private _color = chalk.cyan.bold;
    private _colorItem = chalk.white.bold;

    constructor(private _message: string, private _items: string[]){
        this._progressChunk = 100/_items.length;
        this.startProgress();
    }

    private startProgress(){
        console.log(this._colorItem('\r\n' + this._message));
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
    }

    private write(){
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0, null);

        var now: any = moment();

        var memory = numeral(process.memoryUsage().rss/1024/1024).format('0.00') + 'M';
        var padM = '       ';
        memory = (padM + memory).slice(-padM.length);

        this.writeItem('memory', memory);

        //process.stdout.write(this._color('memory: ').toString() + this._colorItem(memory).toString());
        //process.stdout.write(' | ');

        var elapsed = numeral((now - this._start)/1000).format('0.000') + 's';
        var padE = '          ';
        elapsed = (padE + elapsed).slice(-padE.length);

        this.writeItem('elapsed', elapsed);
        //process.stdout.write(this._color('elapsed: ').toString() + this._colorItem(elapsed).toString());
        //process.stdout.write(' | ');

        var processing = this._current !== this._items.length -1 || !this._done ? this._items[this._current] : '----------';
        var padP = '          ';
        processing = (padP + processing).slice(-padP.length);

        this.writeItem('processing', processing);
        //process.stdout.write(this._color('processing: ').toString() + this._colorItem(processing).toString());
        //process.stdout.write(' | ');

        process.stdout.write(this._colorItem(numeral(this._progress).format('0') + ' %').toString());

    }

    private writeItem(name: string, value: any){
        process.stdout.write(this._color(name + ': ').toString() + this._colorItem(value).toString());
        process.stdout.write(' | ');
    }

}