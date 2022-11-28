import { Injectable } from '@angular/core';
import { Store } from 'angular-state/public-api';

export type Todo = {
  id: string;
  description: string;
  completed: boolean;
};

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
    this.update(state => ({
      ...state,
      todos: [
        ...state.todos,
        { description, completed: false, id: String(state.todos.length) },
      ],
    }));
  }

  completeTodo(todo: Todo) {
    this.update(state => ({
      ...state,
      todos: state.todos.map(t => {
        if (t.id === todo.id) {
          t.completed = true;
        }
        return t;
      }),
    }));
  }

  uncompleteTodo(todo: Todo) {
    this.update(state => ({
      ...state,
      todos: state.todos.map(t => {
        if (t.id === todo.id) {
          t.completed = false;
        }
        return t;
      }),
    }));
  }
}
