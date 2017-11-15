import { TestBed, async } from '@angular/core/testing';

import { RouterOutletStubComponent } from '../../testing/router-stubs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach( async(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent, RouterOutletStubComponent]
      }).compileComponents();
    })
  );

  it('should create the app', async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    })
  );
});
