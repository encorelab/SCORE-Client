'use strict';

import ComponentController from '../componentController';
import { DiscussionService } from './discussionService';
import { Directive } from '@angular/core';
import { StudentAssetRequest } from '../../vle/studentAsset/StudentAssetRequest';
import * as angular from 'angular';

@Directive()
class DiscussionController extends ComponentController {
  studentResponse: string;
  newResponse: string;
  classResponses: any[];
  topLevelResponses: any;
  responsesMap: any;
  retrievedClassmateResponses: boolean;
  componentAnnotations: any = [];
  componentStateIdReplyingTo: any;
  sortOptions = ['newest', 'oldest'];
  sortPostsBy = 'newest';

  static $inject = [
    '$filter',
    '$injector',
    '$mdDialog',
    '$q',
    '$rootScope',
    '$scope',
    'AnnotationService',
    'AudioRecorderService',
    'ConfigService',
    'DiscussionService',
    'NodeService',
    'NotebookService',
    'NotificationService',
    'ProjectService',
    'StudentAssetService',
    'StudentDataService',
    'UtilService',
    '$mdMedia'
  ];

  constructor(
    $filter,
    $injector,
    $mdDialog,
    $q: any,
    $rootScope,
    $scope,
    AnnotationService,
    AudioRecorderService,
    ConfigService,
    private DiscussionService: DiscussionService,
    NodeService,
    NotebookService,
    NotificationService,
    ProjectService,
    StudentAssetService,
    StudentDataService,
    UtilService,
    private $mdMedia: any
  ) {
    super(
      $filter,
      $injector,
      $mdDialog,
      $q,
      $rootScope,
      $scope,
      AnnotationService,
      AudioRecorderService,
      ConfigService,
      NodeService,
      NotebookService,
      NotificationService,
      ProjectService,
      StudentAssetService,
      StudentDataService,
      UtilService
    );
    this.studentResponse = '';
    this.newResponse = '';
    this.classResponses = [];
    this.topLevelResponses = [];
    this.responsesMap = {};
    this.retrievedClassmateResponses = false;
    if (this.isVotingAllowed()) {
      this.sortOptions = this.sortOptions.concat(['mostPopular', 'leastPopular']);
    }
    if (this.ConfigService.isPreview()) {
      let componentStates = [];
      if (this.UtilService.hasConnectedComponent(this.componentContent)) {
        for (const connectedComponent of this.componentContent.connectedComponents) {
          componentStates = componentStates.concat(
            this.StudentDataService.getComponentStatesByNodeIdAndComponentId(
              connectedComponent.nodeId,
              connectedComponent.componentId
            )
          );
        }
        if (this.isConnectedComponentImportWorkMode()) {
          componentStates = componentStates.concat(
            this.StudentDataService.getComponentStatesByNodeIdAndComponentId(
              this.nodeId,
              this.componentId
            )
          );
        }
      } else {
        componentStates = this.StudentDataService.getComponentStatesByNodeIdAndComponentId(
          this.nodeId,
          this.componentId
        );
      }
      this.setClassResponses(componentStates);
    } else {
      if (this.UtilService.hasConnectedComponent(this.componentContent)) {
        const retrieveWorkFromTheseComponents = [];
        for (const connectedComponent of this.componentContent.connectedComponents) {
          retrieveWorkFromTheseComponents.push({
            nodeId: connectedComponent.nodeId,
            componentId: connectedComponent.componentId
          });
        }
        if (this.isConnectedComponentImportWorkMode()) {
          retrieveWorkFromTheseComponents.push({
            nodeId: this.nodeId,
            componentId: this.componentId
          });
        }
        this.getClassmateResponses(retrieveWorkFromTheseComponents);
      } else {
        if (this.isClassmateResponsesGated()) {
          const componentState = this.$scope.componentState;
          if (componentState != null) {
            if (
              this.DiscussionService.componentStateHasStudentWork(
                componentState,
                this.componentContent
              )
            ) {
              this.getClassmateResponses();
            }
          }
        } else {
          this.getClassmateResponses();
        }
      }
    }
    this.disableComponentIfNecessary();
    this.initializeScopeGetComponentState();
    this.subscribeToAttachStudentAsset();
    this.registerStudentWorkReceivedListener();
    this.registerAnnotationReceivedListener();
    this.initializeWatchMdMedia();
    this.broadcastDoneRenderingComponent();
    if (this.componentContent.isCommentingAllowed == null) {
      this.componentContent.isCommentingAllowed = true;
    }
  }

