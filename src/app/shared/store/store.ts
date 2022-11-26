import { inject } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  observeOn,
  queueScheduler,
  Subject,
} from 'rxjs';
import { distinctUntilObjectChanged } from '../utils/distinctUntilObjectChanged';
import { StoreRegistryService } from './store-registry.service';

interface Action<State extends object> {
  name: string;
  actionFn: (state: State) => State;
  isLatest: boolean;
}

export abstract class Store<State extends object> {
  private readonly actionSource: Subject<Action<State>>;
  private readonly stateSource: BehaviorSubject<{
    state: State;
    latest: boolean;
  }>;
  private readonly registryService = inject(StoreRegistryService);

  readonly state$: Observable<{ state: State; latest: boolean }>;

  constructor(private name: string, initialState: State) {
    this.stateSource = new BehaviorSubject<{ state: State; latest: boolean }>({
      state: initialState,
      latest: true,
    });
    this.state$ = this.stateSource.asObservable();
    this.actionSource = new Subject<Action<State>>();
    this.registryService.addStore(name, this as unknown as Store<object>);

    this.actionSource.pipe(observeOn(queueScheduler)).subscribe((action) => {
      const currentState = this.stateSource.getValue();
      const nextState = action.actionFn(currentState.state);
      this.stateSource.next({ state: nextState, latest: action.isLatest });
    });
  }

  select<TX>(selector: (state: State) => TX): Observable<TX> {
    return this.state$.pipe(
      map((s) => s.state),
      map(selector),
      map((state) => structuredClone(state)),
      distinctUntilObjectChanged()
    );
  }

  get snapshot() {
    return this.stateSource.getValue().state;
  }

  changeProperty(prop: keyof State, value: State[typeof prop]) {
    this.dispatchAction(`Change "${String(prop)}" in state`, (state) => ({
      ...state,
      [prop]: value,
    }));
  }

  dispatchAction(
    actionName: string,
    actionFn: (state: State) => State,
    isLatest = true
  ) {
    this.actionSource.next({ name: actionName, actionFn, isLatest });
  }

  destroy() {
    this.registryService.deleteStore(this.name);
  }
}
