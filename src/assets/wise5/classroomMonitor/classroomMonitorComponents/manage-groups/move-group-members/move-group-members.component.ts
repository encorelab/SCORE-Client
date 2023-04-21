import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'move-group-members',
  templateUrl: './move-group-members.component.html',
  styleUrls: ['./move-group-members.component.scss']
})
export class MoveGroupMembersComponent implements OnInit {
  @Input() group: any;
  @Output() dropped = new EventEmitter();
  @Output() removed = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  canDrop(drag: CdkDrag, drop: CdkDropList): boolean {
    return !drop.data.some((workgroup) => workgroup.workgroupId === drag.data.workgroupId);
  }

  removeFromGroup(index: number) {
    this.group.membersInGroup.splice(index, 1);
    this.removed.next();
  }

  removeAllMembersFromGroup(): void {
    this.group.membersInGroup = [];
    this.removed.next();
  }
}
