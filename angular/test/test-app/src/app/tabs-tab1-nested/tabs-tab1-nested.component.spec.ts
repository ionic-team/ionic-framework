import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsTab1NestedComponent } from './tabs-tab1-nested.component';

describe('TabsTab1NestedComponent', () => {
  let component: TabsTab1NestedComponent;
  let fixture: ComponentFixture<TabsTab1NestedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsTab1NestedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsTab1NestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
