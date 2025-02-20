import {expect, test, describe} from '@jest/globals';
const Progress = require('../src/progress');

process.setMaxListeners(0);

function helper(stdout: any, fn: Function) {
    let original = process.stdout.write;

    function restore() {
        process.stdout.write = original;
    }

    process.stdout.write = (str: any) =>{
        stdout.push(str);
        return true;
    };

    fn();

    restore();

    return filterStdout(stdout);
}

function filterStdout(stdout: any): string[]{
    return stdout.filter((str: any) =>{
        return typeof str !== 'object'
    }).join('').trim().split('\r\n');
}

//class Mem implements NodeJS.

describe("Progress", () => {

    test('default', () => {
        let stdout = helper([], () =>{
            let progress = Progress.create({total: 2});
            progress.update();
            progress.update();
        });

        expect(stdout.length).toBe(3);
        expect(stdout[0]).toBe('Progress:                      | Elapsed: 0.0s | 0%');
        expect(stdout[1]).toBe('\rProgress:                      | Elapsed: 0.0s | 50%');
        expect(stdout[2]).toBe('\rProgress:                      | Elapsed: 0.0s | 100%');
    });

    test('pattern', function() {

        let stdout = helper([], () =>{
            let progress = Progress.create({total: 2, pattern: 'bar: {bar} · {elapsed} · {remaining} · {percent} · {current}/{total}'});
            progress.update();
            progress.update();
        });

        expect(stdout.length).toBe(3);
        expect(stdout[0]).toBe('bar:                      · 0.0s · 0.0s · 0% · 0/2');
        expect(stdout[1]).toBe('\rbar:                      · 0.0s · 0.0s · 50% · 1/2');
        expect(stdout[2]).toBe('\rbar:                      · 0.0s · 0.0s · 100% · 2/2');

    });

    test('unsupported token', function() {

        let stdout = helper([], () =>{
            let progress = Progress.create({total: 1, pattern: 'bar: {bar} · {percent} · {token}'});
            progress.update();
        });

        expect(stdout.length).toBe(2);
        expect(stdout[0]).toBe('bar:                      · 0% · token');
        expect(stdout[1]).toBe('\rbar:                      · 100% · token');

    });

    test('customised token', function() {

        let stdout = helper([], () =>{
            let progress = Progress.create({total: 1, pattern: 'bar: {bar} · {percent.green}'});
            progress.update();
        });

        expect(stdout.length).toBe(2);
        expect(stdout[0]).toBe('bar:                      · 0%');
        expect(stdout[1]).toBe('\rbar:                      · 100%');

    });

    test('text', function() {

        let stdout = helper([], () =>{
            let progress = Progress.create({total: 1, pattern: 'bar: {bar} · {percent.green}', textColor: 'blue'});
            progress.update();
        });

        expect(stdout.length).toBe(2);
        expect(stdout[0]).toBe('bar:                      · 0%');
        expect(stdout[1]).toBe('\rbar:                      · 100%');

    });

    test('memory', function() {

        let rss = process.memoryUsage.rss();
        process.memoryUsage.rss = () => { return 20*1024*1024 }

        let stdout = helper([], () =>{
            let progress = Progress.create({total: 1, pattern: 'bar: {bar} · {memory}'});
            progress.update();
        });

        expect(stdout.length).toBe(2);
        expect(stdout[0]).toBe(`bar:                      · 20.0M`);
        expect(stdout[1]).toBe(`\rbar:                      · 20.0M`);

        process.memoryUsage.rss = () => { return rss }
    });

    test('bar', function() {

        let stdout = helper([], () =>{
            let progress = Progress.create({total: 1, pattern: 'bar: {bar.white.green.25} · {percent}'});
            progress.update();
        });

        expect(stdout.length).toBe(2);
        expect(stdout[0]).toBe('bar:                           · 0%');
        expect(stdout[1]).toBe('\rbar:                           · 100%');

    });

    test('title', function() {

        let stdout = helper([], () =>{
            let progress = Progress.create({total: 1, pattern: 'progress · {bar} · {percent}', title: 'title'});
            progress.update();
        });

        expect(stdout.length).toBe(2);
        expect(stdout[0]).toBe('title\nprogress ·                      · 0%');
        expect(stdout[1]).toBe('\rprogress ·                      · 100%');

    });

    test('update frequency', function() {

        let stdout = helper([], () =>{
            let progress = Progress.create({total: 2, pattern: 'progress · {bar} · {percent}', updateFrequency: 100});
            progress.update();
            progress.update();
        });

        expect(stdout.length).toBe(2);
        expect(stdout[0]).toBe('progress ·                      · 0%');
        expect(stdout[1]).toBe('\rprogress ·                      · 100%');

    });

    test('update', function() {

        let stdout = helper([], () =>{
            let progress = Progress.create({total: 1, pattern: 'progress · {bar} · {percent}'});
            progress.update();
            progress.update();
            progress.update();
            progress.update();
        });

        expect(stdout.length).toBe(2);
        expect(stdout[0]).toBe('progress ·                      · 0%');
        expect(stdout[1]).toBe('\rprogress ·                      · 100%');

    });


    test('done', function() {

        let stdout = helper([], () =>{
            let progress = Progress.create({total: 2, pattern: 'progress · {bar} · {percent}'});
            progress.done();
        });

        expect(stdout.length).toBe(2);
        expect(stdout[0]).toBe('progress ·                      · 0%');
        expect(stdout[1]).toBe('\rprogress ·                      · 100%');

    });

});
