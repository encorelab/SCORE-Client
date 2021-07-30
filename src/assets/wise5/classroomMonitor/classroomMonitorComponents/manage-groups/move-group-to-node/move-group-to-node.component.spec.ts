import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveGroupToNodeComponent } from './move-group-to-node.component';

describe('MoveGroupToNodeComponent', () => {
  let component: MoveGroupToNodeComponent;
  let fixture: ComponentFixture<MoveGroupToNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveGroupToNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveGroupToNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
