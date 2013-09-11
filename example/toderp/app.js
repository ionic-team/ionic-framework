angular.module('toderp', ['firebase'])

.factory('TaskStorageService', function() {
  return {
    getTasks: function() {
      var tasks = window.localStorage['tasks'];
      try {
        return JSON.parse(tasks);
      } catch(e) {}
      return [];
    },
    addTask: function(task) {
      var tasks = window.localStorage['tasks'] || "[]";
      try {
        var taskObj = JSON.parse(tasks);
        taskObj && taskObj.push(task);
        this.setTasks(taskObj);
      } catch(e) {}
    },
    deleteTask: function(index) {
      var tasks = window.localStorage['tasks'] || "[]";
      try {
        var taskObj = JSON.parse(tasks);
        taskObj && taskObj.splice(index);
        this.setTasks(taskObj);
      } catch(e) {}
    },
    setTasks: function(tasks) {
      window.localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }
})

.filter('todaysTasks', function() {
  return function(value) {
    return value.filter(function(a) {
      return !a.isDone;
    }).sort(function(a, b) {
      if(a.priority > b.priority) return 1;
      if(a.priority < b.priority) return -1;
      return 0;
    }).slice(0, 3);
  }
})

.factory('TaskListService', ['TaskStorageService', function(TaskStorageService) {

  var tasks = Array.prototype.slice.call(TaskStorageService.getTasks());

  return {
    tasks: tasks,
    
    addTask: function(task) {
      this.tasks.push(task);
      TaskStorageService.addTask(task);
      return task;
    },
    deleteTask: function($index) {
      var last = this.tasks.splice($index, 1);
      TaskStorageService.deleteTask(task);
      return last;
    },
    getTasks: function() {
      return this.tasks;
    }
  };
}])

.controller('TodaysTaskListCtrl', ['$scope', 'TaskListService', function($scope, TaskListService) {
  $scope.tasks = TaskListService.tasks;

  $scope.promptNewTask = function() {
    var data = prompt('What do you need to do?')
    
    TaskListService.addTask({
      text: data
    });
  };
}])

.controller('TaskListCtrl', ['$scope', 'TaskListService', function($scope, TaskListService) {
  $scope.tasks = TaskListService.tasks;
}])


var ListViewController = function(options) {
  var _this = this;

  this.list = options.list;

  window.ion.onGesture('release', function(e) {
    _this._endDrag(e);
  }, this.list);

  window.ion.onGesture('swiperight', function(e) {
    _this._handleSwipeRight(e);
  }, this.list);

  window.ion.onGesture('drag', function(e) {
    _this._handleDrag(e);
  }, this.list);
};

ListViewController.prototype = {
  _endDrag: function(e) {

  },
  _handleDrag: function(e) {
    console.log('Dragging', e);
  },
  _handleSwipeRight: function(e) {
    console.log('SWIPRIGHT', e);
  }
};

var list = document.getElementById('tasks');
var listViewController = new ListViewController({
  list: list
});

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