  isConnectedComponentShowWorkMode() {
    if (this.UtilService.hasConnectedComponent(this.componentContent)) {
      let isShowWorkMode = true;
      for (const connectedComponent of this.componentContent.connectedComponents) {
        isShowWorkMode = isShowWorkMode && connectedComponent.type === 'showWork';
      }
      return isShowWorkMode;
    }
    return false;
  }

  isConnectedComponentImportWorkMode() {
    if (this.UtilService.hasConnectedComponent(this.componentContent)) {
      let isImportWorkMode = true;
      for (const connectedComponent of this.componentContent.connectedComponents) {
        isImportWorkMode = isImportWorkMode && connectedComponent.type === 'importWork';
      }
      return isImportWorkMode;
    }
    return false;
  }

  handleSubmitButtonClicked(componentStateReplyingTo: any = null): void {
    if (componentStateReplyingTo && componentStateReplyingTo.replyText) {
      const componentState = componentStateReplyingTo;
      const componentStateId = componentState.id;
      this.studentResponse = componentState.replyText;
      this.componentStateIdReplyingTo = componentStateId;
      this.isSubmit = true;
      this.isDirty = true;
      componentStateReplyingTo.replyText = null;
    } else {
      this.studentResponse = this.newResponse;
      this.isSubmit = true;
    }
    this.StudentDataService.broadcastComponentSubmitTriggered({
      nodeId: this.nodeId,
      componentId: this.componentId
    });
  }

