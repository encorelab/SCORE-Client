import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { TagService } from '../../../../services/tagService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import {
  ConfigServiceMock,
  TagServiceMock,
  TeacherDataServiceMock
} from '../edit-group-dialog/edit-group-dialog.component.spec';

import { CreateGroupDialogComponent } from './create-group-dialog.component';

describe('CreateGroupDialogComponent', () => {
  let component: CreateGroupDialogComponent;
  let fixture: ComponentFixture<CreateGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateGroupDialogComponent],
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
    fixture = TestBed.createComponent(CreateGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
