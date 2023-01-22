module.exports = {
  preset: 'jest-preset-angular',
  globalSetup: 'jest-preset-angular/global-setup',
  setupFiles: ['<rootDir>/jest-setup.ts'],
  roots: ['<rootDir>', 'lib/src'],
  modulePaths: ['<rootDir>', 'lib/src'],
  moduleDirectories: ['node_modules', 'lib/src'],
  moduleNameMapper: {
    'angular-reactive-state/(.*)': ['<rootDir>/lib/src/$1'],
  },
};
