import { NgModule } from '@angular/core';
import { CreateGroupDialogComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manage-groups/create-group-dialog/create-group-dialog.component';
import { CreateGroupComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manage-groups/create-group/create-group.component';
import { DeleteGroupComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manage-groups/delete-group/delete-group.component';
import { EditGroupDialogComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manage-groups/edit-group-dialog/edit-group-dialog.component';
import { EditGroupMembersComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manage-groups/edit-group-members/edit-group-members.component';
import { EditGroupNameComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manage-groups/edit-group-name/edit-group-name.component';
import { ListGroupsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manage-groups/list-groups/list-groups.component';
import { ManageGroupComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manage-groups/manage-group/manage-group.component';
import { ManageGroupsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manage-groups/manage-groups/manage-groups.component';
import { AngularJSModule } from '../common-hybrid-angular.module';

@NgModule({
  declarations: [
    CreateGroupComponent,
    CreateGroupDialogComponent,
    DeleteGroupComponent,
    EditGroupDialogComponent,
    EditGroupMembersComponent,
    EditGroupNameComponent,
    ListGroupsComponent,
    ManageGroupComponent,
    ManageGroupsComponent
  ],
  imports: [AngularJSModule]
})
export class ManageGroupsModule {}
