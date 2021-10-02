import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MoveGroupMembersDialogComponent } from '../move-group-members-dialog/move-group-members-dialog.component';

@Component({
  selector: 'move-group-members-button',
  templateUrl: './move-group-members-button.component.html',
  styleUrls: ['./move-group-members-button.component.scss']
})
export class MoveGroupMembersButtonComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openMoveGroupMembersDialog() {
    this.dialog.open(MoveGroupMembersDialogComponent, {
      panelClass: 'mat-dialog--md'
    });
  }
}
