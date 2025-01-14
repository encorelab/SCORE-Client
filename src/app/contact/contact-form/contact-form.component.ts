import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { Teacher } from '../../domain/teacher';
import { Student } from '../../domain/student';
import { ConfigService } from '../../services/config.service';
import { StudentService } from '../../student/student.service';
import { LibraryService } from '../../services/library.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactFormComponent implements OnInit {
  issueTypes: object[] = [];
  contactFormGroup: FormGroup = this.fb.group({
    name: new FormControl('', [Validators.required]),
    issueType: new FormControl('', [Validators.required]),
    summary: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });
  runId: number;
  projectId: number;
  projectName: string;
  isError: boolean = false;
  isStudent: boolean = false;
  isSignedIn: boolean = false;
  isSendingRequest: boolean = false;
  isRecaptchaEnabled: boolean = false;
  isRecaptchaError: boolean = false;
  teachers: any[] = [];
  complete: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private configService: ConfigService,
    private studentService: StudentService,
    private libraryService: LibraryService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.isSignedIn = this.userService.isSignedIn();
    this.isStudent = this.userService.isStudent();
    this.obtainRunIdOrProjectIdIfNecessary();
    this.obtainTeacherListIfNecessary();
    this.showEmailIfNecessary();
    this.isRecaptchaEnabled = this.configService.isRecaptchaEnabled();
    this.populateFieldsIfSignedIn();
    this.populateIssueTypes();
    this.setIssueTypeIfNecessary();
  }

  obtainRunIdOrProjectIdIfNecessary() {
    this.route.queryParams.subscribe((params) => {
      this.runId = params['runId'];
      this.projectId = params['projectId'];
      if (this.runId) {
        this.studentService.getRunInfoById(this.runId).subscribe((runInfo) => {
          this.projectName = runInfo.name;
        });
      }
      if (this.projectId) {
        this.libraryService.getProjectInfo(this.projectId).subscribe((project) => {
          this.projectName = project.name;
        });
      }
    });
  }

  obtainTeacherListIfNecessary() {
    if (this.isStudent && this.runId == null && this.projectId == null) {
      this.studentService.getTeacherList().subscribe((teacherList) => {
        this.teachers = teacherList;
        if (this.studentHasTeacher()) {
          this.contactFormGroup.addControl('teacher', new FormControl('', [Validators.required]));
          this.setControlFieldValue('teacher', this.teachers[0].username);
        }
      });
    }
  }

  studentHasTeacher() {
    return this.teachers.length > 0;
  }

  showEmailIfNecessary() {
    if (this.isStudent) {
      this.contactFormGroup.removeControl('email');
    } else {
      this.contactFormGroup.addControl(
        'email',
        new FormControl('', [Validators.required, Validators.email])
      );
    }
  }

  populateFieldsIfSignedIn() {
    if (this.isSignedIn) {
      if (this.isStudent) {
        const user = <Student>this.userService.getUser().getValue();
        this.setControlFieldValue('name', user.firstName + ' ' + user.lastName);
        this.markControlFieldAsDisabled('name');
      } else {
        const user = <Teacher>this.userService.getUser().getValue();
        this.setControlFieldValue('name', user.firstName + ' ' + user.lastName);
        this.setControlFieldValue('email', user.email);
        this.markControlFieldAsDisabled('name');
        this.markControlFieldAsDisabled('email');
      }
    }
  }

  populateIssueTypes() {
    if (this.isStudent) {
      this.issueTypes = [
        { key: 'TROUBLE_LOGGING_IN', value: $localize`Trouble Signing In` },
        { key: 'NEED_HELP_USING_WISE', value: $localize`Need Help Using SCORE` },
        { key: 'PROJECT_PROBLEMS', value: $localize`Problems with a SCORE Unit` },
        { key: 'FEEDBACK', value: $localize`Feedback to SCORE` },
        { key: 'OTHER', value: $localize`Other` }
      ];
    } else {
      this.issueTypes = [
        { key: 'TROUBLE_LOGGING_IN', value: $localize`Trouble Signing In` },
        { key: 'NEED_HELP_USING_WISE', value: $localize`Need Help Using SCORE` },
        { key: 'PROJECT_PROBLEMS', value: $localize`Problems with a SCORE Unit` },
        { key: 'STUDENT_MANAGEMENT', value: $localize`Student Management` },
        { key: 'AUTHORING', value: $localize`Need Help with Authoring` },
        { key: 'FEEDBACK', value: $localize`Feedback to SCORE` },
        { key: 'OTHER', value: $localize`Other` }
      ];
    }
  }

  setIssueTypeIfNecessary() {
    if (this.runId != null) {
      this.setControlFieldValue('issueType', 'PROJECT_PROBLEMS');
    }
  }

  async submit(): Promise<Subscription> {
    this.isError = false;
    const name = this.getName();
    const email = this.getEmail();
    const teacherUsername = this.getTeacherUsername();
    const issueType = this.getIssueType();
    const summary = this.getSummary();
    const description = this.getDescription();
    const runId = this.getRunId();
    const projectId = this.getProjectId();
    const userAgent = this.getUserAgent();
    const recaptchaResponse = await this.getRecaptchaResponse();
    this.setIsSendingRequest(true);
    return this.userService
      .sendContactMessage(
        name,
        email,
        teacherUsername,
        issueType,
        summary,
        description,
        runId,
        projectId,
        userAgent,
        recaptchaResponse
      )
      .pipe(
        finalize(() => {
          this.setIsSendingRequest(false);
        })
      )
      .subscribe((response) => {
        this.handleSendContactMessageResponse(response);
      });
  }

  handleSendContactMessageResponse(response: any) {
    if (response.status === 'success') {
      this.complete = true;
    } else if (response.status === 'error') {
      this.isError = true;
      if (this.isRecaptchaEnabled) {
        this.isRecaptchaError = true;
      }
    }
    this.setIsSendingRequest(false);
  }

  setControlFieldValue(name: string, value: string) {
    this.contactFormGroup.controls[name].setValue(value);
  }

  markControlFieldAsDisabled(name: string) {
    this.contactFormGroup.controls[name].disable();
  }

  getControlFieldValue(fieldName) {
    return this.contactFormGroup.get(fieldName).value;
  }

  getName() {
    return this.getControlFieldValue('name');
  }

  getEmail() {
    let email = null;
    if (!this.isStudent) {
      email = this.getControlFieldValue('email');
    }
    return email;
  }

  getIssueType() {
    return this.getControlFieldValue('issueType');
  }

  getSummary() {
    return this.getControlFieldValue('summary');
  }

  getDescription() {
    return this.getControlFieldValue('description');
  }

  getRunId() {
    return this.runId;
  }

  getProjectId() {
    return this.projectId;
  }

  getTeacherUsername() {
    if (this.isStudent && this.studentHasTeacher()) {
      return this.getControlFieldValue('teacher');
    } else {
      return null;
    }
  }

  getUserAgent() {
    return navigator.userAgent;
  }

  routeToContactCompletePage() {
    this.router.navigate(['contact/complete', {}]);
  }

  private async getRecaptchaResponse(): Promise<string> {
    return this.configService.isRecaptchaEnabled()
      ? await lastValueFrom(this.recaptchaV3Service.execute('importantAction'))
      : '';
  }

  setIsSendingRequest(value: boolean) {
    this.isSendingRequest = value;
  }
}
