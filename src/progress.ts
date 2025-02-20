'use strict';

let charm = require('charm')();
charm.pipe(process.stdout);

class Progress{

    private _barSize: number = 20;

    private _percent: number = 0;
    private readonly _percentIncrease: number = 0;
    private _current: number = 0;

    private _start: number = 0;
    private _elapsed: number = 0;
    private _remaining: number = 0;
    private _now: number = 0;
    private _cycle: number = 0;

    private _padding: string;

    private readonly _pattern: string = 'Progress: {bar} | Elapsed: {elapsed} | {percent}';
    private _regex = /(.*?){(.*?)}/g;

    /**
     * Creates new progress object
     * @param options
     * @returns {Progress}
     */
    public static create(options: ProgressOptions): Progress{
        return new Progress(options.total, options.pattern, options.textColor, options.title, options.updateFrequency)
    }

    private constructor(private _total: number, pattern?: string, private _textColor?: string, private _title?: string, private _updateFrequency = 0){
        this._padding = new Array(300).join(' ');
        if(pattern) this._pattern = pattern;
        //this._padding = new Array(300).join('▒');
        this._percentIncrease = 100/_total;
        this.start();
    }

    /**
     * Updates progress
     */
    public update(): void{
        this._now = new Date().getTime();
        if(this._current == this._total){
            return;
        }else if(this._current >= this._total - 1){
            charm.up(1).erase('line').write("\r");
            this._current = (this._total - 1);
            this.stop();
        }else{
            this._current++;
            this._percent += this._percentIncrease;
            if(!this.skipStep()){
                charm.up(1).erase('line').write("\r");
                this._elapsed = (this._now - this._start)/1000;
                this._remaining  = (this._elapsed/this._current * (this._total - this._current));
                this.write();
            }
        }
    }

    /**
     * Finishes progress
     */
    public done(): void{
        this._now = new Date().getTime();
        charm.up(1).erase('line').write("\r");
        this._current = (this._total - 1);
        this.stop();
    }

    private start = (): void =>{
        charm.erase('line').write("\r");
        this._start = new Date().getTime();
        this._now = new Date().getTime();
        this._cycle = this._start;
        this.renderTitle();
        this.write();
    };

    private stop = (): void =>{
        this._current++;
        this._percent = 100;
        this._elapsed = (this._now - this._start)/1000;
        this._remaining  = 0;
        this.write();
    };

    private write = (): void =>{

        let match;
        while (match = this._regex.exec(this._pattern)) {

            this.renderText(match[1]);

            if(match[2].indexOf('.') == -1){
                this.renderPattern(match[2], match[2]);
            }else{
                let tokens = match[2].split('.');
                if(tokens.length == 4 && tokens[0] == 'bar'){
                    this.renderBar(tokens[1], tokens[2], tokens[3])
                }else if(tokens.length == 2){
                    this.renderPattern(match[2], tokens[0], tokens[1]);
                }

            }
        }
        charm.write("\r\n");
    };

    private renderElapsed = (color?: string): void => {
        this.renderItem(`${this._elapsed.toFixed(1)}s`, color);
    };

    private renderRemaining = (color?: string): void => {
        this.renderItem(`${this._remaining.toFixed(1)}s`, color);
    };

    private renderMemory = (color?: string): void => {
        this.renderItem(`${(process.memoryUsage.rss()/1024/1024).toFixed(1)}M`, color);
    };

    private renderPercent = (color?: string): void => {
        this.renderItem(`${this._percent.toFixed(0)}%`, color);
    };

    private renderCurrent = (color?: string): void => {
        this.renderItem(this._current.toString(), color);
    };

    private renderTotal = (color?: string): void => {
        this.renderItem(this._total.toString(), color);
    };

    private renderBar = (colorRemaining: string = 'white', colorDone: string = 'green', size?: number): void => {

        if(size && size !== this._barSize) this._barSize = size;
        charm.foreground(colorDone).background(colorDone);
        let done = Math.ceil(((this._current / this._total) * this._barSize));

        charm.write(this._padding.substring(0, done));

        charm.foreground(colorRemaining).background(colorRemaining);
        charm.write(this._padding.substring(0, this._barSize - done));
        charm.display('reset');
    };

    private _patternMapping: any = {
        'bar': this.renderBar,
        'elapsed': this.renderElapsed,
        'remaining': this.renderRemaining,
        'memory': this.renderMemory,
        'percent': this.renderPercent,
        'current': this.renderCurrent,
        'total': this.renderTotal,
    };

    private renderPattern = (pattern: string, item: string, color?: string): void => {
        let renderer = this._patternMapping[item];
        if(renderer) {
            renderer(color);
        }else{
            charm.write(pattern);
        }
    };

    private renderItem = (item: string, color?: string): void => {
        if(color){
            charm.foreground(color).write(item).display('reset');
        }else{
            charm.write(item);
        }
    };

    private renderText = (text: string): void =>{
        if(this._textColor){
            charm.display('bright').foreground(this._textColor).write(text).display('reset');
        }else{
            charm.display('bright').write(text).display('reset');
        }
    };

    private renderTitle = (): void => {
        if(this._title && this._title !== '') {
            charm.display('bright').write(this._title).display('reset');
            charm.write("\n");
        }
    };

    private skipStep = (): boolean =>{

        if(this._updateFrequency == 0) return false;
        let elapsed = this._now - this._cycle;

        if(elapsed < this._updateFrequency){
            return true;
        }else{
            this._cycle = this._now;
            return false;
        }
    }
}

//export = Progress
export {Progress};
module.exports = Progress;
