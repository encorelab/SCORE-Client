import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TagService } from '../../../../services/tagService';

import { ListGroupsComponent } from './list-groups.component';

class TagServiceMock {
  tags = [];
  retrieveRunTags() {
    return of({});
  }
}
describe('ListGroupsComponent', () => {
  let component: ListGroupsComponent;
  let fixture: ComponentFixture<ListGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListGroupsComponent],
      providers: [{ provide: TagService, useClass: TagServiceMock }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
