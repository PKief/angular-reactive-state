import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Store } from './store';

type TestStoreState = {
  a: {
    a: string;
  };
  b: {
    b: string;
  };
};

class TestStore extends Store<TestStoreState> {
  constructor() {
    super('TestStore', {
      a: { a: 'a' },
      b: { b: 'b' },
    });
  }
}

Object.defineProperty(global, 'structuredClone', {
  writable: true,
  configurable: true,
  value: (value: unknown) => {
    return JSON.parse(JSON.stringify(value));
  },
});

describe('Store', () => {
  let store: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestStore],
    });
    store = TestBed.inject(TestStore);
  });

  it('should set initial state for store', () => {
    store.state$.subscribe(state => expect(state.a).toEqual({ a: 'a' }));
  });

  it('should select correct state out of store', () => {
    store
      .select(state => state.a)
      .subscribe(value => expect(value).toEqual({ a: 'a' }));
  });

  it('should subscribe to state changes', async () => {
    const stateValue = await firstValueFrom(store.select(state => state.a));
    expect(stateValue).toEqual({ a: 'a' });
    store.updateProperty('a', { a: 'A' }, 'a');
    const updatedStateValue = await firstValueFrom(
      store.select(state => state.a)
    );
    expect(updatedStateValue).toEqual({ a: 'A' });
  });

  it('should trigger state changes via custom actions', () => {
    const stateValue = store.snapshot.a;
    expect(stateValue).toEqual({ a: 'update a' });
    store.update(
      state => ({
        ...state,
        a: { a: 'A' },
      }),
      'update a'
    );
    const updatedStateValue = store.snapshot.a;
    expect(updatedStateValue).toEqual({ a: 'A' });
  });

  it('should not trigger change for state properties which are not selected', () => {
    let countStateChangesA = 0;
    let countStateChangesB = 0;

    store.select(state => state.a).subscribe(() => countStateChangesA++);
    store.select(state => state.b).subscribe(() => countStateChangesB++);

    store.updateProperty('a', { a: 'A' }, 'update a');

    expect(countStateChangesA).toEqual(2);
    expect(countStateChangesB).toEqual(1);
  });
});
