import { TestBed } from '@angular/core/testing';

import { ShareObjectService } from './share-object.service';

describe('ShareObjectService', () => {
  let service: ShareObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareObjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
