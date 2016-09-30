/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { CheckinService } from './checkin.service';

describe('Service: Checkin', () => {
  beforeEach(() => {
    addProviders([CheckinService]);
  });

  it('should ...',
    inject([CheckinService],
      (service: CheckinService) => {
        expect(service).toBeTruthy();
      }));
});
