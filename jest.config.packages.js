module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!axios)'],
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.ts', '!**/*.d.ts', '!src/types/**/*', '!**/node_modules/**'],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^@codefi/(.+)$': ['<rootDir>/../$1/src', '<rootDir>/../../node_modules/@codefi/$1'],
  },
  testPathIgnorePatterns: ['node_modules', 'lib', 'dist', 'artifacts', 'typings'],
}
