import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'edit-group-name',
  templateUrl: './edit-group-name.component.html',
  styleUrls: ['./edit-group-name.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditGroupNameComponent {
  @Input() groupNameForm: FormGroup;
}
