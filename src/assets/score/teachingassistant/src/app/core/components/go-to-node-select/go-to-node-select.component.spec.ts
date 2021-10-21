import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../../../../../../../wise5/services/projectService';
import { TeacherWebSocketService } from '../../../../../../../wise5/services/teacherWebSocketService';

import { GoToNodeSelectComponent } from './go-to-node-select.component';

class ProjectServiceMock {
    project = {
        startGroupId: 'group0',
        nodes: [{ id: 'group0' }],
        inactiveNodes: [],
    };
    getNodePositionById() {
        return '1';
    }
}

describe('GoToNodeSelectComponent', () => {
    let component: GoToNodeSelectComponent;
    let fixture: ComponentFixture<GoToNodeSelectComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        run: { project: { idToOrder: { nodes: [] } } },
                    },
                },
                { provide: ProjectService, useClass: ProjectServiceMock },
                { provide: TeacherWebSocketService, useValue: {} },
            ],
            declarations: [GoToNodeSelectComponent],
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
