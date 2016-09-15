# ts-progress

> Flexible node progress bar

![image](https://github.com/agracio/ts-progress/raw/master/screenshot.png)
 
## Installation
```bash
npm install ts-progress
```
 
## Quickstart
 
 ```javascript
var Progress = require('ts-progress');

var total = 50;
var progress = new Progress(total);
progress.start();
var count = 0;
var iv = setInterval(function () {
    count++;
    progress.update();
    if (count == items) {
        clearInterval(iv);
    }
}, 150);
 ```
 
## Options
Status accepts the following config options on `start()`:
* `total` - Total number of items to process.
* `pattern` - Optional layout pattern, defaults to '*Progress: {bar} | Elapsed: {elapsed} | {percent}*'.
* `title` - Optional title to display above progress bar.
* `updateFrequency` - Optional update frequency limit in milliseconds, defaults to *100*. See [Update frequency](#Update frequency). 

```javascript
var progress = new Progress(50, 'Progress: {bar} | Remaining: {remaining} | {percent} ', 'Awaiting results...');
```

## Update frequency
Update frequency limit.

