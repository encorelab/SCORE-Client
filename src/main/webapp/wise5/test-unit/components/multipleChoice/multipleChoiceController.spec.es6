import angular from 'angular';
import mainModule from 'vle/main';
import 'angular-mocks';

const mockMultipleChoiceService = {

};

const mockStudentDataService = {
  saveComponentEvent: function(component, category, event, data) {

  }
};

describe('MultipleChoiceController', () => {

  let $controller;
  let $rootScope;
  let $scope;
  let multipleChoiceController;
  let component;

  const singleAnswerSingleCorrectAnswerComponent = {
    "id": "z87vj05pjh",
    "type": "MultipleChoice",
    "prompt": "",
    "showSaveButton": true,
    "showSubmitButton": true,
    "choiceType": "radio",
    "choices": [
      {
        "id": "y82sng5vqp",
        "text": "A",
        "feedback": "A Feedback",
        "isCorrect": false
      },
      {
        "id": "37krqrcvxs",
        "text": "B",
        "feedback": "B Feedback",
        "isCorrect": false
      },
      {
        "id": "gbttermlrq",
        "text": "C",
        "feedback": "C Feedback",
        "isCorrect": true
      }
    ],
    "showFeedback": true,
    "showAddToNotebookButton": true
  };

  const singleAnswerMultipleCorrectAnswersComponent = {
    "id": "z87vj05pjh",
    "type": "MultipleChoice",
    "prompt": "",
    "showSaveButton": true,
    "showSubmitButton": true,
    "choiceType": "radio",
    "choices": [
      {
        "id": "y82sng5vqp",
        "text": "A",
        "feedback": "A Feedback",
        "isCorrect": false
      },
      {
        "id": "37krqrcvxs",
        "text": "B",
        "feedback": "B Feedback",
        "isCorrect": true
      },
      {
        "id": "gbttermlrq",
        "text": "C",
        "feedback": "C Feedback",
        "isCorrect": true
      }
    ],
    "showFeedback": true,
    "showAddToNotebookButton": true
  };

  const multipleAnswerComponent = {
    "id": "z87vj05pjh",
    "type": "MultipleChoice",
    "prompt": "",
    "showSaveButton": true,
    "showSubmitButton": true,
    "choiceType": "checkbox",
    "choices": [
      {
        "id": "y82sng5vqp",
        "text": "A",
        "feedback": "A Feedback",
        "isCorrect": false
      },
      {
        "id": "37krqrcvxs",
        "text": "B",
        "feedback": "B Feedback",
        "isCorrect": true
      },
      {
        "id": "gbttermlrq",
        "text": "C",
        "feedback": "C Feedback",
        "isCorrect": true
      }
    ],
    "showFeedback": true,
    "showAddToNotebookButton": true
  };

  const loadSingleAnswerSingleCorrectAnswerComponent = () => {
    component = singleAnswerSingleCorrectAnswerComponent;
    loadComponent();
  };

  const loadSingleAnswerMultipleCorrectAnswersComponent = () => {
    component = singleAnswerMultipleCorrectAnswersComponent;
    loadComponent();
  };

  const loadMultipleAnswerComponent = () => {
    component = multipleAnswerComponent;
    loadComponent();
  };

  const loadComponent = () => {
    $scope = $rootScope.$new();
    $scope.componentContent = JSON.parse(JSON.stringify(component));
    multipleChoiceController = $controller('MultipleChoiceController',
        { $scope: $scope, MultipleChoiceService: mockMultipleChoiceService, StudentDataService: mockStudentDataService });
    multipleChoiceController.nodeId = 'node1';
  };

  const selectSingleAnswerChoice = (choiceId) => {
    multipleChoiceController.radioChoiceSelected(choiceId);
    multipleChoiceController.studentChoices = choiceId;
  };

  const selectMultipleAnswerChoice = (choiceId) => {
    multipleChoiceController.toggleSelection(choiceId);
    multipleChoiceController.studentChoices.push(choiceId);
  };

  const checkAnswer = () => {
    multipleChoiceController.checkAnswer();
  };

  beforeEach(angular.mock.module(mainModule.name));

  beforeEach(inject((_$controller_, _$rootScope_) => {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));

  it('single answer component should show the feedback on the submitted choice', () => {
    loadSingleAnswerSingleCorrectAnswerComponent();
    selectSingleAnswerChoice('y82sng5vqp');
    checkAnswer();
    const choice1 = multipleChoiceController.getChoiceById('y82sng5vqp');
    const choice2 = multipleChoiceController.getChoiceById('37krqrcvxs');
    const choice3 = multipleChoiceController.getChoiceById('gbttermlrq');
    expect(choice1.showFeedback).toBeTruthy();
    expect(choice1.feedbackToShow).toEqual('A Feedback');
    expect(choice2.showFeedback).toBeFalsy();
    expect(choice2.feedbackToShow).toBeFalsy();
    expect(choice3.showFeedback).toBeFalsy();
    expect(choice3.feedbackToShow).toBeFalsy();
  });

  it('single answer single correct answer component should show incorrect when no answer is submitted', () => {
    loadSingleAnswerSingleCorrectAnswerComponent();
    checkAnswer();
    expect(multipleChoiceController.isCorrect).toBeFalsy();
  });

  it('single answer single correct answer component should show incorrect when the incorrect answer is submitted', () => {
    loadSingleAnswerSingleCorrectAnswerComponent();
    selectSingleAnswerChoice('y82sng5vqp');
    checkAnswer();
    expect(multipleChoiceController.isCorrect).toBeFalsy();
  });

  it('single answer single correct answer component should show correct when the correct answer is submitted', () => {
    loadSingleAnswerSingleCorrectAnswerComponent();
    selectSingleAnswerChoice('gbttermlrq');
    checkAnswer();
    expect(multipleChoiceController.isCorrect).toBeTruthy();
  });

  it('single answer multiple correct answers component should show correct when one of the multiple correct answers is submitted', () => {
    loadSingleAnswerMultipleCorrectAnswersComponent();
    selectSingleAnswerChoice('37krqrcvxs');
    checkAnswer();
    expect(multipleChoiceController.isCorrect).toBeTruthy();
    selectSingleAnswerChoice('gbttermlrq');
    checkAnswer();
    expect(multipleChoiceController.isCorrect).toBeTruthy();
  });

  it('multiple answer component should show the feedback on the submitted choices', () => {
    loadMultipleAnswerComponent();
    selectMultipleAnswerChoice('y82sng5vqp');
    selectMultipleAnswerChoice('37krqrcvxs');
    selectMultipleAnswerChoice('gbttermlrq');
    checkAnswer();
    const choice1 = multipleChoiceController.getChoiceById('y82sng5vqp');
    const choice2 = multipleChoiceController.getChoiceById('37krqrcvxs');
    const choice3 = multipleChoiceController.getChoiceById('gbttermlrq');
    expect(choice1.showFeedback).toBeTruthy();
    expect(choice1.feedbackToShow).toEqual('A Feedback');
    expect(choice2.showFeedback).toBeTruthy();
    expect(choice2.feedbackToShow).toEqual('B Feedback');
    expect(choice3.showFeedback).toBeTruthy();
    expect(choice3.feedbackToShow).toEqual('C Feedback');
  });

  it('multiple answer component should show incorrect when no answers are submitted', () => {
    loadMultipleAnswerComponent();
    checkAnswer();
    expect(multipleChoiceController.isCorrect).toBeFalsy();
  });

  it('multiple answer component should show incorrect when the incorrect answer is submitted', () => {
    loadMultipleAnswerComponent();
    selectMultipleAnswerChoice('y82sng5vqp');
    checkAnswer();
    expect(multipleChoiceController.isCorrect).toBeFalsy();
  });

  it('multiple answer component should show incorrect when not just the correct answers are submitted', () => {
    loadMultipleAnswerComponent();
    selectMultipleAnswerChoice('y82sng5vqp');
    selectMultipleAnswerChoice('37krqrcvxs');
    selectMultipleAnswerChoice('gbttermlrq');
    checkAnswer();
    expect(multipleChoiceController.isCorrect).toBeFalsy();
  });

  it('multiple answer component should show incorrect when not all the correct answers are submitted', () => {
    loadMultipleAnswerComponent();
    selectMultipleAnswerChoice('37krqrcvxs');
    checkAnswer();
    expect(multipleChoiceController.isCorrect).toBeFalsy();
  });

  it('multiple answer component should show correct when only the correct answers are submitted', () => {
    loadMultipleAnswerComponent();
    selectMultipleAnswerChoice('37krqrcvxs');
    selectMultipleAnswerChoice('gbttermlrq');
    checkAnswer();
    expect(multipleChoiceController.isCorrect).toBeTruthy();
  });

});
