angular.module('ionic.todo.controllers', ['ionic.todo'])

// The main controller for the application
.controller('TodoCtrl', function($scope, $rootScope, AuthService) {
  $scope.candy = 'yes';

  $scope.navController.pushFromTemplate('splash.html');

  $rootScope.$on('angularFireAuth:login', function(evt, user) {
    $scope.navController.pushFromTemplate('tasks.html');
  });
  $rootScope.$on('angularFireAuth:logout', function(evt, user) {
    $scope.navController.pushFromTemplate('signup.html');
  });
  $rootScope.$on('angularFireAuth:error', function(evt, err) {
    $scope.navController.pushFromTemplate('signup.html');
  });
})

.controller('SplashCtrl', function($scope) {
})

// The login form controller
.controller('LoginCtrl', function($scope,  $rootScope, AuthService) {
  console.log('Created login Ctrl');

  $scope.loginForm = {
    email: 'max@drifty.com',
    password: 'test'
  };

  $scope.close = function() {
    $scope.modal.hide();
  };

  $scope.tryLogin = function(data) {
    $scope.loginError = false;
    AuthService.login(data.email, data.password)
      .then(function(e) {
        $scope.loginError = false;
      }, function(e) {
        $scope.loginError = true;
      });
  };

  $rootScope.$on('angularFireAuth:login', function(evt, user) {
    $scope.modal.hide();
  });
})

// The signup form controller
.controller('SignupCtrl', function($scope, AuthService, Modal, ActionSheet) {
  $scope.signupForm = {};

  Modal.fromTemplateUrl('login.html', function(modal) {
    $scope.loginModal = modal;
  });

  $scope.trySignup = function(data) {
    AuthService.signup(data.email, data.password);
  };

  $scope.showLogin = function() {
    $scope.loginModal && $scope.loginModal.show();
  };
})


// The tasks controller (main app controller)
.controller('TasksCtrl', function($scope, angularFire, angularFireCollection, FIREBASE_URL) {
  /*
  var lastProjectRef = new Firebase(FIREBASE_URL + '/lastproject');
  var lastProjectPromise = angularFire(lastProjectRef, $scope, 'lastProject');
  $scope.lastProject = null;
  */


  $scope.newProject = {};

  $scope.newTask = {};


  /**
   * Add a new tasks to the current project.
   */
  $scope.addTask = function(task) {
    if(!$scope.activeProject) {
      return;
    }

    if(!$scope.activeProject.tasks) {
      $scope.activeProject.tasks = [];
    }
    $scope.activeProject.tasks.push({
      title: task.title,
      user_id: $scope.user.id,
      isCompleted: false
    });

    $scope.newTask = {};
  };

  /**
   * Set the current project
   */
  $scope.setActiveProject = function(project) {
    if(project.$ref) {
      $scope.activeProject = angularFire(project.$ref, $scope, 'activeProject');
    } else {
      $scope.activeProject = angularFire(project, $scope, 'activeProject');
    }
    //$scope.lastProject = project;
  }

  /**
   * Add a project to the projects list.
   */
  $scope.addProject = function(newProject) {
    var p = {
      title: newProject.title,
      user_id: $scope.user.id,
      tasks: []
    };

    console.log("Adding project:", p);


    // Reset the form
    $scope.newProject = {};

    $scope.setActiveProject($scope.projects.add(p));
  };

  $scope.projects = angularFireCollection(new Firebase(FIREBASE_URL + '/project_list'), function(snapshot) {
    if(!snapshot.val()) {
      var title = prompt('Create your first list:');
      if(title) {
        $scope.addProject({
          title: title
        });
      }
    }
  });
})

