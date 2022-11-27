import { Injectable } from '@angular/core';
import { Store } from 'angular-state/store';

@Injectable({
  providedIn: 'root',
})
export class FeaturestoreService extends Store<{ b: string }> {
  constructor() {
    super('FeatureStore', {
      b: '',
    });
  }
}