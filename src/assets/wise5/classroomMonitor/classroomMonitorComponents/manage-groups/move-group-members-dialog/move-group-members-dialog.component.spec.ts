import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveGroupMembersDialogComponent } from './move-group-members-dialog.component';

describe('MoveGroupMembersDialogComponent', () => {
  let component: MoveGroupMembersDialogComponent;
  let fixture: ComponentFixture<MoveGroupMembersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveGroupMembersDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveGroupMembersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
