import { TestBed, inject } from '@angular/core/testing';

import { PostTestService } from './post-test.service';

describe('PostTestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostTestService]
    });
  });

  it('should be created', inject([PostTestService], (service: PostTestService) => {
    expect(service).toBeTruthy();
  }));
});
