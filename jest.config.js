module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.js'],
    transform: {},
    moduleNameMapper: {
        '^@ostro/support/(.*)$': '<rootDir>/../support/$1',
        '^@ostro/support$': '<rootDir>/../support',
        '^@ostro/contracts/(.*)$': '<rootDir>/../contracts/$1',
        '^@ostro/contracts$': '<rootDir>/../contracts',
        '^@ostro/container/(.*)$': '<rootDir>/../container/$1',
        '^@ostro/container$': '<rootDir>/../container/application.js',
        '^@ostro/console/(.*)$': '<rootDir>/../console/$1',
        '^@ostro/console$': '<rootDir>/../console/application.js',
        '^@ostro/encryption/(.*)$': '<rootDir>/$1',
        '^@ostro/encryption$': '<rootDir>/encrypter.js'
    },
    collectCoverage: false,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'clover']
};
