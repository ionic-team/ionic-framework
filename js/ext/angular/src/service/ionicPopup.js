angular.module('ionic.service.popup', ['ionic.service.templateLoad'])


.factory('$ionicPopup', ['$rootScope', '$q', '$document', '$compile', '$ionicTemplateLoader', function($rootScope, $q, $document, $compile, $ionicTemplateLoader) {

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

  var createPopup = function(opts) {
    var defaults = {
      title: '',
      animation: 'fade-in',
    };

    opts = angular.extend(defaults, opts);

    var scope = opts.scope && opts.scope.$new() || $rootScope.$new(true);
    angular.extend(scope, opts);

    // Compile the template
    var element = $compile('<ion-popup>' + opts.content + '</ion-popup>')(scope);
    $document[0].body.appendChild(element[0]);

    var popup = new ionic.views.Popup({el: element[0] });

    scope.popup = popup;

    return popup;
  };

  return {
    showPopup: function(data) {
      var q = $q.defer();
      // If there is an existing popup, just show that one
      var existing = getPopup();
      if(existing) {
        return existing.popup.show(data);
      }

      var popup = createPopup(data);

      popup.show(data);

      return q.promise;
    },
    alert: function(message, title, $scope) {
      this.showPopup({
        message: message,
        title: title,
        scope: $scope
      });
    },
    confirm: function(cb) {
    },
    prompt: function(cb) {
    },
    show: function(data) {
      // data.title
      // data.template
      // data.buttons
      this.showPopup(data);
    },
    showFromTemplate: function(url, data) {

    }
  };
}]);
