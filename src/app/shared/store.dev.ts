import { EnhancerOptions } from 'redux-devtools-extension';

export class StoreDevTools<State> {
  private devTools: any;

  constructor(initialState: State) {
    this.initReduxDevTools(initialState);
  }

  private initReduxDevTools(initialState: State) {
    const config: EnhancerOptions = {
      features: { pause: true, export: true, test: true, jump: false },
      trace: true,
      traceLimit: 25,
    };
    const extensionWindowProperty = '__REDUX_DEVTOOLS_EXTENSION__';
    if ((window as any)[extensionWindowProperty]) {
      this.devTools = (window as any)[extensionWindowProperty].connect(config);
      this.devTools.init(initialState);
    }
  }

  changeState(action: string, stateValue: State) {
    this.devTools.send(action, stateValue);
  }
}
