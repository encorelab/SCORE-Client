import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { TagService } from '../../../../services/tagService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { AddRemoveTag } from './AddRemoveTag';

@Component({
  selector: 'move-group-members-dialog',
  templateUrl: './move-group-members-dialog.component.html',
  styleUrls: ['./move-group-members-dialog.component.scss']
})
export class MoveGroupMembersDialogComponent implements OnInit {
  isDirty: boolean;
  isProcessing: boolean;
  groups: any[] = [];
  unassignedGroup: any = { name: 'Unassigned', membersInGroup: [] };
  selectedGroups = [];

  constructor(
    private configService: ConfigService,
    private dialog: MatDialog,
    protected tagService: TagService,
    protected teacherDataService: TeacherDataService
  ) {}

  ngOnInit(): void {
    this.tagService.retrieveRunTags().subscribe(() => {
      this.groups = Object.assign(this.groups, this.tagService.tags);
      this.groups.map((group) => this.initWorkgroups(group));
    });
  }

  initWorkgroups(group: any): void {
    this.tagService.retrieveWorkgroupsWithTag(group).subscribe((workgroups: any[]) => {
      group.workgroups = workgroups.filter((workgroup) => this.filterCurrentPeriod(workgroup));
      this.initializeMembers(group);
    });
  }

  initializeMembers(group: any): void {
    group.membersNotInGroup = this.getSortedWorkgroupsInPeriod();
    group.membersInGroup = [];
    group.workgroups.forEach((memberInGroup) => {
      this.moveMembersBetweenGroups(group, memberInGroup);
    });
    group.membersInGroupOriginal = Array.from(group.membersInGroup);
  }

  protected getSortedWorkgroupsInPeriod(): any[] {
    return this.getSortedWorkgroupsInRun()
      .map((workgroup) => this.setDisplayNames(workgroup))
      .filter((workgroup) => this.filterCurrentPeriod(workgroup));
  }

  private getSortedWorkgroupsInRun(): any[] {
    return this.configService.getClassmateUserInfos().sort((a, b) => {
      return a.workgroupId - b.workgroupId;
    });
  }

  private setDisplayNames(workgroup: any): any {
    workgroup.displayNames = this.configService.getDisplayUsernamesByWorkgroupId(
      workgroup.workgroupId
    );
    return workgroup;
  }

  private filterCurrentPeriod(workgroup: any): boolean {
    return workgroup.periodId === this.teacherDataService.getCurrentPeriodId();
  }

  private moveMembersBetweenGroups(group, memberInGroup: any): void {
    group.membersNotInGroup.forEach((memberNotInGroup) => {
      if (memberNotInGroup.workgroupId === memberInGroup.id) {
        group.membersInGroup.push(memberNotInGroup);
      }
    });
  }

  selectGroup(): void {
    this.selectedGroups = this.groups.filter((group) => group.isSelected);
    this.updateUnassignedGroup();
  }

  private updateUnassignedGroup(): void {
    this.unassignedGroup.membersInGroup = this.getAllUnassignedMembersInSelectedGroups();
  }

  private getAllUnassignedMembersInSelectedGroups(): any[] {
    const unassignedMembers = [];
    const membersInSelectedGroups = this.getAllMembersInSelectedGroups();
    this.selectedGroups.forEach((group) => {
      group.membersNotInGroup.forEach((memberNotInGroup) => {
        if (
          !membersInSelectedGroups.some((member) => {
            return member.workgroupId === memberNotInGroup.workgroupId;
          })
        ) {
          unassignedMembers.push(memberNotInGroup);
        }
      });
    });
    return this.removeDuplicates(unassignedMembers);
  }

  shuffleBetweenSelectedGroups(): void {
    const allMembersInSelectedGroups = this.removeDuplicates(
      this.getAllMembersInSelectedGroups().concat(this.unassignedGroup.membersInGroup)
    );
    this.clearMembersInSelectedGroups();
    this.clearUnassignedGroupMembers();
    const allMembersInSelectedGroupsShuffled = this.shuffleArray(allMembersInSelectedGroups);
    allMembersInSelectedGroupsShuffled.forEach((memberInSelectedGroups, i) => {
      this.selectedGroups[i % this.selectedGroups.length].membersInGroup.push(
        memberInSelectedGroups
      );
    });
    this.isDirty = true;
  }

  private getAllMembersInSelectedGroups(): any[] {
    const membersInSelectedGroups = [];
    this.selectedGroups.forEach((group) =>
      group.membersInGroup.forEach((memberInGroup) => membersInSelectedGroups.push(memberInGroup))
    );
    return membersInSelectedGroups;
  }

  private removeDuplicates(groups: any[]): any[] {
    const uniqueGroups = new Set();
    groups.forEach((group) => uniqueGroups.add(group));
    return Array.from(uniqueGroups);
  }

  private clearMembersInSelectedGroups(): void {
    this.selectedGroups.forEach((group) => {
      group.membersInGroup = [];
    });
  }

  private clearUnassignedGroupMembers(): void {
    this.unassignedGroup.membersInGroup = [];
  }

  // https://stackoverflow.com/a/2450976/4970939
  // Uses Fisher-Yates shuffle https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  private shuffleArray(array: any[]): any[] {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  saveChanges(): void {
    this.isProcessing = true;
    const addRemoveTags = this.groups.map((group) => new AddRemoveTag(group));
    this.tagService.addRemoveTagsFromWorkgroups(addRemoveTags).subscribe(() => {
      this.emitTagChanges(addRemoveTags);
      this.isProcessing = false;
      this.dialog.closeAll();
    });
  }

  private emitTagChanges(addRemoveTags: AddRemoveTag[]): void {
    addRemoveTags.forEach((addRemoveTag) => {
      if (addRemoveTag.hasAnyChanges()) {
        this.tagService.emitTagChanged(addRemoveTag.tag);
      }
    });
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.isDirty = true;
      this.updateUnassignedGroup();
    }
  }

  memberRemoved(): void {
    this.isDirty = true;
    this.updateUnassignedGroup();
  }
}
