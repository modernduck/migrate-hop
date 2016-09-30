/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { NotificationsService } from './notifications.service';

describe('Service: Notifications', () => {
  beforeEach(() => {
    addProviders([NotificationsService]);
  });

  it('should ...',
    inject([NotificationsService],
      (service: NotificationsService) => {
        expect(service).toBeTruthy();
      }));
});
