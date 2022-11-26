import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from './store';

export type StoreRegistry = Record<string, Store<object>>;

@Injectable({
  providedIn: 'root',
})
export class StoreRegistryService {
  private registry$: BehaviorSubject<StoreRegistry> = new BehaviorSubject({});
  stores$: Observable<StoreRegistry> = this.registry$.asObservable();

  addStore(name: string, storeInstance: Store<object>) {
    this.registry$.next({
      ...this.registry$.getValue(),
      [name]: storeInstance,
    });
  }

  deleteStore(name: string) {
    const stores = this.registry$.getValue();
    delete stores[name];
    this.registry$.next(stores);
  }
}
