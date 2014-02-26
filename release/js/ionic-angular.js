/*!
 * Copyright 2014 Drifty Co.
 * http://drifty.com/
 *
 * Ionic, v0.9.26
 * A powerful HTML5 mobile app framework.
 * http://ionicframework.com/
 *
 * By @maxlynch, @benjsperry, @adamdbradley <3
 *
 * Licensed under the MIT license. Please see LICENSE for more information.
 *
 */
;
/**
 * Create a wrapping module to ease having to include too many
 * modules.
 */
angular.module('ionic.service', [
  'ionic.service.bind',
  'ionic.service.platform',
  'ionic.service.actionSheet',
  'ionic.service.gesture',
  'ionic.service.loading',
  'ionic.service.modal',
  'ionic.service.popup',
  'ionic.service.templateLoad',
  'ionic.service.view',
  'ionic.decorator.location'
]);

// UI specific services and delegates
angular.module('ionic.ui.service', [
  'ionic.ui.service.scrollDelegate',
  'ionic.ui.service.slideBoxDelegate',
  'ionic.ui.service.sideMenuDelegate',
]);

angular.module('ionic.ui', [
                            'ionic.ui.content',
                            'ionic.ui.scroll',
                            'ionic.ui.tabs',
                            'ionic.ui.viewState',
                            'ionic.ui.header',
                            'ionic.ui.sideMenu',
                            'ionic.ui.slideBox',
                            'ionic.ui.list',
                            'ionic.ui.checkbox',
                            'ionic.ui.toggle',
                            'ionic.ui.radio',
                            'ionic.ui.touch'
                           ]);


angular.module('ionic', [
    'ionic.service',
    'ionic.ui.service',
    'ionic.ui',

    // Angular deps
    'ngAnimate',
    'ngSanitize',
    'ui.router'
]);
;

angular.element.prototype.addClass = function(cssClasses) {
  var x, y, cssClass, el, splitClasses, existingClasses;
  if (cssClasses && cssClasses != 'ng-scope' && cssClasses != 'ng-isolate-scope') {
    for(x=0; x<this.length; x++) {
      el = this[x];
      if(el.setAttribute) {

        if(cssClasses.indexOf(' ') < 0) {
          el.classList.add(cssClasses);
        } else {
          existingClasses = (' ' + (el.getAttribute('class') || '') + ' ')
            .replace(/[\n\t]/g, " ");
          splitClasses = cssClasses.split(' ');

          for (y=0; y<splitClasses.length; y++) {
            cssClass = splitClasses[y].trim();
            if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
              existingClasses += cssClass + ' ';
            }
          }
          el.setAttribute('class', existingClasses.trim());
        }
      }
    }
  }
  return this;
};

angular.element.prototype.removeClass = function(cssClasses) {
  var x, y, splitClasses, cssClass, el;
  if (cssClasses) {
    for(x=0; x<this.length; x++) {
      el = this[x];
      if(el.getAttribute) {
        if(cssClasses.indexOf(' ') < 0) {
          el.classList.remove(cssClasses);
        } else {
          splitClasses = cssClasses.split(' ');

          for (y=0; y<splitClasses.length; y++) {
            cssClass = splitClasses[y];
            el.setAttribute('class', (
                (" " + (el.getAttribute('class') || '') + " ")
                .replace(/[\n\t]/g, " ")
                .replace(" " + cssClass.trim() + " ", " ")).trim()
            );
          }
        }
      }
    }
  }
  return this;
};;
angular.module('ionic.decorator.location', [])

.config(['$provide', function($provide) {
  $provide.decorator('$location', ['$delegate', '$timeout', $LocationDecorator]);
}]);

function $LocationDecorator($location, $timeout) {

  $location.__hash = $location.hash;
  //Fix: first time window.location.hash is set, the scrollable area
  //found nearest to body's scrollTop is set to scroll to an element
  //with that ID.
  $location.hash = function(value) {
    if (angular.isDefined(value)) {
      $timeout(function() {
        var scroll = document.querySelector('.scroll-content');
        if (scroll)
          scroll.scrollTop = 0;
      }, 0, false);
    }
    return $location.__hash(value);
  };

  return $location;
}
;
(function() {
'use strict';

angular.module('ionic.ui.service.scrollDelegate', [])

.factory('$ionicScrollDelegate', ['$rootScope', '$timeout', '$q', '$anchorScroll', '$location', '$document', function($rootScope, $timeout, $q, $anchorScroll, $location, $document) {
  return {
    /**
     * Trigger a scroll-to-top event on child scrollers.
     */
    scrollTop: function(animate) {
      $rootScope.$broadcast('scroll.scrollTop', animate);
    },
    scrollBottom: function(animate) {
      $rootScope.$broadcast('scroll.scrollBottom', animate);
    },
    scrollTo: function(left, top, animate) {
      $rootScope.$broadcast('scroll.scrollTo', left, top, animate);
    },
    resize: function() {
      $rootScope.$broadcast('scroll.resize');
    },
    anchorScroll: function(animate) {
      $rootScope.$broadcast('scroll.anchorScroll', animate);
    },
    tapScrollToTop: function(element, animate) {
      var _this = this;
      if (!angular.isDefined(animate)) {
        animate = true;
      }

      ionic.on('tap', function(e) {
        var target = e.target;
        //Don't scroll to top for a button click
        if (ionic.DomUtil.getParentOrSelfWithClass(target, 'button')) {
          return;
        }

        var el = element[0];
        var bounds = el.getBoundingClientRect();

        if(ionic.DomUtil.rectContains(e.gesture.touches[0].pageX, e.gesture.touches[0].pageY, bounds.left, bounds.top, bounds.left + bounds.width, bounds.top + 20)) {
          _this.scrollTop(animate);
        }
      }, element[0]);
    },

    finishRefreshing: function($scope) {
      $scope.$broadcast('scroll.refreshComplete');
    },

    /**
     * Attempt to get the current scroll view in scope (if any)
     *
     * Note: will not work in an isolated scope context.
     */
    getScrollView: function($scope) {
      return $scope.scrollView;
    },

    /**
     * Register a scope and scroll view for scroll event handling.
     * $scope {Scope} the scope to register and listen for events
     */
    register: function($scope, $element, scrollView) {

      var scrollEl = $element[0];

      function scrollViewResize() {
        // Run the resize after this digest
        return $timeout(function() {
          scrollView.resize();
        });
      }

      $element.on('scroll', function(e) {
        var detail = (e.originalEvent || e).detail || {};

        $scope.$onScroll && $scope.$onScroll({
          event: e,
          scrollTop: detail.scrollTop || 0,
          scrollLeft: detail.scrollLeft || 0
        });

      });

      $scope.$parent.$on('scroll.resize', scrollViewResize);

      // Called to stop refreshing on the scroll view
      $scope.$parent.$on('scroll.refreshComplete', function(e) {
        scrollView.finishPullToRefresh();
      });

      $scope.$parent.$on('scroll.anchorScroll', function(e, animate) {
        scrollViewResize().then(function() {
          var hash = $location.hash();
          var elm;
          if (hash && (elm = document.getElementById(hash)) ) {
            var scroll = ionic.DomUtil.getPositionInParent(elm, scrollEl);
            scrollView.scrollTo(scroll.left, scroll.top, !!animate);
          } else {
            scrollView.scrollTo(0,0, !!animate);
          }
        });
      });

      $scope.$parent.$on('scroll.scrollTo', function(e, left, top, animate) {
        scrollViewResize().then(function() {
          scrollView.scrollTo(left, top, !!animate);
        });
      });
      $scope.$parent.$on('scroll.scrollTop', function(e, animate) {
        scrollViewResize().then(function() {
          scrollView.scrollTo(0, 0, !!animate);
        });
      });
      $scope.$parent.$on('scroll.scrollBottom', function(e, animate) {
        scrollViewResize().then(function() {
          var sv = scrollView;
          if (sv) {
            var max = sv.getScrollMax();
            sv.scrollTo(max.left, max.top, !!animate);
          }
        });
      });
    }
  };
}]);

})(ionic);
;
(function() {
'use strict';

angular.module('ionic.ui.service.sideMenuDelegate', [])

.factory('$ionicSideMenuDelegate', ['$rootScope', '$timeout', '$q', function($rootScope, $timeout, $q) {
  return {
    getSideMenuController: function($scope) {
      return $scope.sideMenuController;
    },
    close: function($scope) {
      if($scope.sideMenuController) {
        $scope.sideMenuController.close();
      }
    },
    toggleLeft: function($scope) {
      if($scope.sideMenuController) {
        $scope.sideMenuController.toggleLeft();
      }
    },
    toggleRight: function($scope) {
      if($scope.sideMenuController) {
        $scope.sideMenuController.toggleRight();
      }
    },
    openLeft: function($scope) {
      if($scope.sideMenuController) {
        $scope.sideMenuController.openPercentage(100);
      }
    },
    openRight: function($scope) {
      if($scope.sideMenuController) {
        $scope.sideMenuController.openPercentage(-100);
      }
    }
  };
}]);

})();
;
(function() {
'use strict';

angular.module('ionic.ui.service.slideBoxDelegate', [])

.factory('$ionicSlideBoxDelegate', ['$rootScope', '$timeout', function($rootScope, $timeout) {
  return {
    /**
     * Trigger a slidebox to update and resize itself
     */
    update: function(animate) {
      $rootScope.$broadcast('slideBox.update');
    },

    register: function($scope, $element) {
      $scope.$parent.$on('slideBox.update', function(e) {
        if(e.defaultPrevented) {
          return;
        }
        $timeout(function() {
          $scope.$parent.slideBox.setup();
        });
        e.preventDefault();
      });
    }
  };
}]);

})(ionic);
;
angular.module('ionic.service.actionSheet', ['ionic.service.templateLoad', 'ionic.service.platform', 'ionic.ui.actionSheet', 'ngAnimate'])

.factory('$ionicActionSheet', ['$rootScope', '$document', '$compile', '$animate', '$timeout',
    '$ionicTemplateLoader', '$ionicPlatform',
    function($rootScope, $document, $compile, $animate, $timeout, $ionicTemplateLoader, $ionicPlatform) {

  return {
    /**
     * Load an action sheet with the given template string.
     *
     * A new isolated scope will be created for the 
     * action sheet and the new element will be appended into the body.
     *
     * @param {object} opts the options for this ActionSheet (see docs)
     */
    show: function(opts) {
      var scope = $rootScope.$new(true);

      angular.extend(scope, opts);

      // Compile the template
      var element = $compile('<ion-action-sheet buttons="buttons"></ion-action-sheet>')(scope);

      // Grab the sheet element for animation
      var sheetEl = angular.element(element[0].querySelector('.action-sheet-wrapper'));

      var hideSheet = function(didCancel) {
        $animate.leave(sheetEl, function() {
          if(didCancel) {
            opts.cancel();
          }
        });
        
        $animate.removeClass(element, 'active', function() {
          scope.$destroy();
        });

        $document[0].body.classList.remove('action-sheet-open');
      };

      var onHardwareBackButton = function() {
        hideSheet();
      };

      scope.$on('$destroy', function() {
        $ionicPlatform.offHardwareBackButton(onHardwareBackButton);
      });

      // Support Android back button to close
      $ionicPlatform.onHardwareBackButton(onHardwareBackButton);

      scope.cancel = function() {
        hideSheet(true);
      };

      scope.buttonClicked = function(index) {
        // Check if the button click event returned true, which means
        // we can close the action sheet
        if((opts.buttonClicked && opts.buttonClicked(index)) === true) {
          hideSheet(false);
        }
      };

      scope.destructiveButtonClicked = function() {
        // Check if the destructive button click event returned true, which means
        // we can close the action sheet
        if((opts.destructiveButtonClicked && opts.destructiveButtonClicked()) === true) {
          hideSheet(false);
        }
      };

      $document[0].body.appendChild(element[0]);

      $document[0].body.classList.add('action-sheet-open');

      var sheet = new ionic.views.ActionSheet({el: element[0] });
      scope.sheet = sheet;

      $animate.addClass(element, 'active');
      $animate.enter(sheetEl, element, null, function() {
      });

      return sheet;
    }
  };

}]);
;
angular.module('ionic.service.bind', [])
.factory('$ionicBind', ['$parse', '$interpolate', function($parse, $interpolate) {
  var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/;
  return function(scope, attrs, bindDefinition) {
    angular.forEach(bindDefinition || {}, function (definition, scopeName) {
      //Adapted from angular.js $compile
      var match = definition.match(LOCAL_REGEXP) || [],
        attrName = match[3] || scopeName,
        mode = match[1], // @, =, or &
        parentGet,
        unwatch;

      switch(mode) {
        case '@':
          if (!attrs[attrName]) {
            return;
          }
          attrs.$observe(attrName, function(value) {
            scope[scopeName] = value;
          });
          // we trigger an interpolation to ensure
          // the value is there for use immediately
          if (attrs[attrName]) {
            scope[scopeName] = $interpolate(attrs[attrName])(scope);
          }
          break;

        case '=':
          if (!attrs[attrName]) {
            return;
          }
          unwatch = scope.$watch(attrs[attrName], function(value) {
            scope[scopeName] = value;
          });
          //Destroy parent scope watcher when this scope is destroyed
          scope.$on('$destroy', unwatch);
          break;

        case '&':
          /* jshint -W044 */
          if (attrs[attrName] && attrs[attrName].match(RegExp(scopeName + '\(.*?\)'))) {
            throw new Error('& expression binding "' + scopeName + '" looks like it will recursively call "' +
                          attrs[attrName] + '" and cause a stack overflow! Please choose a different scopeName.');
          }
          parentGet = $parse(attrs[attrName]);
          scope[scopeName] = function(locals) {
            return parentGet(scope, locals);
          };
          break;
      }
    });
  };
}]);
;
angular.module('ionic.service.gesture', [])

