import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoveGroupMembersComponent } from './move-group-members.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MoveGroupMembersComponent', () => {
  let component: MoveGroupMembersComponent;
  let fixture: ComponentFixture<MoveGroupMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoveGroupMembersComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveGroupMembersComponent);
    component = fixture.componentInstance;
    component.group = { id: 1, name: 'group1', membersInGroup: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
