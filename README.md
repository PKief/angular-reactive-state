<h1 align="center">
  <br>
    <img src="https://raw.githubusercontent.com/PKief/angular-reactive-state/main/logo.png" alt="logo" width="200">
  <br><br>
  Angular Reactive State
  <br>
  <br>
</h1>

<h4 align="center">Reactive state management for Angular</h4>

## Advantages

- Provide a store for each Angular module
- Flexible and customizable store services
- Supports Redux Dev Tool Extensions

## Getting started

### Installation

NPM

```
npm i angular-reactive-state
```

Yarn

```
yarn add angular-reactive-state
```

### Create a store

As we are following a decentralized store concept we create a separate store for each of our modules:

Run the following command to create a store service:

```
ng generate service <store-name>
```

Now we follow these steps to transform the generated into a reactive store:

- the service class extends the `Store` class
- the `Store` class wants the type information of how our state looks like
- the `super` function adds a name for the store and the initial state

#### Example

```ts
// todo-store.service.ts
import { Injectable } from '@angular/core';
import { Store } from 'angular-reactive-state';

type TodoStoreState = {
  todos: string[];
};

@Injectable({
  providedIn: 'root',
})
export class TodoStoreService extends Store<TodoStoreState> {
  constructor() {
    super('TodoStore', {
      todos: [],
    });
  }
}
```

### Subscribe the state

The UI components can inject the store service like this:

```ts
constructor(private todoStore: TodoStoreService) {}
```

To subscribe to the state of the todoStore there are different possbilities:

- subscribe to the whole state at once
- subscribe to a specific part of the state

#### Example

```ts
// subscribe to the whole state at once
this.todoStore.state$.subscribe(state => {
  console.log(state); // output: { todos: [] }
});

// subscribe to a specific part of the state
this.todoStore
  .select(state => state.todos)
  .subscribe(todos => {
    console.log(todos); // output: []
  });
```

The `select` method will only trigger an event if the value of the specific property of the state has been changed. In addition the returned values are deep copies of the values in the store, so it is can't cause any reference issues.

### Usage with signals

Since Angular 17, [Signals](https://angular.io/guide/signals#angular-signals) can be used instead of Observables. To achieve this, the function `selectAsSignal` can be used:

```ts
// get a signal of a specific part of the state
const myTodos = this.todoStore.selectAsSignal(state => state.todos);
```

### Get state snapshot

Some operations only require the current state of the store and do not need to get notified about changes. These are cases where a snapshot of the latest state can be very helpful.

#### Example

```ts
// get a part of the state without subscribing to it
console.log(this.todoStore.snapshot.todos); // output: ['my todo']
```

### Change the state

There are two possibilities to update the state in the store:

- update a root-level property of the state
- update the whole state at once

#### Example

```ts
// replace a root-level property of the state with a new value
this.todoStore.updateProperty('todos', ['my first todo']);

// update the whole state at once
this.todoStore.update(state => {
  return {
    ...state,
    todos: [...state.todos, 'my first todo'],
  };
});
```

In combination with the `snapshot` functionality it would also be possible to update the state like this:

```ts
// manipulate the store by using latest values from snapshot
this.todoStore.updateProperty('todos', [
  ...this.todoStore.snapshot.todos,
  'new todo',
]);
```

### Destroy Store

When a store service is not needed anymore it can be destroyed by calling the `destroy` method. This method ensures that no state changes are triggered to the subscribers of the store.

```ts
// store is not triggering events
this.todoStore.destroy();
```
