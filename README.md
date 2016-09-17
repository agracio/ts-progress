# ts-progress

> Flexible node progress bar

![image](https://github.com/agracio/ts-progress/raw/master/screenshot.gif)
 
## Installation
```bash
npm install ts-progress
```
 
## Quickstart
 
 ```javascript
var Progress = require('ts-progress');

var total = 50, count = 0;

var progress = new Progress(total);
progress.start();

var iv = setInterval(function () {
    count++;
    progress.update();
    if (count == total) {
        clearInterval(iv);
    }
}, 150);
 ```
 
## Options
Progress bar accepts the following options on initialisation: 
* `total: number` - Total number of items to process.
* `pattern: string` - Optional layout pattern, defaults to '*Progress: {bar} | Elapsed: {elapsed} | {percent}*'. See [Patterns](#Patterns)
* `textColor: string` - Optional text color. See [Colors](#Colors)
* `title: string` - Optional title to display above progress bar.
* `updateFrequency: number` - Optional update frequency limit in milliseconds. See [Update frequency](#Update frequency).

```javascript

// with default options
var progress = new Progress(50);

// with pattern
var progress = new Progress(50, 'Progress: {bar} | Remaining: {remaining} | {percent} ');

//with pattern and text color
var progress = new Progress(50, 'Progress: {current}/{total} | Remaining: {remaining} | Elapsed: {elapsed} ', 'blue');

//with default options and title
var progress = new Progress(50, undefied, undefied, 'Waiting for results');

```

## Update frequency
When set limits progress bar update rate. Used to limit refresh rate for quickly running tasks progress. Reduces resource allocation to progress bar and resolves display flickering issues.
 
## Patterns
The following tokens are supported: 

* `{bar}` - progress bar.
* `{elapsed}` - elapsed time in seconds.
* `{remaining}` - estimated remaining time in seconds.
* `{percent}` - completion percentage
* `{memory}` - process memory usage.
* `{current}` - current item.
* `{total}` - total items.

### Token customisation
Tokens can be customised to define color for each token. 
Progress bar accepts two colors for remaining/done items as well as length.

Usage for all tokens except progress bar:
* `{token.color}`

Usage for progress bar:
* `{bar.color.color.length}`

```javascript
var progress = new Progress(50, 'Progress: {bar.white.green.20} | Remaining: {remaining.red} | {percent.blue}');
```

## Colors
Progress bar uses [charm](https://www.npmjs.com/package/charm) to render elements and supports charm string colors:
* `red`
* `yellow`
* `green`
* `blue`
* `cyan`
* `magenta`
* `black`
* `white`



[](Comment text goes here)



