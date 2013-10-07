angular.module('ionic.todo', [
               'ionic.todo.filters',
               'ionic.todo.services',
               'ionic.todo.controllers',

               'ionic.service.modal',
               'ionic.service.actionSheet',

               'ionic.ui.nav',
               'ionic.ui.content',
               'ionic.ui.sideMenu',
               'ionic.ui.actionSheet',

               'firebase',
               'ngRoute',
               'ngAnimate'])

// Our Firebase URL
.constant('FIREBASE_URL', 'https://ionic-todo-demo.firebaseio.com/todo');
