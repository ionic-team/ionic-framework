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

  // Append the element to the screen, create the popup view,
  // and add the popup to the scope
  var constructPopupOnScope = function(element, scope) {
    $document[0].body.appendChild(element[0]);

    var popup = new ionic.views.Popup({el: element[0] });

    scope.popup = popup;

    return popup;
  }

  var createPopup = function(opts) {
    var q = $q.defer();

    var defaults = {
      title: '',
      animation: 'fade-in',
    };

    opts = angular.extend(defaults, opts);

    var scope = opts.scope && opts.scope.$new() || $rootScope.$new(true);
    angular.extend(scope, opts);

    // Check if we need to load a template for the content of the popup
    if(opts.templateUrl) {
      $ionicTemplateLoader.load(opts.templateUrl).then(function(templateString) {
        var element = $compile('<ion-popup>' + templateString + '</ion-popup>')(scope);
        q.resolve(constructPopupOnScope(element, scope));
      }, function(err) {
        q.reject(err);
      });

    } else {
      // Compile the template
      var element = $compile('<ion-popup>' + opts.content + '</ion-popup>')(scope);
      q.resolve(constructPopupOnScope(element, scope));
    }

    return q.promise;
  };

  return {
    showPopup: function(data) {
      var q = $q.defer();
      // If there is an existing popup, just show that one
      var existing = getPopup();
      if(existing) {
        return existing.popup.show(data);
      }

      createPopup(data).then(function(popup) {
        popup.show(data);
      }, function(err) {
        console.error('Unable to load popup:', err);
      });

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
