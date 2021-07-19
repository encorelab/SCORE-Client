import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { Tag } from '../../../../../../app/domain/tag';
import { TagService } from '../../../../services/tagService';

@Component({
  selector: 'delete-group',
  templateUrl: './delete-group.component.html',
  styleUrls: ['./delete-group.component.scss']
})
export class DeleteGroupComponent implements OnInit {
  @Input() group: Tag;
  @Input() members: Set<any>;

  constructor(private dialog: MatDialog, private tagService: TagService) {}

  ngOnInit(): void {}

  deleteGroup() {
    const message = $localize`Are you sure you want to delete this group: ${this.group.name}?\nThe students in this group will still be associated with the run.`;
    if (confirm(message)) {
      if (this.members.size > 0) {
        this.removeMembersFromGroup().subscribe(() => {
          this.deleteAndClose();
        });
      } else {
        this.deleteAndClose();
      }
    }
  }

  private removeMembersFromGroup() {
    const removedMembers$: Observable<any>[] = [];
    this.members.forEach((member) => {
      removedMembers$.push(this.tagService.removeWorkgroupTag(member.workgroupId, this.group));
    });
    return forkJoin(removedMembers$);
  }

  private deleteAndClose() {
    this.tagService.deleteRunTag(this.group).subscribe(() => {
      this.dialog.closeAll();
    });
  }
}
