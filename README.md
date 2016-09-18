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
* `textColor: string` - Optional text color. See [Colors](#colors)
* `title: string` - Optional title to display above progress bar.
* `updateFrequency: number` - Optional update frequency limit in milliseconds. See [Update frequency](#update-frequency).

```javascript

// with default options
var progress = new Progress(50);

// with pattern
var progress = new Progress(50, 'Progress: {bar} | Remaining: {remaining} | {percent} ');

//with pattern and text color
var progress = new Progress(50, 'Progress: {current}/{total} | Remaining: {remaining} | Elapsed: {elapsed} ', 'blue');

//with default options and title
var progress = new Progress(50, undefined, undefined, 'Waiting for results');

```

## Update frequency
When set limits progress bar update rate. Used to limit refresh rate for quickly running tasks progress.

In the example below progress bar will only update every 150 milliseconds instead of updating 1000 times every millisecond. This will reduce resource allocation to progress bar. 

 ```javascript
var Progress = require('ts-progress');

var total = 1000, count = 0;

var progress = new Progress(total, undefined, undefined, undefined, 150);

var iv = setInterval(function () {
    count++;
    progress.update();
    if (count == total) {
        clearInterval(iv);
    }
}, 1);
 ```
[](With large number of tasks can result in flickering and ineefctive resource allocation.)
[]( Update freq can be used to limit refresh rate for such tasks.)
  
## Patterns
The following tokens are supported: 

* `{bar}` - progress bar.
* `{elapsed}` - elapsed time in seconds.
* `{remaining}` - estimated remaining time in seconds.
* `{percent}` - completion percentage
* `{memory}` - process memory usage in megabytes.
* `{current}` - current item.
* `{total}` - total items.

### Token customisation
Tokens can be customised to define color for each token. 
Progress bar  token accepts two colors for remaining/done items as well as length.

Usage for all tokens except progress bar:
* `{token.color}`

Usage for progress bar:
* `{bar.color.color.length}` - default is *{bar.white.green.20}*

```javascript
var progress = new Progress(50, 'Progress: {bar.white.red.10} | Remaining: {remaining.red} | {percent.blue}');
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



