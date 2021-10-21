import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ConfigService } from '../../../../services/configService';
import { TagService } from '../../../../services/tagService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { MoveGroupMembersDialogComponent } from './move-group-members-dialog.component';

class TagServiceMock {
  retrieveRunTags() {
    return of([]);
  }
}
describe('MoveGroupMembersDialogComponent', () => {
  let component: MoveGroupMembersDialogComponent;
  let fixture: ComponentFixture<MoveGroupMembersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoveGroupMembersDialogComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: TagService, useClass: TagServiceMock },
        { provide: ConfigService, useValue: {} },
        { provide: TeacherDataService, useValue: {} }
      ]
    }).compileComponents();
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
