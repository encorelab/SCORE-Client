import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoToNodeSelectComponent } from './go-to-node-select.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProjectService } from '../../../services/projectService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';

class MockProjectService {
  project = { startGroupId: 'group0', nodes: [], inactiveNodes: [] };
}

class MockService {}

xdescribe('GoToNodeSelectComponent', () => {
  let component: GoToNodeSelectComponent;
  let fixture: ComponentFixture<GoToNodeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoToNodeSelectComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: ProjectService, useClass: MockProjectService },
        { provide: TeacherWebSocketService, useClass: MockService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoToNodeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
