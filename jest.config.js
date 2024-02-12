module.exports = {
  preset: 'jest-preset-angular',
  moduleNameMapper: {
    'angular-reactive-state/(.*)': ['<rootDir>/lib/src/$1'],
    '^lodash-es$': 'lodash',
  },
};
