import { Component, ElementRef, ViewChild } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';

@Component({
  templateUrl: 'choose-new-node.component.html'
})
export class ChooseNewNode {
  title: string;

  constructor(private upgrade: UpgradeModule) {}

  @ViewChild('titleField') titleField: ElementRef;
  ngAfterViewInit() {
    this.titleField.nativeElement.focus();
  }

  chooseLocation() {
    this.upgrade.$injector.get('$state').go('root.at.project.add-node.choose-location', {
      title: this.title
    });
  }

  cancel() {
    this.upgrade.$injector.get('$state').go('root.at.project');
  }
}