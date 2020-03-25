import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { TaskRequest } from '../../domain/task-request';
import { WebSocketService } from '../../services/websocket/websocket.service';
import { ClassesStore } from '../../../../../../../../../assets/score/teachingassistant/src/app/core/services/storage/classes-store';
import { Period } from '../../../../../../../../../app/domain/period';
import { TeacherService } from '../../../../../../../../../app/teacher/teacher.service';
import { TasksService } from '../../../../../../../../../assets/score/teachingassistant/src/app/core/services/http/tasks.service';

@Component({
  selector: 'app-task-datatable',
  templateUrl: './task-datatable.component.html',
  styleUrls: ['./task-datatable.component.scss']
})
export class TaskDatatableComponent implements OnInit {
  tasksDataSource = new MatTableDataSource<Task>();
  tasksDisplayedColumns = [
    'id',
    'name',
    'workgroupId',
    'periodId',
    'duration',
    'startTime',
    'endTime',
    'timeLeft',
    'active',
    'complete',
    'requests'
  ];
  periods: Period[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private selectionTitle: string;
  private periodName: string;
  runId: number = 0;

  constructor(
    private classesStore: ClassesStore,
    private teacherService: TeacherService,
    private tasksService: TasksService,
    private websocketService: WebSocketService
  ) {}

  ngOnInit() {
    this.websocketService._connect();
    this.tasksDataSource.paginator = this.paginator;
    this.tasksDataSource.sort = this.sort;
    this.refreshRunInformation();
    this.refreshTasks();
    setInterval(() => {
      this.refreshTasks();
    }, 5000);
  }

  resetAttributes() {
    this.tasksDataSource.paginator = this.paginator;
    this.tasksDataSource.sort = this.sort;
  }

  refreshRunInformation() {
    this.runId = this.classesStore.runId;
    this.teacherService.getRun(this.runId).subscribe(
      (run) => {
        this.periods = run.periods;
        this.resetAttributes();
      },
      (err) => console.log('Error retrieving run')
    );
  }

  refreshTasks() {
    if (this.periodName) {
      this.tasksService
        .getTasksByRunIdAndPeriodName(this.runId, this.periodName)
        .subscribe((tasks) => {
          this.tasksDataSource.data = [];
          for (let i = 0; i < tasks.length; i++) {
            let task: Task = tasks[i];
            if (task.complete == false) {
              this.tasksDataSource.data.filter(function (element) {
                return element.id != task.id;
              });
            }
            this.tasksDataSource.data.push(task);
            this.resetAttributes();
          }
        });
    }
  }

  convertTimestamp(timestamp: string) {
    if (timestamp == undefined) return ' ';
    return moment(timestamp).format('MM/DD/YYYY HH:mm');
  }

  periodSelectionChange($event: MatSelectChange) {
    this.periodName = $event.value;
    this.selectionTitle = `for Period ${this.periodName}`;
    this.refreshTasks();
  }

  findTask(taskRequests: TaskRequest[]): string {
    for (let i = 0; i < taskRequests.length; i++) {
      let taskRequest: TaskRequest = taskRequests[i];
      console.log('taskRequest ', taskRequest);
      if (taskRequest.complete == false) {
        return taskRequest.status;
      }
    }
    return 'none';
  }

  calculateTimeLeft(task: Task) {
    if (task.endTime) {
      let now = moment();
      let end = moment(task.endTime);

      var duration = end.diff(now);
      // console.log('DIFFF', duration);
    }
  }

  taskRequestCompleteAction(taskRequest: TaskRequest, status: string) {
    this.tasksService.completeTaskRequest(taskRequest.id, status).subscribe((tr) => {
      if (status === 'approved') {
        this.sendRequestApprovedMessageToStudent(tr);
      }
      this.refreshTasks();
      console.log('Task Request', taskRequest);
    });
  }

  sendRequestApprovedMessageToStudent(taskRequest: TaskRequest) {
    this.websocketService._send(
      `/app/api/teacher/run/${taskRequest.runId}/workgroup-to-next-node/${taskRequest.workgroupId}`,
      null
    );
  }
}
