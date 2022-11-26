import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
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
  state: any;

  constructor(
    private store: AppstoreService,
    private featureStore: FeaturestoreService
  ) {
    this.a$ = store.select((state) => state.a);
    this.feature$ = featureStore.select((state) => state.b);
    this.store.changeProperty('a', 'b');
    this.featureStore.changeProperty('b', 'feature');
  }

  changeState() {
    // this.store.changeProperty('a', Math.random().toString());
    // this.featureStore.changeProperty('b', Math.random().toString());
    this.store.dispatchAction('monitor', (state) => {
      return {
        ...state,
        a: Math.random().toString(),
      };
    });
  }
}
