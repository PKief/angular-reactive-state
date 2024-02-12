var baseConfig = require('../jest.config');

module.exports = Object.assign(baseConfig, {
  preset: 'jest-preset-angular',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.spec.json',
      },
    ],
  },
});
