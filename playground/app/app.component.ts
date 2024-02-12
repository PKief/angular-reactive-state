import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
} from '@angular/core';
import { Todo, TodoStoreService } from './services/todo-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly completedTodos$: Signal<Todo[]>;
  readonly uncompletedTodos$: Signal<Todo[]>;

  constructor(private todoStore: TodoStoreService) {
    const allTodos$ = this.todoStore.selectAsSignal(state => state.todos);

    this.completedTodos$ = computed(() =>
      allTodos$()?.filter(t => t.completed)
    );
    this.uncompletedTodos$ = computed(() =>
      allTodos$()?.filter(t => !t.completed)
    );
  }

  addTodo(description: string) {
    this.todoStore.addTodo(description);
  }

  completeTodo(todo: Todo) {
    this.todoStore.completeTodo(todo);
  }

  uncompleteTodo(todo: Todo) {
    this.todoStore.uncompleteTodo(todo);
  }
}