.factory('$ionicGesture', [function() {
  return {
    on: function(eventType, cb, $element) {
      return window.ionic.onGesture(eventType, cb, $element[0]);
    },
    off: function(gesture, eventType, cb) {
      return window.ionic.offGesture(gesture, eventType, cb);
    }
  };
}]);
;
angular.module('ionic.service.loading', ['ionic.ui.loading'])

.factory('$ionicLoading', ['$rootScope', '$document', '$compile', function($rootScope, $document, $compile) {
  return {
    /**
     * Load an action sheet with the given template string.
     *
     * A new isolated scope will be created for the
     * action sheet and the new element will be appended into the body.
     *
     * @param {object} opts the options for this ActionSheet (see docs)
     */
    show: function(opts) {
      var defaults = {
        content: '',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      };

      opts = angular.extend(defaults, opts);

      var scope = $rootScope.$new(true);
      angular.extend(scope, opts);

      // Make sure there is only one loading element on the page at one point in time
      var existing = angular.element($document[0].querySelector('.loading-backdrop'));
      if(existing.length) {
        existing.remove();
      }

      // Compile the template
      var element = $compile('<ion-loading>' + opts.content + '</ion-loading>')(scope);

      $document[0].body.appendChild(element[0]);

      var loading = new ionic.views.Loading({
        el: element[0],
        maxWidth: opts.maxWidth,
        showDelay: opts.showDelay
      });

      loading.show();

      scope.loading = loading;

      return loading;
    }
  };
}]);
;
angular.module('ionic.service.modal', ['ionic.service.templateLoad', 'ionic.service.platform', 'ngAnimate'])


.factory('$ionicModal', ['$rootScope', '$document', '$compile', '$animate', '$q', '$timeout', '$ionicPlatform', '$ionicTemplateLoader', function($rootScope, $document, $compile, $animate, $q, $timeout, $ionicPlatform, $ionicTemplateLoader) {
  var ModalView = ionic.views.Modal.inherit({
    initialize: function(opts) {
      ionic.views.Modal.prototype.initialize.call(this, opts);
      this.animation = opts.animation || 'slide-in-up';
    },
    // Show the modal
    show: function() {
      var self = this;
      var element = angular.element(this.el);

      document.body.classList.add('modal-open');

      self._isShown = true;

      if(!element.parent().length) {
        element.addClass(this.animation);
        $animate.enter(element, angular.element($document[0].body), null, function() {
        });
        ionic.views.Modal.prototype.show.call(self);
      } else {
        $animate.addClass(element, this.animation, function() {
        });
      }

      if(!this.didInitEvents) {
        var onHardwareBackButton = function() {
          self.hide();
        };

        self.scope.$on('$destroy', function() {
          $ionicPlatform.offHardwareBackButton(onHardwareBackButton);
        });

        // Support Android back button to close
        $ionicPlatform.onHardwareBackButton(onHardwareBackButton);

        this.didInitEvents = true;
      }

      this.scope.$parent.$broadcast('modal.shown', this);

    },
    // Hide the modal
    hide: function() {
      this._isShown = false;
      var element = angular.element(this.el);
      $animate.removeClass(element, this.animation, function() {
        onHideModal(element[0]);
      });

      ionic.views.Modal.prototype.hide.call(this);

      this.scope.$parent.$broadcast('modal.hidden', this);
    },

    // Remove and destroy the modal scope
    remove: function() {
      var self  = this,
          element = angular.element(this.el);
      this._isShown = false;
      $animate.leave(angular.element(this.el), function() {
        onHideModal(element[0]);
        self.scope.$parent.$broadcast('modal.removed', self);
        self.scope.$destroy();
      });
    },

    isShown: function() {
      return !!this._isShown;
    }
  });

  function onHideModal(element) {
    document.body.classList.remove('modal-open');
  }

  var createModal = function(templateString, options) {
    // Create a new scope for the modal
    var scope = options.scope && options.scope.$new() || $rootScope.$new(true);

    // Compile the template
    var element = $compile(templateString)(scope);

    options.el = element[0];
    var modal = new ModalView(options);

    modal.scope = scope;

    // If this wasn't a defined scope, we can assign 'modal' to the isolated scope
    // we created
    if(!options.scope) {
      scope.modal = modal;
    }

    return modal;
  };

  return {
    /**
     * Load a modal with the given template string.
     *
     * A new isolated scope will be created for the
     * modal and the new element will be appended into the body.
     */
    fromTemplate: function(templateString, options) {
      var modal = createModal(templateString, options || {});
      return modal;
    },
    fromTemplateUrl: function(url, cb, options) {
      return $ionicTemplateLoader.load(url).then(function(templateString) {
        var modal = createModal(templateString, options || {});
        cb ? cb(modal) : null;
        return modal;
      });
    },
  };
}]);
;
(function(ionic) {'use strict';

angular.module('ionic.service.platform', [])

/**
 * The platformProvider makes it easy to set and detect which platform
 * the app is currently running on. It has some auto detection built in
 * for PhoneGap and Cordova. This provider also takes care of
 * initializing some defaults that depend on the platform, such as the
 * height of header bars on iOS 7.
 */
.provider('$ionicPlatform', function() {

  return {
    $get: ['$q', function($q) {
      return {
        /**
         * Some platforms have hardware back buttons, so this is one way to bind to it.
         *
         * @param {function} cb the callback to trigger when this event occurs
         */
        onHardwareBackButton: function(cb) {
          ionic.Platform.ready(function() {
            document.addEventListener('backbutton', cb, false);
          });
        },

        /**
         * Remove an event listener for the backbutton.
         *
         * @param {function} fn the listener function that was originally bound.
         */
        offHardwareBackButton: function(fn) {
          ionic.Platform.ready(function() {
            document.removeEventListener('backbutton', fn);
          });
        },

        is: function(type) {
          return ionic.Platform.is(type);
        },

        /**
         * Trigger a callback once the device is ready, or immediately if the device is already
         * ready.
         */
        ready: function(cb) {
          var q = $q.defer();

          ionic.Platform.ready(function(){
            q.resolve();
            cb();
          });

          return q.promise;
        }
      };
    }]
  };
  
});

})(ionic);
;
angular.module('ionic.service.popup', ['ionic.service.templateLoad'])


.factory('$ionicPopup', ['$rootScope', '$document', '$compile', 'TemplateLoader', function($rootScope, $document, $compile, TemplateLoader) {

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

  return {
    alert: function(message, $scope) {

      // If there is an existing popup, just show that one
      var existing = getPopup();
      if(existing) {
        return existing.popup.alert(message);
      }

      var defaults = {
        title: message,
        animation: 'fade-in',
      };

      opts = angular.extend(defaults, opts);

      var scope = $scope && $scope.$new() || $rootScope.$new(true);
      angular.extend(scope, opts);

      // Compile the template
      var element = $compile('<popup>' + opts.content + '</popup>')(scope);
      $document[0].body.appendChild(element[0]);

      var popup = new ionic.views.Popup({el: element[0] });
      popup.alert(message);

      scope.popup = popup;

      return popup;
    },
    confirm: function(cb) {
    },
    prompt: function(cb) {
    },
    show: function(data) {
      // data.title
      // data.template
      // data.buttons
    }
  };
}]);
;
angular.module('ionic.service.templateLoad', [])

.factory('$ionicTemplateLoader', ['$q', '$http', '$templateCache', function($q, $http, $templateCache) {
  return {
    load: function(url) {
      return $http.get(url, {cache: $templateCache})
      .then(function(response) {
        return response.data && response.data.trim();
      });
    }
  };
}]);
;
angular.module('ionic.service.view', ['ui.router', 'ionic.service.platform'])


.run(     ['$rootScope', '$state', '$location', '$document', '$animate', '$ionicPlatform',
  function( $rootScope,   $state,   $location,   $document,   $animate,   $ionicPlatform) {

  // init the variables that keep track of the view history
  $rootScope.$viewHistory = {
    histories: { root: { historyId: 'root', parentHistoryId: null, stack: [], cursor: -1 } },
    backView: null,
    forwardView: null,
    currentView: null,
    disabledRegistrableTagNames: []
  };

  $rootScope.$on('viewState.changeHistory', function(e, data) {
    if(!data) return;

    var hist = (data.historyId ? $rootScope.$viewHistory.histories[ data.historyId ] : null );
    if(hist && hist.cursor > -1 && hist.cursor < hist.stack.length) {
      // the history they're going to already exists
      // go to it's last view in its stack
      var view = hist.stack[ hist.cursor ];
      return view.go(data);
    }

    // this history does not have a URL, but it does have a uiSref
    // figure out its URL from the uiSref
    if(!data.url && data.uiSref) {
      data.url = $state.href(data.uiSref);
    }

    if(data.url) {
      // don't let it start with a #, messes with $location.url()
      if(data.url.indexOf('#') === 0) {
        data.url = data.url.replace('#', '');
      }
      if(data.url !== $location.url()) {
        // we've got a good URL, ready GO!
        $location.url(data.url);
      }
    }
  });

  // Set the document title when a new view is shown
  $rootScope.$on('viewState.viewEnter', function(e, data) {
    if(data && data.title) {
      $document[0].title = data.title;
    }
  });

  // Triggered when devices with a hardware back button (Android) is clicked by the user
  // This is a Cordova/Phonegap platform specifc method
  function onHardwareBackButton(e) {
    if($rootScope.$viewHistory.backView) {
      // there is a back view, go to it
      $rootScope.$viewHistory.backView.go();
    } else {
      // there is no back view, so close the app instead
      ionic.Platform.exitApp();
    }
    e.preventDefault();
    return false;
  }
  $ionicPlatform.onHardwareBackButton(onHardwareBackButton);

}])

