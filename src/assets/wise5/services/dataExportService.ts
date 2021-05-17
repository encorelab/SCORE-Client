import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './configService';
import { TeacherDataService } from './teacherDataService';
import { UtilService } from './utilService';

@Injectable()
export class DataExportService {
  studentEventsByWorkgroupId: any;
  teacherEventsByUserId: any;

  constructor(
    private ConfigService: ConfigService,
    private http: HttpClient,
    private TeacherDataService: TeacherDataService,
    private UtilService: UtilService
  ) {}

  retrieveStudentDataExport(selectedNodes = []): Promise<any> {
    let params = this.createHttpParams('true', 'false', 'true');
    for (const selectedNode of selectedNodes) {
      params = params.append('components', JSON.stringify(selectedNode));
    }
    return this.TeacherDataService.retrieveStudentData(params);
  }

  retrieveEventsExport(
    includeStudentEvents: boolean,
    includeTeacherEvents: boolean,
    includeNames: boolean
  ): Promise<any> {
    const params = new HttpParams()
      .set('runId', this.ConfigService.getRunId())
      .set('getStudentWork', 'false')
      .set('getAnnotations', 'false')
      .set('getEvents', 'false')
      .set('includeStudentEvents', includeStudentEvents + '')
      .set('includeTeacherEvents', includeTeacherEvents + '')
      .set('includeNames', includeNames + '');
    const options = {
      params: params
    };
    const url = this.ConfigService.getConfigParam('runDataExportURL') + '/events';
    return this.http
      .get(url, options)
      .toPromise()
      .then(({ events }: any): any[] => {
        return events;
      });
  }

  processEvents(events: any[]): void {
    this.initializeEventsDataStructures();
    events.sort(this.UtilService.sortByServerSaveTime);
    for (const event of events) {
      if (this.isStudentEvent(event)) {
        this.addStudentEvent(event);
      } else {
        this.addTeacherEvent(event);
      }
    }
  }

  initializeEventsDataStructures(): void {
    this.studentEventsByWorkgroupId = new Map();
    this.teacherEventsByUserId = new Map();
  }

  isStudentEvent(event: any): boolean {
    return !this.isTeacherEvent(event);
  }

  isTeacherEvent(event: any): boolean {
    return (
      this.ConfigService.isTeacherWorkgroupId(event.workgroupId) ||
      this.ConfigService.isTeacherUserId(event.userId)
    );
  }

  addTeacherEvent(event: any): void {
    const userId = event.userId;
    if (!this.teacherEventsByUserId.has(userId)) {
      this.teacherEventsByUserId.set(userId, []);
    }
    this.teacherEventsByUserId.get(userId).push(event);
  }

  addStudentEvent(event: any): void {
    const workgroupId = event.workgroupId;
    if (!this.studentEventsByWorkgroupId.has(workgroupId)) {
      this.studentEventsByWorkgroupId.set(workgroupId, []);
    }
    this.studentEventsByWorkgroupId.get(workgroupId).push(event);
  }

  getStudentEventsByWorkgroupId(workgroupId: number): any[] {
    return this.studentEventsByWorkgroupId.get(workgroupId);
  }

  getTeacherEventsByUserId(userId: number): any[] {
    return this.teacherEventsByUserId.get(userId);
  }

  retrieveNotebookExport(exportType: string): Promise<any> {
    const options = { params: new HttpParams().set('exportType', exportType) };
    return this.http
      .get(this.ConfigService.getConfigParam('notebookURL'), options)
      .toPromise()
      .then((data: any) => {
        return data;
      });
  }

  retrieveNotificationsExport(): Promise<any> {
    return this.http
      .get(this.getExportURL(this.ConfigService.getRunId(), 'notifications'))
      .toPromise()
      .then((data: any) => {
        return data;
      });
  }

  retrieveOneWorkgroupPerRowExport(selectedNodes = []): Promise<any> {
    let params = this.createHttpParams('true', 'true', 'true');
    for (const selectedNode of selectedNodes) {
      params = params.append('components', JSON.stringify(selectedNode));
    }
    return this.TeacherDataService.retrieveStudentData(params);
  }

  retrieveStudentAssetsExport(): Promise<any> {
    window.location.href = this.getExportURL(this.ConfigService.getRunId(), 'studentAssets');
    return new Promise((resolve) => {
      resolve([]);
    });
  }

  retrieveRawDataExport(selectedNodes: any[] = []): Promise<any> {
    let params = this.createHttpParams('true', 'true', 'true');
    for (const selectedNode of selectedNodes) {
      params = params.append('components', JSON.stringify(selectedNode));
    }
    return this.TeacherDataService.retrieveStudentData(params);
  }

  private createHttpParams(studentWork: string, events: string, annotations: string): HttpParams {
    return new HttpParams()
      .set('runId', this.ConfigService.getRunId())
      .set('getStudentWork', studentWork)
      .set('getEvents', events)
      .set('getAnnotations', annotations);
  }

  getExportURL(runId: number, exportType: string): string {
    return this.ConfigService.getConfigParam('runDataExportURL') + `/${runId}/${exportType}`;
  }
}
