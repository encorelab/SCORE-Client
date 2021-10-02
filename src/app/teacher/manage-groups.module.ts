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
import { MoveGroupMembersButtonComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manage-groups/move-group-members-button/move-group-members-button.component';
import { MoveGroupMembersDialogComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manage-groups/move-group-members-dialog/move-group-members-dialog.component';
import { MoveGroupMembersComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manage-groups/move-group-members/move-group-members.component';
import { MoveGroupToNodeComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manage-groups/move-group-to-node/move-group-to-node.component';
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
    ManageGroupsComponent,
    MoveGroupMembersComponent,
    MoveGroupMembersButtonComponent,
    MoveGroupMembersDialogComponent,
    MoveGroupToNodeComponent
  ],
  imports: [AngularJSModule]
})
export class ManageGroupsModule {}
