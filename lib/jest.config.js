var baseConfig = require('../jest.config');

module.exports = Object.assign(baseConfig, {
  preset: 'jest-preset-angular',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
});