  initializeScopeGetComponentState() {
    this.$scope.getComponentState = () => {
      const deferred = this.$q.defer();
      if (this.$scope.discussionController.isDirty && this.$scope.discussionController.isSubmit) {
        const action = 'submit';
        this.$scope.discussionController.createComponentState(action).then((componentState) => {
          this.$scope.discussionController.clearComponentValues();
          this.$scope.discussionController.isDirty = false;
          deferred.resolve(componentState);
        });
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    };
  }

  registerStudentWorkSavedToServerListener() {
    this.subscriptions.add(
      this.StudentDataService.studentWorkSavedToServer$.subscribe((componentState: any) => {
        if (this.isWorkFromThisComponent(componentState)) {
          if (this.isClassmateResponsesGated() && !this.retrievedClassmateResponses) {
            this.getClassmateResponses();
          } else {
            this.addClassResponse(componentState);
          }
          this.disableComponentIfNecessary();
          this.sendPostToStudentsInThread(componentState);
        }
        this.isSubmit = null;
      })
    );
  }

  sendPostToStudentsInThread(componentState) {
    const studentData = componentState.studentData;
    if (studentData != null && this.responsesMap != null) {
      const componentStateIdReplyingTo = studentData.componentStateIdReplyingTo;
      if (componentStateIdReplyingTo != null) {
        const fromWorkgroupId = componentState.workgroupId;
        const notificationType = 'DiscussionReply';
        const nodeId = componentState.nodeId;
        const componentId = componentState.componentId;
        const usernamesArray = this.ConfigService.getUsernamesByWorkgroupId(fromWorkgroupId);
        const usernames = usernamesArray
          .map((obj) => {
            return obj.name;
          })
          .join(', ');
        const notificationMessage = this.$translate('discussion.repliedToADiscussionYouWereIn', {
          usernames: usernames
        });
        const workgroupsNotifiedSoFar = [];
        if (this.responsesMap[componentStateIdReplyingTo] != null) {
          this.sendPostToThreadCreator(
            componentStateIdReplyingTo,
            notificationType,
            nodeId,
            componentId,
            fromWorkgroupId,
            notificationMessage,
            workgroupsNotifiedSoFar
          );
          this.sendPostToThreadRepliers(
            componentStateIdReplyingTo,
            notificationType,
            nodeId,
            componentId,
            fromWorkgroupId,
            notificationMessage,
            workgroupsNotifiedSoFar
          );
        }
      }
    }
  }

  sendPostToThreadCreator(
    componentStateIdReplyingTo,
    notificationType,
    nodeId,
    componentId,
    fromWorkgroupId,
    notificationMessage,
    workgroupsNotifiedSoFar
  ) {
    const originalPostComponentState = this.responsesMap[componentStateIdReplyingTo];
    const toWorkgroupId = originalPostComponentState.workgroupId;
    if (toWorkgroupId != null && toWorkgroupId !== fromWorkgroupId) {
      const notification = this.NotificationService.createNewNotification(
        this.ConfigService.getRunId(),
        this.ConfigService.getPeriodId(),
        notificationType,
        nodeId,
        componentId,
        fromWorkgroupId,
        toWorkgroupId,
        notificationMessage
      );
      this.NotificationService.saveNotificationToServer(notification);
      workgroupsNotifiedSoFar.push(toWorkgroupId);
    }
  }

  sendPostToThreadRepliers(
    componentStateIdReplyingTo,
    notificationType,
    nodeId,
    componentId,
    fromWorkgroupId,
    notificationMessage,
    workgroupsNotifiedSoFar
  ) {
    if (this.responsesMap[componentStateIdReplyingTo].replies != null) {
      const replies = this.responsesMap[componentStateIdReplyingTo].replies;
      for (let r = 0; r < replies.length; r++) {
        const reply = replies[r];
        const toWorkgroupId = reply.workgroupId;
        if (
          toWorkgroupId != null &&
          toWorkgroupId !== fromWorkgroupId &&
          workgroupsNotifiedSoFar.indexOf(toWorkgroupId) === -1
        ) {
          const notification = this.NotificationService.createNewNotification(
            this.ConfigService.getRunId(),
            this.ConfigService.getPeriodId(),
            notificationType,
            nodeId,
            componentId,
            fromWorkgroupId,
            toWorkgroupId,
            notificationMessage
          );
          this.NotificationService.saveNotificationToServer(notification);
          workgroupsNotifiedSoFar.push(toWorkgroupId);
        }
      }
    }
  }

  subscribeToAttachStudentAsset() {
    this.subscriptions.add(
      this.StudentAssetService.attachStudentAsset$.subscribe(
        (studentAssetRequest: StudentAssetRequest) => {
          if (this.isForThisComponent(studentAssetRequest)) {
            this.attachStudentAsset(studentAssetRequest.asset);
          }
        }
      )
    );
  }

  registerStudentWorkReceivedListener() {
    this.subscriptions.add(
      this.StudentDataService.studentWorkReceived$.subscribe((componentState) => {
        if (
          (this.isWorkFromThisComponent(componentState) ||
            this.isWorkFromConnectedComponent(componentState)) &&
          this.isWorkFromClassmate(componentState) &&
          this.retrievedClassmateResponses
        ) {
          this.addClassResponse(componentState);
        }
      })
    );
  }

  registerAnnotationReceivedListener() {
    this.subscriptions.add(
      this.AnnotationService.annotationReceived$.subscribe(({ annotation }) => {
        if (this.isForThisComponent(annotation)) {
          this.addAnnotation(annotation);
          this.topLevelResponses = this.DiscussionService.getLevel1Responses(
            this.classResponses,
            this.componentId,
            this.workgroupId
          );
        }
      })
    );
  }

  addAnnotation(annotation: any) {
    const annotations = this.componentAnnotations.concat(annotation);
    this.componentAnnotations = this.filterLatestAnnotationsByWorkgroup(annotations);
  }
  isWorkFromClassmate(componentState) {
    return componentState.workgroupId !== this.ConfigService.getWorkgroupId();
  }

  isWorkFromThisComponent(componentState) {
    return this.isForThisComponent(componentState);
  }

  isWorkFromConnectedComponent(componentState) {
    if (this.componentContent.connectedComponents != null) {
      for (const connectedComponent of this.componentContent.connectedComponents) {
        if (
          connectedComponent.nodeId === componentState.nodeId &&
          connectedComponent.componentId === componentState.componentId
        ) {
          return true;
        }
      }
    }
    return false;
  }

  initializeWatchMdMedia() {
    this.$scope.$watch(
      () => {
        return this.$mdMedia('gt-sm');
      },
      (md) => {
        this.$scope.mdScreen = md;
      }
    );
  }

  getClassmateResponses(components = [{ nodeId: this.nodeId, componentId: this.componentId }]) {
    if (this.isShowAllPostsMode()) {
      const currentPeriodId = this.DiscussionService.TeacherDataService.getCurrentPeriod().periodId;
      const postsForPeriod = this.DiscussionService.TeacherDataService.getComponentStatesByComponentId(
        this.componentId
      ).filter((componentState) => {
        return currentPeriodId === -1 || componentState.periodId === currentPeriodId;
      });
      this.componentAnnotations = this.DiscussionService.TeacherDataService.getAnnotationsByNodeId(
        this.nodeId
      );
      this.setClassResponses(postsForPeriod, this.componentAnnotations);
    } else {
      const runId = this.ConfigService.getRunId();
      const periodId = this.componentContent.isSharedAcrossAllPeriods
        ? null
        : this.ConfigService.getPeriodId();
      this.DiscussionService.getClassmateResponses(runId, periodId, components).then(
        ({ studentWorkList, annotations }) => {
          this.componentAnnotations = this.filterLatestAnnotationsByWorkgroup(annotations);
          this.setClassResponses(studentWorkList, annotations);
        }
      );
    }
  }

  filterLatestAnnotationsByWorkgroup(annotations) {
    const filteredAnnotations = [];
    for (let i = annotations.length - 1; i >= 0; i--) {
      const annotation = annotations[i];
      let isFound = false;
      for (const filteredAnnotation of filteredAnnotations) {
        if (
          filteredAnnotation.fromWorkgroupId === annotation.fromWorkgroupId &&
          filteredAnnotation.studentWorkId === annotation.studentWorkId
        ) {
          isFound = true;
          break;
        }
      }
      if (!isFound) {
        filteredAnnotations.push(annotation);
      }
    }
    return filteredAnnotations;
  }
  submitButtonClicked() {
    this.isSubmit = true;
    this.disableComponentIfNecessary();
    this.handleSubmitButtonClicked();
  }

  studentDataChanged() {
    this.setIsDirty(true);
    this.createComponentStateAndBroadcast('change');
  }

  /**
   * Create a new component state populated with the student data
   * @param action the action that is triggering creating of this component state
   * e.g. 'submit', 'save', 'change'
   * @return a promise that will return a component state
   */
  createComponentState(action) {
    const componentState: any = this.NodeService.createNewComponentState();
    const studentData: any = {
      response: this.studentResponse,
      attachments: this.attachments
    };
    if (this.componentStateIdReplyingTo != null) {
      studentData.componentStateIdReplyingTo = this.componentStateIdReplyingTo;
    }
    componentState.studentData = studentData;
    componentState.componentType = 'Discussion';
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;
    if (
      (this.ConfigService.isPreview() && !this.componentStateIdReplyingTo) ||
      this.mode === 'authoring'
    ) {
      componentState.id = this.UtilService.generateKey();
    }
    if (this.isSubmit) {
      componentState.studentData.isSubmit = this.isSubmit;
      this.isSubmit = false;
      if (this.mode === 'authoring') {
        if (this.StudentDataService.studentData == null) {
          this.StudentDataService.studentData = {
            componentStates: [],
            events: [],
            annotations: []
          };
        }
        this.StudentDataService.studentData.componentStates.push(componentState);
        const componentStates = this.StudentDataService.getComponentStatesByNodeIdAndComponentId(
          this.nodeId,
          this.componentId
        );
        this.setClassResponses(componentStates);
        this.clearComponentValues();
        this.isDirty = false;
      }
    }
    const deferred = this.$q.defer();
    this.createComponentStateAdditionalProcessing(deferred, componentState, action);
    return deferred.promise;
  }

  clearComponentValues() {
    this.studentResponse = '';
    this.newResponse = '';
    this.attachments = [];
    this.componentStateIdReplyingTo = null;
  }

  disableComponentIfNecessary() {
    super.disableComponentIfNecessary();
    if (this.UtilService.hasConnectedComponent(this.componentContent)) {
      for (const connectedComponent of this.componentContent.connectedComponents) {
        if (connectedComponent.type === 'showWork') {
          this.isDisabled = true;
        }
      }
    }
  }

  showSaveButton() {
    return this.componentContent.showSaveButton;
  }

  showSubmitButton() {
    return this.componentContent.showSubmitButton;
  }

  isClassmateResponsesGated() {
    return this.componentContent.gateClassmateResponses;
  }

  isVotingAllowed() {
    return this.componentContent.isVotingAllowed;
  }

  setClassResponses(componentStates: any[], annotations: any[] = []): void {
    const isStudentMode = true;
    this.classResponses = this.DiscussionService.getClassResponses(
      componentStates,
      annotations,
      isStudentMode
    );
    this.responsesMap = this.DiscussionService.getResponsesMap(this.classResponses);
    this.topLevelResponses = this.DiscussionService.getLevel1Responses(
      this.classResponses,
      this.componentId,
      this.workgroupId
    );
    this.retrievedClassmateResponses = true;
  }

  sortPostsFunction(response1, response2) {
    if (this.sortPostsBy === 'oldest') {
      return this.sortByOldest(response1, response2);
    } else if (this.sortPostsBy === 'mostPopular') {
      return this.sortByMostPopular(response1, response2);
    } else if (this.sortPostsBy === 'leastPopular') {
      return this.sortByLeastPopular(response1, response2);
    }
    return this.sortByNewest(response1, response2);
  }

  sortPosts() {
    this.getClassmateResponses();
  }

  sortByNewest(componentState1, componentState2) {
    if (componentState1.serverSaveTime < componentState2.serverSaveTime) {
      return -1;
    } else if (componentState1.serverSaveTime > componentState2.serverSaveTime) {
      return 1;
    }
    return 0;
  }

  sortByOldest(componentState1, componentState2) {
    return this.sortByNewest(componentState2, componentState1);
  }

  sortByMostPopular(componentState1, componentState2) {
    const cs1Votes = this.sumVotesForComponentState(componentState1);
    const cs2Votes = this.sumVotesForComponentState(componentState2);
    if (cs1Votes >= cs2Votes) {
      return 1;
    } else {
      return -1;
    }
  }

  sortByLeastPopular(componentState1, componentState2) {
    return this.sortByMostPopular(componentState2, componentState1);
  }

  sumVotesForComponentState(componentState) {
    let numVotes = 0;
    for (const annotation of this.componentAnnotations) {
      if (annotation.type === 'vote' && annotation.studentWorkId === componentState.id) {
        numVotes += annotation.data.value;
      }
    }
    return numVotes;
  }

  addClassResponse(componentState: any): void {
    if (componentState.studentData.isSubmit) {
      this.DiscussionService.setUsernames(componentState);
      componentState.replies = [];
      this.classResponses.push(componentState);
      this.addResponseToResponsesMap(this.responsesMap, componentState);
      this.topLevelResponses = this.DiscussionService.getLevel1Responses(
        this.classResponses,
        this.componentId,
        this.workgroupId
      );
    }
  }

  addResponseToResponsesMap(responsesMap: any, componentState: any): void {
    responsesMap[componentState.id] = componentState;
    const componentStateIdReplyingTo = componentState.studentData.componentStateIdReplyingTo;
    if (componentStateIdReplyingTo) {
      if (
        responsesMap[componentStateIdReplyingTo] &&
        responsesMap[componentStateIdReplyingTo].replies
      ) {
        responsesMap[componentStateIdReplyingTo].replies.push(componentState);
      }
    }
  }

  /**
   * Students upvoted this post. This function will create a vote
   * annotation with the value set to -1, 0, or 1 depending on the
   * voting response.
   * @param componentState the student component that the vote is being
   * applied to.
   */
  createupvoteannotation(componentState) {
    const toWorkgroupId = componentState.workgroupId;
    const userInfo = this.ConfigService.getUserInfoByWorkgroupId(toWorkgroupId);
    const periodId = userInfo.periodId;
    const studentUserInfo = this.ConfigService.getMyUserInfo();
    const fromWorkgroupId = studentUserInfo.workgroupId;
    const runId = this.ConfigService.getRunId();
    const nodeId = this.nodeId;
    const componentId = this.componentId;
    const studentWorkId = componentState.id;
    const data = {
      value: 1
    };
    const annotation = this.AnnotationService.createVoteAnnotation(
      runId,
      periodId,
      nodeId,
      componentId,
      fromWorkgroupId,
      toWorkgroupId,
      studentWorkId,
      data
    );
    return this.AnnotationService.saveAnnotation(annotation).then(() => {
      this.addAnnotation(annotation);
    });
  }

  /**
   * Students downvoted this post. This function will create a vote
   * annotation with the value set to -1, 0, or 1 depending on the
   * voting response.
   * @param componentState the student component that the vote is being
   * applied to.
   */
  createdownvoteannotation(componentState) {
    const toWorkgroupId = componentState.workgroupId;
    const userInfo = this.ConfigService.getUserInfoByWorkgroupId(toWorkgroupId);
    const periodId = userInfo.periodId;
    const studentUserInfo = this.ConfigService.getMyUserInfo();
    const fromWorkgroupId = studentUserInfo.workgroupId;
    const runId = this.ConfigService.getRunId();
    const nodeId = this.nodeId;
    const componentId = this.componentId;
    const studentWorkId = componentState.id;
    const data = {
      value: -1
    };
    const annotation = this.AnnotationService.createVoteAnnotation(
      runId,
      periodId,
      nodeId,
      componentId,
      fromWorkgroupId,
      toWorkgroupId,
      studentWorkId,
      data
    );
    return this.AnnotationService.saveAnnotation(annotation).then(() => {
      this.addAnnotation(annotation);
    });
  }

  /**
   * Students un-voted this post. This function will create a vote
   * annotation with the value set to -1, 0, or 1 depending on the
   * voting response.
   * @param componentState the student component that the vote is being
   * applied to.
   */
  createunvoteannotation(componentState) {
    const toWorkgroupId = componentState.workgroupId;
    const userInfo = this.ConfigService.getUserInfoByWorkgroupId(toWorkgroupId);
    const periodId = userInfo.periodId;
    const studentUserInfo = this.ConfigService.getMyUserInfo();
    const fromWorkgroupId = studentUserInfo.workgroupId;
    const runId = this.ConfigService.getRunId();
    const nodeId = this.nodeId;
    const componentId = this.componentId;
    const studentWorkId = componentState.id;
    const data = {
      value: 0
    };
    const annotation = this.AnnotationService.createVoteAnnotation(
      runId,
      periodId,
      nodeId,
      componentId,
      fromWorkgroupId,
      toWorkgroupId,
      studentWorkId,
      data
    );
    return this.AnnotationService.saveAnnotation(annotation).then(() => {
      this.addAnnotation(annotation);
    });
  }

  /**
   * Get the inappropriate flag annotations for these component states
   * @param componentStates an array of component states
   * @return an array of inappropriate flag annotations that are associated
   * with the component states
   */
  getInappropriateFlagAnnotationsByComponentStates(componentStates = []) {
    const annotations = [];
    for (const componentState of componentStates) {
      const latestInappropriateFlagAnnotation = this.AnnotationService.getLatestAnnotationByStudentWorkIdAndType(
        componentState.id,
        'inappropriateFlag'
      );
      if (latestInappropriateFlagAnnotation != null) {
        annotations.push(latestInappropriateFlagAnnotation);
      }
    }
    return annotations;
  }

  showEntireDiscussion($event) {
    this.$mdDialog.show({
      targetEvent: $event,
      fullscreen: true,
      clickOutsideToClose: true,
      parent: angular.element(document.body),
      template: `<md-dialog class="dialog--wider">
        <md-toolbar><div class="md-toolbar-tools"><h2>{{$ctrl.stepTitle}}</h2></div></md-toolbar>
        <md-dialog-content class="gray-lighter-bg md-dialog-content">
          <component node-id="{{$ctrl.nodeId}}" component-id="{{$ctrl.componentId}}" mode="showAllPosts"></component>
        </md-dialog-content>
        <md-dialog-actions layout="row" layout-align="start center">
          <span flex></span>
          <md-button class="md-primary" ng-click="close()" aria-label="{{ ::'CLOSE' | translate }}">
            {{ ::'CLOSE' | translate }}
          </md-button>
        </md-dialog-actions>
      </md-dialog>`,
      controller: ShowEntireDiscussionController,
      bindToController: true,
      controllerAs: '$ctrl',
      locals: {
        componentId: this.componentId,
        nodeId: this.nodeId,
        stepTitle: this.ProjectService.getNodePositionAndTitleByNodeId(this.nodeId)
      }
    });
    function ShowEntireDiscussionController($scope, $mdDialog) {
      $scope.close = () => {
        $mdDialog.hide();
      };
    }
  }

  isShowAllPostsMode() {
    return this.mode === 'showAllPosts';
  }
}

export default DiscussionController;
