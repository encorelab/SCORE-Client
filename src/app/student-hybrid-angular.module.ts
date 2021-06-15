import { NgModule } from '@angular/core';

import { createStudentAngularJSModule } from '../assets/wise5/vle/student-angular-js-module';
import { UpgradeModule } from '@angular/upgrade/static';
import { setUpLocationSync } from '@angular/router/upgrade';
import { ProjectService } from '../assets/wise5/services/projectService';
import { VLEProjectService } from '../assets/wise5/vle/vleProjectService';
import { CommonModule } from '@angular/common';
import { StudentDataService } from '../assets/wise5/services/studentDataService';
import { MatDialogModule } from '@angular/material/dialog';
import { ChooseBranchPathDialogComponent } from './preview/modules/choose-branch-path-dialog/choose-branch-path-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { DataService } from './services/data.service';
import { AngularJSModule } from './common-hybrid-angular.module';
import { NavItemComponent } from '../assets/wise5/vle/nav-item/nav-item.component';
import { HtmlStudent } from '../assets/wise5/components/html/html-student/html-student.component';
import { MultipleChoiceStudent } from '../assets/wise5/components/multipleChoice/multiple-choice-student/multiple-choice-student.component';
import { OutsideUrlStudent } from '../assets/wise5/components/outsideURL/outside-url-student/outside-url-student.component';
import { AudioOscillatorStudent } from '../assets/wise5/components/audioOscillator/audio-oscillator-student/audio-oscillator-student.component';
import { LabelStudent } from '../assets/wise5/components/label/label-student/label-student.component';
import { DrawStudent } from '../assets/wise5/components/draw/draw-student/draw-student.component';
import { MatchStudentModule } from '../assets/wise5/components/match/match-student/match-student.module';
import { StudentComponentModule } from './student/student.component.module';

@NgModule({
  declarations: [
    AudioOscillatorStudent,
    DrawStudent,
    HtmlStudent,
    LabelStudent,
    MultipleChoiceStudent,
    OutsideUrlStudent,
    NavItemComponent
  ],
  imports: [AngularJSModule, MatchStudentModule, StudentComponentModule],
  providers: [
    { provide: DataService, useExisting: StudentDataService },
    { provide: ProjectService, useExisting: VLEProjectService },
    VLEProjectService
  ],
  exports: [CommonModule, MatButtonModule, MatDialogModule, MatListModule]
})
export class StudentAngularJSModule {}

@NgModule({
  declarations: [ChooseBranchPathDialogComponent],
  imports: [StudentAngularJSModule]
})
export class StudentVLEAngularJSModule {
  constructor(upgrade: UpgradeModule) {
    bootstrapAngularJSModule(upgrade, 'vle');
  }
}

@NgModule({
  imports: [StudentAngularJSModule]
})
export class PreviewAngularJSModule {
  constructor(upgrade: UpgradeModule) {
    bootstrapAngularJSModule(upgrade, 'preview');
  }
}

function bootstrapAngularJSModule(upgrade: UpgradeModule, moduleType: string) {
  createStudentAngularJSModule(moduleType);
  upgrade.bootstrap(document.body, [moduleType]);
  setUpLocationSync(upgrade);
}
