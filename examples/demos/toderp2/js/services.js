angular.module('ionic.todo.services', ['ionic.todo', 'firebase'])

// The AuthService handles user authentication with Firebase.
.factory('AuthService', function(angularFireAuth, $rootScope, FIREBASE_URL) {

  // Initialize the angularFireAuth service.
  var ref = new Firebase(FIREBASE_URL);
  angularFireAuth.initialize(ref, {
    scope: $rootScope,
    callback: function(user, err) {
      console.log('AUTH CHANGED', err, user);
    },
    name: 'user'
  });

  return {
    // Try to log in with the given email and pass
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

    logout: function() {
      angularFireAuth.logout();
    },

    // Try to sign up with the given email and pass
    signup: function(email, password) {
      if(!email || !password) {
        return;
      }
      console.log('Signing up', name, email, password);

      angularFireAuth.createUser(email, password, function(err, user) {
        if(err && err.code == "EMAIL_TAKEN") {
          alert('That email is already taken');
        }
      });
    }
  };
})

