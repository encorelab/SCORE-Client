import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { User } from '../../domain/user';
import { AddProjectDialogComponent } from '../add-project-dialog/add-project-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.scss']
})
export class StudentHomeComponent implements OnInit {
  ckBoardUrl: string;
  user: User = new User();

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getUser();
    this.ckBoardUrl = this.configService.getCkBoardUrl();
  }

  getUser() {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  showAddRun() {
    this.dialog.open(AddProjectDialogComponent);
  }
}
