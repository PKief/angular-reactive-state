import { TestBed } from '@angular/core/testing';

import { StoreRegistryService } from './store-registry.service';

describe('StoreRegistryService', () => {
  let service: StoreRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
