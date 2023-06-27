import { TestBed } from '@angular/core/testing';

import { HelpInterceptor } from './help.interceptor';

describe('HelpInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HelpInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HelpInterceptor = TestBed.inject(HelpInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
