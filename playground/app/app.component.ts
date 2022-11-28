import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Todo, TodoStoreService } from './services/todo-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly completedTodos$: Observable<Todo[]>;
  readonly uncompletedTodos$: Observable<Todo[]>;

  constructor(private todoStore: TodoStoreService) {
    const allTodos$ = this.todoStore.select(state => state.todos);
    this.completedTodos$ = allTodos$.pipe(
      map(todos => todos.filter(t => !!t.completed))
    );
    this.uncompletedTodos$ = allTodos$.pipe(
      map(todos => todos.filter(t => !t.completed))
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
