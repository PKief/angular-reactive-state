import { TestBed } from '@angular/core/testing';

import { FeaturestoreService } from './featurestore.service';

describe('FeaturestoreService', () => {
  let service: FeaturestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeaturestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