.factory('$ionicViewService', ['$rootScope', '$state', '$location', '$window', '$injector',
                      function( $rootScope,   $state,   $location,   $window,   $injector) {
  var $animate = $injector.has('$animate') ? $injector.get('$animate') : false;

  var View = function(){};
  View.prototype.initialize = function(data) {
    if(data) {
      for(var name in data) this[name] = data[name];
      return this;
    }
    return null;
  };
  View.prototype.go = function() {

    if(this.stateName) {
      return $state.go(this.stateName, this.stateParams);
    }

    if(this.url && this.url !== $location.url()) {

      if($rootScope.$viewHistory.backView === this) {
        return $window.history.go(-1);
      } else if($rootScope.$viewHistory.forwardView === this) {
        return $window.history.go(1);
      }

      $location.url(this.url);
      return;
    }

    return null;
  };
  View.prototype.destory = function() {
    if(this.scope) {
      this.scope.destory && this.scope.destory();
      this.scope = null;
    }
  };

  function createViewId(stateId) {
    return ionic.Utils.nextUid();
  }

  return {

    register: function(containerScope, element) {

      var viewHistory = $rootScope.$viewHistory,
          currentStateId = this.getCurrentStateId(),
          hist = this._getHistory(containerScope),
          currentView = viewHistory.currentView,
          backView = viewHistory.backView,
          forwardView = viewHistory.forwardView,
          rsp = {
            viewId: null,
            navAction: null,
            navDirection: null,
            historyId: hist.historyId
          };

      if(element && !this.isTagNameRegistrable(element)) {
        // first check to see if this element can even be registered as a view.
        // Certain tags are only containers for views, but are not views themselves.
        // For example, the <ion-tabs> directive contains a <ion-tab> and the <ion-tab> is the
        // view, but the <ion-tabs> directive itself should not be registered as a view.
        rsp.navAction = 'disabledByTagName';
        return rsp;
      }

      if(currentView &&
         currentView.stateId === currentStateId &&
         currentView.historyId === hist.historyId) {
        // do nothing if its the same stateId in the same history
        rsp.navAction = 'noChange';
        return rsp;
      }

      if(viewHistory.forcedNav) {
        // we've previously set exactly what to do
        ionic.Utils.extend(rsp, viewHistory.forcedNav);
        $rootScope.$viewHistory.forcedNav = null;

      } else if(backView && backView.stateId === currentStateId) {
        // they went back one, set the old current view as a forward view
        rsp.viewId = backView.viewId;
        rsp.navAction = 'moveBack';
        currentView.scrollValues = {}; //when going back, erase scrollValues
        if(backView.historyId === currentView.historyId) {
          // went back in the same history
          rsp.navDirection = 'back';
        }

      } else if(forwardView && forwardView.stateId === currentStateId) {
        // they went to the forward one, set the forward view to no longer a forward view
        rsp.viewId = forwardView.viewId;
        rsp.navAction = 'moveForward';
        if(forwardView.historyId === currentView.historyId) {
          rsp.navDirection = 'forward';
        }

        var parentHistory = this._getParentHistoryObj(containerScope);
        if(forwardView.historyId && parentHistory.scope) {
          // if a history has already been created by the forward view then make sure it stays the same
          parentHistory.scope.$historyId = forwardView.historyId;
          rsp.historyId = forwardView.historyId;
        }

      } else if(currentView && currentView.historyId !== hist.historyId &&
                hist.cursor > -1 && hist.stack.length > 0 && hist.cursor < hist.stack.length &&
                hist.stack[hist.cursor].stateId === currentStateId) {
        // they just changed to a different history and the history already has views in it
        rsp.viewId = hist.stack[hist.cursor].viewId;
        rsp.navAction = 'moveBack';

      } else {

        // set a new unique viewId
        rsp.viewId = createViewId(currentStateId);

        if(currentView) {
          // set the forward view if there is a current view (ie: if its not the first view)
          currentView.forwardViewId = rsp.viewId;

          // its only moving forward if its in the same history
          if(hist.historyId === currentView.historyId) {
            rsp.navDirection = 'forward';
          }
          rsp.navAction = 'newView';

          // check if there is a new forward view
          if(forwardView && currentView.stateId !== forwardView.stateId) {
            // they navigated to a new view but the stack already has a forward view
            // since its a new view remove any forwards that existed
            var forwardsHistory = this._getView(forwardView.historyId);
            if(forwardsHistory) {
              // the forward has a history
              for(var x=forwardsHistory.stack.length - 1; x >= forwardView.index; x--) {
                // starting from the end destory all forwards in this history from this point
                forwardsHistory.stack[x].destory();
                forwardsHistory.stack.splice(x);
              }
            }
          }

        } else {
          // there's no current view, so this must be the initial view
          rsp.navAction = 'initialView';
        }

        // add the new view to the stack
        viewHistory.histories[rsp.viewId] = this.createView({
          viewId: rsp.viewId,
          index: hist.stack.length,
          historyId: hist.historyId,
          backViewId: (currentView && currentView.viewId ? currentView.viewId : null),
          forwardViewId: null,
          stateId: currentStateId,
          stateName: this.getCurrentStateName(),
          stateParams: this.getCurrentStateParams(),
          url: $location.url(),
          scrollValues: null
        });

        // add the new view to this history's stack
        hist.stack.push(viewHistory.histories[rsp.viewId]);
      }

      this.setNavViews(rsp.viewId);

      hist.cursor = viewHistory.currentView.index;

      return rsp;
    },

    setNavViews: function(viewId) {
      var viewHistory = $rootScope.$viewHistory;

      viewHistory.currentView = this._getView(viewId);
      viewHistory.backView = this._getBackView(viewHistory.currentView);
      viewHistory.forwardView = this._getForwardView(viewHistory.currentView);

      $rootScope.$broadcast('$viewHistory.historyChange', {
        showBack: (viewHistory.backView && viewHistory.backView.historyId === viewHistory.currentView.historyId)
      });
    },

    registerHistory: function(scope) {
      scope.$historyId = ionic.Utils.nextUid();
    },

    createView: function(data) {
      var newView = new View();
      return newView.initialize(data);
    },

    getCurrentView: function() {
      return $rootScope.$viewHistory.currentView;
    },

    getBackView: function() {
      return $rootScope.$viewHistory.backView;
    },

    getForwardView: function() {
      return $rootScope.$viewHistory.forwardView;
    },

    getNavDirection: function() {
      return $rootScope.$viewHistory.navDirection;
    },

    getCurrentStateName: function() {
      return ($state && $state.current ? $state.current.name : null);
    },

    isCurrentStateNavView: function(navView) {
      return ($state &&
              $state.current &&
              $state.current.views &&
              $state.current.views[navView] ? true : false);
    },

    getCurrentStateParams: function() {
      var rtn;
      if ($state && $state.params) {
        for(var key in $state.params) {
          if($state.params.hasOwnProperty(key)) {
            rtn = rtn || {};
            rtn[key] = $state.params[key];
          }
        }
      }
      return rtn;
    },

    getCurrentStateId: function() {
      var id;
      if($state && $state.current && $state.current.name) {
        id = $state.current.name;
        if($state.params) {
          for(var key in $state.params) {
            if($state.params.hasOwnProperty(key) && $state.params[key]) {
              id += "_" + key + "=" + $state.params[key];
            }
          }
        }
        return id;
      }
      // if something goes wrong make sure its got a unique stateId
      return ionic.Utils.nextUid();
    },

    goToHistoryRoot: function(historyId) {
      if(historyId) {
        var hist = $rootScope.$viewHistory.histories[ historyId ];
        if(hist && hist.stack.length) {
          if($rootScope.$viewHistory.currentView && $rootScope.$viewHistory.currentView.viewId === hist.stack[0].viewId) {
            return;
          }
          $rootScope.$viewHistory.forcedNav = {
            viewId: hist.stack[0].viewId,
            navAction: 'moveBack',
            navDirection: 'back'
          };
          hist.stack[0].go();
        }
      }
    },

    _getView: function(viewId) {
      return (viewId ? $rootScope.$viewHistory.histories[ viewId ] : null );
    },

    _getBackView: function(view) {
      return (view ? this._getView(view.backViewId) : null );
    },

    _getForwardView: function(view) {
      return (view ? this._getView(view.forwardViewId) : null );
    },

    _getHistory: function(scope) {
      var histObj = this._getParentHistoryObj(scope);

      if( !$rootScope.$viewHistory.histories[ histObj.historyId ] ) {
        // this history object exists in parent scope, but doesn't
        // exist in the history data yet
        $rootScope.$viewHistory.histories[ histObj.historyId ] = {
          historyId: histObj.historyId,
          parentHistoryId: this._getParentHistoryObj(histObj.scope.$parent).historyId,
          stack: [],
          cursor: -1
        };
      }

      return $rootScope.$viewHistory.histories[ histObj.historyId ];
    },

    _getParentHistoryObj: function(scope) {
      var parentScope = scope;
      while(parentScope) {
        if(parentScope.hasOwnProperty('$historyId')) {
          // this parent scope has a historyId
          return { historyId: parentScope.$historyId, scope: parentScope };
        }
        // nothing found keep climbing up
        parentScope = parentScope.$parent;
      }
      // no history for for the parent, use the root
      return { historyId: 'root', scope: $rootScope };
    },

    getRenderer: function(navViewElement, navViewAttrs, navViewScope) {
      var service = this;
      var registerData;
      var doAnimation;

      // climb up the DOM and see which animation classname to use, if any
      var animationClass = angular.isDefined(navViewScope.$nextAnimation) ?
        navViewScope.$nextAnimation :
        getParentAnimationClass(navViewElement[0]);

      navViewScope.$nextAnimation = undefined;

      function getParentAnimationClass(el) {
        var className = '';
        while(!className && el) {
          className = el.getAttribute('animation');
          el = el.parentElement;
        }
        return className;
      }

      function setAnimationClass() {
        // add the animation CSS class we're gonna use to transition between views
        if (animationClass) {
          navViewElement[0].classList.add(animationClass);
        }

        if(registerData.navDirection === 'back') {
          // animate like we're moving backward
          navViewElement[0].classList.add('reverse');
        } else {
          // defaults to animate forward
          // make sure the reverse class isn't already added
          navViewElement[0].classList.remove('reverse');
        }
      }

      return function(shouldAnimate) {

        return {

          enter: function(element) {

            if(doAnimation && shouldAnimate) {
              // enter with an animation
              setAnimationClass();

              element.addClass('ng-enter');
              document.body.classList.add('disable-pointer-events');

              $animate.enter(element, navViewElement, null, function() {
                document.body.classList.remove('disable-pointer-events');
                if (animationClass) {
                  navViewElement[0].classList.remove(animationClass);
                }
              });
              return;
            }

            // no animation
            navViewElement.append(element);
          },

          leave: function() {
            var element = navViewElement.contents();

            if(doAnimation && shouldAnimate) {
              // leave with an animation
              setAnimationClass();

              $animate.leave(element, function() {
                element.remove();
              });
              return;
            }

            // no animation
            element.remove();
          },

          register: function(element) {
            // register a new view
            registerData = service.register(navViewScope, element);
            doAnimation = (animationClass !== null && registerData.navDirection !== null);
            return registerData;
          }

        };
      };
    },

    disableRegisterByTagName: function(tagName) {
      // not every element should animate betwee transitions
      // For example, the <ion-tabs> directive should not animate when it enters,
      // but instead the <ion-tabs> directve would just show, and its children
      // <ion-tab> directives would do the animating, but <ion-tabs> itself is not a view
      $rootScope.$viewHistory.disabledRegistrableTagNames.push(tagName.toUpperCase());
    },

    isTagNameRegistrable: function(element) {
      // check if this element has a tagName (at its root, not recursively)
      // that shouldn't be animated, like <ion-tabs> or <ion-side-menu>
      var x, y, disabledTags = $rootScope.$viewHistory.disabledRegistrableTagNames;
      for(x=0; x<element.length; x++) {
        if(element[x].nodeType !== 1) continue;
        for(y=0; y<disabledTags.length; y++) {
          if(element[x].tagName === disabledTags[y]) {
            return false;
          }
        }
      }
      return true;
    },

    clearHistory: function() {
      var historyId, x, view,
      histories = $rootScope.$viewHistory.histories,
      currentView = $rootScope.$viewHistory.currentView;

      for(historyId in histories) {

        if(histories[historyId].stack) {
          histories[historyId].stack = [];
          histories[historyId].cursor = -1;
        }

        if(currentView.historyId === historyId) {
          currentView.backViewId = null;
          currentView.forwardViewId = null;
          histories[historyId].stack.push(currentView);
        } else if(histories[historyId].destroy) {
          histories[historyId].destroy();
        }

      }

      this.setNavViews(currentView.viewId);
    }

  };

}]);
;
angular.module('ionic.ui.navAnimation', [])
.directive('ionNavAnimation', function() {
  return {
    restrict: 'A',
    require: '^?ionNavView',
    link: function($scope, $element, $attrs, navViewCtrl) {
      if (!navViewCtrl) {
        return;
      }
      ionic.on('tap', function() {
        navViewCtrl.setNextAnimation($attrs.ionNavAnimation);
      }, $element[0]);
    }
  };
});
;
(function() {
'use strict';

angular.module('ionic.ui.actionSheet', [])

.directive('ionActionSheet', ['$document', function($document) {
  return {
    restrict: 'E',
    scope: true,
    replace: true,
    link: function($scope, $element){
      var keyUp = function(e) {
        if(e.which == 27) {
          $scope.cancel();
          $scope.$apply();
        }
      };

      var backdropClick = function(e) {
        if(e.target == $element[0]) {
          $scope.cancel();
          $scope.$apply();
        }
      };
      $scope.$on('$destroy', function() {
        $element.remove();
        $document.unbind('keyup', keyUp);
      });

      $document.bind('keyup', keyUp);
      $element.bind('click', backdropClick);
    },
    template: '<div class="action-sheet-backdrop">' +
                '<div class="action-sheet-wrapper action-sheet-up">' + 
                  '<div class="action-sheet">' +
                    '<div class="action-sheet-group">' +
                      '<div class="action-sheet-title" ng-if="titleText">{{titleText}}</div>' +
                      '<button class="button" ng-click="buttonClicked($index)" ng-repeat="button in buttons">{{button.text}}</button>' +
                    '</div>' +
                    '<div class="action-sheet-group" ng-if="destructiveText">' +
                      '<button class="button destructive" ng-click="destructiveButtonClicked()">{{destructiveText}}</button>' +
                    '</div>' +
                    '<div class="action-sheet-group" ng-if="cancelText">' +
                      '<button class="button" ng-click="cancel()">{{cancelText}}</button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>'
  };
}]);

})();
;
(function(ionic) {
'use strict';

angular.module('ionic.ui.header', ['ngAnimate', 'ngSanitize'])

.directive('barHeader', ['$ionicScrollDelegate', function($ionicScrollDelegate) {
  return {
    restrict: 'C',
    link: function($scope, $element, $attr) {
      // We want to scroll to top when the top of this element is clicked
      $ionicScrollDelegate.tapScrollToTop($element);
    }
  };
}])

.directive('ionHeaderBar', ['$ionicScrollDelegate', function($ionicScrollDelegate) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<header class="bar bar-header">\
                <div class="buttons">\
                  <button ng-repeat="button in leftButtons" class="button no-animation" ng-class="button.type" ng-click="button.tap($event, $index)" ng-bind-html="button.content">\
                  </button>\
                </div>\
                <h1 class="title" ng-bind-html="title"></h1>\
                <div class="buttons">\
                  <button ng-repeat="button in rightButtons" class="button no-animation" ng-class="button.type" ng-click="button.tap($event, $index)" ng-bind-html="button.content">\
                  </button>\
                </div>\
              </header>',

    scope: {
      leftButtons: '=',
      rightButtons: '=',
      title: '=',
      type: '@',
      alignTitle: '@'
    },

    link: function($scope, $element, $attr) {
      var hb = new ionic.views.HeaderBar({
        el: $element[0],
        alignTitle: $scope.alignTitle || 'center'
      });

      $element.addClass($scope.type);

      $scope.headerBarView = hb;

      $scope.$watch('leftButtons', function(val) {
        // Resize the title since the buttons have changed
        hb.align();
      });

      $scope.$watch('rightButtons', function(val) {
        // Resize the title since the buttons have changed
        hb.align();
      });

      $scope.$watch('title', function(val) {
        // Resize the title since the title has changed
        hb.align();
      });
    }
  };
}])

