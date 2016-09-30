/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { GroupService } from './group.service';

describe('Service: Group', () => {
  beforeEach(() => {
    addProviders([GroupService]);
  });

  it('should ...',
    inject([GroupService],
      (service: GroupService) => {
        expect(service).toBeTruthy();
      }));
});
