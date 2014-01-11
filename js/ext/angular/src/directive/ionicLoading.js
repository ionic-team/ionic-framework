(function() {
'use strict';

angular.module('ionic.ui.loading', ['ionic.service.loading'])

.directive('loading', ['Loading', function(Loading) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    link: function(scope, element, attrs){
      // TODO: Use a provider service to set defaults?
      var defaults = {
        content: '',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 2000
      };
      element.addClass(scope.animation || '');
      // Anything in attrs can override defaults
      var opts = angular.extend(defaults, attrs);
      var loading = new ionic.views.Loading({
        el: element[0],
        maxWidth: opts.maxWidth,
        showDelay: opts.showDelay,
        content: opts.content
      });

      var localScope = scope.$new();
      localScope.refresh = function() { console.log(localScope.load, localScope.content);
        // Show or hide loader
        angular.bind(loading, (localScope.load ?  loading.show : loading.hide))();
          // Change content
          // TODO: Is this the best way?
        loading.setContent(localScope.content);
      };
      Loading.registerScope(localScope);
    },
    template: '<div class="loading-backdrop" ng-class="{enabled: showBackdrop}">' + 
                '<div class="loading" ng-transclude>' +
                '</div>' +
              '</div>'
  };
}]);

})();