.directive('ionFooterBar', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<footer class="bar bar-footer" ng-transclude>\
              </footer>',

    scope: {
      type: '@',
    },

    link: function($scope, $element, $attr) {
      $element.addClass($scope.type);
    }
  };
});

})(ionic);
;
(function() {
'use strict';

angular.module('ionic.ui.checkbox', [])


.directive('ionCheckbox', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: {
      ngModel: '=?',
      ngValue: '=?',
      ngChecked: '=?',
      ngChange: '&'
    },
    transclude: true,

    template: '<div class="item item-checkbox disable-pointer-events">' +
                '<label class="checkbox enable-pointer-events">' +
                  '<input type="checkbox" ng-model="ngModel" ng-value="ngValue" ng-change="ngChange()">' +
                '</label>' +
                '<div class="item-content" ng-transclude></div>' +
              '</div>',

    compile: function(element, attr) {
      var input = element.find('input');
      if(attr.name) input.attr('name', attr.name);
      if(attr.ngChecked) input.attr('ng-checked', 'ngChecked');
      if(attr.ngTrueValue) input.attr('ng-true-value', attr.ngTrueValue);
      if(attr.ngFalseValue) input.attr('ng-false-value', attr.ngFalseValue);
    }

  };
});

})();
;
(function() {
'use strict';

angular.module('ionic.ui.content', ['ionic.ui.service', 'ionic.ui.scroll'])

/**
 * Panel is a simple 100% width and height, fixed panel. It's meant for content to be
 * added to it, or animated around.
 */
.directive('ionPane', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attr) {
      element.addClass('pane');
    }
  };
})

/*
 * @ngdoc directive
 * @name ionContent
 *
 * @description
 * The ionContent directive provides an easy to use content area that can be configured to use
 * Ionic's custom Scroll View, or the built in overflow scorlling of the browser.
 *
 * While we recommend using the custom Scroll features in Ionic in most cases, sometimes (for performance reasons) only the browser's native overflow scrolling will suffice, and so we've made it easy to toggle between the Ionic scroll implementation and overflow scrolling.
 *
 * When using the Ionic scroll features, you'll get pull-to-refresh, customizable scroll mechanics (like bounce easing, momentum acceleration, etc.) which aligns Ionic with native SDKs that give you access to scroll behavior. You'll also get events while in a momentum scroll, which -webkit-overflow-scrolling: touch will not, making it of limited use in real applications.
 *
 * Also, we are working on virtual list rendering which will only work when using Ionic's scroll view. That is on the upcoming roadmap.
 *
 * @restrict E
 * @param {boolean=} scroll Whether to allow scrolling of content.  Defaults to true.
 * @param {boolean=} overflow-scroll Whether to use overflow-scrolling instead of Ionic scroll.
 * @param {boolean=} padding Whether to add padding to the content.
 * @param {boolean=} has-header Whether to offset the content for a header bar.
 * @param {boolean=} has-subheader Whether to offset the content for a subheader bar.
 * @param {boolean=} has-footer Whether to offset the content for a footer bar.
 * @param {boolean=} has-bouncing Whether to allow scrolling to bounce past the edges of the content.  Defaults to true on iOS, false on Android.
 * @param {expression=} on-refresh Expression to evaluate on refresh completion.
 * @param {expression=} on-refresh-opening Expression to evaluate on refresh opening.
 * @param {expression=} on-scroll Expression to evaluate when the content is scrolled.
 * @param {expression=} on-scroll-complete Expression to evaluate when a scroll action completes.
 */
.directive('ionContent', [
  '$parse',
  '$timeout',
  '$ionicScrollDelegate',
  '$controller',
  '$ionicBind',
function($parse, $timeout, $ionicScrollDelegate, $controller, $ionicBind) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    require: '^?ionNavView',
    scope: true,
    template:
    '<div class="scroll-content">' +
      '<div class="scroll"></div>' +
    '</div>',
    compile: function(element, attr, transclude) {
      if(attr.hasHeader == "true") { element.addClass('has-header'); }
      if(attr.hasSubheader == "true") { element.addClass('has-subheader'); }
      if(attr.hasFooter == "true") { element.addClass('has-footer'); }
      if(attr.hasTabs == "true") { element.addClass('has-tabs'); }
      if(attr.padding == "true") { element.find('div').addClass('padding'); }

      return {
        //Prelink <ion-content> so it can compile before other directives compile.
        //Then other directives can require ionicScrollCtrl
        pre: prelink
      };

      function prelink($scope, $element, $attr, navViewCtrl) {
        var clone, sc, scrollView, scrollCtrl,
          scrollContent = angular.element($element[0].querySelector('.scroll'));

        transclude($scope, function(clone) {
          scrollContent.append(clone);
        });

        $ionicBind($scope, $attr, {
          //Use $ to stop onRefresh from recursively calling itself
          $onRefresh: '&onRefresh',
          $onRefreshOpening: '&onRefreshOpening',
          $onScroll: '&onScroll',
          $onScrollComplete: '&onScrollComplete',
          $onInfiniteScroll: '&onInfiniteScroll',
          refreshComplete: '=',
          infiniteScrollDistance: '@',
          hasBouncing: '@',
          scroll: '@',
          padding: '@',
          hasScrollX: '@',
          hasScrollY: '@',
          scrollbarX: '@',
          scrollbarY: '@',
          startX: '@',
          startY: '@',
          scrollEventInterval: '@'
        });

        if($scope.scroll === "false") {
          // No scrolling
          return;
        }

        if(attr.overflowScroll === "true") {
          $element.addClass('overflow-scroll');
          return;
        }

        scrollCtrl = $controller('$ionicScroll', {
          $scope: $scope,
          scrollViewOptions: {
            el: $element[0],
            bouncing: $scope.$eval($scope.hasBouncing),
            startX: $scope.$eval($scope.startX) || 0,
            startY: $scope.$eval($scope.startY) || 0,
            scrollbarX: $scope.$eval($scope.scrollbarX) !== false,
            scrollbarY: $scope.$eval($scope.scrollbarY) !== false,
            scrollingX: $scope.$eval($scope.hasScrollX) === true,
            scrollingY: $scope.$eval($scope.hasScrollY) !== false,
            scrollEventInterval: parseInt($scope.scrollEventInterval, 10) || 20,
            scrollingComplete: function() {
              $scope.$onScrollComplete({
                scrollTop: this.__scrollTop,
                scrollLeft: this.__scrollLeft
              });
            }
          }
        });

        //Publish scrollView to parent so children can access it
        scrollView = $scope.$parent.scrollView = scrollCtrl.scrollView;

        $scope.$on('$viewContentLoaded', function(e, viewHistoryData) {
          viewHistoryData || (viewHistoryData = {});
          var scroll = viewHistoryData.scrollValues;
          if (scroll) {
            $timeout(function() {
              scrollView.scrollTo(+scroll.left || null, +scroll.top || null);
            }, 0);
          }

          //Save scroll onto viewHistoryData when scope is destroyed
          $scope.$on('$destroy', function() {
            viewHistoryData.scrollValues = scrollView.getValues();
          });
        });

        if(attr.refreshComplete) {
          $scope.refreshComplete = function() {
            if($scope.scrollView) {
              scrollCtrl.refresher && scrollCtrl.refresher.classList.remove('active');
              scrollView.finishPullToRefresh();
              $scope.$parent.$broadcast('scroll.onRefreshComplete');
            }
          };
        }
      }
    }
  };
}])

.directive('ionRefresher', function() {
  return {
    restrict: 'E',
    replace: true,
    require: ['^?ionContent', '^?ionList'],
    template: '<div class="scroll-refresher"><div class="ionic-refresher-content"><i class="icon ion-arrow-down-c icon-pulling"></i><i class="icon ion-loading-d icon-refreshing"></i></div></div>',
    scope: true
  };
})

.directive('ionScrollRefresher', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="scroll-refresher"><div class="scroll-refresher-content" ng-transclude></div></div>'
  };
})

.directive('ionInfiniteScroll', ['$ionicBind', function($ionicBind) {
  return {
    restrict: 'E',
    require: '^?$ionicScroll',
    template:
    '<div class="scroll-infinite">' +
      '<div class="scroll-infinite-content">' +
        '<i class="icon ion-loading-d icon-refreshing"></i>' +
      '</div>' +
    '</div>',
    link: function($scope, $element, $attrs, scrollCtrl) {
      setTimeout(function() {
        var scrollCtrl = $element.controller('$ionicScroll');
        var scrollView = scrollCtrl.scrollView;

        $ionicBind($scope, $attrs, {
          distance: '@infiniteScrollDistance'
        });
        function maxScroll() {
          var dist = $scope.distance || '1%';
          return dist.indexOf('%') > -1 ?
            scrollView.getScrollMax().top * (1 - parseInt(dist,10) / 100) :
            scrollView.getScrollMax().top - parseInt(dist, 10);
        }

        var infiniteScrolling = false;
        $scope.$on('scroll.infiniteScrollComplete', function() {
          $element[0].classList.remove('active');
          setTimeout(function() {
            scrollView.resize();
          });
          infiniteScrolling = false;
        });

        scrollCtrl.$element.on('scroll', ionic.animationFrameThrottle(function() {
          if (!infiniteScrolling && scrollView.getValues().top >= maxScroll()) {
            $element[0].classList.add('active');
            infiniteScrolling = true;
            $scope.$apply(angular.bind($scope, $scope.$onInfiniteScroll));
          }
        }));
      });
    }
  };
}]);

})();
;
(function() {
'use strict';

angular.module('ionic.ui.list', ['ngAnimate'])

.directive('ionItem', ['$timeout', '$parse', function($timeout, $parse) {
  return {
    restrict: 'E',
    require: '?^ionList',
    replace: true,
    transclude: true,

    scope: {
      item: '=',
      itemType: '@',
      canDelete: '@',
      canReorder: '@',
      canSwipe: '@',
      onDelete: '&',
      optionButtons: '&',
      deleteIcon: '@',
      reorderIcon: '@'
    },

    template: '<div class="item item-complex">\
            <div class="item-edit" ng-if="deleteClick !== undefined">\
              <button class="button button-icon icon" ng-class="deleteIconClass" ng-click="deleteClick()" ion-stop-event="click"></button>\
            </div>\
            <a class="item-content" ng-href="{{ href }}" ng-transclude></a>\
            <div class="item-drag" ng-if="reorderIconClass !== undefined">\
              <button data-ionic-action="reorder" class="button button-icon icon" ng-class="reorderIconClass"></button>\
            </div>\
            <div class="item-options" ng-if="itemOptionButtons">\
             <button ng-click="b.onTap(item, b)" ion-stop-event="click" class="button" ng-class="b.type" ng-repeat="b in itemOptionButtons" ng-bind="b.text"></button>\
           </div>\
          </div>',

    link: function($scope, $element, $attr, list) {
      if(!list) return;

      var $parentScope = list.scope;
      var $parentAttrs = list.attrs;

      $attr.$observe('href', function(value) {
        if(value) $scope.href = value.trim();
      });

      if(!$scope.itemType) {
        $scope.itemType = $parentScope.itemType;
      }

      // Set this item's class, first from the item directive attr, and then the list attr if item not set
      $element.addClass($scope.itemType || $parentScope.itemType);

      $scope.itemClass = $scope.itemType;

      // Decide if this item can do stuff, and follow a certain priority
      // depending on where the value comes from
      if(($attr.canDelete ? $scope.canDelete : $parentScope.canDelete) !== "false") {
        if($attr.onDelete || $parentAttrs.onDelete) {

          // only assign this method when we need to
          // and use its existence to decide if the delete should show or not
          $scope.deleteClick = function() {
            if($attr.onDelete) {
              // this item has an on-delete attribute
              $scope.onDelete({ item: $scope.item });
            } else if($parentAttrs.onDelete) {
              // run the parent list's onDelete method
              // if it doesn't exist nothing will happen
              $parentScope.onDelete({ item: $scope.item });
            }
          };

          // Set which icons to use for deleting
          $scope.deleteIconClass = $scope.deleteIcon || $parentScope.deleteIcon || 'ion-minus-circled';
        }
      }

      // set the reorder Icon Class only if the item or list set can-reorder="true"
      if(($attr.canReorder ? $scope.canReorder : $parentScope.canReorder) === "true") {
        $scope.reorderIconClass = $scope.reorderIcon || $parentScope.reorderIcon || 'ion-navicon';
      }

      // Set the option buttons which can be revealed by swiping to the left
      // if canSwipe was set to false don't even bother
      if(($attr.canSwipe ? $scope.canSwipe : $parentScope.canSwipe) !== "false") {
        $scope.itemOptionButtons = $scope.optionButtons();
        if(typeof $scope.itemOptionButtons === "undefined") {
          $scope.itemOptionButtons = $parentScope.optionButtons();
        }
      }

    }
  };
}])

.directive('ionList', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    require: '^?$ionicScroll',
    scope: {
      itemType: '@',
      canDelete: '@',
      canReorder: '@',
      canSwipe: '@',
      showDelete: '=',
      showReorder: '=',
      onDelete: '&',
      onReorder: '&',
      optionButtons: '&',
      deleteIcon: '@',
      reorderIcon: '@'
    },

    template: '<div class="list" ng-class="{\'list-editing\': showDelete, \'list-reordering\': showReorder}" ng-transclude></div>',

    controller: ['$scope', '$attrs', function($scope, $attrs) {
      this.scope = $scope;
      this.attrs = $attrs;
    }],

    link: function($scope, $element, $attr, ionicScrollCtrl) {
      $scope.listView = new ionic.views.ListView({
        el: $element[0],
        listEl: $element[0].children[0],
        scrollEl: ionicScrollCtrl && ionicScrollCtrl.element,
        scrollView: ionicScrollCtrl && ionicScrollCtrl.scrollView,
        onReorder: function(el, oldIndex, newIndex) {
          $scope.$apply(function() {
            $scope.onReorder({el: el, start: oldIndex, end: newIndex});
          });
        }
      });

      if($attr.animation) {
        $element[0].classList.add($attr.animation);
      }

      var destroyShowReorderWatch = $scope.$watch('showReorder', function(val) {
        if(val) {
          $element[0].classList.add('item-options-hide');
        } else if(val === false) {
          // false checking is because it could be undefined
          // if its undefined then we don't care to do anything
          $timeout(function(){
            $element[0].classList.remove('item-options-hide');
          }, 250);
        }
      });

      $scope.$on('$destroy', function () {
        destroyShowReorderWatch();
      });

    }
  };
}]);

})();
;
(function() {
'use strict';

angular.module('ionic.ui.loading', [])

.directive('ionLoading', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    link: function($scope, $element){
      $element.addClass($scope.animation || '');
    },
    template: '<div class="loading-backdrop" ng-class="{enabled: showBackdrop}">' + 
                '<div class="loading" ng-transclude>' +
                '</div>' +
              '</div>'
  };
});

})();
;
(function(ionic) {
'use strict';

angular.module('ionic.ui.radio', [])

// The radio button is a radio powered element with only
// one possible selection in a set of options.
.directive('ionRadio', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: {
      ngModel: '=?',
      ngValue: '=?',
      ngChange: '&',
      icon: '@'
    },
    transclude: true,
    template: '<label class="item item-radio">' +
                '<input type="radio" name="radio-group"' +
                ' ng-model="ngModel" ng-value="ngValue" ng-change="ngChange()">' +
                '<div class="item-content disable-pointer-events" ng-transclude></div>' +
                '<i class="radio-icon disable-pointer-events icon ion-checkmark"></i>' +
              '</label>',

    compile: function(element, attr) {
      if(attr.name) element.children().eq(0).attr('name', attr.name);
      if(attr.icon) element.children().eq(2).removeClass('ion-checkmark').addClass(attr.icon);
    }
  };
})

