module.exports = {
    verbose: true,
    preset: "ts-jest",
    reporters: [
        'default',
        ['github-actions', {silent: false}],
        'summary',
        ['jest-junit', {outputDirectory: 'coverage', outputName: 'junit.xml'}],
    ],
    testMatch: ["<rootDir>/test/**/*.test.{js,jsx,ts,tsx}"],
    collectCoverage: true,
    coverageDirectory: "coverage",
}