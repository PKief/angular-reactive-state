import { EnhancerOptions } from 'redux-devtools-extension';

export type ReduxDevtoolsExtension = {
  connect: (config: EnhancerOptions) => ReduxDevTools;
};

export type MonitorEvent =
  | {
      id: string;
      payload: { type: 'JUMP_TO_ACTION'; actionId: number };
      source: '@devtools-extension';
      state: string;
      type: 'DISPATCH';
    }
  | {
      id: undefined;
      source: '@devtools-extension';
      state: undefined;
      type: 'START';
    };

export type ReduxDevTools = {
  init: (initialState: object) => void;
  subscribe: (listener: (event: MonitorEvent) => void) => void;
  send: (action: string, state: object) => void;
};
