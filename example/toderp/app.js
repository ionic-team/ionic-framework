angular.module('toderp', [])

.factory('TaskListService', function() {
  return {
    tasks: [
      { text: 'Do this thing', created: new Date() }
    ],
    todaysTasks: [
      { text: 'Do this thing', created: new Date() }
    ],
    addTask: function(task) {
      this.tasks.push(task);
    },
    deleteTask: function($index) {
      this.tasks.splice($index, 1);
    }
  };
})

.controller('TodaysTaskListCtrl', ['$scope', 'TaskListService', function($scope, TaskListService) {
  $scope.todaysTasks = TaskListService.todaysTasks;
}])

.controller('TaskListCtrl', ['$scope', 'TaskListService', function($scope, TaskListService) {
  $scope.tasks = TaskListService.tasks;
}])

.controller('TasksCtrl', ['$scope', function($scope) {

}]);

var page = document.getElementById('page');
var leftPanel = document.getElementById('tasks-menu');
var controller = new ion.controllers.LeftRightMenuViewController({
  isRightEnabled: false,
  center: page,
  left: leftPanel,
  leftWidth: 270,
  animateClass: 'menu-animated'
});
window.ion.onGesture('tap', function(e) {
  controller.toggleLeft();
}, document.getElementById('menu-button'));
