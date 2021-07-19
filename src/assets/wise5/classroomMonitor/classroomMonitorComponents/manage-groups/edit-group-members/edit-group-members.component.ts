import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'edit-group-members',
  templateUrl: './edit-group-members.component.html',
  styleUrls: ['./edit-group-members.component.scss']
})
export class EditGroupMembersComponent {
  @Input() membersInGroup: Set<any> = new Set();
  @Input() membersNotInGroup: Set<any> = new Set();
  @Output() addMemberEvent = new EventEmitter();
  @Output() deleteMemberEvent = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
