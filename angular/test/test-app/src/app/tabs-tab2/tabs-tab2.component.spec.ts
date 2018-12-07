import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsTab2Component } from './tabs-tab2.component';

describe('TabsTab2Component', () => {
  let component: TabsTab2Component;
  let fixture: ComponentFixture<TabsTab2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsTab2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsTab2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
