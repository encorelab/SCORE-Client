import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';

@Component({
  selector: 'create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  createGroup() {
    this.dialog.open(CreateGroupDialogComponent, {
      panelClass: 'mat-dialog--md'
    });
  }
}
