import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppstoreService } from './services/appstore.service';
import { FeaturestoreService } from './services/featurestore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'angular-store-concept';
  readonly a$: Observable<string>;
  readonly feature$: Observable<string>;
  a: string | undefined;

  constructor(
    private store: AppstoreService,
    private featureStore: FeaturestoreService
  ) {
    this.a$ = store.select(state => state.a);
    this.feature$ = featureStore.select(state => state.b);
    this.store.updateProperty('a', 'b');
    this.featureStore.updateProperty('b', 'feature');
  }

  changeState() {
    // this.store.updateProperty('a', Math.random().toString());
    this.featureStore.updateProperty('b', Math.random().toString());
    this.store.update(state => {
      return {
        ...state,
        a: Math.random().toString(),
      };
    });
  }
}
