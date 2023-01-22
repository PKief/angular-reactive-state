var baseConfig = require('../jest.config');

module.exports = Object.assign(baseConfig, {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
  setupFiles: ['./jest-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  detectOpenHandles: true,
  moduleNameMapper: {
    'angular-reactive-state/(.*)': ['<rootDir>/../lib/src/$1'],
  },
});
