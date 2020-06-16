import { TestBed } from '@angular/core/testing';

import { ConfirmationBoxService } from './confirmation-box.service';

describe('ConfirmationBoxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfirmationBoxService = TestBed.get(ConfirmationBoxService);
    expect(service).toBeTruthy();
  });
});