// The radio button is a radio powered element with only
// one possible selection in a set of options.
.directive('ionRadioButtons', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: {
      value: '@'
    },
    transclude: true,
    template: '<div class="button-bar button-bar-inline" ng-transclude></div>',

    controller: ['$scope', '$element', function($scope, $element) {

      this.select = function(element) {
        var c, children = $element.children();
        for(var i = 0; i < children.length; i++) {
          c = children[i];
          if(c != element[0]) {
            c.classList.remove('active');
          }
        }
      };

    }],

    link: function($scope, $element, $attr, ngModel) {
      var radio;

      if(ngModel) {
        //$element.bind('tap', tapHandler);

        ngModel.$render = function() {
          var children = $element.children();
          for(var i = 0; i < children.length; i++) {
            children[i].classList.remove('active');
          }
          $scope.$parent.$broadcast('radioButton.select', ngModel.$viewValue);
        };
      }
    }
  };
})

.directive('ionButtonRadio', function() {
  return {
    restrict: 'CA',
    require: ['?^ngModel', '?^ionRadioButtons'],
    link: function($scope, $element, $attr, ctrls) {
      var ngModel = ctrls[0];
      var radioButtons = ctrls[1];
      if(!ngModel || !radioButtons) { return; }

      var setIt = function() {
        
        $element.addClass('active');
        ngModel.$setViewValue($scope.$eval($attr.ngValue));

        radioButtons.select($element);
      };

      var clickHandler = function(e) {
        
        setIt();
      };

      $scope.$on('radioButton.select', function(e, val) {
        if(val == $scope.$eval($attr.ngValue)) {
          $element.addClass('active');
        }
      });
        
      ionic.on('tap', clickHandler, $element[0]);

      $scope.$on('$destroy', function() {
        ionic.off('tap', clickHandler);
      });
    }
  };
});

})(window.ionic);
;
(function() {
'use strict';

angular.module('ionic.ui.scroll', [])

.directive('ionScroll', ['$parse', '$timeout', '$controller', function($parse, $timeout, $controller) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="scroll-view"><div class="scroll" ng-transclude></div></div>',
    transclude: true,
    scope: {
      direction: '@',
      paging: '@',
      onRefresh: '&',
      onScroll: '&',
      refreshComplete: '=',
      scroll: '@',
      scrollbarX: '@',
      scrollbarY: '@',
    },

    controller: function() {},

    compile: function(element, attr, transclude) {

      return {
        //Prelink <ion-scroll> so it can compile before other directives compile.
        //Then other directives can require ionicScrollCtrl
        pre: prelink
      };

      function prelink($scope, $element, $attr) {
        var scrollView, scrollCtrl,
          sc = $element[0].children[0];

        if(attr.padding == "true") {
          sc.classList.add('padding');
        }
        if($scope.$eval($scope.paging) === true) {
          sc.classList.add('scroll-paging');
        }

        if(!$scope.direction) { $scope.direction = 'y'; }
        var isPaging = $scope.$eval($scope.paging) === true;

        var scrollViewOptions= {
          el: $element[0],
          paging: isPaging,
          scrollbarX: $scope.$eval($scope.scrollbarX) !== false,
          scrollbarY: $scope.$eval($scope.scrollbarY) !== false,
          scrollingX: $scope.direction.indexOf('x') >= 0,
          scrollingY: $scope.direction.indexOf('y') >= 0
        };
        if (isPaging) {
          scrollViewOptions.speedMultiplier = 0.8;
          scrollViewOptions.bouncing = false;
        }

        scrollCtrl = $controller('$ionicScroll', {
          $scope: $scope,
          scrollViewOptions: scrollViewOptions
        });
        scrollView = $scope.$parent.scrollView = scrollCtrl.scrollView;
      }
    }
  };
}]);

})();
;
(function() {
'use strict';

/**
 * @description
 * The sideMenuCtrl lets you quickly have a draggable side
 * left and/or right menu, which a center content area.
 */

angular.module('ionic.ui.sideMenu', ['ionic.service.gesture', 'ionic.service.view'])

/**
 * The internal controller for the side menu controller. This
 * extends our core Ionic side menu controller and exposes
 * some side menu stuff on the current scope.
 */

.run(['$ionicViewService', function($ionicViewService) {
  // set that the side-menus directive should not animate when transitioning to it
  $ionicViewService.disableRegisterByTagName('ion-side-menus');
}])

.directive('ionSideMenus', function() {
  return {
    restrict: 'ECA',
    controller: ['$scope', '$attrs', function($scope, $attrs) {
      var _this = this;

      angular.extend(this, ionic.controllers.SideMenuController.prototype);

      ionic.controllers.SideMenuController.call(this, {
        left: { width: 275 },
        right: { width: 275 }
      });

      $scope.sideMenuContentTranslateX = 0;

      $scope.sideMenuController = this;
    }],
    replace: true,
    transclude: true,
    template: '<div class="view" ng-transclude></div>'
  };
})

.directive('ionSideMenuContent', ['$timeout', '$ionicGesture', function($timeout, $ionicGesture) {
  return {
    restrict: 'AC',
    require: '^ionSideMenus',
    scope: true,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, sideMenuCtrl) {

        $element.addClass('menu-content');

        if (angular.isDefined(attr.dragContent)) {
          $scope.$watch(attr.dragContent, function(value) {
            $scope.dragContent = value;
          });
        } else {
          $scope.dragContent = true;
        }

        var defaultPrevented = false;
        var isDragging = false;

        // Listen for taps on the content to close the menu
        /*
        ionic.on('tap', function(e) {
          sideMenuCtrl.close();
        }, $element[0]);
        */

        var dragFn = function(e) {
          if($scope.dragContent) {
            if(defaultPrevented || e.gesture.srcEvent.defaultPrevented) {
              return;
            }
            isDragging = true;
            sideMenuCtrl._handleDrag(e);
            e.gesture.srcEvent.preventDefault();
          }
        };

        var dragVertFn = function(e) {
          if(isDragging) {
            e.gesture.srcEvent.preventDefault();
          }
        };

        //var dragGesture = Gesture.on('drag', dragFn, $element);
        var dragRightGesture = $ionicGesture.on('dragright', dragFn, $element);
        var dragLeftGesture = $ionicGesture.on('dragleft', dragFn, $element);
        var dragUpGesture = $ionicGesture.on('dragup', dragVertFn, $element);
        var dragDownGesture = $ionicGesture.on('dragdown', dragVertFn, $element);

        var dragReleaseFn = function(e) {
          isDragging = false;
          if(!defaultPrevented) {
            sideMenuCtrl._endDrag(e);
          }
          defaultPrevented = false;
        };

        var releaseGesture = $ionicGesture.on('release', dragReleaseFn, $element);

        sideMenuCtrl.setContent({
          onDrag: function(e) {},
          endDrag: function(e) {},
          getTranslateX: function() {
            return $scope.sideMenuContentTranslateX || 0;
          },
          setTranslateX: ionic.animationFrameThrottle(function(amount) {
            if(amount === 0) {
              $element[0].style[ionic.CSS.TRANSFORM] = 'none';
            } else {
              $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(' + amount + 'px, 0, 0)';
            }
            $timeout(function() {
              $scope.sideMenuContentTranslateX = amount;
            });
          }),
          enableAnimation: function() {
            //this.el.classList.add(this.animateClass);
            $scope.animationEnabled = true;
            $element[0].classList.add('menu-animated');
          },
          disableAnimation: function() {
            //this.el.classList.remove(this.animateClass);
            $scope.animationEnabled = false;
            $element[0].classList.remove('menu-animated');
          }
        });

        // Cleanup
        $scope.$on('$destroy', function() {
          $ionicGesture.off(dragLeftGesture, 'dragleft', dragFn);
          $ionicGesture.off(dragRightGesture, 'dragright', dragFn);
          $ionicGesture.off(dragUpGesture, 'dragup', dragFn);
          $ionicGesture.off(dragDownGesture, 'dragdown', dragFn);
          $ionicGesture.off(releaseGesture, 'release', dragReleaseFn);
        });
      };
    }
  };
}])


.directive('ionSideMenu', function() {
  return {
    restrict: 'E',
    require: '^ionSideMenus',
    replace: true,
    transclude: true,
    scope: true,
    template: '<div class="menu menu-{{side}}"></div>',
    compile: function(element, attr, transclude) {
      angular.isUndefined(attr.isEnabled) && attr.$set('isEnabled', 'true');
      angular.isUndefined(attr.width) && attr.$set('width', '275');

      return function($scope, $element, $attr, sideMenuCtrl) {
        $scope.side = $attr.side;

        var sideMenu = sideMenuCtrl[$scope.side] = new ionic.views.SideMenu({
          width: 275,
          el: $element[0],
          isEnabled: true
        });

        $scope.$watch($attr.width, function(val) {
          var numberVal = +val;
          if (numberVal && numberVal == val) {
            sideMenu.setWidth(+val);
          }
        });
        $scope.$watch($attr.isEnabled, function(val) {
          sideMenu.setIsEnabled(!!val);
        });

        transclude($scope, function(clone) {
          $element.append(clone);
        });
      };
    }
  };
});
})();
;
(function() {
'use strict';

/**
 * @description
 * The slideBoxCtrol lets you quickly create a multi-page 
 * container where each page can be swiped or dragged between
 */

angular.module('ionic.ui.slideBox', [])

/**
 * The internal controller for the slide box controller.
 */

.directive('ionSlideBox', ['$timeout', '$compile', '$ionicSlideBoxDelegate', function($timeout, $compile, $ionicSlideBoxDelegate) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      doesContinue: '@',
      slideInterval: '@',
      showPager: '@',
      disableScroll: '@',
      onSlideChanged: '&',
      activeSlide: '=?'
    },
    controller: ['$scope', '$element', function($scope, $element) {
      var _this = this;

      var continuous = $scope.$eval($scope.doesContinue) === true;
      var slideInterval = continuous ? $scope.$eval($scope.slideInterval) || 4000 : 0;

      var slider = new ionic.views.Slider({
        el: $element[0],
        auto: slideInterval,
        disableScroll: ($scope.$eval($scope.disableScroll) === true) || false,
        continuous: continuous,
        startSlide: $scope.activeSlide,
        slidesChanged: function() {
          $scope.currentSlide = slider.getPos();

          // Try to trigger a digest
          $timeout(function() {});
        },
        callback: function(slideIndex) {
          $scope.currentSlide = slideIndex;
          $scope.onSlideChanged({index:$scope.currentSlide});
          $scope.$parent.$broadcast('slideBox.slideChanged', slideIndex);
          $scope.activeSlide = slideIndex;
          // Try to trigger a digest
          $timeout(function() {});
        }
      });

      $scope.$watch('activeSlide', function(nv) {
        if(angular.isDefined(nv)){
          slider.slide(nv);
        }
      });

      $scope.$on('slideBox.nextSlide', function() {
        slider.next();
      });

      $scope.$on('slideBox.prevSlide', function() {
        slider.prev();
      });

      $scope.$on('slideBox.setSlide', function(e, index) {
        slider.slide(index);
      });

      $scope.$parent.slideBox = slider;

      $ionicSlideBoxDelegate.register($scope, $element);

      this.getNumSlides = function() {
        return slider.getNumSlides();
      };

      $timeout(function() {
        slider.load();
      });
    }],
    template: '<div class="slider">\
            <div class="slider-slides" ng-transclude>\
            </div>\
          </div>',

    link: function($scope, $element, $attr, slideBoxCtrl) {
      // If the pager should show, append it to the slide box
      if($scope.$eval($scope.showPager) !== false) {
        var childScope = $scope.$new();
        var pager = angular.element('<ion-pager></ion-pager>');
        $element.append(pager);
        $compile(pager)(childScope);
      }
    }
  };
}])

