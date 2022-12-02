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
  private readonly dispatchEvents$ = new Subject<MonitorEvent>();
  private readonly stateHistory: object[] = [];
  private readonly globalState: Record<string, object> = {};

  constructor(private storeRegistry: StoreRegistry) {}

  /**
   * Initialize the dev tools which can be used to monitor state changes of the stores.
   */
  init() {
    if (!window.__REDUX_DEVTOOLS_EXTENSION__) return;

    const config: EnhancerOptions = {
      features: { pause: true, export: true, test: true, jump: true },
      trace: true,
      traceLimit: 25,
    };

    this.devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect(config);
    this.devTools?.init(this.globalState);
    this.devTools?.subscribe((event: MonitorEvent) => {
      if (event.type === 'DISPATCH') {
        this.dispatchEvents$.next(event);
      }
    });

    this.watchChangesOfStores();
    this.watchChangesOfMonitor();
  }

  /**
   * Watch all changes which are coming from the monitor of the dev tools extension.
   */
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

  /**
   * Observes all dispatch events from the devtools extension and
   * updates the respective store with the state which should be replayed.
   *
   * @param event Dispatch event from devtools extension
   * @returns
   */
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
          // Temporarily save reference in history
          this.stateHistory.push(state);
          store[storeName]?.update(() => state);
        }
      })
    );
  }

  /**
   * Watches all state changes which are coming from all stores.
   */
  private watchChangesOfStores() {
    this.storeRegistry.stores$
      .pipe(
        mergeMap(stores =>
          from(Object.keys(stores)).pipe(
            mergeMap(key =>
              stores[key].state$.pipe(
                filter(this.isStateUnprocessed),
                map(state => {
                  return { name: key, state: state };
                })
              )
            )
          )
        ),
        tap(({ name, state }) => {
          this.globalState[name] = state;
          this.changeState(name, this.globalState);
        })
      )
      .subscribe();
  }

  /**
   * If the devtools replay some of the old states by time traveling then the references are stored inside of the devtools' state history.
   * Based on the object references the devtools recognize if the state was already processed or if it's a new state change.
   *
   * @param emittedStateFromStore
   * @returns True if state is new to the devtools and false if the state was already processed
   */
  private isStateUnprocessed(emittedStateFromStore: object) {
    const devToolStateIndex = this.stateHistory.findIndex(historyState =>
      Object.is(historyState, emittedStateFromStore)
    );
    if (devToolStateIndex > -1) {
      this.stateHistory.splice(devToolStateIndex, 1);
      return false;
    }
    return true;
  }

  private changeState(action: string, stateValue: object) {
    this.devTools?.send(action, stateValue);
  }
}
