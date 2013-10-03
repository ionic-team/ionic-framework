angular.module('ionic.todo', ['ionic.todo.services', 'ionic.todo.controllers', 'firebase', 'ngRoute', 'ngAnimate'])

// Our Firebase URL
.constant('FIREBASE_URL', 'https://ionic-todo-demo.firebaseio.com/');
