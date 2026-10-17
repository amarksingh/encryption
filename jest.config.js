const tsJestPath = "/Users/amarkumarsingh/.nvm/versions/node/v24.12.0/lib/node_modules/ts-jest";

module.exports = {
    "testEnvironment": "node",
    "testMatch": [
        "**/test/**/*.test.ts",
        "**/test/**/*.test.js"
    ],
    "transform": {
        "^.+\\.ts$": [
            tsJestPath,
            {
                "tsconfig": "<rootDir>/tsconfig.json"
            }
        ]
    },
    "moduleNameMapper": {
        "^@ostro/support/(.*)$": "<rootDir>/../support/src/$1",
        "^@ostro/support$": "<rootDir>/../support/src",
        "^@ostro/contracts/(.*)$": "<rootDir>/../contracts/src/$1",
        "^@ostro/contracts$": "<rootDir>/../contracts/src",
        "^@ostro/container/(.*)$": "<rootDir>/../container/$1",
        "^@ostro/container$": "<rootDir>/../container/application",
        "^@ostro/console/(.*)$": "<rootDir>/../console/$1",
        "^@ostro/console$": "<rootDir>/../console/application",
        "^@ostro/encryption/(.*)$": "<rootDir>/src/$1",
        "^@ostro/encryption$": "<rootDir>/src/encrypter"
    },
    "collectCoverage": true,
    "collectCoverageFrom": [
        "<rootDir>/src/**/*.ts",
        "!<rootDir>/node_modules/**",
        "!<rootDir>/test/**",
        "!<rootDir>/coverage/**",
        "!<rootDir>/build/**"
    ],
    "coverageDirectory": "coverage",
    "coverageReporters": [
        "text",
        "lcov",
        "clover"
    ]
};
