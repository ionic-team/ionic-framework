angular.module('toderp', ['firebase', 'ngRoute', 'ngAnimate'])

.controller('ToderpCtrl', function($scope) {
  $scope.display = {
    screen: 'login'
  };
  $scope.setScreen = function(screen) {
    $scope.display.screen = screen;
  };
})

.factory('AuthService', function(angularFireAuth, $rootScope) {
  var ref = new Firebase('https://ionic-todo-demo.firebaseio.com/');
  angularFireAuth.initialize(ref, {
    scope: $rootScope,
    name: 'user'
  });

  $rootScope.$on('angularFireAuth:login', function(evt, user) {
    console.log('Logged in!', evt, user);
  });
  $rootScope.$on('angularFireAuth:logout', function(evt, user) {
    console.log('Logged out!', evt, user);
  });
  $rootScope.$on('angularFireAuth:error', function(evt, err) {
    console.log('Login Error!', evt, err);
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
        $scope.display.screen = 'signup';
        $scope.loginError = true;
      });
  }

  $scope.showSignup = function() {
    $scope.setScreen('signup');
  }
})

.controller('SignupCtrl', function($scope, AuthService) {

  $scope.trySignup = function(data) {
    AuthService.signup(data.email, data.password);
  };
});
