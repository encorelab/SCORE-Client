
class ComponentController {
    constructor($injector, $scope, $compile, $element, ConfigService, NodeService, NotebookService, ProjectService, StudentDataService) {
        this.$injector = $injector;
        this.$compile = $compile;
        this.ConfigService = ConfigService;
        this.NodeService = NodeService;
        this.NotebookService = NotebookService;
        this.ProjectService = ProjectService;
        this.StudentDataService = StudentDataService;

        if (this.mode) {
            $scope.mode = this.mode;
        } else {
            $scope.mode = "student";
        }

        if (this.workgroupId != null) {
            try {
                this.workgroupId = parseInt(this.workgroupId);
            } catch(e) {

            }
        }

        if (this.teacherWorkgroupId) {
            try {
                this.teacherWorkgroupId = parseInt(this.teacherWorkgroupId);
            } catch(e) {

            }
        }

        if (this.componentState == null || this.componentState === '') {
            this.componentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(this.nodeId, this.componentId);
        } else {
            this.componentState = angular.fromJson(this.componentState);
            this.nodeId = this.componentState.nodeId;
            this.componentId = this.componentState.componentId;

        }

        var authoringComponentContent = this.ProjectService.getComponentByNodeIdAndComponentId(this.nodeId, this.componentId);
        var componentContent = this.ProjectService.injectAssetPaths(authoringComponentContent);

        // replace any student names in the component content
        componentContent = this.ConfigService.replaceStudentNames(componentContent);

        if (this.NotebookService.isNotebookEnabled()) {
            // inject the click attribute that will snip the image when the image is clicked
            componentContent = this.ProjectService.injectClickToSnipImage(componentContent);
        }

        if ($scope.mode === 'authoring') {
            $scope.authoringComponentContent = authoringComponentContent;
            $scope.authoringComponentContentJSONString = angular.toJson($scope.authoringComponentContent, 4);
            $scope.nodeAuthoringController = $scope.$parent.nodeAuthoringController;
        }

        $scope.componentContent = componentContent;
        $scope.componentState = this.componentState;
        $scope.componentTemplatePath = this.NodeService.getComponentTemplatePath(componentContent.type);
        $scope.nodeId = this.nodeId;
        $scope.workgroupId = this.workgroupId;
        $scope.teacherWorkgroupId = this.teacherWorkgroupId;
        $scope.type = componentContent.type;
        $scope.nodeController = $scope.$parent.nodeController;

        if (this.originalNodeId != null && this.originalComponentId != null) {
            /*
             * set the original node id and component id. this is used
             * when we are showing previous work from another component.
             */
            $scope.originalNodeId = this.originalNodeId;
            $scope.originalComponentId = this.originalComponentId;

            // get the original component
            var originalComponentContent = this.ProjectService.getComponentByNodeIdAndComponentId(this.originalNodeId, this.originalComponentId);
            $scope.originalComponentContent = originalComponentContent;
        }

        var componentHTML = '<div id="{{component.id}}" class="component-wrapper">' +
            '<div ng-include="componentTemplatePath" class="component component--{{type}}"></div></div>';

        if (componentHTML != null) {
            $element.html(componentHTML);
            this.$compile($element.contents())($scope);
        }
    }
}

ComponentController.$inject = ['$injector', '$scope', '$compile', '$element', 'ConfigService', 'NodeService', 'NotebookService', 'ProjectService', 'StudentDataService'];

const Component = {
    bindings: {
        componentContent: '@',
        componentId: '@',
        componentState: '@',
        mode: '@',
        nodeId: '@',
        originalNodeId: '@',
        originalComponentId: '@',
        teacherWorkgroupId: '@',
        workgroupId: '@'
    },
    scope: true,
    controller: ComponentController
};

export default Component;