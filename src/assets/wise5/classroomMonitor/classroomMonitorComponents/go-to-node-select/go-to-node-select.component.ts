import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tag } from '../../../../../app/domain/tag';
import { Project } from '../../../../../app/domain/project';
import { Run } from '../../../../../app/domain/run';
import { Workgroup } from '../../../../../app/domain/workgroup';
import { ProjectService } from '../../../services/projectService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';

@Component({
  selector: 'app-go-to-node-select',
  templateUrl: './go-to-node-select.component.html',
  styleUrls: ['./go-to-node-select.component.scss']
})
export class GoToNodeSelectComponent {
  group: Tag;
  period: any;
  run: Run;
  stepNodes: any[] = [];
  workgroup: Workgroup;
  displayedColumns: string[] = ['stepName'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService,
    private websocketService: TeacherWebSocketService
  ) {
    const project = new Project();
    project.setContent(this.projectService.project);
    for (const nodeInOrder of project.idToOrder.nodes) {
      if (nodeInOrder.node.type !== 'group') {
        nodeInOrder.stepNumber = this.projectService.getNodePositionById(nodeInOrder.node.id);
        this.stepNodes.push(nodeInOrder);
      }
    }
    this.workgroup = data.workgroup;
    this.period = data.period;
    this.group = data.group;
  }

  sendToNode(node: any) {
    if (this.workgroup != null) {
      this.websocketService.sendWorkgroupToNode(this.workgroup.id, node.id);
    } else if (this.period != null) {
      this.websocketService.sendPeriodToNode(this.period.id, node.id);
    } else {
      this.websocketService.sendGroupToNode(this.group, node.id);
    }
  }
}
