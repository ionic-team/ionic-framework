angular.module('ionic.todo.controllers', ['ionic.todo', 'firebase'])

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
.controller('LoginCtrl', function($scope,  AuthService) {
  console.log('Created login Ctrl');

  $scope.loginForm = {
    email: 'max@drifty.com',
    password: 'test'
  };

  $scope.showSignup = function() {
    $scope.navController.pushFromTemplate('signup.html');
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
})

// The signup form controller
.controller('SignupCtrl', function($scope, AuthService) {
  $scope.signupForm = {};

  $scope.trySignup = function(data) {
    AuthService.signup(data.email, data.password);
  };
})

.controller('ProjectsCtrl', function($scope, angularFire, FIREBASE_URL) {
})

// The tasks controller (main app controller)
.controller('TasksCtrl', function($scope, angularFire, FIREBASE_URL) {
  var taskRef = new Firebase(FIREBASE_URL + '/todos');
  $scope.todos = [];
  angularFire(taskRef, $scope, 'todos');
  $scope.addTask = function(task) {
    var t = {};
    t = angular.extend({
      id: $scope.user.id
    }, task);

    console.log("Adding task:", t);
    $scope.todos.push(t);

    $scope.task = {};
  };
});
