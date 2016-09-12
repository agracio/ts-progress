const numeral = require('numeral');
var charm = require('charm')();
charm.pipe(process.stdout);

/**
 * Object holding the key-value pairs.
 * @type {Object}
 * @private
 */

class Progress{

    private _barSize: number = 20;

    private _start: any;
    private _percent: number = 0;
    private _percentIncrease: number = 0;
    private _current: number = 0;
    private _now: number = 0;

    private _padding: string;

    private _processing: string;

    constructor(private _items: number, private _pattern: string = 'Progress: {bar} | Elapsed: {elapsed} | {percent}', private _title?: string){
        this._padding = new Array(300).join(' ');
        this._percentIncrease = 100/_items;
    }

    public start(processing?: string){
        this._start = new Date().getTime();
        this._processing = processing;
        this.renderTitle();
        this.write();
    }

    public update(processing?: string){
        this._processing = processing;
        if(this._current === this._items - 1){
            this.stop();
        }else{
            this._current++;
            this._percent = this._percent + this._percentIncrease;
            this.write();
        }
    }

    private stop = () =>{
        this._percent = 100;
        this._current++;
        this.write();
        charm.write("\n");
    };

    private write = () =>{
        charm.erase('line').write("\r");
        this._now = new Date().getTime();

        var regex = /(.*?){(.*?)}/g;
        var match;
        while (match = regex.exec(this._pattern)) {

            charm.display('bright').write(match[1]).display('reset');

            if(match[2].indexOf('.') == -1){
                this.renderPattern(match[2], match[2]);
            }else{
                var tokens = match[2].split('.');
                if(tokens.length == 4 && tokens[0] === 'bar'){
                    this.renderBar(tokens[1], tokens[2], tokens[3])
                }else if(tokens.length == 2){
                    this.renderPattern(match[2], tokens[0], tokens[1]);
                }

            }
        }
    };

    private renderElapsed = (color?: string) => {
        this.renderItem(numeral(((this._now - this._start)/1000)).format('0.0') + 's', color);
    };

    private renderRemaining = (color?: string) => {
        var item: string = 'N/A';
        if(this._current != 0){
            var elapsed = ((this._now - this._start)/1000);
            var remaining  = (elapsed/this._current * (this._items - this._current));
            item = numeral(remaining).format('0.0') + 's';
        }

        this.renderItem(item, color);
    };

    private renderMemory = (color?: string) => {
        this.renderItem(numeral(process.memoryUsage().rss/1024/1024).format('0.0') + 'M', color);
    };

    private renderPercent = (color?: string) => {
        this.renderItem(`${numeral(this._percent).format('0')}%`, color);
    };

    private renderCurrent = (color?: string) => {
        this.renderItem(this._current.toString(), color);
    };

    private renderTotal = (color?: string) => {
        this.renderItem(this._items.toString(), color);
    };

    private renderProcessing = (color?: string) => {
        this.renderItem(this._processing, color);
    };

    private renderBar = (colorRemaining: string | number = 'white', colorDone: string | number = 'green', size?: number) => {

        if(size && size !== this._barSize) this._barSize = size;
        //console.log(size);
        charm.foreground(colorDone).background(colorDone);
        var done = Math.ceil(((this._current / this._items) * this._barSize));

        charm.write(this._padding.substr(0, done));

        charm.foreground(colorRemaining).background(colorRemaining);
        charm.write(this._padding.substr(0, this._barSize - done));
        charm.display('reset');
    };

    private _patternMapping: any = {
        'bar': this.renderBar.bind(this),
        'elapsed': this.renderElapsed,
        'remaining': this.renderRemaining,
        'memory': this.renderMemory.bind(this),
        'percent': this.renderPercent.bind(this),
        'current': this.renderCurrent.bind(this),
        'total': this.renderTotal.bind(this),
        'processing': this.renderProcessing.bind(this)
    };

    private renderPattern = (pattern: string, item: string, color?: string) => {
        var renderer = this._patternMapping[item];
        if(renderer) {
            renderer(color);
        }else{
            charm.write(pattern);
        }
    };

    private renderItem = (item: string, color?: string) => {
        if(color) charm.foreground(color).write(item).display('reset'); else charm.write(item);
    };

    private renderTitle = (color?: string) => {
        if(this._title) {
            charm.display('bright').write(this._title).display('reset');
            charm.write("\n");
        }
    };

    // private pad(value: string, length: number = 0){
    //     var pad = new Array(length + 1).join(' ');
    //     return (pad + value).slice(-pad.length);
    // };

    // private format(value: number, format: string){
    //
    // };


}

export {Progress}