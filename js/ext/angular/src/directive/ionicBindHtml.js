angular.module('ionic.ui.bindHtml', [])
.directive('bindHtmlUnsafe', function () {
  return function (scope, element, attr) {
    element.addClass('ng-binding').data('$binding', attr.bindHtmlUnsafe);
    scope.$watch(attr.bindHtmlUnsafe, function(value) {
      element.html(value || '');
    });
  };
});
