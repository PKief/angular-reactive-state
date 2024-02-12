import { Injectable } from '@angular/core';
import { Store } from 'angular-reactive-state/public-api';
import { Todo } from './todo';

export type TodoStoreState = {
  todos: Todo[];
};

@Injectable({
  providedIn: 'root',
})
export class TodoStoreService extends Store<TodoStoreState> {
  constructor() {
    super('TodoStore', { todos: [] });
  }

  addTodo(description: string) {
    this.update(
      state => ({
        ...state,
        todos: [
          ...state.todos,
          { description, completed: false, id: String(state.todos.length) },
        ],
      }),
      'add todo'
    );
  }

  removeTodo(todo: Todo) {
    this.update(
      state => ({
        ...state,
        todos: state.todos.filter(t => t.id !== todo.id),
      }),
      'remove todo'
    );
  }

  completeTodo(todo: Todo) {
    this.update(
      state => ({
        ...state,
        todos: state.todos.map(t => {
          if (t.id === todo.id) {
            t.completed = true;
          }
          return t;
        }),
      }),
      'complete todo'
    );
  }

  uncompleteTodo(todo: Todo) {
    this.update(
      state => ({
        ...state,
        todos: state.todos.map(t => {
          if (t.id === todo.id) {
            t.completed = false;
          }
          return t;
        }),
      }),
      'uncomplete todo'
    );
  }
}
