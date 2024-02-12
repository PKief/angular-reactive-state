import { inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  map,
  Observable,
  observeOn,
  queueScheduler,
  Subject,
} from 'rxjs';
import { distinctUntilObjectChanged } from '../utils/distinctUntilObjectChanged';
import { StoreRegistry } from './store-registry';

type Action<State extends object> = {
  reducer: (state: State) => State;
  title: string;
};

export abstract class Store<State extends object> {
  private readonly stateSource: BehaviorSubject<State>;
  private readonly registryService = inject(StoreRegistry);

  readonly state$: Observable<State>;
  readonly actions$: Subject<Action<State>>;

  constructor(
    private name: string,
    initialState: State
  ) {
    this.stateSource = new BehaviorSubject<State>(initialState);
    this.state$ = this.stateSource.asObservable();
    this.actions$ = new Subject<Action<State>>();
    this.registryService.addStore(name, this as unknown as Store<object>);

    this.actions$.pipe(observeOn(queueScheduler)).subscribe(action => {
      const currentState = this.stateSource.getValue();
      const nextState = action.reducer(currentState);
      this.stateSource.next(nextState);
    });
  }

  select<SelectedState>(
    selector: (state: State) => SelectedState
  ): Observable<SelectedState> {
    return this.state$.pipe(
      map(selector),
      map(state => structuredClone(state)),
      distinctUntilObjectChanged()
    );
  }

  selectAsSignal<SelectedState>(
    selector: (state: State) => SelectedState
  ): Signal<SelectedState> {
    return toSignal(this.select(selector), {
      initialValue: selector(this.snapshot),
    });
  }

  get snapshot() {
    return this.stateSource.getValue();
  }

  updateProperty(prop: keyof State, value: State[typeof prop], title: string) {
    this.update(
      state => ({
        ...state,
        [prop]: value,
      }),
      title
    );
  }

  update(stateChanger: (state: State) => State, title: string) {
    this.actions$.next({ reducer: stateChanger, title });
  }

  destroy() {
    this.actions$.complete();
    this.stateSource.complete();
    this.registryService.deleteStore(this.name);
  }
}
