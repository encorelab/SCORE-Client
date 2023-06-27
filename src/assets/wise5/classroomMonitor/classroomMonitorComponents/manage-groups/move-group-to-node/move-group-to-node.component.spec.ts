import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';

import { MoveGroupToNodeComponent } from './move-group-to-node.component';
import { MatIconModule } from '@angular/material/icon';

describe('MoveGroupToNodeComponent', () => {
  let component: MoveGroupToNodeComponent;
  let fixture: ComponentFixture<MoveGroupToNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoveGroupToNodeComponent],
      imports: [MatDialogModule, MatIconModule],
      providers: [{ provide: ConfigService, useValue: {} }]
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
