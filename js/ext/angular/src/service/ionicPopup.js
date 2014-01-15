angular.module('ionic.service.popup', ['ionic.service.templateLoad'])


.factory('$ionicPopup', ['$rootScope', '$document', '$compile', '$ionicTemplateLoader', function($rootScope, $document, $compile, $ionicTemplateLoader) {

  var getPopup = function() {
    // Make sure there is only one loading element on the page at one point in time
    var existing = angular.element($document[0].querySelector('.popup'));
    if(existing.length) {
      var scope = existing.scope();
      if(scope.popup) {
        return scope;
      }
    }
  };

  var createPopup = function($scope, opts) {
    var defaults = {
      title: '',
      animation: 'fade-in',
    };

    opts = angular.extend(defaults, opts);

    var scope = $scope && $scope.$new() || $rootScope.$new(true);
    angular.extend(scope, opts);

    // Compile the template
    var element = $compile('<popup>' + opts.content + '</popup>')(scope);
    $document[0].body.appendChild(element[0]);

    var popup = new ionic.views.Popup({el: element[0] });

    scope.popup = popup;

    return popup;
  };

  return {
    alert: function(message, title, $scope) {

      // If there is an existing popup, just show that one
      var existing = getPopup();
      if(existing) {
        return existing.popup.alert(message, title);
      }

      var popup = createPopup($scope, {
        title: title,
        message: message
      });

      popup.alert(message, title);

    },
    confirm: function(cb) {
    },
    prompt: function(cb) {
    },
    show: function(data) {
      // data.title
      // data.template
      // data.buttons

    },
    showFromTemplate: function(url, data) {

    }
  };
}]);