.directive('ionSlide', function() {
  return {
    restrict: 'E',
    require: '^ionSlideBox',
    compile: function(element, attr) {
      element.addClass('slider-slide');
      return function($scope, $element, $attr) {};
    },
  };
})

.directive('ionPager', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^ionSlideBox',
    template: '<div class="slider-pager"><span class="slider-pager-page" ng-repeat="slide in numSlides() track by $index" ng-class="{active: $index == currentSlide}"><i class="icon ion-record"></i></span></div>',
    link: function($scope, $element, $attr, slideBox) {
      var selectPage = function(index) {
        var children = $element[0].children;
        var length = children.length;
        for(var i = 0; i < length; i++) {
          if(i == index) {
            children[i].classList.add('active');
          } else {
            children[i].classList.remove('active');
          }
        }
      };

      $scope.numSlides = function() {
        return new Array(slideBox.getNumSlides());
      };

      $scope.$watch('currentSlide', function(v) {
        selectPage(v);
      });
    }
  };

});

})();
;
angular.module('ionic.ui.tabs', ['ionic.service.view'])

/**
 * @description
 *
 * The Tab Controller renders a set of pages that switch based on taps
 * on a tab bar. Modelled off of UITabBarController.
 */

.run(['$ionicViewService', function($ionicViewService) {
  // set that the tabs directive should not animate when transitioning
  // to it. Instead, the children <tab> directives would animate
  $ionicViewService.disableRegisterByTagName('ion-tabs');
}])

.controller('$ionicTabs', ['$scope', '$ionicViewService', '$element', function($scope, $ionicViewService, $element) {
  var self = $scope.tabsController = this;
  self.tabs = [];

  self.selectedTab = null;

  self.add = function(tab) {
    $ionicViewService.registerHistory(tab);
    self.tabs.push(tab);
    if(self.tabs.length === 1) {
      self.select(tab);
    }
  };

  self.remove = function(tab) {
    var tabIndex = self.tabs.indexOf(tab);
    if (tabIndex === -1) {
      return;
    }
    //Use a field like '$tabSelected' so developers won't accidentally set it in controllers etc
    if (tab.$tabSelected) {
      self.deselect(tab);
      //Try to select a new tab if we're removing a tab
      if (self.tabs.length === 1) {
        //do nothing if there are no other tabs to select
      } else {
        //Select previous tab if it's the last tab, else select next tab
        var newTabIndex = tabIndex === self.tabs.length - 1 ? tabIndex - 1 : tabIndex + 1;
        self.select(self.tabs[newTabIndex]);
      }
    }
    self.tabs.splice(tabIndex, 1);
  };

  self.getTabIndex = function(tab) {
    return self.tabs.indexOf(tab);
  };

  self.deselect = function(tab) {
    if (tab.$tabSelected) {
      self.selectedTab = null;
      tab.$tabSelected = false;
      (tab.onDeselect || angular.noop)();
    }
  };

  self.select = function(tab, shouldEmitEvent) {
    var tabIndex;
    if (angular.isNumber(tab)) {
      tabIndex = tab;
      tab = self.tabs[tabIndex];
    } else {
      tabIndex = self.tabs.indexOf(tab);
    }
    if (!tab || tabIndex == -1) {
      throw new Error('Cannot select tab "' + tabIndex + '"!');
    }

    if (self.selectedTab && self.selectedTab.$historyId == tab.$historyId) {
      if (shouldEmitEvent) {
        $ionicViewService.goToHistoryRoot(tab.$historyId);
      }
    } else {
      angular.forEach(self.tabs, function(tab) {
        self.deselect(tab);
      });

      self.selectedTab = tab;
      //Use a funny name like $tabSelected so the developer doesn't overwrite the var in a child scope
      tab.$tabSelected = true;
      (tab.onSelect || angular.noop)();

      if (shouldEmitEvent) {
        var viewData = {
          type: 'tab',
          tabIndex: tabIndex,
          historyId: tab.$historyId,
          navViewName: tab.navViewName,
          hasNavView: !!tab.navViewName,
          title: tab.title,
          //Skip the first character of href if it's #
          url: tab.href,
          uiSref: tab.uiSref
        };
        $scope.$emit('viewState.changeHistory', viewData);
      }
    }
  };
}])

.directive('ionTabs', ['$ionicViewService', '$ionicBind', function($ionicViewService, $ionicBind) {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    transclude: true,
    controller: '$ionicTabs',
    template:
    '<div class="view {{$animation}}">' +
      '<div class="tabs {{$tabsStyle}} {{$tabsType}}">' +
      '</div>' +
    '</div>',
    compile: function(element, attr, transclude) {
      if(angular.isUndefined(attr.tabsType)) attr.$set('tabsType', 'tabs-positive');

      return function link($scope, $element, $attr, tabsCtrl) {

        $ionicBind($scope, $attr, {
          $animation: '@animation',
          $tabsStyle: '@tabsStyle',
          $tabsType: '@tabsType'
        });

        tabsCtrl.$scope = $scope;
        tabsCtrl.$element = $element;
        tabsCtrl.$tabsElement = angular.element($element[0].querySelector('.tabs'));

        transclude($scope, function(clone) {
          $element.append(clone);
        });
      };
    }
  };
}])

.controller('$ionicTab', ['$scope', '$ionicViewService', '$rootScope', '$element',
function($scope, $ionicViewService, $rootScope, $element) {
  this.$scope = $scope;
}])

// Generic controller directive
.directive('ionTab', ['$rootScope', '$animate', '$ionicBind', '$compile', '$ionicViewService', function($rootScope, $animate, $ionicBind, $compile, $ionicViewService) {

  //Returns ' key="value"' if value exists
  function attrStr(k,v) {
    return angular.isDefined(v) ? ' ' + k + '="' + v + '"' : '';
  }
  return {
    restrict: 'E',
    require: ['^ionTabs', 'ionTab'],
    replace: true,
    transclude: 'element',
    controller: '$ionicTab',
    scope: true,
    compile: function(element, attr, transclude) {
      return function link($scope, $element, $attr, ctrls) {
        var childScope, childElement, tabNavElement;
          tabsCtrl = ctrls[0],
          tabCtrl = ctrls[1];

        $ionicBind($scope, $attr, {
          animate: '=',
          leftButtons: '=',
          rightButtons: '=',
          onSelect: '&',
          onDeselect: '&',
          title: '@',
          uiSref: '@',
          href: '@',
        });

        tabNavElement = angular.element(
          '<ion-tab-nav' +
          attrStr('title', attr.title) +
          attrStr('icon', attr.icon) +
          attrStr('icon-on', attr.iconOn) +
          attrStr('icon-off', attr.iconOff) +
          attrStr('badge', attr.badge) +
          attrStr('badge-style', attr.badgeStyle) +
          '></ion-tab-nav>'
        );
        tabNavElement.data('$ionTabsController', tabsCtrl);
        tabNavElement.data('$ionTabController', tabCtrl);
        tabsCtrl.$tabsElement.append($compile(tabNavElement)($scope));

        tabsCtrl.add($scope);
        $scope.$on('$destroy', function() {
          tabsCtrl.remove($scope);
          tabNavElement.isolateScope().$destroy();
          tabNavElement.remove();
        });

        $scope.$watch('$tabSelected', function(value) {
          if (!value) {
            $scope.$broadcast('tab.hidden', $scope);
          }
          childScope && childScope.$destroy();
          childScope = null;
          childElement && $animate.leave(childElement);
          childElement = null;
          if (value) {
            childScope = $scope.$new();
            transclude(childScope, function(clone) {
              //remove title attr to stop hover annoyance!
              clone[0].removeAttribute('title');
              $animate.enter(clone, tabsCtrl.$element);
              clone.addClass('pane');
              childElement = clone;
            });
            $scope.$broadcast('tab.shown', $scope);
          }
        });

        transclude($scope, function(clone) {
          var navView = clone[0].querySelector('ion-nav-view');
          if (navView) {
            $scope.navViewName = navView.getAttribute('name');
            selectTabIfMatchesState();
            $scope.$on('$stateChangeSuccess', selectTabIfMatchesState);
          }
        });

        function selectTabIfMatchesState() {
          // this tab's ui-view is the current one, go to it!
          if ($ionicViewService.isCurrentStateNavView($scope.navViewName)) {
            tabsCtrl.select($scope);
          }
        }
      };
    }
  };
}])

.directive('ionTabNav', function() {
  return {
    restrict: 'E',
    replace: true,
    require: ['^ionTabs', '^ionTab'],
    template:
    '<a ng-class="{active: isTabActive(), \'has-badge\':badge}" ' +
      'ng-click="selectTab($event)" class="tab-item">' +
      '<span class="badge {{badgeStyle}}" ng-if="badge">{{badge}}</span>' +
      '<i class="icon {{getIconOn()}}" ng-if="getIconOn() && isTabActive()"></i>' +
      '<i class="icon {{getIconOff()}}" ng-if="getIconOff() && !isTabActive()"></i>' +
      '<span class="tab-title" ng-bind-html="title"></span>' +
    '</a>',
    scope: {
      title: '@',
      icon: '@',
      iconOn: '@',
      iconOff: '@',
      badge: '=',
      badgeStyle: '@'
    },
    compile: function(element, attr, transclude) {
      return function link($scope, $element, $attrs, ctrls) {
        var tabsCtrl = ctrls[0],
          tabCtrl = ctrls[1];

        $scope.getIconOn = function() {
          return $scope.iconOn || $scope.icon;
        };
        $scope.getIconOff = function() {
          return $scope.iconOff || $scope.icon;
        };

        $scope.isTabActive = function() {
          return tabsCtrl.selectedTab === tabCtrl.$scope;
        };
        $scope.selectTab = function(e) {
          e.preventDefault();
          tabsCtrl.select(tabCtrl.$scope, true);
        };
      };
    }
  };
});
;
(function(ionic) {
'use strict';

angular.module('ionic.ui.toggle', [])

// The Toggle directive is a toggle switch that can be tapped to change
// its value
.directive('ionToggle', function() {

  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: {
      ngModel: '=?',
      ngValue: '=?',
      ngChecked: '=?',
      ngChange: '&',
      ngDisabled: '=?'
    },
    transclude: true,
    template: '<div class="item item-toggle disable-pointer-events">' +
                '<div ng-transclude></div>' +
                '<label class="toggle enable-pointer-events">' +
                  '<input type="checkbox" ng-model="ngModel" ng-value="ngValue" ng-change="ngChange()" ng-disabled="ngDisabled">' +
                  '<div class="track disable-pointer-events">' +
                    '<div class="handle"></div>' +
                  '</div>' +
                '</label>' +
              '</div>',

    compile: function(element, attr) {
      var input = element.find('input');
      if(attr.name) input.attr('name', attr.name);
      if(attr.ngChecked) input.attr('ng-checked', 'ngChecked');
      if(attr.ngTrueValue) input.attr('ng-true-value', attr.ngTrueValue);
      if(attr.ngFalseValue) input.attr('ng-false-value', attr.ngFalseValue);

      // return function link($scope, $element, $attr, ngModel) {
      //   var el, checkbox, track, handle;

      //   el = $element[0].getElementsByTagName('label')[0];
      //   checkbox = el.children[0];
      //   track = el.children[1];
      //   handle = track.children[0];

      //   $scope.toggle = new ionic.views.Toggle({
      //     el: el,
      //     track: track,
      //     checkbox: checkbox,
      //     handle: handle
      //   });

      //   ionic.on('drag', function(e) {
      //     
      //     $scope.toggle.drag(e);
      //   }, handle);

      // }
    }

  };
});

})(window.ionic);
;

// Similar to Angular's ngTouch, however it uses Ionic's tap detection
// and click simulation. ngClick 

