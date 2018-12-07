import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsTab1Component } from './tabs-tab1.component';

describe('TabsTab1Component', () => {
  let component: TabsTab1Component;
  let fixture: ComponentFixture<TabsTab1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsTab1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsTab1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
