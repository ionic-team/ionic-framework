angular.module('toderp', ['firebase', 'ngRoute', 'ngAnimate'])

.constant('FIREBASE_URL', 'https://ionic-todo-demo.firebaseio.com/')

.controller('ToderpCtrl', function($scope, $rootScope, AuthService) {
  $scope.display = {
    screen: 'splash'
  };
  $rootScope.$on('angularFireAuth:login', function(evt, user) {
    $scope.display.screen = 'tasks';
  });
  $rootScope.$on('angularFireAuth:logout', function(evt, user) {
    console.log('Logged out!', evt, user);
    $scope.display.screen = 'login';
  });
  $rootScope.$on('angularFireAuth:error', function(evt, err) {
    console.log('Login Error!', evt, err);
  });

  $scope.setScreen = function(screen) {
    $scope.display.screen = screen;
  };
})

.factory('AuthService', function(angularFireAuth, $rootScope, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL);
  angularFireAuth.initialize(ref, {
    scope: $rootScope,
    callback: function(user, err) {
      console.log('AUTH CHANGED', err, user);
    },
    name: 'user'
  });

  return {
    login: function(email, password) {
      if(!email || !password) {
        return;
      }
      console.log('Logging in', email, password);
      return angularFireAuth.login('password', {
        email: email,
        password: password
      });
    },
    signup: function(email, password) {
      if(!email || !password) {
        return;
      }
      console.log('Signing up', name, email, password);

      angularFireAuth.createUser(email, password, function(err, user) {
        console.log('SIGED UP', err, user);
      });
    }
  };
})

.controller('LoginCtrl', function($scope,  AuthService) {
  console.log('Created login Ctrl');

  $scope.loginForm = {
    email: 'max@drifty.com',
    password: 'test'
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

  $scope.showSignup = function() {
    $scope.setScreen('signup');
  };
})

.controller('SignupCtrl', function($scope, AuthService) {

  $scope.trySignup = function(data) {
    AuthService.signup(data.email, data.password);
  };
})

.controller('TasksCtrl', function($scope, angularFire, FIREBASE_URL) {
  var taskRef = new Firebase(FIREBASE_URL + '/tasks');
  $scope.tasks = angularFire(taskRef, $scope, 'tasks');
  $scope.addTask = function(task) {
    var t = {};
    t = angular.extend({
      id: $scope.user.id
    }, task);

    console.log("Adding task:", t);
    $scope.tasks.push(t);

    $scope.task = {};
  };
});
