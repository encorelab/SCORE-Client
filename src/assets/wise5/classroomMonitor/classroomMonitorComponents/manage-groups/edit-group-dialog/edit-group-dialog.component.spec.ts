import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { TagService } from '../../../../services/tagService';
import { TeacherDataService } from '../../../../services/teacherDataService';

import { EditGroupDialogComponent } from './edit-group-dialog.component';

export class ConfigServiceMock {
  getClassmateUserInfos() {
    return [];
  }
}

export class TagServiceMock {}

export class TeacherDataServiceMock {
  getCurrentPeriodId() {
    return 1;
  }
}

describe('EditGroupDialogComponent', () => {
  let component: EditGroupDialogComponent;
  let fixture: ComponentFixture<EditGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditGroupDialogComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { group: {}, workgroups: [] } },
        { provide: ConfigService, useClass: ConfigServiceMock },
        { provide: TagService, useClass: TagServiceMock },
        { provide: TeacherDataService, useClass: TeacherDataServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
