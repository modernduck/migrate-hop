/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { UploadService } from './upload.service';

describe('Service: Upload', () => {
  beforeEach(() => {
    addProviders([UploadService]);
  });

  it('should ...',
    inject([UploadService],
      (service: UploadService) => {
        expect(service).toBeTruthy();
      }));
});
