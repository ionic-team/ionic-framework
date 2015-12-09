/**
* @ngdoc directive
* @name ionTitle
* @module ionic
* @restrict E
*
* Used for titles in header and nav bars. New in 1.2
*
* Identical to <div class="title"> but with future compatibility for Ionic 2
*
* @usage
*
* ```html
* <ion-nav-bar>
*   <ion-title>Hello</ion-title>
* <ion-nav-bar>
* ```
*/
IonicModule
.directive('ionTitle', [function() {
  return {
    restrict: 'E',
    compile: function(element) {
      element.addClass('title');
    }
  };
}]);
