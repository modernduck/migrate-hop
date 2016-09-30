/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { PaymentService } from './payment.service';

describe('Service: Payment', () => {
  beforeEach(() => {
    addProviders([PaymentService]);
  });

  it('should ...',
    inject([PaymentService],
      (service: PaymentService) => {
        expect(service).toBeTruthy();
      }));
});
