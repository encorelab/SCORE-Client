import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeacherWebSocketService } from '../../../../../../../../assets/wise5/services/teacherWebSocketService';
import { Run } from '../../../../../../../../app/domain/run';
import { Workgroup } from '../../../../../../../../app/domain/workgroup';

@Component({
    selector: 'app-go-to-node-select',
    templateUrl: './go-to-node-select.component.html',
    styleUrls: ['./go-to-node-select.component.scss'],
})
export class GoToNodeSelectComponent implements OnInit {
    run: Run;
    stepNodes: any[] = [];
    period: any;
    workgroup: Workgroup;
    displayedColumns: string[] = ['stepName'];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private websocketService: TeacherWebSocketService,
    ) {
        this.run = data.run;
        for (const nodeInOrder of this.run.project.idToOrder.nodes) {
            if (nodeInOrder.node.type !== 'group') {
                this.stepNodes.push(nodeInOrder);
            }
        }
        this.workgroup = data.workgroup;
        this.period = data.period;
    }

    ngOnInit() {}

    sendToNode(node: any) {
        if (this.workgroup != null) {
            this.websocketService.sendWorkgroupToNode(
                this.workgroup.id,
                node.id,
            );
        } else {
            this.websocketService.sendPeriodToNode(this.period.id, node.id);
        }
    }
}
