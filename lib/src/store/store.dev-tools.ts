import { Injectable } from '@angular/core';
import { EnhancerOptions } from 'redux-devtools-extension';
import {
  combineLatestWith,
  filter,
  from,
  iif,
  map,
  mergeMap,
  of,
  Subject,
  tap,
} from 'rxjs';
import { distinctUntilObjectChanged } from '../utils';
import { StoreRegistry } from './store-registry';
import { MonitorEvent, ReduxDevTools } from './types';

@Injectable({
  providedIn: 'root',
})
export class StoreDevTools {
  private devTools: ReduxDevTools | undefined;
  private dispatchEvents$ = new Subject<MonitorEvent>();

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
    this.devTools.init(globalState);
    this.devTools.subscribe((event: MonitorEvent) => {
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
        mergeMap((event) =>
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
      map((state) => JSON.parse(state)),
      map((state) => ({
        storeName: Object.keys(state)[0],
        state: Object.values(state)[0] as object,
      })),
      combineLatestWith(this.storeRegistry.stores$),
      tap(([{ state, storeName }, store]) => {
        store[storeName]?.dispatchAction('monitor', () => state, false);
      })
    );
  }

  private watchChangesOfStores(globalState: Record<string, object>) {
    this.storeRegistry.stores$
      .pipe(
        mergeMap((stores) =>
          from(Object.keys(stores)).pipe(
            mergeMap((key) =>
              stores[key].state$.pipe(
                filter((s) => s.latest),
                map((state) => {
                  return { name: key, state: state.state };
                })
              )
            )
          )
        ),
        distinctUntilObjectChanged(),
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