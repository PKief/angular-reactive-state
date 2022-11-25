import { firstValueFrom } from 'rxjs';
import { Store } from './store';

class TestStore<T extends object> extends Store<T> {}

describe('Store', () => {
  it('should set initial state for store', () => {
    const store = new TestStore<{ a: string }>({ a: 'a' });
    store.state$.subscribe((state) => expect(state.a).toBe('a'));
  });

  it('should select correct state out of store', () => {
    const store = new TestStore<{ a: string }>({ a: 'a' });
    store
      .select((state) => state.a)
      .subscribe((value) => expect(value).toBe('a'));
  });

  it('should subscribe to state changes', async () => {
    const store = new TestStore<{ a: string }>({ a: 'a' });
    const stateValue = await firstValueFrom(store.select((state) => state.a));
    expect(stateValue).toBe('a');
    store.changeProperty('a', 'A');
    const updatedStateValue = await firstValueFrom(
      store.select((state) => state.a)
    );
    expect(updatedStateValue).toBe('A');
  });

  it('should not trigger change for state properties which are not selected', () => {
    const store = new TestStore<{ a: { a: string }; b: { b: string } }>({
      a: { a: 'a' },
      b: { b: 'b' },
    });
    let countStateChangesA = 0;
    let countStateChangesB = 0;

    store.select((state) => state.a).subscribe(() => countStateChangesA++);
    store.select((state) => state.b).subscribe(() => countStateChangesB++);

    store.changeProperty('a', { a: 'A' });

    expect(countStateChangesA).toBe(2);
    expect(countStateChangesB).toBe(1);
  });
});
