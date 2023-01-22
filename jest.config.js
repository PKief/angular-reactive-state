module.exports = {
  preset: 'jest-preset-angular',
  globalSetup: 'jest-preset-angular/global-setup',
  moduleNameMapper: {
    'angular-reactive-state/(.*)': ['<rootDir>/lib/src/$1'],
  },
};