(function(angular, ionic) {'use strict';


angular.module('ionic.ui.touch', [])

  .config(['$provide', function($provide) {
    $provide.decorator('ngClickDirective', ['$delegate', function($delegate) {
      // drop the default ngClick directive
      $delegate.shift();
      return $delegate;
    }]);
  }])

  .directive('ngClick', ['$parse', function($parse) {
    
    function onTap(e) {
      // wire this up to Ionic's tap/click simulation
      ionic.tapElement(e.target, e);
    }

    // Actual linking function.
    return function(scope, element, attr) {

      var clickHandler = $parse(attr.ngClick);

      element.on('click', function(event) {
        scope.$apply(function() {
          clickHandler(scope, {$event: (event)});
        });
      });

      ionic.on('tap', onTap, element[0]);

      // Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
      // something else nearby.
      element.onclick = function(event) { };

      scope.$on('$destroy', function () {
        ionic.off('tap', onTap, element[0]);
      });

    };

  }])

  .directive('ionStopEvent', function () {
    function stopEvent(e) {
      e.stopPropagation();
    }
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.bind(attr.ionStopEvent, stopEvent);
      }
    };
  });


})(window.angular, window.ionic);
;
(function() {
'use strict';

/**
 * @description
 * The NavController is a navigation stack View Controller modelled off of
 * UINavigationController from Cocoa Touch. With the Nav Controller, you can
 * "push" new "pages" on to the navigation stack, and then pop them off to go
 * back. The NavController controls a navigation bar with a back button and title
 * which updates as the pages switch.
 *
 * The NavController makes sure to not recycle scopes of old pages
 * so that a pop will still show the same state that the user left.
 *
 * However, once a page is popped, its scope is destroyed and will have to be
 * recreated then next time it is pushed.
 *
 */

angular.module('ionic.ui.viewState', ['ionic.service.view', 'ionic.service.gesture', 'ngSanitize'])

/**
 * Our Nav Bar directive which updates as the controller state changes.
 */
.directive('ionNavBar', ['$ionicViewService', '$rootScope', '$animate', '$compile',
                function( $ionicViewService,   $rootScope,   $animate,   $compile) {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      animation: '@',
      type: '@',
      backType: '@backButtonType',
      backLabel: '@backButtonLabel',
      backIcon: '@backButtonIcon',
      alignTitle: '@'
    },
    controller: function() {},
    template:
    '<header class="bar bar-header nav-bar{{navBarClass()}}">' +
      '<ion-nav-back-button ng-if="(backType || backLabel || backIcon)" ' +
        'type="backType" label="backLabel" icon="backIcon" class="hide" ' +
        'ng-class="{\'hide\': !backButtonEnabled}">' +
      '</ion-nav-back-button>' +
      '<div class="buttons left-buttons"> ' +
        '<button ng-click="button.tap($event)" ng-repeat="button in leftButtons" ' +
          'class="button no-animation {{button.type}}" ng-bind-html="button.content">' +
        '</button>' +
      '</div>' +

      '<h1 ng-bind-html="title" class="title"></h1>' +

      '<div class="buttons right-buttons"> ' +
        '<button ng-click="button.tap($event)" ng-repeat="button in rightButtons" '+
          'class="button no-animation {{button.type}}" ng-bind-html="button.content">' +
        '</button>' +
      '</div>' +
    '</header>',
    compile: function(tElement, tAttrs) {

      return function link($scope, $element, $attr) {
        //defaults
        $scope.backButtonEnabled = false;
        $scope.animateEnabled = true;
        $scope.isReverse = false;
        $scope.isInvisible = true;

        $scope.navBarClass = function() {
          return ($scope.type ? ' ' + $scope.type : '') +
            ($scope.isReverse ? ' reverse' : '') +
            ($scope.isInvisible ? ' invisible' : '') +
            (!$scope.animationDisabled && $scope.animation ? ' ' + $scope.animation : '');
        };

        // Initialize our header bar view which will handle
        // resizing and aligning our title labels
        var hb = new ionic.views.HeaderBar({
          el: $element[0],
          alignTitle: $scope.alignTitle || 'center'
        });
        $scope.headerBarView = hb;

        //Navbar events
        $scope.$on('viewState.viewEnter', function(e, data) {
          updateHeaderData(data);
        });
        $scope.$on('viewState.showNavBar', function(e, showNavBar) {
          $scope.isInvisible = !showNavBar;
        });

        // All of these these are emitted from children of a sibling scope,
        // so we listen on parent so we can catch them as they bubble up
        var unregisterEventListeners = [
          $scope.$parent.$on('$viewHistory.historyChange', function(e, data) {
            $scope.backButtonEnabled = !!data.showBack;
          }),
          $scope.$parent.$on('viewState.leftButtonsChanged', function(e, data) {
            $scope.leftButtons = data;
          }),
          $scope.$parent.$on('viewState.rightButtonsChanged', function(e, data) {
            $scope.rightButtons = data;
          }),
          $scope.$parent.$on('viewState.showBackButton', function(e, data) {
            $scope.backButtonEnabled = !!data;
          }),
          $scope.$parent.$on('viewState.titleUpdated', function(e, data) {
            $scope.title = data && data.title || '';
          })
        ];
        $scope.$on('$destroy', function() {
          for (var i=0; i<unregisterEventListeners.length; i++)
            unregisterEventListeners[i]();
        });

        function updateHeaderData(data) {

          if (angular.isDefined(data.hideBackButton)) {
            $scope.backButtonEnabled = !!data.hideBackButton;
          }
          $scope.isReverse = data.navDirection == 'back';
          $scope.animateEnabled = !!(data.navDirection && data.animate !== false);

          $scope.leftButtons = data.leftButtons;
          $scope.rightButtons = data.rightButtons;
          $scope.oldTitle = $scope.title;
          $scope.title = data && data.title || '';

          //If no animation, we're done!
          if (!$scope.animateEnabled) {
            hb.align();
            return;
          } else {
            animateTitles();
          }
        }

        function animateTitles() {
          var oldTitleEl, newTitleEl, currentTitles;

          //If we have any title right now (or more than one, they could be transitioning on switch),
          //replace the first one with an oldTitle element
          currentTitles = $element[0].querySelectorAll('.title');
          if (currentTitles.length) {
            oldTitleEl = $compile('<h1 ng-bind-html="oldTitle" class="title"></h1>')($scope);
            angular.element(currentTitles[0]).replaceWith(oldTitleEl);
          }
          //Compile new title
          newTitleEl = $compile('<h1 class="title invisible" ng-bind-html="title"></h1>')($scope);

          //Animate in one frame
          ionic.requestAnimationFrame(function() {

            oldTitleEl && $animate.leave(angular.element(oldTitleEl));

            var insert = oldTitleEl && angular.element(oldTitleEl) || null;
            $animate.enter(newTitleEl, $element, insert, function() {
              hb.align();
            });

            //Cleanup any old titles leftover (besides the one we already did replaceWith on)
            angular.forEach(currentTitles, function(el) {
              if (el && el.parentNode) {
                //Use .remove() to cleanup things like .data()
                angular.element(el).remove();
              }
            });

            //$apply so bindings fire
            $scope.$digest();

            //Stop flicker of new title on ios7
            ionic.requestAnimationFrame(function() {
              newTitleEl[0].classList.remove('invisible');
            });
          });
        }
      };
    }
  };
}])

.directive('ionNavBarTitle', function() {
  return {
    restrict: 'A',
    require: '^ionNavBar',
    link: function($scope, $element, $attr, navBarCtrl) {
      $scope.headerBarView && $scope.headerBarView.align();
      $element.on('$animate:close', function() {
        $scope.headerBarView && $scope.headerBarView.align();
      });
    }
  };
})

/*
 * Directive to put on an element that has 'invisible' class when rendered.
 * This removes the visible class one frame later.
 * Fixes flickering in iOS7 and old android.
 * Used in title and back button
 */
.directive('ionAsyncVisible', function() {
  return function($scope, $element) {
    ionic.requestAnimationFrame(function() {
      $element[0].classList.remove('invisible');
    });
  };
})

.directive('ionView', ['$ionicViewService', '$rootScope', '$animate',
           function( $ionicViewService,   $rootScope,   $animate) {
  return {
    restrict: 'EA',
    priority: 1000,
    scope: {
      leftButtons: '=',
      rightButtons: '=',
      title: '=',
      icon: '@',
      iconOn: '@',
      iconOff: '@',
      type: '@',
      alignTitle: '@',
      hideBackButton: '@',
      hideNavBar: '@',
      animation: '@'
    },

    compile: function(tElement, tAttrs, transclude) {
      tElement.addClass('pane');
      tElement[0].removeAttribute('title');

      return function link($scope, $element, $attr) {

        $rootScope.$broadcast('viewState.viewEnter', {
          title: $scope.title,
          navDirection: $scope.$navDirection || $scope.$parent.$navDirection
        });

        // Should we hide a back button when this tab is shown
        $scope.hideBackButton = $scope.$eval($scope.hideBackButton);
        if($scope.hideBackButton) {
          $rootScope.$broadcast('viewState.showBackButton', false);
        }

        // Should the nav bar be hidden for this view or not?
        $rootScope.$broadcast('viewState.showNavBar', ($scope.hideNavBar !== 'true') );

        // watch for changes in the left buttons
        $scope.$watch('leftButtons', function(value) {
          $scope.$emit('viewState.leftButtonsChanged', $scope.leftButtons);
        });

        $scope.$watch('rightButtons', function(val) {
          $scope.$emit('viewState.rightButtonsChanged', $scope.rightButtons);
        });

        // watch for changes in the title
        $scope.$watch('title', function(val) {
          $scope.$emit('viewState.titleUpdated', $scope);
        });
      };
    }
  };
}])


.directive('ionNavBackButton', ['$ionicViewService', '$rootScope',
                     function($ionicViewService,   $rootScope) {

  function goBack(e) {
    var backView = $ionicViewService.getBackView();
    backView && backView.go();
    e.alreadyHandled = true;
    return false;
  }

  return {
    restrict: 'E',
    scope: {
      type: '=',
      label: '=',
      icon: '='
    },
    replace: true,
    template:
    '<button ng-click="goBack($event)" class="button back-button {{type}} ' +
      '{{(icon && !label) ? \'icon \' + icon : \'\'}}">' +
      '<i ng-if="icon && label" class="icon {{icon}}"></i> ' +
      '{{label}}' +
    '</button>',
    link: function($scope) {
      $scope.goBack = goBack;
    }
  };
}])

.directive('ionNavView', ['$ionicViewService', '$state', '$compile', '$controller', '$animate',
              function( $ionicViewService,   $state,   $compile,   $controller,   $animate) {
  // IONIC's fork of Angular UI Router, v0.2.7
  // the navView handles registering views in the history, which animation to use, and which
  var viewIsUpdating = false;

  var directive = {
    restrict: 'E',
    terminal: true,
    priority: 2000,
    transclude: true,
    controller: ['$scope', function($scope) {
      this.setNextAnimation = function(anim) {
        $scope.$nextAnimation = anim;
      };
    }],
    compile: function (element, attr, transclude) {
      return function(scope, element, attr, navViewCtrl) {
        var viewScope, viewLocals,
            name = attr[directive.name] || attr.name || '',
            onloadExp = attr.onload || '',
            initialView = transclude(scope);

        // Put back the compiled initial view
        element.append(initialView);

        // Find the details of the parent view directive (if any) and use it
        // to derive our own qualified view name, then hang our own details
        // off the DOM so child directives can find it.
        var parent = element.parent().inheritedData('$uiView');
        if (name.indexOf('@') < 0) name  = name + '@' + (parent ? parent.state.name : '');
        var view = { name: name, state: null };
        element.data('$uiView', view);

        var eventHook = function() {
          if (viewIsUpdating) return;
          viewIsUpdating = true;

          try { updateView(true); } catch (e) {
            viewIsUpdating = false;
            throw e;
          }
          viewIsUpdating = false;
        };

        scope.$on('$stateChangeSuccess', eventHook);
        scope.$on('$viewContentLoading', eventHook);
        updateView(false);

        function updateView(doAnimate) {
          //===false because $animate.enabled() is a noop without angular-animate included
          if ($animate.enabled() === false) {
            doAnimate = false;
          }

          var locals = $state.$current && $state.$current.locals[name];
          if (locals === viewLocals) return; // nothing to do
          var renderer = $ionicViewService.getRenderer(element, attr, scope);

          // Destroy previous view scope
          if (viewScope) {
            viewScope.$destroy();
            viewScope = null;
          }

          if (!locals) {
            viewLocals = null;
            view.state = null;

            // Restore the initial view
            return element.append(initialView);
          }

          var newElement = angular.element('<div></div>').html(locals.$template).contents();
          var viewRegisterData = renderer().register(newElement);

          // Remove existing content
          renderer(doAnimate).leave();

          viewLocals = locals;
          view.state = locals.$$state;

          renderer(doAnimate).enter(newElement);

          var link = $compile(newElement);
          viewScope = scope.$new();

          viewScope.$navDirection = viewRegisterData.navDirection;

          if (locals.$$controller) {
            locals.$scope = viewScope;
            var controller = $controller(locals.$$controller, locals);
            element.children().data('$ngControllerController', controller);
          }
          link(viewScope);

          var viewHistoryData = $ionicViewService._getView(viewRegisterData.viewId) || {};
          viewScope.$broadcast('$viewContentLoaded', viewHistoryData);

          if (onloadExp) viewScope.$eval(onloadExp);

          newElement = null;
        }
      };
    }
  };
  return directive;
}]);

})();
;
(function() {
'use strict';

angular.module('ionic.ui.virtRepeat', [])

.directive('ionVirtRepeat', function() {
  return {
    require: ['?ngModel', '^virtualList'],
    transclude: 'element',
    priority: 1000,
    terminal: true,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, ctrls) {
        var virtualList = ctrls[1];

        virtualList.listView.renderViewport = function(high, low, start, end) {
        };
      };
    }
  };
});
})(ionic);
;

