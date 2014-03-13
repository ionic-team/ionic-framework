(function(ionic) {
'use strict';

angular.module('ionic.service.popup', ['ionic.service.templateLoad'])

/**
 * @ngdoc service
 * @name $ionicPopup
 * @module ionic
 * @restrict E
 * @description
 *
 * The Ionic Popup service makes it easy to programatically create and show popup
 * windows that require the user to respond in order to continue:
 *
 * ![Popup](http://ionicframework.com.s3.amazonaws.com/docs/controllers/popup.png)
 *
 * The popup system has support for nicer versions of the built in `alert()` `prompt()` and `confirm()` functions
 * you are used to in the browser, but with more powerful support for customizing input types in the case of
 * prompt, or customizing the look of the window.
 *
 * But the true power of the Popup is when a built-in popup just won't cut it. Luckily, the popup window
 * has full support for arbitrary popup content, and a simple promise-based system for returning data
 * entered by the user.
 *
 * @usage
 * To trigger a Popup in your code, use the $ionicPopup service in your angular controllers:
 *
 * ```js
 * angular.module('mySuperApp', ['ionic'])
 * .controller(function($scope, $ionicPopup) {
 *
 *  // Triggered on a button click, or some other target
    $scope.showPopup = function() {
      $scope.data = {}

      // An elaborate, custom popup
      $ionicPopup.show({
        templateUrl: 'popup-template.html',
        title: 'Enter Wi-Fi Password',
        subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
          { text: 'Cancel', onTap: function(e) { return true; } },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              return $scope.data.wifi;
            }
          },
        ]
      }).then(function(res) {
        console.log('Tapped!', res);
      }, function(err) {
        console.log('Err:', err);
      }, function(msg) {
        console.log('message:', msg);
      });

      // A confirm dialog
      $scope.showConfirm = function() {
        $ionicPopup.confirm({
          title: 'Consume Ice Cream',
          content: 'Are you sure you want to eat this ice cream?'
        }).then(function(res) {
          if(res) {
            console.log('You are sure');
          } else {
            console.log('You are not sure');
          }
        });
      };

      // A prompt dialog
      $scope.showPrompt = function() {
        $ionicPopup.prompt({
          title: 'ID Check',
          content: 'What is your name?'
        }).then(function(res) {
          console.log('Your name is', res);
        });
      };

      // A prompt with password input dialog
      $scope.showPasswordPrompt = function() {
        $ionicPopup.prompt({
          title: 'Password Check',
          content: 'Enter your secret password',
          inputType: 'password',
          inputPlaceholder: 'Your password'
        }).then(function(res) {
          console.log('Your name is', res);
        });
      };

      // An alert dialog
      $scope.showAlert = function() {
        $ionicPopup.alert({
          title: 'Don\'t eat that!',
          content: 'It might taste good'
        }).then(function(res) {
          console.log('Thank you for not eating my delicious ice cream cone');
        });
      };
    };
  });
  ```
 
 */
.factory('$ionicPopup', ['$rootScope', '$q', '$document', '$compile', '$timeout', '$ionicTemplateLoader',
  function($rootScope, $q, $document, $compile, $timeout, $ionicTemplateLoader) {

  // TODO: Make this configurable
  var popupOptions = {
    // How long to wait after a popup is already shown to show another one
    stackPushDelay: 50
  }

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

  // Show the backdrop element
  var showBackdrop = function() {
    var el = $compile('<ion-popup-backdrop></ion-popup-backdrop>')($rootScope.$new(true));
    $document[0].body.appendChild(el[0]);
    backdropEl = el;
  };

  // Remove the backdrop element
  var removeBackdrop = function() {
    backdropEl.remove();
  };

  // Push the new popup onto the stack with the given data and scope.
  // If this is the first one in the stack, show the backdrop, otherwise don't.
  var pushAndShow = function(popup, data) {
    var lastPopup = popupStack[popupStack.length-1];

    popupStack.push(popup);

    // If this is the first popup, show the backdrop
    if(popupStack.length == 1) {
      showBackdrop();
    }

    // If we have an existing popup, add a delay between hiding and showing it
    if(lastPopup) {
      hideSinglePopup(lastPopup);
      $timeout(function() {
        showSinglePopup(popup);
      }, popupOptions.stackPushDelay);
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
    return '<ion-popup title="' + opts.title + '" buttons="buttons" on-button-tap="onButtonTap(button, event)" on-close="onClose(button, result, event)">' 
        + (content || '') + 
      '</ion-popup>';
  };


  // Given an options object, build a new popup window and return a promise
  // which will contain the constructed popup at a later date. Perhaps at a later
  // year even. At this point, it's hard to say.
  var createPopup = function(opts, responseDeferred) {
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

    scope.onClose = function(button, result, event) {
      popAndRemove(scope.popup);
      responseDeferred.resolve(result);
    };

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
      var popupTemplate = buildPopupTemplate(opts, opts.template || opts.content);
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

      createPopup(data, q).then(function(popup, scope) {

        // We constructed the popup, push it on the stack and show it
        pushAndShow(popup, data);

      }, function(err) {
        console.error('Unable to load popup:', err);
      });

      return q.promise;
    },

    // Show a standard alert popup 
    alert: function(opts) {
      return this.showPopup({
        content: opts.content || '',
        title: opts.title || '',
        buttons: [
          {
            text: opts.okText || 'OK',
            type: opts.okType || 'button-positive',
            onTap: function(e) {
              return true;
            }
          }
        ]
      });
    },

    // Show a standard confirm popup
    confirm: function(opts) {
      return this.showPopup({
        content: opts.content || '',
        title: opts.title || '',
        buttons: [
          {
            text: opts.cancelText || 'Cancel' ,
            type: opts.cancelType || 'button-default',
            onTap: function(e) { e.preventDefault(); }
          },
          {
            text: opts.okText || 'OK',
            type: opts.okType || 'button-positive',
            onTap: function(e) {
              return true;
            }
          }
        ]
      });
    },

    // Show a standard prompt popup
    prompt: function(opts) {
      var scope = $rootScope.$new(true);
      scope.data = {};
      return this.showPopup({
        content: opts.content || '',
        title: opts.title || '',
        scope: scope,
        template: '<input ng-model="data.response" type="' + (opts.inputType || 'text') + '" placeholder="' + (opts.inputPlaceholder || '') + '">',
        buttons: [
          {
            text: opts.cancelText || 'Cancel',
            type: opts.okType || 'button-default',
            onTap: function(e) { e.preventDefault(); }
          },
          {
            text: opts.okText || 'OK',
            type: opts.okType || 'button-positive',
            onTap: function(e) {
              return scope.data.response;
            }
          }
        ]
      });
    },
    
    // Show an arbitrary popup
    show: function(data) {
      return this.showPopup(data);
    }
  };
}]);

})(ionic);
