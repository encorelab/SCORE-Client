import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { MoveGroupMembersButtonComponent } from './move-group-members-button.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MoveGroupMembersButtonComponent', () => {
  let component: MoveGroupMembersButtonComponent;
  let fixture: ComponentFixture<MoveGroupMembersButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoveGroupMembersButtonComponent],
      imports: [MatDialogModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveGroupMembersButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
