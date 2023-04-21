import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tag } from '../../../../../../app/domain/tag';
import { GoToNodeSelectComponent } from '../../go-to-node-select/go-to-node-select.component';
import { ConfigService } from '../../../../services/configService';

@Component({
  selector: 'move-group-to-node',
  templateUrl: './move-group-to-node.component.html',
  styleUrls: ['./move-group-to-node.component.scss']
})
export class MoveGroupToNodeComponent {
  @Input() group: Tag;

  constructor(private configService: ConfigService, private dialog: MatDialog) {}

  chooseNodeToSend() {
    this.dialog.open(GoToNodeSelectComponent, {
      minWidth: '600px',
      maxHeight: '800px',
      data: { group: this.group, runId: this.configService.getRunId() },
      panelClass: 'mat-dialog--md'
    });
  }
}
