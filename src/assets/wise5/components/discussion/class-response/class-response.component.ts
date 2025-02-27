import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { ConfigService } from '../../../services/configService';
import { AnnotationService } from '../../../services/annotationService';
import { getAvatarColorForWorkgroupId } from '../../../common/workgroup/workgroup';

@Component({
  selector: 'class-response',
  templateUrl: 'class-response.component.html',
  styleUrls: ['class-response.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClassResponse {
  @Input()
  componentannotations = [];

  @Input()
  response: any;

  @Input()
  numReplies: number;

  @Input()
  mode: any;

  @Input()
  isDisabled: boolean;

  @Input()
  isCommentingAllowed: boolean = true;

  @Input()
  isVotingAllowed: boolean;

  @Output()
  submitButtonClicked: any = new EventEmitter();

  @Output()
  deleteButtonClicked: any = new EventEmitter();

  @Output()
  undoDeleteButtonClicked: any = new EventEmitter();

  @Output()
  createupvoteannotation: any = new EventEmitter();

  @Output()
  createdownvoteannotation: any = new EventEmitter();

  @Output()
  createunvoteannotation: any = new EventEmitter();

  urlMatcher: any = /((http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?)/g;
  expanded: boolean = false;
  repliesToShow: any[] = [];
  currentVote = 0;
  numVotes = 0;
  isUpvoteClicked = false;
  isDownvoteClicked = false;

  constructor(private annotationService: AnnotationService, private configService: ConfigService) {}

  ngOnInit(): void {
    this.injectLinksIntoResponse();
    this.injectLinksIntoReplies();
    if (this.hasAnyReply()) {
      this.showLastReply();
    }
    this.updateVoteDisplays();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.numReplies != null && !changes.numReplies.isFirstChange()) {
      this.expanded = true;
      this.injectLinksIntoReplies();
      this.showAllReplies();
    }
  }

  injectLinksIntoResponse(): void {
    this.response.studentData.responseTextHTML = this.injectLinks(
      this.response.studentData.response
    );
  }

  injectLinksIntoReplies(): void {
    this.response.replies.forEach((replyComponentState: any): void => {
      replyComponentState.studentData.responseHTML = this.injectLinks(
        replyComponentState.studentData.response
      );
    });
  }

  injectLinks(response: string): string {
    return response.replace(this.urlMatcher, (match) => {
      let matchUrl = match;
      if (!match.startsWith('http')) {
        /*
         * The url does not begin with http so we will add // to the beginning of it so that the
         * browser treats the url as an absolute link and not a relative link. The browser will also
         * use the same protocol that the current page is loaded with (http or https).
         */
        matchUrl = '//' + match;
      }
      return `<a href="${matchUrl}" target="_blank">${match}</a>`;
    });
  }

  updateVoteDisplays() {
    this.sumVotes();
    this.getLatestVoteForCurrentWorkgroup();
  }

  sumVotes() {
    this.numVotes = 0;
    for (const annotation of this.componentannotations) {
      if (annotation.type === 'vote' && annotation.studentWorkId === this.response.id) {
        this.numVotes += annotation.data.value;
      }
    }
  }

  getLatestVoteForCurrentWorkgroup() {
    for (let i = this.componentannotations.length - 1; i >= 0; i--) {
      const componentannotation = this.componentannotations[i];
      if (
        componentannotation.studentWorkId === this.response.id &&
        componentannotation.fromWorkgroupId === this.configService.getWorkgroupId()
      ) {
        if (componentannotation.data.value === -1) {
          this.isDownvoteClicked = true;
          this.isUpvoteClicked = false;
        } else if (componentannotation.data.value === 1) {
          this.isDownvoteClicked = false;
          this.isUpvoteClicked = true;
        } else {
          this.isDownvoteClicked = false;
          this.isUpvoteClicked = false;
        }
        break;
      }
    }
  }

  getAvatarColorForWorkgroupId(workgroupId: number): string {
    return getAvatarColorForWorkgroupId(workgroupId);
  }

  adjustClientSaveTime(time: any): number {
    return this.configService.convertToClientTimestamp(time);
  }

  replyEntered($event: any): void {
    if (this.isEnterKeyEvent($event)) {
      $event.preventDefault();
      this.response.replyText = this.removeLastChar(this.response.replyText);
      this.expandAndShowAllReplies();
      this.submitButtonClicked.emit(this.response);
    }
  }

  isEnterKeyEvent(event: any): boolean {
    return event.keyCode == 13 && !event.shiftKey && this.response.replyText;
  }

  removeLastChar(responseText: string): string {
    return responseText.substring(0, responseText.length - 1);
  }

  delete(componentState: any): void {
    if (confirm($localize`Are you sure you want to delete this post?`)) {
      this.deleteButtonClicked.emit(componentState);
    }
  }

  undoDelete(componentState: any): void {
    if (confirm($localize`Are you sure you want to show this post?`)) {
      this.undoDeleteButtonClicked.emit(componentState);
    }
  }

  toggleExpanded(): void {
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.showAllReplies();
    } else {
      this.showLastReply();
    }
  }

  hasAnyReply(): boolean {
    return this.response.replies.length > 0;
  }

  showLastReply(): void {
    if (this.response.replies.length > 0) {
      this.repliesToShow = [this.response.replies[this.response.replies.length - 1]];
    }
  }

  showAllReplies(): void {
    this.repliesToShow = this.response.replies;
  }

  expandAndShowAllReplies(): void {
    this.expanded = true;
    this.showAllReplies();
  }

  upvoteClicked(componentState) {
    if (!this.isUpvoteClicked) {
      this.createupvoteannotation({ componentState: componentState });
    } else {
      this.createunvoteannotation({ componentState: componentState });
    }
  }

  downvoteClicked(componentState) {
    if (!this.isDownvoteClicked) {
      this.createdownvoteannotation({ componentState: componentState });
    } else {
      this.createunvoteannotation({ componentState: componentState });
    }
  }

  /**
   * Get the vote annotations for these component states
   * @param componentStates an array of component states
   * @return an array of vote annotations that are associated
   * with the component states
   */
  getVoteAnnotationsByComponentStates(componentStates = []) {
    const annotations = [];
    for (const componentState of componentStates) {
      const latestInappropriateFlagAnnotation = this.annotationService.getLatestAnnotationByStudentWorkIdAndType(
        componentState.id,
        'vote'
      );
      if (latestInappropriateFlagAnnotation != null) {
        annotations.push(latestInappropriateFlagAnnotation);
      }
    }
    return annotations;
  }
}
