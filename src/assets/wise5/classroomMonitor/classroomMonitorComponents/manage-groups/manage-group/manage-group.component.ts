import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tag } from '../../../../../../app/domain/tag';
import { TagService } from '../../../../services/tagService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { EditGroupDialogComponent } from '../edit-group-dialog/edit-group-dialog.component';

@Component({
  selector: 'manage-group',
  templateUrl: './manage-group.component.html',
  styleUrls: ['./manage-group.component.scss']
})
export class ManageGroupComponent {
  @Input() group: Tag;

  workgroups: Set<any> = new Set<any>();

  constructor(
    private tagService: TagService,
    protected teacherDataService: TeacherDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initWorkgroups();
    this.tagService.tagChanged$.subscribe((tag: Tag) => {
      if (tag.id === this.group.id) {
        this.initWorkgroups();
      }
    });
  }

  initWorkgroups(): void {
    this.tagService.retrieveWorkgroupsWithTag(this.group).subscribe((workgroups: any[]) => {
      const currentPeriodId = this.teacherDataService.getCurrentPeriodId();
      this.workgroups = new Set(
        workgroups.filter((workgroup) => {
          return workgroup.periodId === currentPeriodId;
        })
      );
    });
  }

  editGroup() {
    this.dialog.open(EditGroupDialogComponent, {
      data: {
        group: this.group,
        workgroups: this.workgroups
      },
      panelClass: 'mat-dialog--md'
    });
  }
}
