/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('Service: Cart', () => {
  beforeEach(() => {
    addProviders([CartService]);
  });

  it('should ...',
    inject([CartService],
      (service: CartService) => {
        expect(service).toBeTruthy();
      }));
});
