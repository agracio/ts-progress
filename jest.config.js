module.exports = {
    verbose: true,
    reporters: [
        'default',
        ['github-actions', {silent: false}],
        'summary',
    ],
    roots: [
        "./lib/test",
    ],
}