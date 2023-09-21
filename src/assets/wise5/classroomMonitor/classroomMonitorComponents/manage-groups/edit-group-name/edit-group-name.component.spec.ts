import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupNameComponent } from './edit-group-name.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EditGroupNameComponent', () => {
  let component: EditGroupNameComponent;
  let fixture: ComponentFixture<EditGroupNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditGroupNameComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroupNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
