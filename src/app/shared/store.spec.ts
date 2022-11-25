import { Store } from './store';

describe('Store', () => {
  it('should set initial state for store', () => {
    class TestStore extends Store<{ a: string }> {}
    const store = new TestStore({ a: 'a' });
    
    store.state$.subscribe((state) => expect(state.a).toBe('a'));
  });
});
