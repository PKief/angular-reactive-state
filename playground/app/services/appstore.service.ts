import { Injectable } from '@angular/core';
import { Store } from 'angular-state/store';

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
