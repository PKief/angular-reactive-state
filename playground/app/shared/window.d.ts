import { ReduxDevtoolsExtension } from 'lib/src/types';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: ReduxDevtoolsExtension;
  }
}

export {};
