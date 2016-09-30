/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { CourseService } from './course.service';

describe('Service: Course', () => {
  beforeEach(() => {
    addProviders([CourseService]);
  });

  it('should ...',
    inject([CourseService],
      (service: CourseService) => {
        expect(service).toBeTruthy();
      }));
});
