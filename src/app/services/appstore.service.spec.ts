import { TestBed } from '@angular/core/testing';

import { AppstoreService } from './appstore.service';

describe('AppstoreService', () => {
  let service: AppstoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppstoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
