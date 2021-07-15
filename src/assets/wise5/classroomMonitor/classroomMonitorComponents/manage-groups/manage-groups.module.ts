import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { ManageGroupsComponent } from './manage-groups/manage-groups.component';

angular
  .module('manageGroups', [])
  .directive(
    'manageGroupsComponent',
    downgradeComponent({ component: ManageGroupsComponent }) as angular.IDirectiveFactory
  )
  .config([
    '$stateProvider',
    ($stateProvider) => {
      $stateProvider.state('root.cm.manageGroups', {
        url: '/manage-groups',
        component: 'manageGroupsComponent'
      });
    }
  ]);
