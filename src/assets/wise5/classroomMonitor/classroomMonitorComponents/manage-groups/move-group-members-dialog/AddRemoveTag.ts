import { Tag } from '../../../../../../app/domain/tag';

export class AddRemoveTag {
  tag: Tag;
  workgroupIdsToAdd: number[];
  workgroupIdsToRemove: number[];

  constructor(group: any) {
    this.tag = group;
    this.workgroupIdsToAdd = this.getWorkgroupIdsToAdd(group);
    this.workgroupIdsToRemove = this.getWorkgroupIdsToRemove(group);
  }

  hasAnyChanges(): boolean {
    return this.workgroupIdsToAdd.length + this.workgroupIdsToRemove.length > 0;
  }

  private getWorkgroupIdsToAdd(group: any): number[] {
    const teamsToAdd = this.subtract(group.membersInGroup, group.membersInGroupOriginal);
    return teamsToAdd.map((team) => team.workgroupId);
  }

  private getWorkgroupIdsToRemove(group: any): number[] {
    const teamsToRemove = this.subtract(group.membersInGroupOriginal, group.membersInGroup);
    return teamsToRemove.map((team) => team.workgroupId);
  }

  private subtract(setA: any[], setB: any[]): any[] {
    return setA.filter((element) => !setB.includes(element));
  }
}
