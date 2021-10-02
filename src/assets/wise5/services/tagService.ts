'use strict';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './configService';
import { map } from 'rxjs/operators';
import { ProjectService } from './projectService';
import { Tag } from '../../../app/domain/tag';
import { Subject } from 'rxjs';

@Injectable()
export class TagService {
  tags: Tag[] = [];
  private tagChangedSource = new Subject<Tag>();
  tagChanged$ = this.tagChangedSource.asObservable();

  constructor(
    protected http: HttpClient,
    protected ConfigService: ConfigService,
    protected ProjectService: ProjectService
  ) {}

  setTags(tags: any[]) {
    this.tags = tags;
  }

  getTags() {
    return this.tags;
  }

  addTag(id: number, name: string) {
    const tagObject: any = {
      name: name
    };
    if (id != null) {
      tagObject.id = id;
    }
    this.tags.push(tagObject);
  }

  createRunTag(name: string) {
    return this.http.post(`/api/tag/run/${this.ConfigService.getRunId()}/create`, name);
  }

  updateRunTag(tag: Tag) {
    return this.http.post(`/api/tag/run/${this.ConfigService.getRunId()}/update`, tag);
  }

  deleteRunTag(tag: Tag) {
    return this.http.post(`/api/tag/run/${this.ConfigService.getRunId()}/delete`, tag).pipe(
      map(() => {
        this.tags.splice(
          this.tags.findIndex((tagLocal) => {
            return tagLocal.id === tag.id;
          }),
          1
        );
      })
    );
  }

  retrieveRunTags() {
    return this.http.get(`/api/tag/run/${this.ConfigService.getRunId()}`).pipe(
      map((data: any) => {
        this.tags = data;
        return data;
      })
    );
  }

  retrieveWorkgroupsWithTag(tag: Tag) {
    return this.http.get(`/api/tag/${tag.id}/workgroups`);
  }

  retrieveStudentTags() {
    return this.http.get(`/api/tag/workgroup/${this.ConfigService.getWorkgroupId()}`).pipe(
      map((data: any) => {
        this.tags = data;
        return data;
      })
    );
  }

  addWorkgroupTag(workgroupId: number, tag: Tag) {
    return this.http.post(`/api/tag/workgroup/${workgroupId}/add`, tag);
  }

  removeWorkgroupTag(workgroupId: number, tag: Tag) {
    return this.http.request('DELETE', `/api/tag/workgroup/${workgroupId}/delete`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: tag
    });
  }

  removeTagFromWorkgroups(workgroupIds: number[], tag: Tag) {
    return this.http.request('DELETE', `/api/tag/${tag.id}/workgroups/delete`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: workgroupIds
    });
  }

  addRemoveTagsFromWorkgroups(addRemoveTagsParam: any) {
    return this.http.request('POST', `/api/tag/workgroups/add-delete`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: addRemoveTagsParam
    });
  }

  getNextAvailableTag() {
    this.getTagsFromProject();
    let counter = 1;
    const tagPrefix = 'Group ';
    const existingTagNames = this.getExistingTagNames();
    while (true) {
      const newTagName = tagPrefix + counter;
      if (!existingTagNames.includes(newTagName)) {
        this.addTag(null, newTagName);
        return newTagName;
      }
      counter++;
    }
  }

  getExistingTagNames() {
    return this.tags.map((tag) => {
      return tag.name;
    });
  }

  getTagsFromProject() {
    this.tags = this.ProjectService.getTags();
  }

  hasTagName(tagName: string): boolean {
    return this.getExistingTagNames().includes(tagName);
  }

  emitTagChanged(tag: Tag): void {
    this.tagChangedSource.next(tag);
  }
}
