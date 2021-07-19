import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ConfigService } from '../../../../services/configService';
import { TagService } from '../../../../services/tagService';
import { TeacherDataService } from '../../../../services/teacherDataService';

@Component({
  selector: 'edit-group-dialog',
  templateUrl: './edit-group-dialog.component.html',
  styleUrls: ['./edit-group-dialog.component.scss']
})
export class EditGroupDialogComponent {
  group: any;
  groupNameForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });
  isProcessing: boolean;
  isShowSavedMessage: boolean;
  membersInGroup: Set<any> = new Set();
  membersNotInGroup: Set<any> = new Set();

  constructor(
    protected dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) protected data: any,
    protected configService: ConfigService,
    protected tagService: TagService,
    protected teacherDataService: TeacherDataService
  ) {}

  ngOnInit(): void {
    this.group = this.data.group;
    this.groupNameForm.controls['name'].setValue(this.data.group.name);
    this.groupNameForm.controls['name'].valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((name: string) => {
        if (name.length > 0) {
          this.saveName(name);
        }
      });
    this.initializeMembers();
  }

  initializeMembers() {
    this.membersNotInGroup = this.getSortedWorkgroupsInPeriod();
    for (const memberInGroup of this.data.workgroups) {
      this.moveMembersBetweenGroups(memberInGroup);
    }
  }

  private moveMembersBetweenGroups(memberInGroup: any) {
    this.membersNotInGroup.forEach((memberNotInGroup) => {
      if (memberNotInGroup.workgroupId === memberInGroup.id) {
        this.membersInGroup.add(memberNotInGroup);
        this.membersNotInGroup.delete(memberNotInGroup);
      }
    });
  }

  protected getSortedWorkgroupsInPeriod() {
    const currentPeriodId = this.teacherDataService.getCurrentPeriodId();
    const sortedWorkgroupsInPeriod = new Set<any>();
    for (const workgroup of this.getSortedWorkgroupsInRun()) {
      if (workgroup.periodId === currentPeriodId) {
        workgroup.displayNames = this.configService.getDisplayUsernamesByWorkgroupId(
          workgroup.workgroupId
        );
        sortedWorkgroupsInPeriod.add(workgroup);
      }
    }
    return sortedWorkgroupsInPeriod;
  }

  private getSortedWorkgroupsInRun() {
    return this.configService.getClassmateUserInfos().sort((a, b) => {
      return a.workgroupId - b.workgroupId;
    });
  }

  saveName(name: string) {
    this.isShowSavedMessage = false;
    this.isProcessing = true;
    this.group.name = name;
    this.tagService.updateRunTag(this.group).subscribe(() => {
      this.showSavedMessage();
    });
  }

  addMember(member: any) {
    this.membersNotInGroup.delete(member);
    this.addMemberToGroup(member);
  }

  addMemberToGroup(member: any) {
    this.isProcessing = true;
    this.tagService.addWorkgroupTag(member.workgroupId, this.group).subscribe(() => {
      this.membersInGroup.add(member);
      this.tagService.emitTagChanged(this.group);
      this.showSavedMessage();
    });
  }

  deleteMember(member: any) {
    this.deleteMemberFromGroup(member);
    this.membersNotInGroup.add(member);
  }

  deleteMemberFromGroup(member: any) {
    this.isProcessing = true;
    this.tagService.removeWorkgroupTag(member.workgroupId, this.group).subscribe(() => {
      this.membersInGroup.delete(member);
      this.tagService.emitTagChanged(this.group);
      this.showSavedMessage();
    });
  }

  private showSavedMessage() {
    this.isProcessing = false;
    this.isShowSavedMessage = true;
  }
}
