import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { ConfigService } from '../../../../../../src/app/services/config.service';
import { TeacherRun } from '../../../../../../src/app/teacher/teacher-run';
import { Observable } from 'rxjs';
import { Run } from '../../../../../../src/app/domain/run';
import { ClassesStore } from './core/services/storage/classes-store';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'SCORE TA Monitoring App';
    private contextPath: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private teacherService: TeacherService,
        private classesStore: ClassesStore,
    ) {
        console.log(window.location.href);
        if (window.location.href) {
            let split = window.location.href.split('/');
            let runId = split[split.length - 1];
            this.classesStore.runId = Number(runId);
        }
    }
    ngOnInit() {}
}
