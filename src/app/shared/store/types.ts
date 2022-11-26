import { EnhancerOptions } from 'redux-devtools-extension';

export type ReduxDevtoolsExtension = {
  connect: (config: EnhancerOptions) => ReduxDevTools;
};

type DispatchTypes = 'JUMP_TO_ACTION' | 'ROLLBACK';

export type MonitorEvent =
  | {
      id: string;
      payload: { type: DispatchTypes; actionId: number };
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
