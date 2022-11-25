import { Injectable } from '@angular/core';
import { AppState } from '../app.module';
import { Store } from '../shared/store';

@Injectable({
  providedIn: 'root',
})
export class AppstoreService extends Store<AppState> {
  constructor() {
    super({
      a: '',
    });
  }
}
