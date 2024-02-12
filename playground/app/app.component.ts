import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  effect,
} from '@angular/core';
import { StateDevToolsModule } from 'angular-reactive-state/dev-tools';
import { Todo } from './todo';
import { TodoStoreService } from './todo-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StateDevToolsModule],
  standalone: true,
})
export class AppComponent {
  readonly todos$: Signal<Todo[]>;

  constructor(private todoStore: TodoStoreService) {
    this.todos$ = this.todoStore.selectAsSignal(state => state.todos);

    effect(() => {
      this.todos$().sort((a, b) =>
        a.completed === b.completed ? 0 : a.completed ? 1 : -1
      );
    });
  }

  addTodo(description: string) {
    this.todoStore.addTodo(description);
  }

  removeTodo(todo: Todo) {
    this.todoStore.removeTodo(todo);
  }

  toggleTodo(todo: Todo) {
    if (todo.completed) {
      this.todoStore.uncompleteTodo(todo);
    } else {
      this.todoStore.completeTodo(todo);
    }
  }
}
