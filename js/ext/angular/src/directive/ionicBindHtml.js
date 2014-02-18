angular.module('ionic.ui.bindHtml', [])
.directive('ionBindHtmlUnsafe', function () {
  return function (scope, element, attr) {
    element.addClass('ng-binding').data('$binding', attr.ionBindHtmlUnsafe);
    scope.$watch(attr.ionBindHtmlUnsafe, function(value) {
      element.html(value || '');
    });
  };
});
