import { Injectable } from '@angular/core';
import { StoreRegistry } from 'angular-state/store/store-registry';
import { EnhancerOptions } from 'redux-devtools-extension';
import {
  filter,
  from,
  iif,
  map,
  mergeMap,
  of,
  Subject,
  tap,
  withLatestFrom,
} from 'rxjs';
import { MonitorEvent, ReduxDevTools, ReduxDevtoolsExtension } from '../types';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: ReduxDevtoolsExtension;
  }
}

@Injectable({
  providedIn: 'root',
})
export class StateDevTools {
  private devTools: ReduxDevTools | undefined;
  private dispatchEvents$ = new Subject<MonitorEvent>();
  private stateHistory: object[] = [];

  constructor(private storeRegistry: StoreRegistry) {}

  init() {
    if (!window.__REDUX_DEVTOOLS_EXTENSION__) return;

    const config: EnhancerOptions = {
      features: { pause: true, export: true, test: true, jump: true },
      trace: true,
      traceLimit: 25,
    };

    this.devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect(config);
    const globalState: Record<string, object> = {};
    this.devTools?.init(globalState);
    this.devTools?.subscribe((event: MonitorEvent) => {
      if (event.type === 'DISPATCH') {
        this.dispatchEvents$.next(event);
      }
    });

    this.watchChangesOfStores(globalState);
    this.watchChangesOfMonitor();
  }

  private watchChangesOfMonitor() {
    this.dispatchEvents$
      .pipe(
        mergeMap(event =>
          iif(
            () =>
              event.type === 'DISPATCH' &&
              event.payload.type === 'JUMP_TO_ACTION',
            this.processDispatchEvents(event),
            of(event)
          )
        )
      )
      .subscribe();
  }

  private processDispatchEvents(event: MonitorEvent) {
    return of(event.state).pipe(
      filter(Boolean),
      map(state => JSON.parse(state)),
      mergeMap(state => from(Object.entries(state))),
      map(([storeName, state]) => ({
        storeName,
        state,
      })),
      withLatestFrom(this.storeRegistry.stores$),
      tap(([{ state, storeName }, store]) => {
        if (state) {
          this.stateHistory.push(state);
          store[storeName]?.update(() => state);
        }
      })
    );
  }

  private watchChangesOfStores(globalState: Record<string, object>) {
    this.storeRegistry.stores$
      .pipe(
        mergeMap(stores =>
          from(Object.keys(stores)).pipe(
            mergeMap(key =>
              stores[key].state$.pipe(
                filter(
                  // filter out state changes of dev tool
                  s => {
                    const devToolStateIndex = this.stateHistory.findIndex(
                      historyState => Object.is(historyState, s)
                    );
                    if (devToolStateIndex > -1) {
                      this.stateHistory.splice(devToolStateIndex, 1);
                      return false;
                    }
                    return true;
                  }
                ),
                map(state => {
                  return { name: key, state: state };
                })
              )
            )
          )
        ),
        tap(({ name, state }) => {
          globalState[name] = state;
          this.changeState(name, globalState);
        })
      )
      .subscribe();
  }

  private changeState(action: string, stateValue: object) {
    this.devTools?.send(action, stateValue);
  }
}
