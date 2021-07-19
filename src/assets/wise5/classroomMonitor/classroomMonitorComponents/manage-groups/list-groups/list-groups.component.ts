import { Component } from '@angular/core';
import { TagService } from '../../../../services/tagService';

@Component({
  selector: 'list-groups',
  templateUrl: './list-groups.component.html',
  styleUrls: ['./list-groups.component.scss']
})
export class ListGroupsComponent {
  groups: any[] = [];

  constructor(protected tagService: TagService) {}

  ngOnInit(): void {
    this.tagService.retrieveRunTags().subscribe(() => {
      this.groups = this.tagService.tags;
    });
  }
}
