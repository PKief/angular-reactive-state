import { Injectable } from '@angular/core';
import { Store } from '../shared/store/store';

export type AppState = {
  a: string;
};

@Injectable({
  providedIn: 'root',
})
export class AppstoreService extends Store<AppState> {
  constructor() {
    super('AppStore', {
      a: '',
    });
  }
}
