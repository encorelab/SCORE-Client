import { Component } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { Tag } from '../../../../../../app/domain/tag';
import { EditGroupDialogComponent } from '../edit-group-dialog/edit-group-dialog.component';

@Component({
  selector: 'app-create-group-dialog',
  templateUrl: './create-group-dialog.component.html',
  styleUrls: ['./create-group-dialog.component.scss']
})
export class CreateGroupDialogComponent extends EditGroupDialogComponent {
  ngOnInit(): void {
    this.membersNotInGroup = this.getSortedWorkgroupsInPeriod();
  }

  saveChanges() {
    this.isProcessing = true;
    this.tagService
      .createRunTag(this.groupNameForm.controls['name'].value)
      .subscribe((tag: Tag) => {
        if (this.membersInGroup.size > 0) {
          this.addMembersToGroup(tag).subscribe(() => {
            this.updateTagAndClose(tag);
          });
        } else {
          this.updateTagAndClose(tag);
        }
      });
  }

  private addMembersToGroup(tag: Tag) {
    const tagAdded$: Observable<any>[] = [];
    this.membersInGroup.forEach((member) => {
      tagAdded$.push(this.tagService.addWorkgroupTag(member.workgroupId, tag));
    });
    return forkJoin(tagAdded$);
  }

  private updateTagAndClose(tag: Tag) {
    this.tagService.tags.push(tag);
    this.isProcessing = false;
    this.dialog.closeAll();
  }

  addMemberToGroup(member: any) {
    this.membersInGroup.add(member);
  }

  deleteMemberFromGroup(member: any) {
    this.membersInGroup.delete(member);
  }
}
