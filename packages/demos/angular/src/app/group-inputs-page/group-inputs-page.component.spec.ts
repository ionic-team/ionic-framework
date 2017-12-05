import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { GroupInputsPageComponent } from './group-inputs-page.component';
import { SharedModule } from '../shared/shared.module';

describe('GroupInputsPageComponent', () => {
  let component: GroupInputsPageComponent;
  let fixture: ComponentFixture<GroupInputsPageComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, SharedModule],
        declarations: [GroupInputsPageComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupInputsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
