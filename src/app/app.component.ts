import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppstoreService } from './services/appstore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-store-concept';
  readonly a$: Observable<string>;

  constructor(private store: AppstoreService) {
    this.a$ = store.select((state) => state.a);
    this.store.changeProperty('a', 'b');
  }
}
