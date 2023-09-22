import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';

import { MoveGroupToNodeComponent } from './move-group-to-node.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MoveGroupToNodeComponent', () => {
  let component: MoveGroupToNodeComponent;
  let fixture: ComponentFixture<MoveGroupToNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoveGroupToNodeComponent],
      imports: [MatDialogModule],
      providers: [{ provide: ConfigService, useValue: {} }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
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
