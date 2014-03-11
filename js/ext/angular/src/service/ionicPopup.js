(function(ionic) {
'use strict';

angular.module('ionic.service.popup', ['ionic.service.templateLoad'])

.factory('$ionicPopup', ['$rootScope', '$q', '$document', '$compile', '$timeout', '$ionicTemplateLoader',
  function($rootScope, $q, $document, $compile, $timeout, $ionicTemplateLoader) {

  // Center the given popup
  var positionPopup = function(popup) {
    popup.el.style.marginLeft = (-popup.el.offsetWidth) / 2 + 'px';
    popup.el.style.marginTop = (-popup.el.offsetHeight) / 2 + 'px';
  };

  // Hide the body of the given popup if it's empty
  var hideBody = function(popup) {
    var bodyEl = popup.el.querySelector('.popup-body');
    if(bodyEl && bodyEl.innerHTML.trim() == '') {
      bodyEl.style.display = 'none';
    }
  };

  // Show a single popup
  var showSinglePopup = function(popup, opts) {
    var _this = this;

    ionic.requestAnimationFrame(function() {
      hideBody(popup);
      positionPopup(popup);
      popup.el.classList.remove('popup-hidden');
      popup.el.classList.add('popup-showing');
      popup.el.classList.add('active');
    });
  };

  // Show a popup that was already shown at one point in the past
  var reshowSinglePopup = function(popup) {
    ionic.requestAnimationFrame(function() {
      popup.el.classList.remove('popup-hidden');
      popup.el.classList.add('popup-showing');
      popup.el.classList.add('active');
    });
  };

  // Hide a single popup
  var hideSinglePopup = function(popup) {
    ionic.requestAnimationFrame(function() {
      popup.el.classList.remove('active');
      popup.el.classList.add('popup-hidden');
    });
  };

  // Remove a popup once and for all
  var removeSinglePopup = function(popup) {
    // Force a reflow so the animation will actually run
    popup.el.offsetWidth;

    popup.el.classList.remove('active');
    popup.el.classList.add('popup-hidden');

    $timeout(function() {
      popup.el.remove();
    }, 400);
  };


  /**
   * Popup stack and directive
   */

  var popupStack = [];
  var backdropEl = null;

  var showBackdrop = function() {
    var el = $compile('<ion-popup-backdrop></ion-popup-backdrop>')($rootScope.$new(true));
    $document[0].body.appendChild(el[0]);
    backdropEl = el;
  };

  var removeBackdrop = function() {
    backdropEl.remove();
  };

  // Push the new popup onto the stack with the given data and scope.
  // If this is the first one in the stack, show the backdrop, otherwise don't.
  var pushAndShow = function(popup, data, q) {
    var lastPopup = popupStack[popupStack.length-1];

    popupStack.push(popup);

    // If this is the first popup, show the backdrop
    if(popupStack.length == 1) {
      showBackdrop();
    }

    // TODO: Use the q field to resolve/reject based on popup response

    // If we have an existing popup, add a delay between hiding and showing it
    if(lastPopup) {
      hideSinglePopup(lastPopup);
      $timeout(function() {
        showSinglePopup(popup);
      }, 50);
    } else {
      // Otherwise, immediately show it
      showSinglePopup(popup);
    }

  };

  // Pop the current popup off the stack. If there are other popups, show them
  // otherwise hide the backdrop.
  var popAndRemove = function(popup) {
    var lastPopup = popupStack.pop();
    var nextPopup = popupStack[popupStack.length-1];
    removeSinglePopup(lastPopup);

    if(nextPopup) {
      reshowSinglePopup(nextPopup);
    } else {
      removeBackdrop();
    }
  };

  // Append the element to the screen, create the popup view,
  // and add the popup to the scope
  var constructPopupOnScope = function(element, scope) {
    var popup = {
      el: element[0],
      scope: scope
    };

    scope.popup = popup;

    return popup;
  }

  var buildPopupTemplate = function(opts, content) {
    return '<ion-popup title="' + opts.title + '" buttons="buttons" on-button-tap="onButtonTap(button, event)" on-close="onClose(button, event)">' 
        + (content || '') + 
      '</ion-popup>';
  };


  // Given an options object, build a new popup window and return a promise
  // which will contain the constructed popup at a later date. Perhaps at a later
  // year even. At this point, it's hard to say.
  var createPopup = function(opts) {
    var q = $q.defer();

    // Create some defaults
    var defaults = {
      title: '',
      animation: 'fade-in',
    };

    opts = angular.extend(defaults, opts);

    // Create a new scope, and bind some of the options stuff to that scope
    var scope = opts.scope && opts.scope.$new() || $rootScope.$new(true);
    angular.extend(scope, opts);

    scope.onClose = function() {
      popAndRemove(scope.popup);
    }
    scope.onButtonTap = function() {
      console.log('ON BUTTON!!!');
    }

    // Check if we need to load a template for the content of the popup
    if(opts.templateUrl) {

      // Load the template externally
      $ionicTemplateLoader.load(opts.templateUrl).then(function(templateString) {

        var popupTemplate = buildPopupTemplate(opts, templateString);
        var element = $compile(popupTemplate)(scope);
        $document[0].body.appendChild(element[0]);
        q.resolve(constructPopupOnScope(element, scope));

      }, function(err) {
        // Error building the popup
        q.reject(err);
      });

    } else {
      // Compile the template
      var popupTemplate = buildPopupTemplate(opts, opts.content);
      var element = $compile(popupTemplate)(scope);
      $document[0].body.appendChild(element[0]);
      q.resolve(constructPopupOnScope(element, scope));
    }

    return q.promise;
  };



  // Public API
  return {
    showPopup: function(data) {
      var q = $q.defer();

      createPopup(data).then(function(popup, scope) {

        // We constructed the popup, push it on the stack and show it
        pushAndShow(popup, data, scope, q);

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

})(ionic);
