import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { Tag } from '../../../../../../app/domain/tag';
import { TagService } from '../../../../services/tagService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherDataServiceMock } from '../edit-group-dialog/edit-group-dialog.component.spec';

import { ManageGroupComponent } from './manage-group.component';

export class TagServiceMock {
  private tagChangedSource = new Subject<Tag>();
  tagChanged$ = this.tagChangedSource.asObservable();
  retrieveWorkgroupsWithTag() {
    return of([]);
  }
}

describe('ManageGroupComponent', () => {
  let component: ManageGroupComponent;
  let fixture: ComponentFixture<ManageGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageGroupComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: TagService, useClass: TagServiceMock },
        { provide: TeacherDataService, useClass: TeacherDataServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupComponent);
    component = fixture.componentInstance;
    component.group = { id: 1, name: 'group1' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
