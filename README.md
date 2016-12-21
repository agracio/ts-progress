# ts-progress

[![Coverage Status](https://coveralls.io/repos/github/agracio/ts-progress/badge.svg?branch=master)](https://coveralls.io/github/agracio/ts-progress?branch=master)
[![Dependencies](https://david-dm.org/agracio/ts-progress.svg)](https://david-dm.org/agracio/ts-progress#info=dependencies)
[![img](https://david-dm.org/agracio/ts-progress/dev-status.svg)](https://david-dm.org/agracio/ts-progress/#info=devDependencies)
[![Known Vulnerabilities](https://snyk.io/test/github/agracio/ts-progress/badge.svg)](https://snyk.io/test/github/agracio/ts-progress)
[![Downloads](https://img.shields.io/npm/dm/ts-progress.svg)](https://www.npmjs.com/package/ts-progress)

> Flexible node progress bar for Windows/macOS/Linux

![image](https://github.com/agracio/ts-progress/raw/master/screenshot.gif)
 
## Installation
```bash
npm install ts-progress
```
 
## Quickstart
 
 ```javascript
var Progress = require('ts-progress');

var total = 50, count = 0;

var progress = Progress.create({total: total});

var iv = setInterval(function () {
    count++;
    progress.update();
    if (count == total) {
        clearInterval(iv);
    }
}, 150);
 ```
## API

### create(options)

Creates and returns new progress bar.

### update() 

Updates progress. 

### done()

Finishes progress regardless of progress stage. Optional.
 
## Options
Progress bar accepts the following options on initialisation: 
* `total: number` - Total number of items to process.
* `pattern: string` - Optional layout pattern, defaults to '*Progress: {bar} | Elapsed: {elapsed} | {percent}*'. See [Patterns](#patterns)
* `textColor: string` - Optional text color. See [Colors](#colors)
* `title: string` - Optional title to display above progress bar.
* `updateFrequency: number` - Optional update frequency limit in milliseconds. See [Update frequency](#update-frequency).

```javascript

// with default options
var progress = Progress.create({total: 50});

// with pattern
var progress = Progress.create({total: 50, pattern: 'Progress: {bar} | Remaining: {remaining} | {percent} '});

//with pattern and text color
var progress = Progress.create({total: 50, pattern: 'Progress: {current}/{total} | Remaining: {remaining} | Elapsed: {elapsed} ', textColor: 'blue'});

//with default options and title
var progress = Progress.create({total: 50, title: 'Waiting for results'});

```

## Update frequency
When set limits progress bar update rate. Used to limit refresh rate for quickly running tasks.

In the example below progress bar will only update every 150 milliseconds instead of updating 1000 times every millisecond. This will reduce resource allocation to progress bar. 

 ```javascript
var Progress = require('ts-progress');

var total = 1000, count = 0;

var progress = Progress.create({total: total, updateFrequency: 150});

var iv = setInterval(function () {
    count++;
    progress.update();
    if (count == total) {
        clearInterval(iv);
    }
}, 1);
 ```
 
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
var progress = Progress.create({total:50, pattern: 'Progress: {bar.white.red.10} | Remaining: {remaining.red} | {percent.blue}'});
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




