import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoveGroupMembersComponent } from './move-group-members.component';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';

describe('MoveGroupMembersComponent', () => {
  let component: MoveGroupMembersComponent;
  let fixture: ComponentFixture<MoveGroupMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoveGroupMembersComponent],
      imports: [DragDropModule, MatIconModule]
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
