import { Injectable, OnDestroy } from '@angular/core';
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
import { isEqual } from 'lodash';

interface Action<T extends object> {
  name: string;
  actionFn: (state: T) => T;
}

@Injectable()
export abstract class Store<T extends object> implements OnDestroy {
  private readonly actionSubscription: Subscription;
  private readonly actionSource: Subject<Action<T>>;
  private readonly stateSource: BehaviorSubject<T>;
  readonly state$: Observable<T>;

  constructor(initialState: T, logChanges = false) {
    this.stateSource = new BehaviorSubject<T>(initialState);
    this.state$ = this.stateSource.asObservable();
    this.actionSource = new Subject<Action<T>>();

    this.actionSubscription = this.actionSource
      .pipe(observeOn(queueScheduler))
      .subscribe((action) => {
        const currentState = this.stateSource.getValue();
        const nextState = action.actionFn(currentState);

        if (logChanges) {
          this.log(action.name, currentState, nextState);
        }

        this.stateSource.next(nextState);
      });
  }

  select<TX>(selector: (state: T) => TX): Observable<TX> {
    return this.state$.pipe(
      map(selector),
      map((state) => structuredClone(state)),
      distinctUntilChanged((prev, cur) => isEqual(prev, cur))
    );
  }

  get snapshot() {
    return this.stateSource.getValue();
  }

  protected changeState(actionName: string, actionFn: (state: T) => T) {
    this.actionSource.next({ name: actionName, actionFn });
  }

  private log(actionName: string, before: T, after: T) {
    //TBD
  }

  ngOnDestroy(): void {
    this.actionSubscription.unsubscribe();
  }
}