(function() {
'use strict';

// Turn the expression supplied to the directive:
//
//     a in b
//
// into `{ value: "a", collection: "b" }`
function parseRepeatExpression(expression){
  var match = expression.match(/^\s*([\$\w]+)\s+in\s+(\S*)\s*$/);
  if (! match) {
    throw new Error("Expected sfVirtualRepeat in form of '_item_ in _collection_' but got '" +
                    expression + "'.");
  }
  return {
    value: match[1],
    collection: match[2]
  };
}

// Utility to filter out elements by tag name
function isTagNameInList(element, list){
  var t, tag = element.tagName.toUpperCase();
  for( t = 0; t < list.length; t++ ){
    if( list[t] === tag ){
      return true;
    }
  }
  return false;
}


// Utility to find the viewport/content elements given the start element:
function findViewportAndContent(startElement){
  /*jshint eqeqeq:false, curly:false */
  var root = $rootElement[0];
  var e, n;
  // Somewhere between the grandparent and the root node
  for( e = startElement.parent().parent()[0]; e !== root; e = e.parentNode ){
    // is an element
    if( e.nodeType != 1 ) break;
    // that isn't in the blacklist (tables etc.),
    if( isTagNameInList(e, DONT_WORK_AS_VIEWPORTS) ) continue;
    // has a single child element (the content),
    if( e.childElementCount != 1 ) continue;
    // which is not in the blacklist
    if( isTagNameInList(e.firstElementChild, DONT_WORK_AS_CONTENT) ) continue;
    // and no text.
    for( n = e.firstChild; n; n = n.nextSibling ){
      if( n.nodeType == 3 && /\S/g.test(n.textContent) ){
        break;
      }
    }
    if( n === null ){
      // That element should work as a viewport.
      return {
        viewport: angular.element(e),
        content: angular.element(e.firstElementChild)
      };
    }
  }
  throw new Error("No suitable viewport element");
}

// Apply explicit height and overflow styles to the viewport element.
//
// If the viewport has a max-height (inherited or otherwise), set max-height.
// Otherwise, set height from the current computed value or use
// window.innerHeight as a fallback
//
function setViewportCss(viewport){
  var viewportCss = {'overflow': 'auto'},
      style = window.getComputedStyle ?
        window.getComputedStyle(viewport[0]) :
        viewport[0].currentStyle,
      maxHeight = style && style.getPropertyValue('max-height'),
      height = style && style.getPropertyValue('height');

  if( maxHeight && maxHeight !== '0px' ){
    viewportCss.maxHeight = maxHeight;
  }else if( height && height !== '0px' ){
    viewportCss.height = height;
  }else{
    viewportCss.height = window.innerHeight;
  }
  viewport.css(viewportCss);
}

// Apply explicit styles to the content element to prevent pesky padding
// or borders messing with our calculations:
function setContentCss(content){
  var contentCss = {
    margin: 0,
    padding: 0,
    border: 0,
    'box-sizing': 'border-box'
  };
  content.css(contentCss);
}

// TODO: compute outerHeight (padding + border unless box-sizing is border)
function computeRowHeight(element){
  var style = window.getComputedStyle ? window.getComputedStyle(element)
                                      : element.currentStyle,
      maxHeight = style && style.getPropertyValue('max-height'),
      height = style && style.getPropertyValue('height');

  if( height && height !== '0px' && height !== 'auto' ){
    $log.info('Row height is "%s" from css height', height);
  }else if( maxHeight && maxHeight !== '0px' && maxHeight !== 'none' ){
    height = maxHeight;
    $log.info('Row height is "%s" from css max-height', height);
  }else if( element.clientHeight ){
    height = element.clientHeight+'px';
    $log.info('Row height is "%s" from client height', height);
  }else{
    throw new Error("Unable to compute height of row");
  }
  angular.element(element).css('height', height);
  return parseInt(height, 10);
}

angular.module('ionic.ui.virtualRepeat', [])

/**
 * A replacement for ng-repeat that supports virtual lists.
 * This is not a 1 to 1 replacement for ng-repeat. However, in situations
 * where you have huge lists, this repeater will work with our virtual
 * scrolling to only render items that are showing or will be showing
 * if a scroll is made.
 */
.directive('ionVirtualRepeat', ['$log', function($log) {
    return {
      require: ['?ngModel, ^virtualList'],
      transclude: 'element',
      priority: 1000,
      terminal: true,
      compile: function(element, attr, transclude) {
        var ident = parseRepeatExpression(attr.sfVirtualRepeat);

        return function(scope, iterStartElement, attrs, ctrls, b) {
          var virtualList = ctrls[1];

          var rendered = [];
          var rowHeight = 0;
          var sticky = false;

          var dom = virtualList.element;
          //var dom = findViewportAndContent(iterStartElement);

          // The list structure is controlled by a few simple (visible) variables:
          var state = 'ngModel' in attrs ? scope.$eval(attrs.ngModel) : {};

          function makeNewScope (idx, collection, containerScope) {
            var childScope = containerScope.$new();
            childScope[ident.value] = collection[idx];
            childScope.$index = idx;
            childScope.$first = (idx === 0);
            childScope.$last = (idx === (collection.length - 1));
            childScope.$middle = !(childScope.$first || childScope.$last);
            childScope.$watch(function updateChildScopeItem(){
              childScope[ident.value] = collection[idx];
            });
            return childScope;
          }

          // Given the collection and a start and end point, add the current
          function addElements (start, end, collection, containerScope, insPoint) {
            var frag = document.createDocumentFragment();
            var newElements = [], element, idx, childScope;
            for( idx = start; idx !== end; idx ++ ){
              childScope = makeNewScope(idx, collection, containerScope);
              element = linker(childScope, angular.noop);
              //setElementCss(element);
              newElements.push(element);
              frag.appendChild(element[0]);
            }
            insPoint.after(frag);
            return newElements;
          }

          function recomputeActive() {
            // We want to set the start to the low water mark unless the current
            // start is already between the low and high water marks.
            var start = clip(state.firstActive, state.firstVisible - state.lowWater, state.firstVisible - state.highWater);
            // Similarly for the end
            var end = clip(state.firstActive + state.active,
                           state.firstVisible + state.visible + state.lowWater,
                           state.firstVisible + state.visible + state.highWater );
            state.firstActive = Math.max(0, start);
            state.active = Math.min(end, state.total) - state.firstActive;
          }

          function sfVirtualRepeatOnScroll(evt){
            if( !rowHeight ){
              return;
            }
            // Enter the angular world for the state change to take effect.
            scope.$apply(function(){
              state.firstVisible = Math.floor(evt.target.scrollTop / rowHeight);
              state.visible = Math.ceil(dom.viewport[0].clientHeight / rowHeight);
              $log.log('scroll to row %o', state.firstVisible);
              sticky = evt.target.scrollTop + evt.target.clientHeight >= evt.target.scrollHeight;
              recomputeActive();
              $log.log(' state is now %o', state);
              $log.log(' sticky = %o', sticky);
            });
          }

          function sfVirtualRepeatWatchExpression(scope){
            var coll = scope.$eval(ident.collection);
            if( coll.length !== state.total ){
              state.total = coll.length;
              recomputeActive();
            }
            return {
              start: state.firstActive,
              active: state.active,
              len: coll.length
            };
          }

          function destroyActiveElements (action, count) {
            var dead, ii, remover = Array.prototype[action];
            for( ii = 0; ii < count; ii++ ){
              dead = remover.call(rendered);
              dead.scope().$destroy();
              dead.remove();
            }
          }

          // When the watch expression for the repeat changes, we may need to add
          // and remove scopes and elements
          function sfVirtualRepeatListener(newValue, oldValue, scope){
            var oldEnd = oldValue.start + oldValue.active,
                collection = scope.$eval(ident.collection),
                newElements;
            if(newValue === oldValue) {
              $log.info('initial listen');
              newElements = addElements(newValue.start, oldEnd, collection, scope, iterStartElement);
              rendered = newElements;
              if(rendered.length) {
                rowHeight = computeRowHeight(newElements[0][0]);
              }
            } else {
              var newEnd = newValue.start + newValue.active;
              var forward = newValue.start >= oldValue.start;
              var delta = forward ? newValue.start - oldValue.start
                                  : oldValue.start - newValue.start;
              var endDelta = newEnd >= oldEnd ? newEnd - oldEnd : oldEnd - newEnd;
              var contiguous = delta < (forward ? oldValue.active : newValue.active);
              $log.info('change by %o,%o rows %s', delta, endDelta, forward ? 'forward' : 'backward');
              if(!contiguous) {
                $log.info('non-contiguous change');
                destroyActiveElements('pop', rendered.length);
                rendered = addElements(newValue.start, newEnd, collection, scope, iterStartElement);
              } else {
                if(forward) {
                  $log.info('need to remove from the top');
                  destroyActiveElements('shift', delta);
                } else if(delta) {
                  $log.info('need to add at the top');
                  newElements = addElements(
                    newValue.start,
                    oldValue.start,
                    collection, scope, iterStartElement);
                  rendered = newElements.concat(rendered);
                }

                if(newEnd < oldEnd) {
                  $log.info('need to remove from the bottom');
                  destroyActiveElements('pop', oldEnd - newEnd);
                } else if(endDelta) {
                  var lastElement = rendered[rendered.length-1];
                  $log.info('need to add to the bottom');
                  newElements = addElements(
                    oldEnd,
                    newEnd,
                    collection, scope, lastElement);
                  rendered = rendered.concat(newElements);
                }
              }
              if(!rowHeight && rendered.length) {
                rowHeight = computeRowHeight(rendered[0][0]);
              }
              dom.content.css({'padding-top': newValue.start * rowHeight + 'px'});
            }
            dom.content.css({'height': newValue.len * rowHeight + 'px'});
            if(sticky) {
              dom.viewport[0].scrollTop = dom.viewport[0].clientHeight + dom.viewport[0].scrollHeight;
            }
          }

          //  - The index of the first active element
          state.firstActive = 0;
          //  - The index of the first visible element
          state.firstVisible = 0;
          //  - The number of elements visible in the viewport.
          state.visible = 0;
          // - The number of active elements
          state.active = 0;
          // - The total number of elements
          state.total = 0;
          // - The point at which we add new elements
          state.lowWater = state.lowWater || 100;
          // - The point at which we remove old elements
          state.highWater = state.highWater || 300;
          // TODO: now watch the water marks

          setContentCss(dom.content);
          setViewportCss(dom.viewport);
          // When the user scrolls, we move the `state.firstActive`
          dom.bind('momentumScrolled', sfVirtualRepeatOnScroll);

          scope.$on('$destroy', function () {
            dom.unbind('momentumScrolled', sfVirtualRepeatOnScroll);
          });

          // The watch on the collection is just a watch on the length of the
          // collection. We don't care if the content changes.
          scope.$watch(sfVirtualRepeatWatchExpression, sfVirtualRepeatListener, true);
        };
      }
    };
  }]);

})(ionic);
;
(function() {
'use strict';

angular.module('ionic.ui.scroll')

.controller('$ionicScroll', ['$scope', 'scrollViewOptions', '$timeout', '$ionicScrollDelegate', '$window', function($scope, scrollViewOptions, $timeout, $ionicScrollDelegate, $window) {

  var self = this;

  var element = this.element = scrollViewOptions.el;
  var scrollView = this.scrollView = new ionic.views.Scroll(scrollViewOptions);

  if (!angular.isDefined(scrollViewOptions.bouncing)) {
    ionic.Platform.ready(function() {
      scrollView.options.bouncing = !ionic.Platform.isAndroid();
    });
  }

  var $element = this.$element = angular.element(element);

  //Attach self to element as a controller so other directives can require this controller
  //through `require: '$ionicScroll'
  $element.data('$$ionicScrollController', this);

  //Register delegate for event handling
  $ionicScrollDelegate.register($scope, $element, scrollView);

  $window.addEventListener('resize', resize);
  $scope.$on('$destroy', function() {
    $window.removeEventListener('resize', resize);
  });
  function resize() {
    scrollView.resize();
  }

  $timeout(function() {
    scrollView.run();

    self.refresher = element.querySelector('.scroll-refresher');

    // Activate pull-to-refresh
    if(self.refresher) {
      var refresherHeight = self.refresher.clientHeight || 0;
      scrollView.activatePullToRefresh(refresherHeight, function() {
        self.refresher.classList.add('active');
        $scope.$onRefreshOpening && $scope.$onRefreshOpening();
      }, function() {
        self.refresher.classList.remove('refreshing');
        self.refresher.classList.remove('active');
      }, function() {
        self.refresher.classList.add('refreshing');
        $scope.$onRefresh && $scope.$onRefresh();
        $scope.$parent.$broadcast('scroll.onRefresh');
      });
    }
  });

}]);

})();
