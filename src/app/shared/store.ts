import { Injectable, OnDestroy } from '@angular/core';
import { isEqual } from 'lodash';
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  Observable,
  observeOn,
  queueScheduler,
  Subject,
  Subscription,
} from 'rxjs';
import { StoreDevTools } from './store.dev';

interface Action<State extends object> {
  name: string;
  actionFn: (state: State) => State;
}

@Injectable()
export abstract class Store<State extends object> implements OnDestroy {
  private readonly actionSubscription: Subscription;
  private readonly actionSource: Subject<Action<State>>;
  private readonly stateSource: BehaviorSubject<State>;
  private readonly devTools: StoreDevTools<State> | undefined;
  readonly state$: Observable<State>;

  constructor(initialState: State) {
    this.stateSource = new BehaviorSubject<State>(initialState);
    this.state$ = this.stateSource.asObservable();
    this.actionSource = new Subject<Action<State>>();

    if (process.env['NODE_ENV'] !== 'production') {
      this.devTools = new StoreDevTools<State>(initialState);
    }

    this.actionSubscription = this.actionSource
      .pipe(observeOn(queueScheduler))
      .subscribe((action) => {
        const currentState = this.stateSource.getValue();
        const nextState = action.actionFn(currentState);

        this.devTools?.changeState(action.name, nextState);

        this.stateSource.next(nextState);
      });
  }

  select<TX>(selector: (state: State) => TX): Observable<TX> {
    return this.state$.pipe(
      map(selector),
      map((state) => structuredClone(state)),
      this.distinctUntilObjectChanges()
    );
  }

  get snapshot() {
    return this.stateSource.getValue();
  }

  changeProperty(prop: keyof State, value: State[typeof prop]) {
    this.dispatchAction(`Change "${String(prop)}" in state`, (state) => ({
      ...state,
      [prop]: value,
    }));
  }

  dispatchAction(actionName: string, actionFn: (state: State) => State) {
    this.actionSource.next({ name: actionName, actionFn });
  }

  private distinctUntilObjectChanges() {
    return <T>(source: Observable<T>): Observable<T> =>
      source.pipe(distinctUntilChanged((prev, cur) => isEqual(prev, cur)));
  }

  ngOnDestroy(): void {
    this.actionSubscription.unsubscribe();
  }
}
