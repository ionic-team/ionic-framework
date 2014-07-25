/*!
 * Copyright 2014 Drifty Co.
 * http://drifty.com/
 *
 * Ionic, v1.0.0-beta.10
 * A powerful HTML5 mobile app framework.
 * http://ionicframework.com/
 *
 * By @maxlynch, @benjsperry, @adamdbradley <3
 *
 * Licensed under the MIT license. Please see LICENSE for more information.
 *
 */

(function() {
/*
 * deprecated.js
 * https://github.com/wearefractal/deprecated/
 * Copyright (c) 2014 Fractal <contact@wearefractal.com>
 * License MIT
 */
//Interval object
var deprecated = {
  method: function(msg, log, fn) {
    var called = false;
    return function deprecatedMethod(){
      if (!called) {
        called = true;
        log(msg);
      }
      return fn.apply(this, arguments);
    };
  },

  field: function(msg, log, parent, field, val) {
    var called = false;
    var getter = function(){
      if (!called) {
        called = true;
        log(msg);
      }
      return val;
    };
    var setter = function(v) {
      if (!called) {
        called = true;
        log(msg);
      }
      val = v;
      return v;
    };
    Object.defineProperty(parent, field, {
      get: getter,
      set: setter,
      enumerable: true
    });
    return;
  }
};


var IonicModule = angular.module('ionic', ['ngAnimate', 'ngSanitize', 'ui.router']),
  extend = angular.extend,
  forEach = angular.forEach,
  isDefined = angular.isDefined,
  isString = angular.isString,
  jqLite = angular.element;


/**
 * @ngdoc service
 * @name $ionicActionSheet
 * @module ionic
 * @description
 * The Action Sheet is a slide-up pane that lets the user choose from a set of options.
 * Dangerous options are highlighted in red and made obvious.
 *
 * There are easy ways to cancel out of the action sheet, such as tapping the backdrop or even
 * hitting escape on the keyboard for desktop testing.
 *
 * ![Action Sheet](http://ionicframework.com.s3.amazonaws.com/docs/controllers/actionSheet.gif)
 *
 * @usage
 * To trigger an Action Sheet in your code, use the $ionicActionSheet service in your angular controllers:
 *
 * ```js
 * angular.module('mySuperApp', ['ionic'])
 * .controller(function($scope, $ionicActionSheet, $timeout) {
 *
 *  // Triggered on a button click, or some other target
 *  $scope.show = function() {
 *
 *    // Show the action sheet
 *    var hideSheet = $ionicActionSheet.show({
 *      buttons: [
 *        { text: '<b>Share</b> This' },
 *        { text: 'Move' }
 *      ],
 *      destructiveText: 'Delete',
 *      titleText: 'Modify your album',
 *      cancelText: 'Cancel',
 *      cancel: function() {
          // add cancel code..
        },
 *      buttonClicked: function(index) {
 *        return true;
 *      }
 *    });
 *
 *    // For example's sake, hide the sheet after two seconds
 *    $timeout(function() {
 *      hideSheet();
 *    }, 2000);
 *
 *  };
 * });
 * ```
 *
 */
IonicModule
.factory('$ionicActionSheet', [
  '$rootScope',
  '$document',
  '$compile',
  '$animate',
  '$timeout',
  '$ionicTemplateLoader',
  '$ionicPlatform',
function($rootScope, $document, $compile, $animate, $timeout, $ionicTemplateLoader, $ionicPlatform) {

  return {
    show: actionSheet
  };

  /**
   * @ngdoc method
   * @name $ionicActionSheet#show
   * @description
   * Load and return a new action sheet.
   *
   * A new isolated scope will be created for the
   * action sheet and the new element will be appended into the body.
   *
   * @param {object} options The options for this ActionSheet. Properties:
   *
   *  - `[Object]` `buttons` Which buttons to show.  Each button is an object with a `text` field.
   *  - `{string}` `titleText` The title to show on the action sheet.
   *  - `{string=}` `cancelText` the text for a 'cancel' button on the action sheet.
   *  - `{string=}` `destructiveText` The text for a 'danger' on the action sheet.
   *  - `{function=}` `cancel` Called if the cancel button is pressed, the backdrop is tapped or
   *     the hardware back button is pressed.
   *  - `{function=}` `buttonClicked` Called when one of the non-destructive buttons is clicked,
   *     with the index of the button that was clicked and the button object. Return true to close
   *     the action sheet, or false to keep it opened.
   *  - `{function=}` `destructiveButtonClicked` Called when the destructive button is clicked.
   *     Return true to close the action sheet, or false to keep it opened.
   *  -  `{boolean=}` `cancelOnStateChange` Whether to cancel the actionSheet when navigating
   *     to a new state.  Default true.
   *
   * @returns {function} `hideSheet` A function which, when called, hides & cancels the action sheet.
   */
  function actionSheet(opts) {
    var scope = $rootScope.$new(true);

    angular.extend(scope, {
      cancel: angular.noop,
      destructiveButtonClicked: angular.noop,
      buttonClicked: angular.noop,
      $deregisterBackButton: angular.noop,
      buttons: [],
      cancelOnStateChange: true
    }, opts || {});


    // Compile the template
    var element = scope.element = $compile('<ion-action-sheet buttons="buttons"></ion-action-sheet>')(scope);

    // Grab the sheet element for animation
    var sheetEl = jqLite(element[0].querySelector('.action-sheet-wrapper'));

    var stateChangeListenDone = scope.cancelOnStateChange ?
      $rootScope.$on('$stateChangeSuccess', function() { scope.cancel(); }) :
      angular.noop;

    // removes the actionSheet from the screen
    scope.removeSheet = function(done) {
      if (scope.removed) return;

      scope.removed = true;
      sheetEl.removeClass('action-sheet-up');
      $document[0].body.classList.remove('action-sheet-open');
      scope.$deregisterBackButton();
      stateChangeListenDone();

      $animate.removeClass(element, 'active', function() {
        scope.$destroy();
        element.remove();
        // scope.cancel.$scope is defined near the bottom
        scope.cancel.$scope = null;
        (done || angular.noop)();
      });
    };

    scope.showSheet = function(done) {
      if (scope.removed) return;

      $document[0].body.appendChild(element[0]);
      $document[0].body.classList.add('action-sheet-open');

      $animate.addClass(element, 'active', function() {
        if (scope.removed) return;
        (done || angular.noop)();
      });
      $timeout(function(){
        if (scope.removed) return;
        sheetEl.addClass('action-sheet-up');
      }, 20, false);
    };

    // registerBackButtonAction returns a callback to deregister the action
    scope.$deregisterBackButton = $ionicPlatform.registerBackButtonAction(
      scope.cancel,
      PLATFORM_BACK_BUTTON_PRIORITY_ACTION_SHEET
    );

    // called when the user presses the cancel button
    scope.cancel = function() {
      // after the animation is out, call the cancel callback
      scope.removeSheet(opts.cancel);
    };

    scope.buttonClicked = function(index) {
      // Check if the button click event returned true, which means
      // we can close the action sheet
      if (opts.buttonClicked(index, opts.buttons[index]) === true) {
        scope.removeSheet();
      }
    };

    scope.destructiveButtonClicked = function() {
      // Check if the destructive button click event returned true, which means
      // we can close the action sheet
      if (opts.destructiveButtonClicked() === true) {
        scope.removeSheet();
      }
    };

    scope.showSheet();

    // Expose the scope on $ionicActionSheet's return value for the sake
    // of testing it.
    scope.cancel.$scope = scope;

    return scope.cancel;
  }
}]);


jqLite.prototype.addClass = function(cssClasses) {
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

jqLite.prototype.removeClass = function(cssClasses) {
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
};


/**
 * @ngdoc service
 * @name $ionicAnimation
 * @module ionic
 * @description
 *
 * A powerful animation and transition system for Ionic apps.
 *
 * @usage
 *
 * ```js
 * angular.module('mySuperApp', ['ionic'])
 * .controller(function($scope, $ionicAnimation) {
 *    var anim = $ionicAnimation({
 *     // A unique, reusable name
 *     name: 'popIn',
 *
 *     // The duration of an auto playthrough
 *     duration: 0.5,
 *
 *     // How long to wait before running the animation
 *     delay: 0,
 *
 *     // Whether to reverse after doing one run through
 *     autoReverse: false,
 *
 *     // How many times to repeat? -1 or null for infinite
 *     repeat: -1,
 *
 *     // Timing curve to use (same as CSS timing functions), or a function of time "t" to handle it yourself
 *     curve: 'ease-in-out'
 *
 *     onStart: function() {
 *       // Callback on start
 *     },
 *     onEnd: function() {
 *       // Callback on end
 *     },
 *     step: function(amt) {
 *
 *     }
 *   })
 * });
 * ```
 *
 */
IonicModule
.provider('$ionicAnimation', function() {
  var useSlowAnimations = false;
  this.setSlowAnimations = function(isSlow) {
    useSlowAnimations = isSlow;
  };

  this.create = function(animation) {
    return ionic.Animation.create(animation);
  };

  this.$get = [function() {
    return function(opts) {
      opts.useSlowAnimations = useSlowAnimations;
      return ionic.Animation.create(opts);
    };
  }];
});

/**
 * @ngdoc service
 * @name $ionicBackdrop
 * @module ionic
 * @description
 * Shows and hides a backdrop over the UI.  Appears behind popups, loading,
 * and other overlays.
 *
 * Often, multiple UI components require a backdrop, but only one backdrop is
 * ever needed in the DOM at a time.
 *
 * Therefore, each component that requires the backdrop to be shown calls
 * `$ionicBackdrop.retain()` when it wants the backdrop, then `$ionicBackdrop.release()`
 * when it is done with the backdrop.
 *
 * For each time `retain` is called, the backdrop will be shown until `release` is called.
 *
 * For example, if `retain` is called three times, the backdrop will be shown until `release`
 * is called three times.
 *
 * @usage
 *
 * ```js
 * function MyController($scope, $ionicBackdrop, $timeout) {
 *   //Show a backdrop for one second
 *   $scope.action = function() {
 *     $ionicBackdrop.retain();
 *     $timeout(function() {
 *       $ionicBackdrop.release();
 *     }, 1000);
 *   };
 * }
 * ```
 */
IonicModule
.factory('$ionicBackdrop', [
  '$document',
function($document) {

  var el = jqLite('<div class="backdrop">');
  var backdropHolds = 0;

  $document[0].body.appendChild(el[0]);

  return {
    /**
     * @ngdoc method
     * @name $ionicBackdrop#retain
     * @description Retains the backdrop.
     */
    retain: retain,
    /**
     * @ngdoc method
     * @name $ionicBackdrop#release
     * @description
     * Releases the backdrop.
     */
    release: release,

    getElement: getElement,

    // exposed for testing
    _element: el
  };

  function retain() {
    if ( (++backdropHolds) === 1 ) {
      el.addClass('visible');
      ionic.requestAnimationFrame(function() {
        backdropHolds && el.addClass('active');
      });
    }
  }
  function release() {
    if ( (--backdropHolds) === 0 ) {
      el.removeClass('active');
      setTimeout(function() {
        !backdropHolds && el.removeClass('visible');
      }, 100);
    }
  }

  function getElement() {
    return el;
  }

}]);

/**
 * @private
 */
IonicModule
.factory('$ionicBind', ['$parse', '$interpolate', function($parse, $interpolate) {
  var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/;
  return function(scope, attrs, bindDefinition) {
    forEach(bindDefinition || {}, function (definition, scopeName) {
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

IonicModule
.factory('$collectionDataSource', [
  '$cacheFactory',
  '$parse',
  '$rootScope',
function($cacheFactory, $parse, $rootScope) {

  function CollectionRepeatDataSource(options) {
    var self = this;
    this.scope = options.scope;
    this.transcludeFn = options.transcludeFn;
    this.transcludeParent = options.transcludeParent;

    this.keyExpr = options.keyExpr;
    this.listExpr = options.listExpr;
    this.trackByExpr = options.trackByExpr;

    this.heightGetter = options.heightGetter;
    this.widthGetter = options.widthGetter;

    this.dimensions = [];
    this.data = [];

    if (this.trackByExpr) {
      var trackByGetter = $parse(this.trackByExpr);
      var hashFnLocals = {$id: hashKey};
      this.itemHashGetter = function(index, value) {
        hashFnLocals[self.keyExpr] = value;
        hashFnLocals.$index = index;
        return trackByGetter(self.scope, hashFnLocals);
      };
    } else {
      this.itemHashGetter = function(index, value) {
        return hashKey(value);
      };
    }

    this.attachedItems = {};
    this.BACKUP_ITEMS_LENGTH = 10;
    this.backupItemsArray = [];
  }
  CollectionRepeatDataSource.prototype = {
    setup: function() {
      for (var i = 0; i < this.BACKUP_ITEMS_LENGTH; i++) {
        this.detachItem(this.createItem());
      }
    },
    destroy: function() {
      this.dimensions.length = 0;
      this.data = null;
      this.backupItemsArray.length = 0;
      this.attachedItems = {};
    },
    calculateDataDimensions: function() {
      var locals = {};
      this.dimensions = this.data.map(function(value, index) {
        locals[this.keyExpr] = value;
        locals.$index = index;
        return {
          width: this.widthGetter(this.scope, locals),
          height: this.heightGetter(this.scope, locals)
        };
      }, this);
    },
    createItem: function() {
      var item = {};
      item.scope = this.scope.$new();

      this.transcludeFn(item.scope, function(clone) {
        clone.css('position', 'absolute');
        item.element = clone;
      });

      this.transcludeParent.append(item.element);

      return item;
    },
    getItem: function(hash) {
      if ( (item = this.attachedItems[hash]) ) {
        //do nothing, the item is good
      } else if ( (item = this.backupItemsArray.pop()) ) {
        reconnectScope(item.scope);
      } else {
        item = this.createItem();
      }
      return item;
    },
    attachItemAtIndex: function(index) {
      var value = this.data[index];
      var hash = this.itemHashGetter(index, value);
      var item = this.getItem(hash);

      if (item.scope.$index !== index || item.scope[this.keyExpr] !== value) {
        item.scope[this.keyExpr] = value;
        item.scope.$index = index;
        item.scope.$first = (index === 0);
        item.scope.$last = (index === (this.getLength() - 1));
        item.scope.$middle = !(item.scope.$first || item.scope.$last);
        item.scope.$odd = !(item.scope.$even = (index&1) === 0);

        //We changed the scope, so digest if needed
        if (!$rootScope.$$phase) {
          item.scope.$digest();
        }
      }

      item.hash = hash;
      this.attachedItems[hash] = item;

      return item;
    },
    destroyItem: function(item) {
      item.element.remove();
      item.scope.$destroy();
      item.scope = null;
      item.element = null;
    },
    detachItem: function(item) {
      delete this.attachedItems[item.hash];

      // If we are at the limit of backup items, just get rid of the this element
      if (this.backupItemsArray.length >= this.BACKUP_ITEMS_LENGTH) {
        this.destroyItem(item);
      // Otherwise, add it to our backup items
      } else {
        this.backupItemsArray.push(item);
        item.element.css(ionic.CSS.TRANSFORM, 'translate3d(-2000px,-2000px,0)');
        //Don't .$destroy(), just stop watchers and events firing
        disconnectScope(item.scope);
      }
    },
    getLength: function() {
      return this.data && this.data.length || 0;
    },
    setData: function(value) {
      this.data = value || [];
      this.calculateDataDimensions();
    },
  };

  return CollectionRepeatDataSource;
}]);

/**
* Computes a hash of an 'obj'.
 * Hash of a:
 *  string is string
 *  number is number as string
 *  object is either result of calling $$hashKey function on the object or uniquely generated id,
 *         that is also assigned to the $$hashKey property of the object.
 *
 * @param obj
 * @returns {string} hash string such that the same input will have the same hash string.
 *         The resulting string key is in 'type:hashKey' format.
 */
function hashKey(obj) {
  var objType = typeof obj,
      key;

  if (objType == 'object' && obj !== null) {
    if (typeof (key = obj.$$hashKey) == 'function') {
      // must invoke on object to keep the right this
      key = obj.$$hashKey();
    } else if (key === undefined) {
      key = obj.$$hashKey = ionic.Utils.nextUid();
    }
  } else {
    key = obj;
  }

  return objType + ':' + key;
}

function disconnectScope(scope) {
  if (scope.$root === scope) {
    return; // we can't disconnect the root node;
  }
  var parent = scope.$parent;
  scope.$$disconnected = true;
  // See Scope.$destroy
  if (parent.$$childHead === scope) {
    parent.$$childHead = scope.$$nextSibling;
  }
  if (parent.$$childTail === scope) {
    parent.$$childTail = scope.$$prevSibling;
  }
  if (scope.$$prevSibling) {
    scope.$$prevSibling.$$nextSibling = scope.$$nextSibling;
  }
  if (scope.$$nextSibling) {
    scope.$$nextSibling.$$prevSibling = scope.$$prevSibling;
  }
  scope.$$nextSibling = scope.$$prevSibling = null;
}

function reconnectScope(scope) {
  if (scope.$root === scope) {
    return; // we can't disconnect the root node;
  }
  if (!scope.$$disconnected) {
    return;
  }
  var parent = scope.$parent;
  scope.$$disconnected = false;
  // See Scope.$new for this logic...
  scope.$$prevSibling = parent.$$childTail;
  if (parent.$$childHead) {
    parent.$$childTail.$$nextSibling = scope;
    parent.$$childTail = scope;
  } else {
    parent.$$childHead = parent.$$childTail = scope;
  }
}


IonicModule
.factory('$collectionRepeatManager', [
  '$rootScope',
  '$timeout',
function($rootScope, $timeout) {
  /**
   * Vocabulary: "primary" and "secondary" size/direction/position mean
   * "y" and "x" for vertical scrolling, or "x" and "y" for horizontal scrolling.
   */
  function CollectionRepeatManager(options) {
    var self = this;
    this.dataSource = options.dataSource;
    this.element = options.element;
    this.scrollView = options.scrollView;

    this.isVertical = !!this.scrollView.options.scrollingY;
    this.renderedItems = {};
    this.dimensions = [];
    this.setCurrentIndex(0);

    //Override scrollview's render callback
    this.scrollView.__$callback = this.scrollView.__callback;
    this.scrollView.__callback = angular.bind(this, this.renderScroll);

    function getViewportSize() { return self.viewportSize; }
    //Set getters and setters to match whether this scrollview is vertical or not
    if (this.isVertical) {
      this.scrollView.options.getContentHeight = getViewportSize;

      this.scrollValue = function() {
        return this.scrollView.__scrollTop;
      };
      this.scrollMaxValue = function() {
        return this.scrollView.__maxScrollTop;
      };
      this.scrollSize = function() {
        return this.scrollView.__clientHeight;
      };
      this.secondaryScrollSize = function() {
        return this.scrollView.__clientWidth;
      };
      this.transformString = function(y, x) {
        return 'translate3d('+x+'px,'+y+'px,0)';
      };
      this.primaryDimension = function(dim) {
        return dim.height;
      };
      this.secondaryDimension = function(dim) {
        return dim.width;
      };
    } else {
      this.scrollView.options.getContentWidth = getViewportSize;

      this.scrollValue = function() {
        return this.scrollView.__scrollLeft;
      };
      this.scrollMaxValue = function() {
        return this.scrollView.__maxScrollLeft;
      };
      this.scrollSize = function() {
        return this.scrollView.__clientWidth;
      };
      this.secondaryScrollSize = function() {
        return this.scrollView.__clientHeight;
      };
      this.transformString = function(x, y) {
        return 'translate3d('+x+'px,'+y+'px,0)';
      };
      this.primaryDimension = function(dim) {
        return dim.width;
      };
      this.secondaryDimension = function(dim) {
        return dim.height;
      };
    }
  }

  CollectionRepeatManager.prototype = {
    destroy: function() {
      this.renderedItems = {};
      this.render = angular.noop;
      this.calculateDimensions = angular.noop;
      this.dimensions = [];
    },

    /*
     * Pre-calculate the position of all items in the data list.
     * Do this using the provided width and height (primarySize and secondarySize)
     * provided by the dataSource.
     */
    calculateDimensions: function() {
      /*
       * For the sake of explanations below, we're going to pretend we are scrolling
       * vertically: Items are laid out with primarySize being height,
       * secondarySize being width.
       */
      var primaryPos = 0;
      var secondaryPos = 0;
      var secondaryScrollSize = this.secondaryScrollSize();
      var previousItem;

      return this.dataSource.dimensions.map(function(dim) {
        //Each dimension is an object {width: Number, height: Number} provided by
        //the dataSource
        var rect = {
          //Get the height out of the dimension object
          primarySize: this.primaryDimension(dim),
          //Max out the item's width to the width of the scrollview
          secondarySize: Math.min(this.secondaryDimension(dim), secondaryScrollSize)
        };

        //If this isn't the first item
        if (previousItem) {
          //Move the item's x position over by the width of the previous item
          secondaryPos += previousItem.secondarySize;
          //If the y position is the same as the previous item and
          //the x position is bigger than the scroller's width
          if (previousItem.primaryPos === primaryPos &&
              secondaryPos + rect.secondarySize > secondaryScrollSize) {
            //Then go to the next row, with x position 0
            secondaryPos = 0;
            primaryPos += previousItem.primarySize;
          }
        }

        rect.primaryPos = primaryPos;
        rect.secondaryPos = secondaryPos;

        previousItem = rect;
        return rect;
      }, this);
    },
    resize: function() {
      this.dimensions = this.calculateDimensions();
      var lastItem = this.dimensions[this.dimensions.length - 1];
      this.viewportSize = lastItem ? lastItem.primaryPos + lastItem.primarySize : 0;
      this.setCurrentIndex(0);
      this.render(true);
      if (!this.dataSource.backupItemsArray.length) {
        this.dataSource.setup();
      }
    },
    /*
     * setCurrentIndex sets the index in the list that matches the scroller's position.
     * Also save the position in the scroller for next and previous items (if they exist)
     */
    setCurrentIndex: function(index, height) {
      var currentPos = (this.dimensions[index] || {}).primaryPos || 0;
      this.currentIndex = index;

      this.hasPrevIndex = index > 0;
      if (this.hasPrevIndex) {
        this.previousPos = Math.max(
          currentPos - this.dimensions[index - 1].primarySize,
          this.dimensions[index - 1].primaryPos
        );
      }
      this.hasNextIndex = index + 1 < this.dataSource.getLength();
      if (this.hasNextIndex) {
        this.nextPos = Math.min(
          currentPos + this.dimensions[index + 1].primarySize,
          this.dimensions[index + 1].primaryPos
        );
      }
    },
    /**
     * override the scroller's render callback to check if we need to
     * re-render our collection
     */
    renderScroll: ionic.animationFrameThrottle(function(transformLeft, transformTop, zoom, wasResize) {
      if (this.isVertical) {
        this.renderIfNeeded(transformTop);
      } else {
        this.renderIfNeeded(transformLeft);
      }
      return this.scrollView.__$callback(transformLeft, transformTop, zoom, wasResize);
    }),
    renderIfNeeded: function(scrollPos) {
      if ((this.hasNextIndex && scrollPos >= this.nextPos) ||
          (this.hasPrevIndex && scrollPos < this.previousPos)) {
           // Math.abs(transformPos - this.lastRenderScrollValue) > 100) {
        this.render();
      }
    },
    /*
     * getIndexForScrollValue: Given the most recent data index and a new scrollValue,
     * find the data index that matches that scrollValue.
     *
     * Strategy (if we are scrolling down): keep going forward in the dimensions list,
     * starting at the given index, until an item with height matching the new scrollValue
     * is found.
     *
     * This is a while loop. In the worst case it will have to go through the whole list
     * (eg to scroll from top to bottom).  The most common case is to scroll
     * down 1-3 items at a time.
     *
     * While this is not as efficient as it could be, optimizing it gives no noticeable
     * benefit.  We would have to use a new memory-intensive data structure for dimensions
     * to fully optimize it.
     */
    getIndexForScrollValue: function(i, scrollValue) {
      var rect;
      //Scrolling up
      if (scrollValue <= this.dimensions[i].primaryPos) {
        while ( (rect = this.dimensions[i - 1]) && rect.primaryPos > scrollValue) {
          i--;
        }
      //Scrolling down
      } else {
        while ( (rect = this.dimensions[i + 1]) && rect.primaryPos < scrollValue) {
          i++;
        }
      }
      return i;
    },
    /*
     * render: Figure out the scroll position, the index matching it, and then tell
     * the data source to render the correct items into the DOM.
     */
    render: function(shouldRedrawAll) {
      var i;
      var isOutOfBounds = ( this.currentIndex >= this.dataSource.getLength() );
      // We want to remove all the items and redraw everything if we're out of bounds
      // or a flag is passed in.
      if (isOutOfBounds || shouldRedrawAll) {
        for (i in this.renderedItems) {
          this.removeItem(i);
        }
        // Just don't render anything if we're out of bounds
        if (isOutOfBounds) return;
      }

      var rect;
      var scrollValue = this.scrollValue();
      // Scroll size = how many pixels are visible in the scroller at one time
      var scrollSize = this.scrollSize();
      // We take the current scroll value and add it to the scrollSize to get
      // what scrollValue the current visible scroll area ends at.
      var scrollSizeEnd = scrollSize + scrollValue;
      // Get the new start index for scrolling, based on the current scrollValue and
      // the most recent known index
      var startIndex = this.getIndexForScrollValue(this.currentIndex, scrollValue);

      // If we aren't on the first item, add one row of items before so that when the user is
      // scrolling up he sees the previous item
      var renderStartIndex = Math.max(startIndex - 1, 0);
      // Keep adding items to the 'extra row above' until we get to a new row.
      // This is for the case where there are multiple items on one row above
      // the current item; we want to keep adding items above until
      // a new row is reached.
      while (renderStartIndex > 0 &&
         (rect = this.dimensions[renderStartIndex]) &&
         rect.primaryPos === this.dimensions[startIndex - 1].primaryPos) {
        renderStartIndex--;
      }

      // Keep rendering items, adding them until we are past the end of the visible scroll area
      i = renderStartIndex;
      while ((rect = this.dimensions[i]) && (rect.primaryPos - rect.primarySize < scrollSizeEnd)) {
        this.renderItem(i, rect.primaryPos, rect.secondaryPos);
        i++;
      }
      var renderEndIndex = i - 1;

      // Remove any items that were rendered and aren't visible anymore
      for (i in this.renderedItems) {
        if (i < renderStartIndex || i > renderEndIndex) {
          this.removeItem(i);
        }
      }

      this.setCurrentIndex(startIndex);
    },
    renderItem: function(dataIndex, primaryPos, secondaryPos) {
      // Attach an item, and set its transform position to the required value
      var item = this.dataSource.attachItemAtIndex(dataIndex);
      if (item && item.element) {
        if (item.primaryPos !== primaryPos || item.secondaryPos !== secondaryPos) {
          item.element.css(ionic.CSS.TRANSFORM, this.transformString(
            primaryPos, secondaryPos
          ));
          item.primaryPos = primaryPos;
          item.secondaryPos = secondaryPos;
        }
        // Save the item in rendered items
        this.renderedItems[dataIndex] = item;
      } else {
        // If an item at this index doesn't exist anymore, be sure to delete
        // it from rendered items
        delete this.renderedItems[dataIndex];
      }
    },
    removeItem: function(dataIndex) {
      // Detach a given item
      var item = this.renderedItems[dataIndex];
      if (item) {
        item.primaryPos = item.secondaryPos = null;
        this.dataSource.detachItem(item);
        delete this.renderedItems[dataIndex];
      }
    }
  };

  return CollectionRepeatManager;
}]);


function delegateService(methodNames) {
  return ['$log', function($log) {
    var delegate = this;

    var instances = this._instances = [];
    this._registerInstance = function(instance, handle) {
      instance.$$delegateHandle = handle;
      instances.push(instance);

      return function deregister() {
        var index = instances.indexOf(instance);
        if (index !== -1) {
          instances.splice(index, 1);
        }
      };
    };

    this.$getByHandle = function(handle) {
      if (!handle) {
        return delegate;
      }
      return new InstanceForHandle(handle);
    };

    /*
     * Creates a new object that will have all the methodNames given,
     * and call them on the given the controller instance matching given
     * handle.
     * The reason we don't just let $getByHandle return the controller instance
     * itself is that the controller instance might not exist yet.
     *
     * We want people to be able to do
     * `var instance = $ionicScrollDelegate.$getByHandle('foo')` on controller
     * instantiation, but on controller instantiation a child directive
     * may not have been compiled yet!
     *
     * So this is our way of solving this problem: we create an object
     * that will only try to fetch the controller with given handle
     * once the methods are actually called.
     */
    function InstanceForHandle(handle) {
      this.handle = handle;
    }
    methodNames.forEach(function(methodName) {
      InstanceForHandle.prototype[methodName] = function() {
        var handle = this.handle;
        var args = arguments;
        var matchingInstancesFound = 0;
        var finalResult;
        var result;

        //This logic is repeated below; we could factor some of it out to a function
        //but don't because it lets this method be more performant (one loop versus 2)
        instances.forEach(function(instance) {
          if (instance.$$delegateHandle === handle) {
            matchingInstancesFound++;
            result = instance[methodName].apply(instance, args);
            //Only return the value from the first call
            if (matchingInstancesFound === 1) {
              finalResult = result;
            }
          }
        });

        if (!matchingInstancesFound) {
          return $log.warn(
            'Delegate for handle "'+this.handle+'" could not find a ' +
            'corresponding element with delegate-handle="'+this.handle+'"! ' +
            methodName + '() was not called!\n' +
            'Possible cause: If you are calling ' + methodName + '() immediately, and ' +
            'your element with delegate-handle="' + this.handle + '" is a child of your ' +
            'controller, then your element may not be compiled yet. Put a $timeout ' +
            'around your call to ' + methodName + '() and try again.'
          );
        }

        return finalResult;
      };
      delegate[methodName] = function() {
        var args = arguments;
        var finalResult;
        var result;

        //This logic is repeated above
        instances.forEach(function(instance, index) {
          result = instance[methodName].apply(instance, args);
          //Only return the value from the first call
          if (index === 0) {
            finalResult = result;
          }
        });

        return finalResult;
      };

      function callMethod(instancesToUse, methodName, args) {
        var finalResult;
        var result;
        instancesToUse.forEach(function(instance, index) {
          result = instance[methodName].apply(instance, args);
          //Make it so the first result is the one returned
          if (index === 0) {
            finalResult = result;
          }
        });
        return finalResult;
      }
    });
  }];
}

/**
 * @ngdoc service
 * @name $ionicGesture
 * @module ionic
 * @description An angular service exposing ionic
 * {@link ionic.utility:ionic.EventController}'s gestures.
 */
IonicModule
.factory('$ionicGesture', [function() {
  return {
    /**
     * @ngdoc method
     * @name $ionicGesture#on
     * @description Add an event listener for a gesture on an element. See {@link ionic.utility:ionic.EventController#onGesture}.
     * @param {string} eventType The gesture event to listen for.
     * @param {function(e)} callback The function to call when the gesture
     * happens.
     * @param {element} $element The angular element to listen for the event on.
     * @returns {ionic.Gesture} The gesture object (use this to remove the gesture later on).
     */
    on: function(eventType, cb, $element) {
      return window.ionic.onGesture(eventType, cb, $element[0]);
    },
    /**
     * @ngdoc method
     * @name $ionicGesture#off
     * @description Remove an event listener for a gesture on an element. See {@link ionic.utility:ionic.EventController#offGesture}.
     * @param {ionic.Gesture} gesture The gesture that should be removed.
     * @param {string} eventType The gesture event to remove the listener for.
     * @param {function(e)} callback The listener to remove.
     */
    off: function(gesture, eventType, cb) {
      return window.ionic.offGesture(gesture, eventType, cb);
    }
  };
}]);


var LOADING_TPL =
  '<div class="loading-container">' +
    '<div class="loading">' +
    '</div>' +
  '</div>';

var LOADING_HIDE_DEPRECATED = '$ionicLoading instance.hide() has been deprecated. Use $ionicLoading.hide().';
var LOADING_SHOW_DEPRECATED = '$ionicLoading instance.show() has been deprecated. Use $ionicLoading.show().';
var LOADING_SET_DEPRECATED = '$ionicLoading instance.setContent() has been deprecated. Use $ionicLoading.show({ template: \'my content\' }).';

/**
 * @ngdoc service
 * @name $ionicLoading
 * @module ionic
 * @description
 * An overlay that can be used to indicate activity while blocking user
 * interaction.
 *
 * @usage
 * ```js
 * angular.module('LoadingApp', ['ionic'])
 * .controller('LoadingCtrl', function($scope, $ionicLoading) {
 *   $scope.show = function() {
 *     $ionicLoading.show({
 *       template: 'Loading...'
 *     });
 *   };
 *   $scope.hide = function(){
 *     $ionicLoading.hide();
 *   };
 * });
 * ```
 */
/**
 * @ngdoc object
 * @name $ionicLoadingConfig
 * @module ionic
 * @description
 * Set the default options to be passed to the {@link ionic.service:$ionicLoading} service.
 *
 * @usage
 * ```js
 * var app = angular.module('myApp', ['ionic'])
 * app.constant('$ionicLoadingConfig', {
 *   template: 'Default Loading Template...'
 * });
 * app.controller('AppCtrl', function($scope, $ionicLoading) {
 *   $scope.showLoading = function() {
 *     $ionicLoading.show(); //options default to values in $ionicLoadingConfig
 *   };
 * });
 * ```
 */
IonicModule
.constant('$ionicLoadingConfig', {
  template: '<i class="ion-loading-d"></i>'
})
.factory('$ionicLoading', [
  '$ionicLoadingConfig',
  '$document',
  '$ionicTemplateLoader',
  '$ionicBackdrop',
  '$timeout',
  '$q',
  '$log',
  '$compile',
  '$ionicPlatform',
function($ionicLoadingConfig, $document, $ionicTemplateLoader, $ionicBackdrop, $timeout, $q, $log, $compile, $ionicPlatform) {

  var loaderInstance;
  //default values
  var deregisterBackAction = angular.noop;
  var loadingShowDelay = $q.when();

  return {
    /**
     * @ngdoc method
     * @name $ionicLoading#show
     * @description Shows a loading indicator. If the indicator is already shown,
     * it will set the options given and keep the indicator shown.
     * @param {object} opts The options for the loading indicator. Available properties:
     *  - `{string=}` `template` The html content of the indicator.
     *  - `{string=}` `templateUrl` The url of an html template to load as the content of the indicator.
     *  - `{boolean=}` `noBackdrop` Whether to hide the backdrop. By default it will be shown.
     *  - `{number=}` `delay` How many milliseconds to delay showing the indicator. By default there is no delay.
     *  - `{number=}` `duration` How many milliseconds to wait until automatically
     *  hiding the indicator. By default, the indicator will be shown until `.hide()` is called.
     */
    show: showLoader,
    /**
     * @ngdoc method
     * @name $ionicLoading#hide
     * @description Hides the loading indicator, if shown.
     */
    hide: hideLoader,
    /**
     * @private for testing
     */
    _getLoader: getLoader
  };

  function getLoader() {
    if (!loaderInstance) {
      loaderInstance = $ionicTemplateLoader.compile({
        template: LOADING_TPL,
        appendTo: $document[0].body
      })
      .then(function(loader) {
        var self = loader;

        loader.show = function(options) {
          var templatePromise = options.templateUrl ?
            $ionicTemplateLoader.load(options.templateUrl) :
            //options.content: deprecated
            $q.when(options.template || options.content || '');


          if (!this.isShown) {
            //options.showBackdrop: deprecated
            this.hasBackdrop = !options.noBackdrop && options.showBackdrop !== false;
            if (this.hasBackdrop) {
              $ionicBackdrop.retain();
              $ionicBackdrop.getElement().addClass('backdrop-loading');
            }
          }

          if (options.duration) {
            $timeout.cancel(this.durationTimeout);
            this.durationTimeout = $timeout(
              angular.bind(this, this.hide),
              +options.duration
            );
          }

          templatePromise.then(function(html) {
            if (html) {
              var loading = self.element.children();
              loading.html(html);
              $compile(loading.contents())(self.scope);
            }

            //Don't show until template changes
            if (self.isShown) {
              self.element.addClass('visible');
              ionic.requestAnimationFrame(function() {
                self.isShown && self.element.addClass('active');
                $document[0].body.classList.add('loading-active');
              });
            }
          });

          this.isShown = true;
        };
        loader.hide = function() {
          if (this.isShown) {
            if (this.hasBackdrop) {
              $ionicBackdrop.release();
              $ionicBackdrop.getElement().removeClass('backdrop-loading');
            }
            self.element.removeClass('active');
            $document[0].body.classList.remove('loading-active');
            setTimeout(function() {
              !self.isShown && self.element.removeClass('visible');
            }, 200);
          }
          $timeout.cancel(this.durationTimeout);
          this.isShown = false;
        };

        return loader;
      });
    }
    return loaderInstance;
  }

  function showLoader(options) {
    options = extend($ionicLoadingConfig || {}, options || {});
    var delay = options.delay || options.showDelay || 0;

    //If loading.show() was called previously, cancel it and show with our new options
    loadingShowDelay && $timeout.cancel(loadingShowDelay);
    loadingShowDelay = $timeout(angular.noop, delay);

    loadingShowDelay.then(getLoader).then(function(loader) {
      deregisterBackAction();
      //Disable hardware back button while loading
      deregisterBackAction = $ionicPlatform.registerBackButtonAction(
        angular.noop,
        PLATFORM_BACK_BUTTON_PRIORITY_LOADING
      );
      return loader.show(options);
    });

    return {
      hide: deprecated.method(LOADING_HIDE_DEPRECATED, $log.error, hideLoader),
      show: deprecated.method(LOADING_SHOW_DEPRECATED, $log.error, function() {
        showLoader(options);
      }),
      setContent: deprecated.method(LOADING_SET_DEPRECATED, $log.error, function(content) {
        getLoader().then(function(loader) {
          loader.show({ template: content });
        });
      })
    };
  }

  function hideLoader() {
    deregisterBackAction();
    $timeout.cancel(loadingShowDelay);
    getLoader().then(function(loader) {
      loader.hide();
    });
  }
}]);

/**
 * @ngdoc service
 * @name $ionicModal
 * @module ionic
 * @description
 *
 * Related: {@link ionic.controller:ionicModal ionicModal controller}.
 *
 * The Modal is a content pane that can go over the user's main view
 * temporarily.  Usually used for making a choice or editing an item.
 *
 * Put the content of the modal inside of an `<ion-modal-view>` element.
 *
 * Note: a modal will broadcast 'modal.shown', 'modal.hidden', and 'modal.removed' events from its originating
 * scope, passing in itself as an event argument. Both the modal.removed and modal.hidden events are
 * called when the modal is removed.
 *
 * @usage
 * ```html
 * <script id="my-modal.html" type="text/ng-template">
 *   <ion-modal-view>
 *     <ion-header-bar>
 *       <h1 class="title">My Modal title</h1>
 *     </ion-header-bar>
 *     <ion-content>
 *       Hello!
 *     </ion-content>
 *   </ion-modal-view>
 * </script>
 * ```
 * ```js
 * angular.module('testApp', ['ionic'])
 * .controller('MyController', function($scope, $ionicModal) {
 *   $ionicModal.fromTemplateUrl('my-modal.html', {
 *     scope: $scope,
 *     animation: 'slide-in-up'
 *   }).then(function(modal) {
 *     $scope.modal = modal;
 *   });
 *   $scope.openModal = function() {
 *     $scope.modal.show();
 *   };
 *   $scope.closeModal = function() {
 *     $scope.modal.hide();
 *   };
 *   //Cleanup the modal when we're done with it!
 *   $scope.$on('$destroy', function() {
 *     $scope.modal.remove();
 *   });
 *   // Execute action on hide modal
 *   $scope.$on('modal.hidden', function() {
 *     // Execute action
 *   });
 *   // Execute action on remove modal
 *   $scope.$on('modal.removed', function() {
 *     // Execute action
 *   });
 * });
 * ```
 */
IonicModule
.factory('$ionicModal', [
  '$rootScope',
  '$document',
  '$compile',
  '$timeout',
  '$ionicPlatform',
  '$ionicTemplateLoader',
  '$q',
  '$log',
function($rootScope, $document, $compile, $timeout, $ionicPlatform, $ionicTemplateLoader, $q, $log) {

  /**
   * @ngdoc controller
   * @name ionicModal
   * @module ionic
   * @description
   * Instantiated by the {@link ionic.service:$ionicModal} service.
   *
   * Be sure to call [remove()](#remove) when you are done with each modal
   * to clean it up and avoid memory leaks.
   *
   * Note: a modal will broadcast 'modal.shown', 'modal.hidden', and 'modal.removed' events from its originating
   * scope, passing in itself as an event argument. Note: both modal.removed and modal.hidden are
   * called when the modal is removed.
   */
  var ModalView = ionic.views.Modal.inherit({
    /**
     * @ngdoc method
     * @name ionicModal#initialize
     * @description Creates a new modal controller instance.
     * @param {object} options An options object with the following properties:
     *  - `{object=}` `scope` The scope to be a child of.
     *    Default: creates a child of $rootScope.
     *  - `{string=}` `animation` The animation to show & hide with.
     *    Default: 'slide-in-up'
     *  - `{boolean=}` `focusFirstInput` Whether to autofocus the first input of
     *    the modal when shown.  Default: false.
     *  - `{boolean=}` `backdropClickToClose` Whether to close the modal on clicking the backdrop.
     *    Default: true.
     *  - `{boolean=}` `hardwareBackButtonClose` Whether the modal can be closed using the hardware
     *    back button on Android and similar devices.  Default: true.
     */
    initialize: function(opts) {
      ionic.views.Modal.prototype.initialize.call(this, opts);
      this.animation = opts.animation || 'slide-in-up';
    },

    /**
     * @ngdoc method
     * @name ionicModal#show
     * @description Show this modal instance.
     * @returns {promise} A promise which is resolved when the modal is finished animating in.
     */
    show: function() {
      var self = this;

      if(self.scope.$$destroyed) {
        $log.error('Cannot call modal.show() after remove(). Please create a new modal instance using $ionicModal.');
        return;
      }

      var modalEl = jqLite(self.modalEl);

      self.el.classList.remove('hide');
      $timeout(function(){
        $document[0].body.classList.add('modal-open');
      }, 400);


      if(!self.el.parentElement) {
        modalEl.addClass(self.animation);
        $document[0].body.appendChild(self.el);
      }

      modalEl.addClass('ng-enter active')
             .removeClass('ng-leave ng-leave-active');

      self._isShown = true;
      self._deregisterBackButton = $ionicPlatform.registerBackButtonAction(
        self.hardwareBackButtonClose ? angular.bind(self, self.hide) : angular.noop,
        PLATFORM_BACK_BUTTON_PRIORITY_MODAL
      );

      self._isOpenPromise = $q.defer();

      ionic.views.Modal.prototype.show.call(self);

      $timeout(function(){
        modalEl.addClass('ng-enter-active');
        ionic.trigger('resize');
        self.scope.$parent && self.scope.$parent.$broadcast('modal.shown', self);
        self.el.classList.add('active');
      }, 20);

      return $timeout(function() {
        //After animating in, allow hide on backdrop click
        self.$el.on('click', function(e) {
          if (self.backdropClickToClose && e.target === self.el) {
            self.hide();
          }
        });
      }, 400);
    },

    /**
     * @ngdoc method
     * @name ionicModal#hide
     * @description Hide this modal instance.
     * @returns {promise} A promise which is resolved when the modal is finished animating out.
     */
    hide: function() {
      var self = this;
      var modalEl = jqLite(self.modalEl);

      self.el.classList.remove('active');
      modalEl.addClass('ng-leave');

      $timeout(function(){
        modalEl.addClass('ng-leave-active')
               .removeClass('ng-enter ng-enter-active active');
      }, 20);

      self.$el.off('click');
      self._isShown = false;
      self.scope.$parent && self.scope.$parent.$broadcast('modal.hidden', self);
      self._deregisterBackButton && self._deregisterBackButton();

      ionic.views.Modal.prototype.hide.call(self);

      return $timeout(function(){
        $document[0].body.classList.remove('modal-open');
        self.el.classList.add('hide');
      }, 500);
    },

    /**
     * @ngdoc method
     * @name ionicModal#remove
     * @description Remove this modal instance from the DOM and clean up.
     * @returns {promise} A promise which is resolved when the modal is finished animating out.
     */
    remove: function() {
      var self = this;
      self.scope.$parent && self.scope.$parent.$broadcast('modal.removed', self);

      return self.hide().then(function() {
        self.scope.$destroy();
        self.$el.remove();
      });
    },

    /**
     * @ngdoc method
     * @name ionicModal#isShown
     * @returns boolean Whether this modal is currently shown.
     */
    isShown: function() {
      return !!this._isShown;
    }
  });

  var createModal = function(templateString, options) {
    // Create a new scope for the modal
    var scope = options.scope && options.scope.$new() || $rootScope.$new(true);

    extend(scope, {
      $hasHeader: false,
      $hasSubheader: false,
      $hasFooter: false,
      $hasSubfooter: false,
      $hasTabs: false,
      $hasTabsTop: false
    });

    // Compile the template
    var element = $compile('<ion-modal>' + templateString + '</ion-modal>')(scope);

    options.$el = element;
    options.el = element[0];
    options.modalEl = options.el.querySelector('.modal');
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
     * @ngdoc method
     * @name $ionicModal#fromTemplate
     * @param {string} templateString The template string to use as the modal's
     * content.
     * @param {object} options Options to be passed {@link ionic.controller:ionicModal#initialize ionicModal#initialize} method.
     * @returns {object} An instance of an {@link ionic.controller:ionicModal}
     * controller.
     */
    fromTemplate: function(templateString, options) {
      var modal = createModal(templateString, options || {});
      return modal;
    },
    /**
     * @ngdoc method
     * @name $ionicModal#fromTemplateUrl
     * @param {string} templateUrl The url to load the template from.
     * @param {object} options Options to be passed {@link ionic.controller:ionicModal#initialize ionicModal#initialize} method.
     * options object.
     * @returns {promise} A promise that will be resolved with an instance of
     * an {@link ionic.controller:ionicModal} controller.
     */
    fromTemplateUrl: function(url, options, _) {
      var cb;
      //Deprecated: allow a callback as second parameter. Now we return a promise.
      if (angular.isFunction(options)) {
        cb = options;
        options = _;
      }
      return $ionicTemplateLoader.load(url).then(function(templateString) {
        var modal = createModal(templateString, options || {});
        cb && cb(modal);
        return modal;
      });
    }
  };
}]);


/**
 * @ngdoc service
 * @name $ionicNavBarDelegate
 * @module ionic
 * @description
 * Delegate for controlling the {@link ionic.directive:ionNavBar} directive.
 *
 * @usage
 *
 * ```html
 * <body ng-controller="MyCtrl">
 *   <ion-nav-bar>
 *     <button ng-click="setNavTitle('banana')">
 *       Set title to banana!
 *     </button>
 *   </ion-nav-bar>
 * </body>
 * ```
 * ```js
 * function MyCtrl($scope, $ionicNavBarDelegate) {
 *   $scope.setNavTitle = function(title) {
 *     $ionicNavBarDelegate.setTitle(title);
 *   }
 * }
 * ```
 */
IonicModule
.service('$ionicNavBarDelegate', delegateService([
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#back
   * @description Goes back in the view history.
   * @param {DOMEvent=} event The event object (eg from a tap event)
   */
  'back',
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#align
   * @description Aligns the title with the buttons in a given direction.
   * @param {string=} direction The direction to the align the title text towards.
   * Available: 'left', 'right', 'center'. Default: 'center'.
   */
  'align',
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#showBackButton
   * @description
   * Set/get whether the {@link ionic.directive:ionNavBackButton} is shown
   * (if it exists).
   * @param {boolean=} show Whether to show the back button.
   * @returns {boolean} Whether the back button is shown.
   */
  'showBackButton',
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#showBar
   * @description
   * Set/get whether the {@link ionic.directive:ionNavBar} is shown.
   * @param {boolean} show Whether to show the bar.
   * @returns {boolean} Whether the bar is shown.
   */
  'showBar',
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#setTitle
   * @description
   * Set the title for the {@link ionic.directive:ionNavBar}.
   * @param {string} title The new title to show.
   */
  'setTitle',
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#changeTitle
   * @description
   * Change the title, transitioning the new title in and the old one out in a given direction.
   * @param {string} title The new title to show.
   * @param {string} direction The direction to transition the new title in.
   * Available: 'forward', 'back'.
   */
  'changeTitle',
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#getTitle
   * @returns {string} The current title of the navbar.
   */
  'getTitle',
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#getPreviousTitle
   * @returns {string} The previous title of the navbar.
   */
  'getPreviousTitle'
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#$getByHandle
   * @param {string} handle
   * @returns `delegateInstance` A delegate instance that controls only the
   * navBars with delegate-handle matching the given handle.
   *
   * Example: `$ionicNavBarDelegate.$getByHandle('myHandle').setTitle('newTitle')`
   */
]));

var PLATFORM_BACK_BUTTON_PRIORITY_VIEW = 100;
var PLATFORM_BACK_BUTTON_PRIORITY_SIDE_MENU = 150;
var PLATFORM_BACK_BUTTON_PRIORITY_MODAL = 200;
var PLATFORM_BACK_BUTTON_PRIORITY_ACTION_SHEET = 300;
var PLATFORM_BACK_BUTTON_PRIORITY_POPUP = 400;
var PLATFORM_BACK_BUTTON_PRIORITY_LOADING = 500;

function componentConfig(defaults) {
  defaults.$get = function() { return defaults; };
  return defaults;
}

IonicModule
.constant('$ionicPlatformDefaults', {
  'ios': {
    '$ionicNavBarConfig': {
      transition: 'nav-title-slide-ios7',
      alignTitle: 'center',
      backButtonIcon: 'ion-ios7-arrow-back'
    },
    '$ionicNavViewConfig': {
      transition: 'slide-left-right-ios7'
    },
    '$ionicTabsConfig': {
      type: '',
      position: ''
    }
  },
  'android': {
    '$ionicNavBarConfig': {
      transition: 'nav-title-slide-ios7',
      alignTitle: 'center',
      backButtonIcon: 'ion-ios7-arrow-back'
    },
    '$ionicNavViewConfig': {
      transition: 'slide-left-right-ios7'
    },
    '$ionicTabsConfig': {
      type: 'tabs-striped',
      position: ''
    }
  }
});


IonicModule.config([
  '$ionicPlatformDefaults',

  '$injector',

function($ionicPlatformDefaults, $injector) {
  var platform = ionic.Platform.platform();

  var applyConfig = function(platformDefaults) {
    forEach(platformDefaults, function(defaults, constantName) {
      extend($injector.get(constantName), defaults);
    });
  };

  switch(platform) {
    case 'ios':
      applyConfig($ionicPlatformDefaults.ios);
      break;
    case 'android':
      applyConfig($ionicPlatformDefaults.android);
      break;
  }
}]);

/**
 * @ngdoc service
 * @name $ionicPlatform
 * @module ionic
 * @description
 * An angular abstraction of {@link ionic.utility:ionic.Platform}.
 *
 * Used to detect the current platform, as well as do things like override the
 * Android back button in PhoneGap/Cordova.
 */
IonicModule
.provider('$ionicPlatform', function() {
  return {
    $get: ['$q', '$rootScope', function($q, $rootScope) {
      var self = {

        /**
         * @ngdoc method
         * @name $ionicPlatform#onHardwareBackButton
         * @description
         * Some platforms have a hardware back button, so this is one way to
         * bind to it.
         * @param {function} callback the callback to trigger when this event occurs
         */
        onHardwareBackButton: function(cb) {
          ionic.Platform.ready(function() {
            document.addEventListener('backbutton', cb, false);
          });
        },

        /**
         * @ngdoc method
         * @name $ionicPlatform#offHardwareBackButton
         * @description
         * Remove an event listener for the backbutton.
         * @param {function} callback The listener function that was
         * originally bound.
         */
        offHardwareBackButton: function(fn) {
          ionic.Platform.ready(function() {
            document.removeEventListener('backbutton', fn);
          });
        },

        /**
         * @ngdoc method
         * @name $ionicPlatform#registerBackButtonAction
         * @description
         * Register a hardware back button action. Only one action will execute
         * when the back button is clicked, so this method decides which of
         * the registered back button actions has the highest priority.
         *
         * For example, if an actionsheet is showing, the back button should
         * close the actionsheet, but it should not also go back a page view
         * or close a modal which may be open.
         *
         * @param {function} callback Called when the back button is pressed,
         * if this listener is the highest priority.
         * @param {number} priority Only the highest priority will execute.
         * @param {*=} actionId The id to assign this action. Default: a
         * random unique id.
         * @returns {function} A function that, when called, will deregister
         * this backButtonAction.
         */
        $backButtonActions: {},
        registerBackButtonAction: function(fn, priority, actionId) {

          if(!self._hasBackButtonHandler) {
            // add a back button listener if one hasn't been setup yet
            self.$backButtonActions = {};
            self.onHardwareBackButton(self.hardwareBackButtonClick);
            self._hasBackButtonHandler = true;
          }

          var action = {
            id: (actionId ? actionId : ionic.Utils.nextUid()),
            priority: (priority ? priority : 0),
            fn: fn
          };
          self.$backButtonActions[action.id] = action;

          // return a function to de-register this back button action
          return function() {
            delete self.$backButtonActions[action.id];
          };
        },

        /**
         * @private
         */
        hardwareBackButtonClick: function(e){
          // loop through all the registered back button actions
          // and only run the last one of the highest priority
          var priorityAction, actionId;
          for(actionId in self.$backButtonActions) {
            if(!priorityAction || self.$backButtonActions[actionId].priority >= priorityAction.priority) {
              priorityAction = self.$backButtonActions[actionId];
            }
          }
          if(priorityAction) {
            priorityAction.fn(e);
            return priorityAction;
          }
        },

        is: function(type) {
          return ionic.Platform.is(type);
        },

        /**
         * @ngdoc method
         * @name $ionicPlatform#ready
         * @description
         * Trigger a callback once the device is ready,
         * or immediately if the device is already ready.
         * @param {function=} callback The function to call.
         * @returns {promise} A promise which is resolved when the device is ready.
         */
        ready: function(cb) {
          var q = $q.defer();

          ionic.Platform.ready(function(){
            q.resolve();
            cb && cb();
          });

          return q.promise;
        }
      };
      return self;
    }]
  };

});



var POPUP_TPL =
  '<div class="popup">' +
    '<div class="popup-head">' +
      '<h3 class="popup-title" ng-bind-html="title"></h3>' +
      '<h5 class="popup-sub-title" ng-bind-html="subTitle" ng-if="subTitle"></h5>' +
    '</div>' +
    '<div class="popup-body">' +
    '</div>' +
    '<div class="popup-buttons row">' +
      '<button ng-repeat="button in buttons" ng-click="$buttonTapped(button, $event)" class="button col" ng-class="button.type || \'button-default\'" ng-bind-html="button.text"></button>' +
    '</div>' +
  '</div>';

/**
 * @ngdoc service
 * @name $ionicPopup
 * @module ionic
 * @restrict E
 * @codepen zkmhJ
 * @description
 *
 * The Ionic Popup service allows programmatically creating and showing popup
 * windows that require the user to respond in order to continue.
 *
 * The popup system has support for more flexible versions of the built in `alert()`, `prompt()`,
 * and `confirm()` functions that users are used to, in addition to allowing popups with completely
 * custom content and look.
 *
 * @usage
 * A few basic examples, see below for details about all of the options available.
 *
 * ```js
 *angular.module('mySuperApp', ['ionic'])
 *.controller('PopupCtrl',function($scope, $ionicPopup, $timeout) {
 *
 * // Triggered on a button click, or some other target
 * $scope.showPopup = function() {
 *   $scope.data = {}
 *
 *   // An elaborate, custom popup
 *   var myPopup = $ionicPopup.show({
 *     template: '<input type="password" ng-model="data.wifi">',
 *     title: 'Enter Wi-Fi Password',
 *     subTitle: 'Please use normal things',
 *     scope: $scope,
 *     buttons: [
 *       { text: 'Cancel' },
 *       {
 *         text: '<b>Save</b>',
 *         type: 'button-positive',
 *         onTap: function(e) {
 *           if (!$scope.data.wifi) {
 *             //don't allow the user to close unless he enters wifi password
 *             e.preventDefault();
 *           } else {
 *             return $scope.data.wifi;
 *           }
 *         }
 *       },
 *     ]
 *   });
 *   myPopup.then(function(res) {
 *     console.log('Tapped!', res);
 *   });
 *   $timeout(function() {
 *      myPopup.close(); //close the popup after 3 seconds for some reason
 *   }, 3000);
 *  };
 *  // A confirm dialog
 *  $scope.showConfirm = function() {
 *    var confirmPopup = $ionicPopup.confirm({
 *      title: 'Consume Ice Cream',
 *      template: 'Are you sure you want to eat this ice cream?'
 *    });
 *    confirmPopup.then(function(res) {
 *      if(res) {
 *        console.log('You are sure');
 *      } else {
 *        console.log('You are not sure');
 *      }
 *    });
 *  };
 *
 *  // An alert dialog
 *  $scope.showAlert = function() {
 *    var alertPopup = $ionicPopup.alert({
 *      title: 'Don\'t eat that!',
 *      template: 'It might taste good'
 *    });
 *    alertPopup.then(function(res) {
 *      console.log('Thank you for not eating my delicious ice cream cone');
 *    });
 *  };
 *});
 *```
 */

IonicModule
.factory('$ionicPopup', [
  '$ionicTemplateLoader',
  '$ionicBackdrop',
  '$q',
  '$timeout',
  '$rootScope',
  '$document',
  '$compile',
  '$ionicPlatform',
function($ionicTemplateLoader, $ionicBackdrop, $q, $timeout, $rootScope, $document, $compile, $ionicPlatform) {
  //TODO allow this to be configured
  var config = {
    stackPushDelay: 50
  };
  var popupStack = [];
  var $ionicPopup = {
    /**
     * @ngdoc method
     * @description
     * Show a complex popup. This is the master show function for all popups.
     *
     * A complex popup has a `buttons` array, with each button having a `text` and `type`
     * field, in addition to an `onTap` function.  The `onTap` function, called when
     * the correspondingbutton on the popup is tapped, will by default close the popup
     * and resolve the popup promise with its return value.  If you wish to prevent the
     * default and keep the popup open on button tap, call `event.preventDefault()` on the
     * passed in tap event.  Details below.
     *
     * @name $ionicPopup#show
     * @param {object} options The options for the new popup, of the form:
     *
     * ```
     * {
     *   title: '', // String. The title of the popup.
     *   subTitle: '', // String (optional). The sub-title of the popup.
     *   template: '', // String (optional). The html template to place in the popup body.
     *   templateUrl: '', // String (optional). The URL of an html template to place in the popup   body.
     *   scope: null, // Scope (optional). A scope to link to the popup content.
     *   buttons: [{ //Array[Object] (optional). Buttons to place in the popup footer.
     *     text: 'Cancel',
     *     type: 'button-default',
     *     onTap: function(e) {
     *       // e.preventDefault() will stop the popup from closing when tapped.
     *       e.preventDefault();
     *     }
     *   }, {
     *     text: 'OK',
     *     type: 'button-positive',
     *     onTap: function(e) {
     *       // Returning a value will cause the promise to resolve with the given value.
     *       return scope.data.response;
     *     }
     *   }]
     * }
     * ```
     *
     * @returns {object} A promise which is resolved when the popup is closed. Has an additional
     * `close` function, which can be used to programmatically close the popup.
     */
    show: showPopup,

    /**
     * @ngdoc method
     * @name $ionicPopup#alert
     * @description Show a simple alert popup with a message and one button that the user can
     * tap to close the popup.
     *
     * @param {object} options The options for showing the alert, of the form:
     *
     * ```
     * {
     *   title: '', // String. The title of the popup.
     *   subTitle: '', // String (optional). The sub-title of the popup.
     *   template: '', // String (optional). The html template to place in the popup body.
     *   templateUrl: '', // String (optional). The URL of an html template to place in the popup   body.
     *   okText: '', // String (default: 'OK'). The text of the OK button.
     *   okType: '', // String (default: 'button-positive'). The type of the OK button.
     * }
     * ```
     *
     * @returns {object} A promise which is resolved when the popup is closed. Has one additional
     * function `close`, which can be called with any value to programmatically close the popup
     * with the given value.
     */
    alert: showAlert,

    /**
     * @ngdoc method
     * @name $ionicPopup#confirm
     * @description
     * Show a simple confirm popup with a Cancel and OK button.
     *
     * Resolves the promise with true if the user presses the OK button, and false if the
     * user presses the Cancel button.
     *
     * @param {object} options The options for showing the confirm popup, of the form:
     *
     * ```
     * {
     *   title: '', // String. The title of the popup.
     *   subTitle: '', // String (optional). The sub-title of the popup.
     *   template: '', // String (optional). The html template to place in the popup body.
     *   templateUrl: '', // String (optional). The URL of an html template to place in the popup   body.
     *   cancelText: '', // String (default: 'Cancel'). The text of the Cancel button.
     *   cancelType: '', // String (default: 'button-default'). The type of the Cancel button.
     *   okText: '', // String (default: 'OK'). The text of the OK button.
     *   okType: '', // String (default: 'button-positive'). The type of the OK button.
     * }
     * ```
     *
     * @returns {object} A promise which is resolved when the popup is closed. Has one additional
     * function `close`, which can be called with any value to programmatically close the popup
     * with the given value.
     */
    confirm: showConfirm,

    /**
     * @ngdoc method
     * @name $ionicPopup#prompt
     * @description Show a simple prompt popup, which has an input, OK button, and Cancel button.
     * Resolves the promise with the value of the input if the user presses OK, and with undefined
     * if the user presses Cancel.
     *
     * ```javascript
     *  $ionicPopup.prompt({
     *    title: 'Password Check',
     *    template: 'Enter your secret password',
     *    inputType: 'password',
     *    inputPlaceholder: 'Your password'
     *  }).then(function(res) {
     *    console.log('Your password is', res);
     *  });
     * ```
     * @param {object} options The options for showing the prompt popup, of the form:
     *
     * ```
     * {
     *   title: '', // String. The title of the popup.
     *   subTitle: '', // String (optional). The sub-title of the popup.
     *   template: '', // String (optional). The html template to place in the popup body.
     *   templateUrl: '', // String (optional). The URL of an html template to place in the popup   body.
     *   inputType: // String (default: 'text'). The type of input to use
     *   inputPlaceholder: // String (default: ''). A placeholder to use for the input.
     *   cancelText: // String (default: 'Cancel'. The text of the Cancel button.
     *   cancelType: // String (default: 'button-default'). The type of the Cancel button.
     *   okText: // String (default: 'OK'). The text of the OK button.
     *   okType: // String (default: 'button-positive'). The type of the OK button.
     * }
     * ```
     *
     * @returns {object} A promise which is resolved when the popup is closed. Has one additional
     * function `close`, which can be called with any value to programmatically close the popup
     * with the given value.
     */
    prompt: showPrompt,
    /**
     * @private for testing
     */
    _createPopup: createPopup,
    _popupStack: popupStack
  };

  return $ionicPopup;

  function createPopup(options) {
    options = extend({
      scope: null,
      title: '',
      buttons: [],
    }, options || {});

    var popupPromise = $ionicTemplateLoader.compile({
      template: POPUP_TPL,
      scope: options.scope && options.scope.$new(),
      appendTo: $document[0].body
    });
    var contentPromise = options.templateUrl ?
      $ionicTemplateLoader.load(options.templateUrl) :
      $q.when(options.template || options.content || '');

    return $q.all([popupPromise, contentPromise])
    .then(function(results) {
      var self = results[0];
      var content = results[1];
      var responseDeferred = $q.defer();

      self.responseDeferred = responseDeferred;

      //Can't ng-bind-html for popup-body because it can be insecure html
      //(eg an input in case of prompt)
      var body = jqLite(self.element[0].querySelector('.popup-body'));
      if (content) {
        body.html(content);
        $compile(body.contents())(self.scope);
      } else {
        body.remove();
      }

      extend(self.scope, {
        title: options.title,
        buttons: options.buttons,
        subTitle: options.subTitle,
        $buttonTapped: function(button, event) {
          var result = (button.onTap || angular.noop)(event);
          event = event.originalEvent || event; //jquery events

          if (!event.defaultPrevented) {
            responseDeferred.resolve(result);
          }
        }
      });

      self.show = function() {
        if (self.isShown) return;

        self.isShown = true;
        ionic.requestAnimationFrame(function() {
          //if hidden while waiting for raf, don't show
          if (!self.isShown) return;

          //if the popup is taller than the window, make the popup body scrollable
          if(self.element[0].offsetHeight > window.innerHeight - 20){
            self.element[0].style.height = window.innerHeight - 20+'px';
            popupBody = self.element[0].querySelectorAll('.popup-body');
            popupHead = self.element[0].querySelectorAll('.popup-head');
            popupButtons = self.element[0].querySelectorAll('.popup-buttons');
            self.element.addClass('popup-tall');
            newHeight = window.innerHeight - popupHead[0].offsetHeight - popupButtons[0].offsetHeight -20;
            popupBody[0].style.height =  newHeight + 'px';
          }

          self.element.removeClass('popup-hidden');
          self.element.addClass('popup-showing active');
          ionic.DomUtil.centerElementByMarginTwice(self.element[0]);
          focusInputOrButton(self.element);
        });
      };
      self.hide = function(callback) {
        callback = callback || angular.noop;
        if (!self.isShown) return callback();

        self.isShown = false;
        self.element.removeClass('active');
        self.element.addClass('popup-hidden');
        $timeout(callback, 250);
      };
      self.remove = function() {
        if (self.removed) return;

        self.hide(function() {
          self.element.remove();
          self.scope.$destroy();
        });

        self.removed = true;
      };

      return self;
    });
  }

  function onHardwareBackButton(e) {
    popupStack[0] && popupStack[0].responseDeferred.resolve();
  }

  function showPopup(options) {
    var popupPromise = $ionicPopup._createPopup(options);
    var previousPopup = popupStack[0];

    if (previousPopup) {
      previousPopup.hide();
    }

    var resultPromise = $timeout(angular.noop, previousPopup ? config.stackPushDelay : 0)
    .then(function() { return popupPromise; })
    .then(function(popup) {
      if (!previousPopup) {
        //Add popup-open & backdrop if this is first popup
        document.body.classList.add('popup-open');
        $ionicBackdrop.retain();
        $ionicPopup._backButtonActionDone = $ionicPlatform.registerBackButtonAction(
          onHardwareBackButton,
          PLATFORM_BACK_BUTTON_PRIORITY_POPUP
        );
      }
      popupStack.unshift(popup);
      popup.show();

      //DEPRECATED: notify the promise with an object with a close method
      popup.responseDeferred.notify({
        close: resultPromise.close
      });

      return popup.responseDeferred.promise.then(function(result) {
        var index = popupStack.indexOf(popup);
        if (index !== -1) {
          popupStack.splice(index, 1);
        }
        popup.remove();

        var previousPopup = popupStack[0];
        if (previousPopup) {
          previousPopup.show();
        } else {
          //Remove popup-open & backdrop if this is last popup
          document.body.classList.remove('popup-open');
          $ionicBackdrop.release();
          ($ionicPopup._backButtonActionDone || angular.noop)();
        }

        return result;
      });
    });

    function close(result) {
      popupPromise.then(function(popup) {
        if (!popup.removed) {
          popup.responseDeferred.resolve(result);
        }
      });
    }
    resultPromise.close = close;

    return resultPromise;
  }

  function focusInputOrButton(element) {
    var focusOn = element[0].querySelector('input[autofocus]');
    if (!focusOn) {
      focusOn = element[0].querySelector('input');
      if (!focusOn) {
        var buttons = element[0].querySelectorAll('button');
        focusOn = buttons[buttons.length-1];
      }
    }
    if(focusOn) {
      focusOn.focus();
    }
  }

  function showAlert(opts) {
    return showPopup( extend({
      buttons: [{
        text: opts.okText || 'OK',
        type: opts.okType || 'button-positive',
        onTap: function(e) {
          return true;
        }
      }]
    }, opts || {}) );
  }

  function showConfirm(opts) {
    return showPopup( extend({
      buttons: [{
        text: opts.cancelText || 'Cancel' ,
        type: opts.cancelType || 'button-default',
        onTap: function(e) { return false; }
      }, {
        text: opts.okText || 'OK',
        type: opts.okType || 'button-positive',
        onTap: function(e) { return true; }
      }]
    }, opts || {}) );
  }

  function showPrompt(opts) {
    var scope = $rootScope.$new(true);
    scope.data = {};
    return showPopup( extend({
      template: '<input ng-model="data.response" type="' + (opts.inputType || 'text') +
        '" placeholder="' + (opts.inputPlaceholder || '') + '">',
      scope: scope,
      buttons: [{
        text: opts.cancelText || 'Cancel',
        type: opts.cancelType|| 'button-default',
        onTap: function(e) {}
      }, {
        text: opts.okText || 'OK',
        type: opts.okType || 'button-positive',
        onTap: function(e) {
          return scope.data.response || '';
        }
      }]
    }, opts || {}) );
  }
}]);



/**
 * @ngdoc service
 * @name $ionicScrollDelegate
 * @module ionic
 * @description
 * Delegate for controlling scrollViews (created by
 * {@link ionic.directive:ionContent} and
 * {@link ionic.directive:ionScroll} directives).
 *
 * Methods called directly on the $ionicScrollDelegate service will control all scroll
 * views.  Use the {@link ionic.service:$ionicScrollDelegate#$getByHandle $getByHandle}
 * method to control specific scrollViews.
 *
 * @usage
 *
 * ```html
 * <body ng-controller="MainCtrl">
 *   <ion-content>
 *     <button ng-click="scrollTop()">Scroll to Top!</button>
 *   </ion-content>
 * </body>
 * ```
 * ```js
 * function MainCtrl($scope, $ionicScrollDelegate) {
 *   $scope.scrollTop = function() {
 *     $ionicScrollDelegate.scrollTop();
 *   };
 * }
 * ```
 *
 * Example of advanced usage, with two scroll areas using `delegate-handle`
 * for fine control.
 *
 * ```html
 * <body ng-controller="MainCtrl">
 *   <ion-content delegate-handle="mainScroll">
 *     <button ng-click="scrollMainToTop()">
 *       Scroll content to top!
 *     </button>
 *     <ion-scroll delegate-handle="small" style="height: 100px;">
 *       <button ng-click="scrollSmallToTop()">
 *         Scroll small area to top!
 *       </button>
 *     </ion-scroll>
 *   </ion-content>
 * </body>
 * ```
 * ```js
 * function MainCtrl($scope, $ionicScrollDelegate) {
 *   $scope.scrollMainToTop = function() {
 *     $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
 *   };
 *   $scope.scrollSmallToTop = function() {
 *     $ionicScrollDelegate.$getByHandle('small').scrollTop();
 *   };
 * }
 * ```
 */
IonicModule
.service('$ionicScrollDelegate', delegateService([
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#resize
   * @description Tell the scrollView to recalculate the size of its container.
   */
  'resize',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#scrollTop
   * @param {boolean=} shouldAnimate Whether the scroll should animate.
   */
  'scrollTop',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#scrollBottom
   * @param {boolean=} shouldAnimate Whether the scroll should animate.
   */
  'scrollBottom',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#scrollTo
   * @param {number} left The x-value to scroll to.
   * @param {number} top The y-value to scroll to.
   * @param {boolean=} shouldAnimate Whether the scroll should animate.
   */
  'scrollTo',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#scrollBy
   * @param {number} left The x-offset to scroll by.
   * @param {number} top The y-offset to scroll by.
   * @param {boolean=} shouldAnimate Whether the scroll should animate.
   */
  'scrollBy',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#getScrollPosition
   * @returns {object} The scroll position of this view, with the following properties:
   *  - `{number}` `left` The distance the user has scrolled from the left (starts at 0).
   *  - `{number}` `top` The distance the user has scrolled from the top (starts at 0).
   */
  'getScrollPosition',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#anchorScroll
   * @description Tell the scrollView to scroll to the element with an id
   * matching window.location.hash.
   *
   * If no matching element is found, it will scroll to top.
   *
   * @param {boolean=} shouldAnimate Whether the scroll should animate.
   */
  'anchorScroll',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#getScrollView
   * @returns {object} The scrollView associated with this delegate.
   */
  'getScrollView',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#rememberScrollPosition
   * @description
   * Will make it so, when this scrollView is destroyed (user leaves the page),
   * the last scroll position the page was on will be saved, indexed by the
   * given id.
   *
   * Note: for pages associated with a view under an ion-nav-view,
   * rememberScrollPosition automatically saves their scroll.
   *
   * Related methods: scrollToRememberedPosition, forgetScrollPosition (below).
   *
   * In the following example, the scroll position of the ion-scroll element
   * will persist, even when the user changes the toggle switch.
   *
   * ```html
   * <ion-toggle ng-model="shouldShowScrollView"></ion-toggle>
   * <ion-scroll delegate-handle="myScroll" ng-if="shouldShowScrollView">
   *   <div ng-controller="ScrollCtrl">
   *     <ion-list>
   *       {% raw %}<ion-item ng-repeat="i in items">{{i}}</ion-item>{% endraw %}
   *     </ion-list>
   *   </div>
   * </ion-scroll>
   * ```
   * ```js
   * function ScrollCtrl($scope, $ionicScrollDelegate) {
   *   var delegate = $ionicScrollDelegate.$getByHandle('myScroll');
   *
   *   // Put any unique ID here.  The point of this is: every time the controller is recreated
   *   // we want to load the correct remembered scroll values.
   *   delegate.rememberScrollPosition('my-scroll-id');
   *   delegate.scrollToRememberedPosition();
   *   $scope.items = [];
   *   for (var i=0; i<100; i++) {
   *     $scope.items.push(i);
   *   }
   * }
   * ```
   *
   * @param {string} id The id to remember the scroll position of this
   * scrollView by.
   */
  'rememberScrollPosition',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#forgetScrollPosition
   * @description
   * Stop remembering the scroll position for this scrollView.
   */
  'forgetScrollPosition',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#scrollToRememberedPosition
   * @description
   * If this scrollView has an id associated with its scroll position,
   * (through calling rememberScrollPosition), and that position is remembered,
   * load the position and scroll to it.
   * @param {boolean=} shouldAnimate Whether to animate the scroll.
   */
  'scrollToRememberedPosition'
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#$getByHandle
   * @param {string} handle
   * @returns `delegateInstance` A delegate instance that controls only the
   * scrollViews with `delegate-handle` matching the given handle.
   *
   * Example: `$ionicScrollDelegate.$getByHandle('my-handle').scrollTop();`
   */
]));


/**
 * @ngdoc service
 * @name $ionicSideMenuDelegate
 * @module ionic
 *
 * @description
 * Delegate for controlling the {@link ionic.directive:ionSideMenus} directive.
 *
 * Methods called directly on the $ionicSideMenuDelegate service will control all side
 * menus.  Use the {@link ionic.service:$ionicSideMenuDelegate#$getByHandle $getByHandle}
 * method to control specific ionSideMenus instances.
 *
 * @usage
 *
 * ```html
 * <body ng-controller="MainCtrl">
 *   <ion-side-menus>
 *     <ion-side-menu-content>
 *       Content!
 *       <button ng-click="toggleLeftSideMenu()">
 *         Toggle Left Side Menu
 *       </button>
 *     </ion-side-menu-content>
 *     <ion-side-menu side="left">
 *       Left Menu!
 *     <ion-side-menu>
 *   </ion-side-menus>
 * </body>
 * ```
 * ```js
 * function MainCtrl($scope, $ionicSideMenuDelegate) {
 *   $scope.toggleLeftSideMenu = function() {
 *     $ionicSideMenuDelegate.toggleLeft();
 *   };
 * }
 * ```
 */
IonicModule
.service('$ionicSideMenuDelegate', delegateService([
  /**
   * @ngdoc method
   * @name $ionicSideMenuDelegate#toggleLeft
   * @description Toggle the left side menu (if it exists).
   * @param {boolean=} isOpen Whether to open or close the menu.
   * Default: Toggles the menu.
   */
  'toggleLeft',
  /**
   * @ngdoc method
   * @name $ionicSideMenuDelegate#toggleRight
   * @description Toggle the right side menu (if it exists).
   * @param {boolean=} isOpen Whether to open or close the menu.
   * Default: Toggles the menu.
   */
  'toggleRight',
  /**
   * @ngdoc method
   * @name $ionicSideMenuDelegate#getOpenRatio
   * @description Gets the ratio of open amount over menu width. For example, a
   * menu of width 100 that is opened by 50 pixels is 50% opened, and would return
   * a ratio of 0.5.
   *
   * @returns {float} 0 if nothing is open, between 0 and 1 if left menu is
   * opened/opening, and between 0 and -1 if right menu is opened/opening.
   */
  'getOpenRatio',
  /**
   * @ngdoc method
   * @name $ionicSideMenuDelegate#isOpen
   * @returns {boolean} Whether either the left or right menu is currently opened.
   */
  'isOpen',
  /**
   * @ngdoc method
   * @name $ionicSideMenuDelegate#isOpenLeft
   * @returns {boolean} Whether the left menu is currently opened.
   */
  'isOpenLeft',
  /**
   * @ngdoc method
   * @name $ionicSideMenuDelegate#isOpenRight
   * @returns {boolean} Whether the right menu is currently opened.
   */
  'isOpenRight',
  /**
   * @ngdoc method
   * @name $ionicSideMenuDelegate#canDragContent
   * @param {boolean=} canDrag Set whether the content can or cannot be dragged to open
   * side menus.
   * @returns {boolean} Whether the content can be dragged to open side menus.
   */
  'canDragContent',
  /**
   * @ngdoc method
   * @name $ionicSideMenuDelegate#edgeDragThreshold
   * @param {boolean|number=} value Set whether the content drag can only start if it is below a certain threshold distance from the edge of the screen. Accepts three different values:
   *  - If a non-zero number is given, that many pixels is used as the maximum allowed distance from the edge that starts dragging the side menu.
   *  - If true is given, the default number of pixels (25) is used as the maximum allowed distance.
   *  - If false or 0 is given, the edge drag threshold is disabled, and dragging from anywhere on the content is allowed.
   * @returns {boolean} Whether the drag can start only from within the edge of screen threshold.
   */
  'edgeDragThreshold',
  /**
   * @ngdoc method
   * @name $ionicSideMenuDelegate#$getByHandle
   * @param {string} handle
   * @returns `delegateInstance` A delegate instance that controls only the
   * {@link ionic.directive:ionSideMenus} directives with `delegate-handle` matching
   * the given handle.
   *
   * Example: `$ionicSideMenuDelegate.$getByHandle('my-handle').toggleLeft();`
   */
]));


/**
 * @ngdoc service
 * @name $ionicSlideBoxDelegate
 * @module ionic
 * @description
 * Delegate that controls the {@link ionic.directive:ionSlideBox} directive.
 *
 * Methods called directly on the $ionicSlideBoxDelegate service will control all slide boxes.  Use the {@link ionic.service:$ionicSlideBoxDelegate#$getByHandle $getByHandle}
 * method to control specific slide box instances.
 *
 * @usage
 *
 * ```html
 * <body ng-controller="MyCtrl">
 *   <ion-slide-box>
 *     <ion-slide>
 *       <div class="box blue">
 *         <button ng-click="nextSlide()">Next slide!</button>
 *       </div>
 *     </ion-slide>
 *     <ion-slide>
 *       <div class="box red">
 *         Slide 2!
 *       </div>
 *     </ion-slide>
 *   </ion-slide-box>
 * </body>
 * ```
 * ```js
 * function MyCtrl($scope, $ionicSlideBoxDelegate) {
 *   $scope.nextSlide = function() {
 *     $ionicSlideBoxDelegate.next();
 *   }
 * }
 * ```
 */
IonicModule
.service('$ionicSlideBoxDelegate', delegateService([
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#update
   * @description
   * Update the slidebox (for example if using Angular with ng-repeat,
   * resize it for the elements inside).
   */
  'update',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#slide
   * @param {number} to The index to slide to.
   * @param {number=} speed The number of milliseconds for the change to take.
   */
  'slide',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#enableSlide
   * @param {boolean=} shouldEnable Whether to enable sliding the slidebox.
   * @returns {boolean} Whether sliding is enabled.
   */
  'enableSlide',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#previous
   * @description Go to the previous slide. Wraps around if at the beginning.
   */
  'previous',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#next
   * @description Go to the next slide. Wraps around if at the end.
   */
  'next',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#stop
   * @description Stop sliding. The slideBox will not move again until
   * explicitly told to do so.
   */
  'stop',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#start
   * @description Start sliding again if the slideBox was stopped. 
   */
  'start',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#currentIndex
   * @returns number The index of the current slide.
   */
  'currentIndex',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#slidesCount
   * @returns number The number of slides there are currently.
   */
  'slidesCount'
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#$getByHandle
   * @param {string} handle
   * @returns `delegateInstance` A delegate instance that controls only the
   * {@link ionic.directive:ionSlideBox} directives with `delegate-handle` matching
   * the given handle.
   *
   * Example: `$ionicSlideBoxDelegate.$getByHandle('my-handle').stop();`
   */
]));


/**
 * @ngdoc service
 * @name $ionicTabsDelegate
 * @module ionic
 *
 * @description
 * Delegate for controlling the {@link ionic.directive:ionTabs} directive.
 *
 * Methods called directly on the $ionicTabsDelegate service will control all ionTabs
 * directives. Use the {@link ionic.service:$ionicTabsDelegate#$getByHandle $getByHandle}
 * method to control specific ionTabs instances.
 *
 * @usage
 *
 * ```html
 * <body ng-controller="MyCtrl">
 *   <ion-tabs>
 *
 *     <ion-tab title="Tab 1">
 *       Hello tab 1!
 *       <button ng-click="selectTabWithIndex(1)">Select tab 2!</button>
 *     </ion-tab>
 *     <ion-tab title="Tab 2">Hello tab 2!</ion-tab>
 *
 *   </ion-tabs>
 * </body>
 * ```
 * ```js
 * function MyCtrl($scope, $ionicTabsDelegate) {
 *   $scope.selectTabWithIndex = function(index) {
 *     $ionicTabsDelegate.select(index);
 *   }
 * }
 * ```
 */
IonicModule
.service('$ionicTabsDelegate', delegateService([
  /**
   * @ngdoc method
   * @name $ionicTabsDelegate#select
   * @description Select the tab matching the given index.
   *
   * @param {number} index Index of the tab to select.
   * @param {boolean=} shouldChangeHistory Whether this selection should load this tab's
   * view history (if it exists) and use it, or just load the default page.
   * Default false.
   * Hint: you probably want this to be true if you have an
   * {@link ionic.directive:ionNavView} inside your tab.
   */
  'select',
  /**
   * @ngdoc method
   * @name $ionicTabsDelegate#selectedIndex
   * @returns `number` The index of the selected tab, or -1.
   */
  'selectedIndex'
  /**
   * @ngdoc method
   * @name $ionicTabsDelegate#$getByHandle
   * @param {string} handle
   * @returns `delegateInstance` A delegate instance that controls only the
   * {@link ionic.directive:ionTabs} directives with `delegate-handle` matching
   * the given handle.
   *
   * Example: `$ionicTabsDelegate.$getByHandle('my-handle').select(0);`
   */
]));


IonicModule
.factory('$ionicTemplateLoader', [
  '$compile',
  '$controller',
  '$http',
  '$q',
  '$rootScope',
  '$templateCache',
function($compile, $controller, $http, $q, $rootScope, $templateCache) {

  return {
    load: fetchTemplate,
    compile: loadAndCompile
  };

  function fetchTemplate(url) {
    return $http.get(url, {cache: $templateCache})
    .then(function(response) {
      return response.data && response.data.trim();
    });
  }

  function loadAndCompile(options) {
    options = extend({
      template: '',
      templateUrl: '',
      scope: null,
      controller: null,
      locals: {},
      appendTo: null
    }, options || {});

    var templatePromise = options.templateUrl ?
      this.load(options.templateUrl) :
      $q.when(options.template);

    return templatePromise.then(function(template) {
      var controller;
      var scope = options.scope || $rootScope.$new();

      //Incase template doesn't have just one root element, do this
      var element = jqLite('<div>').html(template).contents();

      if (options.controller) {
        controller = $controller(
          options.controller,
          extend(options.locals, {
            $scope: scope
          })
        );
        element.children().data('$ngControllerController', controller);
      }
      if (options.appendTo) {
        jqLite(options.appendTo).append(element);
      }

      $compile(element)(scope);

      return {
        element: element,
        scope: scope
      };
    });
  }

}]);

/**
 * @private
 * TODO document
 */
IonicModule
.run([
  '$rootScope',
  '$state',
  '$location',
  '$document',
  '$animate',
  '$ionicPlatform',
  '$ionicViewService',
function($rootScope, $state, $location, $document, $animate, $ionicPlatform, $ionicViewService) {

  // init the variables that keep track of the view history
  $rootScope.$viewHistory = {
    histories: { root: { historyId: 'root', parentHistoryId: null, stack: [], cursor: -1 } },
    views: {},
    backView: null,
    forwardView: null,
    currentView: null,
    disabledRegistrableTagNames: []
  };

  // set that these directives should not animate when transitioning
  // to it. Instead, the children <tab> directives would animate
  if ($ionicViewService.disableRegisterByTagName) {
    $ionicViewService.disableRegisterByTagName('ion-tabs');
    $ionicViewService.disableRegisterByTagName('ion-side-menus');
  }

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
  $ionicPlatform.registerBackButtonAction(
    onHardwareBackButton,
    PLATFORM_BACK_BUTTON_PRIORITY_VIEW
  );

}])

.factory('$ionicViewService', [
  '$rootScope',
  '$state',
  '$location',
  '$window',
  '$injector',
  '$animate',
  '$ionicNavViewConfig',
function($rootScope, $state, $location, $window, $injector, $animate, $ionicNavViewConfig) {

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
  View.prototype.destroy = function() {
    if(this.scope) {
      this.scope.$destroy && this.scope.$destroy();
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
          nextViewOptions = this.nextViewOptions(),
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
        rsp.viewId = backView.viewId;
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
            var forwardsHistory = this._getHistoryById(forwardView.historyId);
            if(forwardsHistory) {
              // the forward has a history
              for(var x=forwardsHistory.stack.length - 1; x >= forwardView.index; x--) {
                // starting from the end destroy all forwards in this history from this point
                forwardsHistory.stack[x].destroy();
                forwardsHistory.stack.splice(x);
              }
            }
          }

        } else {
          // there's no current view, so this must be the initial view
          rsp.navAction = 'initialView';
        }

        // add the new view
        viewHistory.views[rsp.viewId] = this.createView({
          viewId: rsp.viewId,
          index: hist.stack.length,
          historyId: hist.historyId,
          backViewId: (currentView && currentView.viewId ? currentView.viewId : null),
          forwardViewId: null,
          stateId: currentStateId,
          stateName: this.getCurrentStateName(),
          stateParams: this.getCurrentStateParams(),
          url: $location.url(),
        });

        if (rsp.navAction == 'moveBack') {
          //moveBack(from, to);
          $rootScope.$emit('$viewHistory.viewBack', currentView.viewId, rsp.viewId);
        }

        // add the new view to this history's stack
        hist.stack.push(viewHistory.views[rsp.viewId]);
      }

      if(nextViewOptions) {
        if(nextViewOptions.disableAnimate) rsp.navDirection = null;
        if(nextViewOptions.disableBack) viewHistory.views[rsp.viewId].backViewId = null;
        this.nextViewOptions(null);
      }

      this.setNavViews(rsp.viewId);

      hist.cursor = viewHistory.currentView.index;

      return rsp;
    },

    setNavViews: function(viewId) {
      var viewHistory = $rootScope.$viewHistory;

      viewHistory.currentView = this._getViewById(viewId);
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

    _getViewById: function(viewId) {
      return (viewId ? $rootScope.$viewHistory.views[ viewId ] : null );
    },

    _getBackView: function(view) {
      return (view ? this._getViewById(view.backViewId) : null );
    },

    _getForwardView: function(view) {
      return (view ? this._getViewById(view.forwardViewId) : null );
    },

    _getHistoryById: function(historyId) {
      return (historyId ? $rootScope.$viewHistory.histories[ historyId ] : null );
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

    nextViewOptions: function(opts) {
      if(arguments.length) {
        this._nextOpts = opts;
      } else {
        return this._nextOpts;
      }
    },

    getRenderer: function(navViewElement, navViewAttrs, navViewScope) {
      var service = this;
      var registerData;
      var doAnimation;

      // climb up the DOM and see which animation classname to use, if any
      var animationClass = getParentAnimationClass(navViewElement[0]);

      function getParentAnimationClass(el) {
        var className = '';
        while(!className && el) {
          className = el.getAttribute('animation');
          el = el.parentElement;
        }

        // If they don't have an animation set explicitly, use the value in the config
        if(!className) {
          return $ionicNavViewConfig.transition;
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
            } else if(!doAnimation) {
              document.body.classList.remove('disable-pointer-events');
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
      var
      histories = $rootScope.$viewHistory.histories,
      currentView = $rootScope.$viewHistory.currentView;

      for(var historyId in histories) {

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

      for(var viewId in $rootScope.$viewHistory.views) {
        if(viewId !== currentView.viewId) {
          delete $rootScope.$viewHistory.views[viewId];
        }
      }

      this.setNavViews(currentView.viewId);
    }

  };

}]);

/**
 * @private
 */
IonicModule.config([
  '$provide',
function($provide) {
  function $LocationDecorator($location, $timeout) {

    $location.__hash = $location.hash;
    //Fix: when window.location.hash is set, the scrollable area
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

  $provide.decorator('$location', ['$delegate', '$timeout', $LocationDecorator]);
}]);


/**
 * @ngdoc service
 * @name $ionicListDelegate
 * @module ionic
 *
 * @description
 * Delegate for controlling the {@link ionic.directive:ionList} directive.
 *
 * Methods called directly on the $ionicListDelegate service will control all lists.
 * Use the {@link ionic.service:$ionicListDelegate#$getByHandle $getByHandle}
 * method to control specific ionList instances.
 *
 * @usage
 *
 * ````html
 * <ion-content ng-controller="MyCtrl">
 *   <button class="button" ng-click="showDeleteButtons()"></button>
 *   <ion-list>
 *     <ion-item ng-repeat="i in items">>
 *       {% raw %}Hello, {{i}}!{% endraw %}
 *       <ion-delete-button class="ion-minus-circled"></ion-delete-button>
 *     </ion-item>
 *   </ion-list>
 * </ion-content>
 * ```
 * ```js
 * function MyCtrl($scope, $ionicListDelegate) {
 *   $scope.showDeleteButtons = function() {
 *     $ionicListDelegate.showDelete(true);
 *   };
 * }
 * ```
 */
IonicModule
.service('$ionicListDelegate', delegateService([
  /**
   * @ngdoc method
   * @name $ionicListDelegate#showReorder
   * @param {boolean=} showReorder Set whether or not this list is showing its reorder buttons.
   * @returns {boolean} Whether the reorder buttons are shown.
   */
  'showReorder',
  /**
   * @ngdoc method
   * @name $ionicListDelegate#showDelete
   * @param {boolean=} showReorder Set whether or not this list is showing its delete buttons.
   * @returns {boolean} Whether the delete buttons are shown.
   */
  'showDelete',
  /**
   * @ngdoc method
   * @name $ionicListDelegate#canSwipeItems
   * @param {boolean=} showReorder Set whether or not this list is able to swipe to show
   * option buttons.
   * @returns {boolean} Whether the list is able to swipe to show option buttons.
   */
  'canSwipeItems',
  /**
   * @ngdoc method
   * @name $ionicListDelegate#closeOptionButtons
   * @description Closes any option buttons on the list that are swiped open.
   */
  'closeOptionButtons',
  /**
   * @ngdoc method
   * @name $ionicListDelegate#$getByHandle
   * @param {string} handle
   * @returns `delegateInstance` A delegate instance that controls only the
   * {@link ionic.directive:ionList} directives with `delegate-handle` matching
   * the given handle.
   *
   * Example: `$ionicListDelegate.$getByHandle('my-handle').showReorder(true);`
   */
]))

.controller('$ionicList', [
  '$scope',
  '$attrs',
  '$parse',
  '$ionicListDelegate',
function($scope, $attrs, $parse, $ionicListDelegate) {

  var isSwipeable = true;
  var isReorderShown = false;
  var isDeleteShown = false;

  var deregisterInstance = $ionicListDelegate._registerInstance(this, $attrs.delegateHandle);
  $scope.$on('$destroy', deregisterInstance);

  this.showReorder = function(show) {
    if (arguments.length) {
      isReorderShown = !!show;
    }
    return isReorderShown;
  };

  this.showDelete = function(show) {
    if (arguments.length) {
      isDeleteShown = !!show;
    }
    return isDeleteShown;
  };

  this.canSwipeItems = function(can) {
    if (arguments.length) {
      isSwipeable = !!can;
    }
    return isSwipeable;
  };

  this.closeOptionButtons = function() {
    this.listView && this.listView.clearDragEffects();
  };
}]);

IonicModule
.controller('$ionicNavBar', [
  '$scope',
  '$element',
  '$attrs',
  '$ionicViewService',
  '$animate',
  '$compile',
  '$ionicNavBarDelegate',
function($scope, $element, $attrs, $ionicViewService, $animate, $compile, $ionicNavBarDelegate) {
  //Let the parent know about our controller too so that children of
  //sibling content elements can know about us
  $element.parent().data('$ionNavBarController', this);

  var deregisterInstance = $ionicNavBarDelegate._registerInstance(this, $attrs.delegateHandle);

  $scope.$on('$destroy', deregisterInstance);

  var self = this;

  this.leftButtonsElement = jqLite(
    $element[0].querySelector('.buttons.left-buttons')
  );
  this.rightButtonsElement = jqLite(
    $element[0].querySelector('.buttons.right-buttons')
  );

  this.back = function() {
    var backView = $ionicViewService.getBackView();
    backView && backView.go();
    return false;
  };

  this.align = function(direction) {
    this._headerBarView.align(direction);
  };

  this.showBackButton = function(show) {
    if (arguments.length) {
      $scope.backButtonShown = !!show;
    }
    return !!($scope.hasBackButton && $scope.backButtonShown);
  };

  this.showBar = function(show) {
    if (arguments.length) {
      $scope.isInvisible = !show;
      $scope.$parent.$hasHeader = !!show;
    }
    return !$scope.isInvisible;
  };

  this.setTitle = function(title) {
    if ($scope.title === title) {
      return;
    }
    $scope.oldTitle = $scope.title;
    $scope.title = title || '';
  };

  this.changeTitle = function(title, direction) {
    if ($scope.title === title) {
      return false;
    }
    this.setTitle(title);
    $scope.isReverse = direction == 'back';
    $scope.shouldAnimate = !!direction;

    if (!$scope.shouldAnimate) {
      //We're done!
      this._headerBarView.align();
    } else {
      this._animateTitles();
    }
    return true;
  };

  this.getTitle = function() {
    return $scope.title || '';
  };

  this.getPreviousTitle = function() {
    return $scope.oldTitle || '';
  };

  /**
   * Exposed for testing
   */
  this._animateTitles = function() {
    var oldTitleEl, newTitleEl, currentTitles;

    //If we have any title right now
    //(or more than one, they could be transitioning on switch),
    //replace the first one with an oldTitle element
    currentTitles = $element[0].querySelectorAll('.title');
    if (currentTitles.length) {
      oldTitleEl = $compile('<h1 class="title" ng-bind-html="oldTitle"></h1>')($scope);
      jqLite(currentTitles[0]).replaceWith(oldTitleEl);
    }
    //Compile new title
    newTitleEl = $compile('<h1 class="title invisible" ng-bind-html="title"></h1>')($scope);

    //Animate in on next frame
    ionic.requestAnimationFrame(function() {

      oldTitleEl && $animate.leave(jqLite(oldTitleEl));

      var insert = oldTitleEl && jqLite(oldTitleEl) || null;
      $animate.enter(newTitleEl, $element, insert, function() {
        self._headerBarView.align();
      });

      //Cleanup any old titles leftover (besides the one we already did replaceWith on)
      forEach(currentTitles, function(el) {
        if (el && el.parentNode) {
          //Use .remove() to cleanup things like .data()
          jqLite(el).remove();
        }
      });

      //$apply so bindings fire
      $scope.$digest();

      //Stop flicker of new title on ios7
      ionic.requestAnimationFrame(function() {
        newTitleEl[0].classList.remove('invisible');
      });
    });
  };
}]);


/**
 * @private
 */
IonicModule

.factory('$$scrollValueCache', function() {
  return {};
})

.controller('$ionicScroll', [
  '$scope',
  'scrollViewOptions',
  '$timeout',
  '$window',
  '$$scrollValueCache',
  '$location',
  '$rootScope',
  '$document',
  '$ionicScrollDelegate',
function($scope, scrollViewOptions, $timeout, $window, $$scrollValueCache, $location, $rootScope, $document, $ionicScrollDelegate) {

  var self = this;

  this._scrollViewOptions = scrollViewOptions; //for testing

  var element = this.element = scrollViewOptions.el;
  var $element = this.$element = jqLite(element);
  var scrollView = this.scrollView = new ionic.views.Scroll(scrollViewOptions);

  //Attach self to element as a controller so other directives can require this controller
  //through `require: '$ionicScroll'
  //Also attach to parent so that sibling elements can require this
  ($element.parent().length ? $element.parent() : $element)
    .data('$$ionicScrollController', this);

  var deregisterInstance = $ionicScrollDelegate._registerInstance(
    this, scrollViewOptions.delegateHandle
  );

  if (!angular.isDefined(scrollViewOptions.bouncing)) {
    ionic.Platform.ready(function() {
      scrollView.options.bouncing = true;

      if(ionic.Platform.isAndroid()) {
        // No bouncing by default on Android
        scrollView.options.bouncing = false;
        // Faster scroll decel
        scrollView.options.deceleration = 0.95;
      } else {
      }
    });
  }

  var resize = angular.bind(scrollView, scrollView.resize);
  ionic.on('resize', resize, $window);

  // set by rootScope listener if needed
  var backListenDone = angular.noop;

  $scope.$on('$destroy', function() {
    deregisterInstance();
    scrollView.__removeEventHandlers();
    ionic.off('resize', resize, $window);
    $window.removeEventListener('resize', resize);
    backListenDone();
    if (self._rememberScrollId) {
      $$scrollValueCache[self._rememberScrollId] = scrollView.getValues();
    }
  });

  $element.on('scroll', function(e) {
    var detail = (e.originalEvent || e).detail || {};
    $scope.$onScroll && $scope.$onScroll({
      event: e,
      scrollTop: detail.scrollTop || 0,
      scrollLeft: detail.scrollLeft || 0
    });
  });

  $scope.$on('$viewContentLoaded', function(e, historyData) {
    //only the top-most scroll area under a view should remember that view's
    //scroll position
    if (e.defaultPrevented) { return; }
    e.preventDefault();

    var viewId = historyData && historyData.viewId || $scope.$historyId;
    if (viewId) {
      $timeout(function() {
        self.rememberScrollPosition(viewId);
        self.scrollToRememberedPosition();

        backListenDone = $rootScope.$on('$viewHistory.viewBack', function(e, fromViewId, toViewId) {
          //When going back from this view, forget its saved scroll position
          if (viewId === fromViewId) {
            self.forgetScrollPosition();
          }
        });
      }, 0, false);
    }
  });

  $timeout(function() {
    scrollView.run();
  });

  this._rememberScrollId = null;

  this.getScrollView = function() {
    return this.scrollView;
  };

  this.getScrollPosition = function() {
    return this.scrollView.getValues();
  };

  this.resize = function() {
    return $timeout(resize);
  };

  this.scrollTop = function(shouldAnimate) {
    this.resize().then(function() {
      scrollView.scrollTo(0, 0, !!shouldAnimate);
    });
  };

  this.scrollBottom = function(shouldAnimate) {
    this.resize().then(function() {
      var max = scrollView.getScrollMax();
      scrollView.scrollTo(max.left, max.top, !!shouldAnimate);
    });
  };

  this.scrollTo = function(left, top, shouldAnimate) {
    this.resize().then(function() {
      scrollView.scrollTo(left, top, !!shouldAnimate);
    });
  };

  this.scrollBy = function(left, top, shouldAnimate) {
    this.resize().then(function() {
      scrollView.scrollBy(left, top, !!shouldAnimate);
    });
  };

  this.anchorScroll = function(shouldAnimate) {
    this.resize().then(function() {
      var hash = $location.hash();
      var elm = hash && $document[0].getElementById(hash);
      if (!(hash && elm)) {
        scrollView.scrollTo(0,0, !!shouldAnimate);
        return;
      }
      var curElm = elm;
      var scrollLeft = 0, scrollTop = 0, levelsClimbed = 0;
      do {
        if(curElm !== null)scrollLeft += curElm.offsetLeft;
        if(curElm !== null)scrollTop += curElm.offsetTop;
        curElm = curElm.offsetParent;
        levelsClimbed++;
      } while (curElm.attributes != self.element.attributes && curElm.offsetParent);
      scrollView.scrollTo(scrollLeft, scrollTop, !!shouldAnimate);
    });
  };

  this.rememberScrollPosition = function(id) {
    if (!id) {
      throw new Error("Must supply an id to remember the scroll by!");
    }
    this._rememberScrollId = id;
  };
  this.forgetScrollPosition = function() {
    delete $$scrollValueCache[this._rememberScrollId];
    this._rememberScrollId = null;
  };
  this.scrollToRememberedPosition = function(shouldAnimate) {
    var values = $$scrollValueCache[this._rememberScrollId];
    if (values) {
      this.resize().then(function() {
        scrollView.scrollTo(+values.left, +values.top, shouldAnimate);
      });
    }
  };

  /**
   * @private
   */
  this._setRefresher = function(refresherScope, refresherElement) {
    var refresher = this.refresher = refresherElement;
    var refresherHeight = self.refresher.clientHeight || 0;
    scrollView.activatePullToRefresh(refresherHeight, function() {
      refresher.classList.add('active');
      refresherScope.$onPulling();
    }, function() {
      refresher.classList.remove('refreshing');
      refresher.classList.remove('active');
    }, function() {
      refresher.classList.add('refreshing');
      refresherScope.$onRefresh();
    });
  };
}]);


IonicModule
.controller('$ionicSideMenus', [
  '$scope',
  '$attrs',
  '$ionicSideMenuDelegate',
  '$ionicPlatform',
function($scope, $attrs, $ionicSideMenuDelegate, $ionicPlatform) {
  var self = this;
  extend(this, ionic.controllers.SideMenuController.prototype);

  this.$scope = $scope;

  ionic.controllers.SideMenuController.call(this, {
    left: { width: 275 },
    right: { width: 275 }
  });

  this.canDragContent = function(canDrag) {
    if (arguments.length) {
      $scope.dragContent = !!canDrag;
    }
    return $scope.dragContent;
  };

  this.edgeThreshold = 25;
  this.edgeThresholdEnabled = false;
  this.edgeDragThreshold = function(value) {
    if (arguments.length) {
      if (angular.isNumber(value) && value > 0) {
        this.edgeThreshold = value;
        this.edgeThresholdEnabled = true;
      } else {
        this.edgeThresholdEnabled = !!value;
      }
    }
    return this.edgeThresholdEnabled;
  };

  this.isDraggableTarget = function(e) {
    //Only restrict edge when sidemenu is closed and restriction is enabled
    var shouldOnlyAllowEdgeDrag = self.edgeThresholdEnabled && !self.isOpen();
    var startX = e.gesture.startEvent && e.gesture.startEvent.center &&
      e.gesture.startEvent.center.pageX;

    var dragIsWithinBounds = !shouldOnlyAllowEdgeDrag ||
      startX <= self.edgeThreshold ||
      startX >= self.content.offsetWidth - self.edgeThreshold;

    return ($scope.dragContent || self.isOpen()) &&
           dragIsWithinBounds &&
           !e.gesture.srcEvent.defaultPrevented &&
           !e.target.tagName.match(/input|textarea|select|object|embed/i) &&
           !e.target.isContentEditable &&
           !(e.target.dataset ? e.target.dataset.preventScroll : e.target.getAttribute('data-prevent-default') == 'true');
  };

  $scope.sideMenuContentTranslateX = 0;


  var deregisterBackButtonAction = angular.noop;
  var closeSideMenu = angular.bind(this, this.close);
  $scope.$watch(function() {
    return self.getOpenAmount() !== 0;
  }, function(isOpen) {
    deregisterBackButtonAction();
    if (isOpen) {
      deregisterBackButtonAction = $ionicPlatform.registerBackButtonAction(
        closeSideMenu,
        PLATFORM_BACK_BUTTON_PRIORITY_SIDE_MENU
      );
    }
  });

  var deregisterInstance = $ionicSideMenuDelegate._registerInstance(
    this, $attrs.delegateHandle
  );
  $scope.$on('$destroy', function() {
    deregisterInstance();
    deregisterBackButtonAction();
  });
}]);

IonicModule
.controller('$ionicTab', [
  '$scope',
  '$ionicViewService',
  '$attrs',
  '$location',
  '$state',
function($scope, $ionicViewService, $attrs, $location, $state) {
  this.$scope = $scope;

  //All of these exposed for testing
  this.hrefMatchesState = function() {
    return $attrs.href && $location.path().indexOf(
      $attrs.href.replace(/^#/, '').replace(/\/$/, '')
    ) === 0;
  };
  this.srefMatchesState = function() {
    return $attrs.uiSref && $state.includes( $attrs.uiSref.split('(')[0] );
  };
  this.navNameMatchesState = function() {
    return this.navViewName && $ionicViewService.isCurrentStateNavView(this.navViewName);
  };

  this.tabMatchesState = function() {
    return this.hrefMatchesState() || this.srefMatchesState() || this.navNameMatchesState();
  };
}]);

IonicModule
.controller('$ionicTabs', [
  '$scope', 
  '$ionicViewService', 
  '$element', 
function($scope, $ionicViewService, $element) {
  var _selectedTab = null;
  var self = this;
  self.tabs = [];

  self.selectedIndex = function() {
    return self.tabs.indexOf(_selectedTab);
  };
  self.selectedTab = function() {
    return _selectedTab;
  };

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

  self.deselect = function(tab) {
    if (tab.$tabSelected) {
      _selectedTab = null;
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

    if (_selectedTab && _selectedTab.$historyId == tab.$historyId) {
      if (shouldEmitEvent) {
        $ionicViewService.goToHistoryRoot(tab.$historyId);
      }
    } else {
      forEach(self.tabs, function(tab) {
        self.deselect(tab);
      });

      _selectedTab = tab;
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
}]);


/*
 * We don't document the ionActionSheet directive, we instead document
 * the $ionicActionSheet service
 */
IonicModule
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
                '<div class="action-sheet-wrapper">' +
                  '<div class="action-sheet">' +
                    '<div class="action-sheet-group">' +
                      '<div class="action-sheet-title" ng-if="titleText" ng-bind-html="titleText"></div>' +
                      '<button class="button" ng-click="buttonClicked($index)" ng-repeat="button in buttons" ng-bind-html="button.text"></button>' +
                    '</div>' +
                    '<div class="action-sheet-group" ng-if="destructiveText">' +
                      '<button class="button destructive" ng-click="destructiveButtonClicked()" ng-bind-html="destructiveText"></button>' +
                    '</div>' +
                    '<div class="action-sheet-group" ng-if="cancelText">' +
                      '<button class="button" ng-click="cancel()" ng-bind-html="cancelText"></button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>'
  };
}]);


/**
 * @ngdoc directive
 * @name ionCheckbox
 * @module ionic
 * @restrict E
 * @codepen hqcju
 * @description
 * The checkbox is no different than the HTML checkbox input, except it's styled differently.
 *
 * The checkbox behaves like any [AngularJS checkbox](http://docs.angularjs.org/api/ng/input/input[checkbox]).
 *
 * @usage
 * ```html
 * <ion-checkbox ng-model="isChecked">Checkbox Label</ion-checkbox>
 * ```
 */

IonicModule
.directive('ionCheckbox', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    transclude: true,
    template:
      '<label class="item item-checkbox">' +
        '<div class="checkbox checkbox-input-hidden disable-pointer-events">' +
          '<input type="checkbox">' +
          '<i class="checkbox-icon"></i>' +
        '</div>' +
        '<div class="item-content disable-pointer-events" ng-transclude></div>' +
      '</label>',
    compile: function(element, attr) {
      var input = element.find('input');
      forEach({
        'name': attr.name,
        'ng-value': attr.ngValue,
        'ng-model': attr.ngModel,
        'ng-checked': attr.ngChecked,
        'ng-disabled': attr.ngDisabled,
        'ng-true-value': attr.ngTrueValue,
        'ng-false-value': attr.ngFalseValue,
        'ng-change': attr.ngChange
      }, function(value, name) {
        if (isDefined(value)) {
          input.attr(name, value);
        }
      });
    }

  };
});

/**
 * @ngdoc directive
 * @module ionic
 * @name collectionRepeat
 * @restrict A
 * @codepen mFygh
 * @description
 * `collection-repeat` is a directive that allows you to render lists with
 * thousands of items in them, and experience little to no performance penalty.
 *
 * Demo:
 *
 * The directive renders onto the screen only the items that should be currently visible.
 * So if you have 1,000 items in your list but only ten fit on your screen,
 * collection-repeat will only render into the DOM the ten that are in the current
 * scroll position.
 *
 * Here are a few things to keep in mind while using collection-repeat:
 *
 * 1. The data supplied to collection-repeat must be an array.
 * 2. You must explicitly tell the directive what size your items will be in the DOM, using directive attributes.
 * Pixel amounts or percentages are allowed (see below).
 * 3. The elements rendered will be absolutely positioned: be sure to let your CSS work with
 * this (see below).
 * 4. Keep the HTML of your repeated elements as simple as possible.
 * The more complicated your elements, the more likely it is that the on-demand compilation will cause
 * some jerkiness in the user's scrolling.
 * 6. Each collection-repeat list will take up all of its parent scrollView's space.
 * If you wish to have multiple lists on one page, put each list within its own
 * {@link ionic.directive:ionScroll ionScroll} container.
 * 7. You should not use the ng-show and ng-hide directives on your ion-content/ion-scroll elements that
 * have a collection-repeat inside.  ng-show and ng-hide apply the `display: none` css rule to the content's
 * style, causing the scrollView to read the width and height of the content as 0.  Resultingly,
 * collection-repeat will render elements that have just been un-hidden incorrectly.
 *
 *
 * @usage
 *
 * #### Basic Usage (single rows of items)
 *
 * Notice two things here: we use ng-style to set the height of the item to match
 * what the repeater thinks our item height is.  Additionally, we add a css rule
 * to make our item stretch to fit the full screen (since it will be absolutely
 * positioned).
 *
 * ```html
 * <ion-content ng-controller="ContentCtrl">
 *   <div class="list">
 *     <div class="item my-item"
 *       collection-repeat="item in items"
 *       collection-item-width="'100%'"
 *       collection-item-height="getItemHeight(item, $index)"
 *       ng-style="{height: getItemHeight(item, $index)}">
 *       {% raw %}{{item}}{% endraw %}
 *     </div>
 *   </div>
 * </div>
 * ```
 * ```js
 * function ContentCtrl($scope) {
 *   $scope.items = [];
 *   for (var i = 0; i < 1000; i++) {
 *     $scope.items.push('Item ' + i);
 *   }
 *
 *   $scope.getItemHeight = function(item, index) {
 *     //Make evenly indexed items be 10px taller, for the sake of example
 *     return (index % 2) === 0 ? 50 : 60;
 *   };
 * }
 * ```
 * ```css
 * .my-item {
 *   left: 0;
 *   right: 0;
 * }
 * ```
 *
 * #### Grid Usage (three items per row)
 *
 * ```html
 * <ion-content>
 *   <div class="item item-avatar my-image-item"
 *     collection-repeat="image in images"
 *     collection-item-width="'33%'"
 *     collection-item-height="'33%'">
 *     <img ng-src="{{image.src}}">
 *   </div>
 * </ion-content>
 * ```
 * Percentage of total visible list dimensions. This example shows a 3 by 3 matrix that fits on the screen (3 rows and 3 colums). Note that dimensions are used in the creation of the element and therefore a measurement of the item cannnot be used as an input dimension.
 * ```css
 * .my-image-item img {
 *   height: 33%;
 *   width: 33%;
 * }
 * ```
 *
 * @param {expression} collection-repeat The expression indicating how to enumerate a collection. These
 *   formats are currently supported:
 *
 *   * `variable in expression` – where variable is the user defined loop variable and `expression`
 *     is a scope expression giving the collection to enumerate.
 *
 *     For example: `album in artist.albums`.
 *
 *   * `variable in expression track by tracking_expression` – You can also provide an optional tracking function
 *     which can be used to associate the objects in the collection with the DOM elements. If no tracking function
 *     is specified the collection-repeat associates elements by identity in the collection. It is an error to have
 *     more than one tracking function to resolve to the same key. (This would mean that two distinct objects are
 *     mapped to the same DOM element, which is not possible.)  Filters should be applied to the expression,
 *     before specifying a tracking expression.
 *
 *     For example: `item in items` is equivalent to `item in items track by $id(item)'. This implies that the DOM elements
 *     will be associated by item identity in the array.
 *
 *     For example: `item in items track by $id(item)`. A built in `$id()` function can be used to assign a unique
 *     `$$hashKey` property to each item in the array. This property is then used as a key to associated DOM elements
 *     with the corresponding item in the array by identity. Moving the same object in array would move the DOM
 *     element in the same way in the DOM.
 *
 *     For example: `item in items track by item.id` is a typical pattern when the items come from the database. In this
 *     case the object identity does not matter. Two objects are considered equivalent as long as their `id`
 *     property is same.
 *
 *     For example: `item in items | filter:searchText track by item.id` is a pattern that might be used to apply a filter
 *     to items in conjunction with a tracking expression.
 *
 * @param {expression} collection-item-width The width of the repeated element.  Can be a number (in pixels) or a percentage.
 * @param {expression} collection-item-height The height of the repeated element.  Can be a number (in pixels), or a percentage.
 *
 */
var COLLECTION_REPEAT_SCROLLVIEW_XY_ERROR = "Cannot create a collection-repeat within a scrollView that is scrollable on both x and y axis.  Choose either x direction or y direction.";
var COLLECTION_REPEAT_ATTR_HEIGHT_ERROR = "collection-repeat expected attribute collection-item-height to be a an expression that returns a number (in pixels) or percentage.";
var COLLECTION_REPEAT_ATTR_WIDTH_ERROR = "collection-repeat expected attribute collection-item-width to be a an expression that returns a number (in pixels) or percentage.";
var COLLECTION_REPEAT_ATTR_REPEAT_ERROR = "collection-repeat expected expression in form of '_item_ in _collection_[ track by _id_]' but got '%'";

IonicModule
.directive({
  ngSrc: collectionRepeatSrcDirective('ngSrc', 'src'),
  ngSrcset: collectionRepeatSrcDirective('ngSrcset', 'srcset'),
  ngHref: collectionRepeatSrcDirective('ngHref', 'href')
})
.directive('collectionRepeat', [
  '$collectionRepeatManager',
  '$collectionDataSource',
  '$parse',
function($collectionRepeatManager, $collectionDataSource, $parse) {
  return {
    priority: 1000,
    transclude: 'element',
    terminal: true,
    $$tlb: true,
    require: '^$ionicScroll',
    controller: [function(){}],
    link: function($scope, $element, $attr, scrollCtrl, $transclude) {
      var scrollView = scrollCtrl.scrollView;
      if (scrollView.options.scrollingX && scrollView.options.scrollingY) {
        throw new Error(COLLECTION_REPEAT_SCROLLVIEW_XY_ERROR);
      }

      var isVertical = !!scrollView.options.scrollingY;
      if (isVertical && !$attr.collectionItemHeight) {
        throw new Error(COLLECTION_REPEAT_ATTR_HEIGHT_ERROR);
      } else if (!isVertical && !$attr.collectionItemWidth) {
        throw new Error(COLLECTION_REPEAT_ATTR_WIDTH_ERROR);
      }

      var heightParsed = $parse($attr.collectionItemHeight || '"100%"');
      var widthParsed = $parse($attr.collectionItemWidth || '"100%"');

      var heightGetter = function(scope, locals) {
        var result = heightParsed(scope, locals);
        if (isString(result) && result.indexOf('%') > -1) {
          return Math.floor(parseInt(result, 10) / 100 * scrollView.__clientHeight);
        }
        return result;
      };
      var widthGetter = function(scope, locals) {
        var result = widthParsed(scope, locals);
        if (isString(result) && result.indexOf('%') > -1) {
          return Math.floor(parseInt(result, 10) / 100 * scrollView.__clientWidth);
        }
        return result;
      };

      var match = $attr.collectionRepeat.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
      if (!match) {
        throw new Error(COLLECTION_REPEAT_ATTR_REPEAT_ERROR
                        .replace('%', $attr.collectionRepeat));
      }
      var keyExpr = match[1];
      var listExpr = match[2];
      var trackByExpr = match[3];

      var dataSource = new $collectionDataSource({
        scope: $scope,
        transcludeFn: $transclude,
        transcludeParent: $element.parent(),
        keyExpr: keyExpr,
        listExpr: listExpr,
        trackByExpr: trackByExpr,
        heightGetter: heightGetter,
        widthGetter: widthGetter
      });
      var collectionRepeatManager = new $collectionRepeatManager({
        dataSource: dataSource,
        element: scrollCtrl.$element,
        scrollView: scrollCtrl.scrollView,
      });

      $scope.$watchCollection(listExpr, function(value) {
        if (value && !angular.isArray(value)) {
          throw new Error("collection-repeat expects an array to repeat over, but instead got '" + typeof value + "'.");
        }
        rerender(value);
      });

      function rerender(value) {
        scrollView.resize();
        dataSource.setData(value);
        collectionRepeatManager.resize();
      }
      function onWindowResize() {
        rerender($scope.$eval(listExpr));
      }

      ionic.on('resize', onWindowResize, window);

      $scope.$on('$destroy', function() {
        collectionRepeatManager.destroy();
        dataSource.destroy();
        ionic.off('resize', onWindowResize, window);
      });
    }
  };
}]);

// Fix for #1674
// Problem: if an ngSrc or ngHref expression evaluates to a falsy value, it will 
// not erase the previous truthy value of the href.
// In collectionRepeat, we re-use elements from before. So if the ngHref expression
// evaluates to truthy for item 1 and then falsy for item 2, if an element changes
// from representing item 1 to representing item 2, item 2 will still have
// item 1's href value.
// Solution:  erase the href or src attribute if ngHref/ngSrc are falsy.
function collectionRepeatSrcDirective(ngAttrName, attrName) {
  return [function() {
    return {
      priority: '99', // it needs to run after the attributes are interpolated
      require: '^?collectionRepeat',
      link: function(scope, element, attr, collectionRepeatCtrl) {
        if (!collectionRepeatCtrl) return;
        attr.$observe(ngAttrName, function(value) {
          if (!value) {
            element.removeAttr(attrName);
          }
        });
      }
    };
  }];
}

/**
 * @ngdoc directive
 * @name ionContent
 * @module ionic
 * @delegate ionic.service:$ionicScrollDelegate
 * @restrict E
 *
 * @description
 * The ionContent directive provides an easy to use content area that can be configured
 * to use Ionic's custom Scroll View, or the built in overflow scrolling of the browser.
 *
 * While we recommend using the custom Scroll features in Ionic in most cases, sometimes
 * (for performance reasons) only the browser's native overflow scrolling will suffice,
 * and so we've made it easy to toggle between the Ionic scroll implementation and
 * overflow scrolling.
 *
 * You can implement pull-to-refresh with the {@link ionic.directive:ionRefresher}
 * directive, and infinite scrolling with the {@link ionic.directive:ionInfiniteScroll}
 * directive.
 *
 * Be aware that this directive gets its own child scope. If you do not understand why this
 * is important, you can read [https://docs.angularjs.org/guide/scope](https://docs.angularjs.org/guide/scope).
 *
 * @param {string=} delegate-handle The handle used to identify this scrollView
 * with {@link ionic.service:$ionicScrollDelegate}.
 * @param {string=} direction Which way to scroll. 'x' or 'y' or 'xy'. Default 'y'.
 * @param {boolean=} padding Whether to add padding to the content.
 * of the content.  Defaults to true on iOS, false on Android.
 * @param {boolean=} scroll Whether to allow scrolling of content.  Defaults to true.
 * @param {boolean=} overflow-scroll Whether to use overflow-scrolling instead of
 * Ionic scroll.
 * @param {boolean=} scrollbar-x Whether to show the horizontal scrollbar. Default true.
 * @param {boolean=} scrollbar-y Whether to show the vertical scrollbar. Default true.
 * @param {boolean=} scrollbar-y Whether to show the vertical scrollbar. Default true.
 * @param {string=} start-y Initial vertical scroll position. Default 0.
 * of the content.  Defaults to true on iOS, false on Android.
 * @param {expression=} on-scroll Expression to evaluate when the content is scrolled.
 * @param {expression=} on-scroll-complete Expression to evaluate when a scroll action completes.
 * @param {boolean=} has-bouncing Whether to allow scrolling to bounce past the edges
 * of the content.  Defaults to true on iOS, false on Android.
 */
IonicModule
.directive('ionContent', [
  '$timeout',
  '$controller',
  '$ionicBind',
function($timeout, $controller, $ionicBind) {
  return {
    restrict: 'E',
    require: '^?ionNavView',
    scope: true,
    priority: 800,
    compile: function(element, attr) {
      var innerElement;

      element.addClass('scroll-content ionic-scroll');

      if (attr.scroll != 'false') {
        //We cannot use normal transclude here because it breaks element.data()
        //inheritance on compile
        innerElement = jqLite('<div class="scroll"></div>');
        innerElement.append(element.contents());
        element.append(innerElement);
      } else {
        element.addClass('scroll-content-false');
      }

      return { pre: prelink };
      function prelink($scope, $element, $attr, navViewCtrl) {
        var parentScope = $scope.$parent;
        $scope.$watch(function() {
          return (parentScope.$hasHeader ? ' has-header' : '')  +
            (parentScope.$hasSubheader ? ' has-subheader' : '') +
            (parentScope.$hasFooter ? ' has-footer' : '') +
            (parentScope.$hasSubfooter ? ' has-subfooter' : '') +
            (parentScope.$hasTabs ? ' has-tabs' : '') +
            (parentScope.$hasTabsTop ? ' has-tabs-top' : '');
        }, function(className, oldClassName) {
          $element.removeClass(oldClassName);
          $element.addClass(className);
        });

        //Only this ionContent should use these variables from parent scopes
        $scope.$hasHeader = $scope.$hasSubheader =
          $scope.$hasFooter = $scope.$hasSubfooter =
          $scope.$hasTabs = $scope.$hasTabsTop =
          false;
        $ionicBind($scope, $attr, {
          $onScroll: '&onScroll',
          $onScrollComplete: '&onScrollComplete',
          hasBouncing: '@',
          padding: '@',
          direction: '@',
          scrollbarX: '@',
          scrollbarY: '@',
          startX: '@',
          startY: '@',
          scrollEventInterval: '@'
        });
        $scope.direction = $scope.direction || 'y';

        if (angular.isDefined($attr.padding)) {
          $scope.$watch($attr.padding, function(newVal) {
              (innerElement || $element).toggleClass('padding', !!newVal);
          });
        }

        if ($attr.scroll === "false") {
          //do nothing
        } else if(attr.overflowScroll === "true") {
          $element.addClass('overflow-scroll');
        } else {
          $controller('$ionicScroll', {
            $scope: $scope,
            scrollViewOptions: {
              el: $element[0],
              delegateHandle: attr.delegateHandle,
              bouncing: $scope.$eval($scope.hasBouncing),
              startX: $scope.$eval($scope.startX) || 0,
              startY: $scope.$eval($scope.startY) || 0,
              scrollbarX: $scope.$eval($scope.scrollbarX) !== false,
              scrollbarY: $scope.$eval($scope.scrollbarY) !== false,
              scrollingX: $scope.direction.indexOf('x') >= 0,
              scrollingY: $scope.direction.indexOf('y') >= 0,
              scrollEventInterval: parseInt($scope.scrollEventInterval, 10) || 10,
              scrollingComplete: function() {
                $scope.$onScrollComplete({
                  scrollTop: this.__scrollTop,
                  scrollLeft: this.__scrollLeft
                });
              }
            }
          });
        }

      }
    }
  };
}]);

var GESTURE_DIRECTIVES = 'onHold onTap onTouch onRelease onDrag onDragUp onDragRight onDragDown onDragLeft onSwipe onSwipeUp onSwipeRight onSwipeDown onSwipeLeft'.split(' ');

GESTURE_DIRECTIVES.forEach(function(name) {
  IonicModule.directive(name, gestureDirective(name));
});


/**
 * @ngdoc directive
 * @name onHold
 * @module ionic
 * @restrict A
 *
 * @description
 * Touch stays at the same location for 500ms.
 *
 * @usage
 * ```html
 * <button on-hold="onHold()" class="button">Test</button>
 * ```
 */


/**
 * @ngdoc directive
 * @name onTap
 * @module ionic
 * @restrict A
 *
 * @description
 * Quick touch at a location. If the duration of the touch goes
 * longer than 250ms it is no longer a tap gesture.
 *
 * @usage
 * ```html
 * <button on-tap="onTap()" class="button">Test</button>
 * ```
 */


/**
 * @ngdoc directive
 * @name onTouch
 * @module ionic
 * @restrict A
 *
 * @description
 * Called immediately when the user first begins a touch. This
 * gesture does not wait for a touchend/mouseup.
 *
 * @usage
 * ```html
 * <button on-touch="onTouch()" class="button">Test</button>
 * ```
 */


/**
 * @ngdoc directive
 * @name onRelease
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when the user ends a touch.
 *
 * @usage
 * ```html
 * <button on-release="onRelease()" class="button">Test</button>
 * ```
 */


/**
 * @ngdoc directive
 * @name onDrag
 * @module ionic
 * @restrict A
 *
 * @description
 * Move with one touch around on the page. Blocking the scrolling when
 * moving left and right is a good practice. When all the drag events are
 * blocking you disable scrolling on that area.
 *
 * @usage
 * ```html
 * <button on-drag="onDrag()" class="button">Test</button>
 * ```
 */


/**
 * @ngdoc directive
 * @name onDragUp
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when the element is dragged up.
 *
 * @usage
 * ```html
 * <button on-drag-up="onDragUp()" class="button">Test</button>
 * ```
 */


/**
 * @ngdoc directive
 * @name onDragRight
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when the element is dragged to the right.
 *
 * @usage
 * ```html
 * <button on-drag-right="onDragRight()" class="button">Test</button>
 * ```
 */


/**
 * @ngdoc directive
 * @name onDragDown
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when the element is dragged down.
 *
 * @usage
 * ```html
 * <button on-drag-down="onDragDown()" class="button">Test</button>
 * ```
 */


/**
 * @ngdoc directive
 * @name onDragLeft
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when the element is dragged to the left.
 *
 * @usage
 * ```html
 * <button on-drag-left="onDragLeft()" class="button">Test</button>
 * ```
 */


/**
 * @ngdoc directive
 * @name onSwipe
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when a moving touch has a high velocity in any direction.
 *
 * @usage
 * ```html
 * <button on-swipe="onSwipe()" class="button">Test</button>
 * ```
 */


/**
 * @ngdoc directive
 * @name onSwipeUp
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when a moving touch has a high velocity moving up.
 *
 * @usage
 * ```html
 * <button on-swipe-up="onSwipeUp()" class="button">Test</button>
 * ```
 */


/**
 * @ngdoc directive
 * @name onSwipeRight
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when a moving touch has a high velocity moving to the right.
 *
 * @usage
 * ```html
 * <button on-swipe-right="onSwipeRight()" class="button">Test</button>
 * ```
 */


/**
 * @ngdoc directive
 * @name onSwipeDown
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when a moving touch has a high velocity moving down.
 *
 * @usage
 * ```html
 * <button on-swipe-down="onSwipeDown()" class="button">Test</button>
 * ```
 */


/**
 * @ngdoc directive
 * @name onSwipeLeft
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when a moving touch has a high velocity moving to the left.
 *
 * @usage
 * ```html
 * <button on-swipe-left="onSwipeLeft()" class="button">Test</button>
 * ```
 */


function gestureDirective(directiveName) {
  return ['$ionicGesture', '$parse', function($ionicGesture, $parse) {
    var eventType = directiveName.substr(2).toLowerCase();

    return function(scope, element, attr) {
      var fn = $parse( attr[directiveName] );

      var listener = function(ev) {
        scope.$apply(function() {
          fn(scope, {
            $event: ev
          });
        });
      };

      var gesture = $ionicGesture.on(eventType, listener, element);

      scope.$on('$destroy', function() {
        $ionicGesture.off(gesture, eventType, listener);
      });
    };
  }];
}


IonicModule
.directive('ionNavBar', tapScrollToTopDirective())
.directive('ionHeaderBar', tapScrollToTopDirective())

/**
 * @ngdoc directive
 * @name ionHeaderBar
 * @module ionic
 * @restrict E
 *
 * @description
 * Adds a fixed header bar above some content.
 *
 * Can also be a subheader (lower down) if the 'bar-subheader' class is applied.
 * See [the header CSS docs](/docs/components/#subheader).
 *
 * Note: If you use ionHeaderBar in combination with ng-if, the surrounding content
 * will not align correctly.  This will be fixed soon.
 *
 * @param {string=} align-title Where to align the title. 
 * Available: 'left', 'right', or 'center'.  Defaults to 'center'.
 * @param {boolean=} no-tap-scroll By default, the header bar will scroll the
 * content to the top when tapped.  Set no-tap-scroll to true to disable this 
 * behavior.
 * Available: true or false.  Defaults to false.
 *
 * @usage
 * ```html
 * <ion-header-bar align-title="left" class="bar-positive">
 *   <div class="buttons">
 *     <button class="button" ng-click="doSomething()">Left Button</button>
 *   </div>
 *   <h1 class="title">Title!</h1>
 *   <div class="buttons">
 *     <button class="button">Right Button</button>
 *   </div>
 * </ion-header-bar>
 * <ion-content>
 *   Some content!
 * </ion-content>
 * ```
 */
.directive('ionHeaderBar', headerFooterBarDirective(true))

/**
 * @ngdoc directive
 * @name ionFooterBar
 * @module ionic
 * @restrict E
 *
 * @description
 * Adds a fixed footer bar below some content.
 *
 * Can also be a subfooter (higher up) if the 'bar-subfooter' class is applied.
 * See [the footer CSS docs](/docs/components/#footer).
 *
 * Note: If you use ionFooterBar in combination with ng-if, the surrounding content
 * will not align correctly.  This will be fixed soon.
 *
 * @param {string=} align-title Where to align the title.
 * Available: 'left', 'right', or 'center'.  Defaults to 'center'.
 *
 * @usage
 * ```html
 * <ion-content>
 *   Some content!
 * </ion-content>
 * <ion-footer-bar align-title="left" class="bar-assertive">
 *   <div class="buttons">
 *     <button class="button">Left Button</button>
 *   </div>
 *   <h1 class="title">Title!</h1>
 *   <div class="buttons" ng-click="doSomething()">
 *     <button class="button">Right Button</button>
 *   </div>
 * </ion-footer-bar>
 * ```
 */
.directive('ionFooterBar', headerFooterBarDirective(false));

function tapScrollToTopDirective() {
  return ['$ionicScrollDelegate', function($ionicScrollDelegate) {
    return {
      restrict: 'E',
      link: function($scope, $element, $attr) {
        if ($attr.noTapScroll == 'true') {
          return;
        }
        ionic.on('tap', onTap, $element[0]);
        $scope.$on('$destroy', function() {
          ionic.off('tap', onTap, $element[0]);
        });

        function onTap(e) {
          var depth = 3;
          var current = e.target;
          //Don't scroll to top in certain cases
          while (depth-- && current) {
            if (current.classList.contains('button') ||
                current.tagName.match(/input|textarea|select/i) ||
                current.isContentEditable) {
              return;
            }
            current = current.parentNode;
          }
          var touch = e.gesture && e.gesture.touches[0] || e.detail.touches[0];
          var bounds = $element[0].getBoundingClientRect();
          if (ionic.DomUtil.rectContains(
            touch.pageX, touch.pageY,
            bounds.left, bounds.top - 20,
            bounds.left + bounds.width, bounds.top + bounds.height
          )) {
            $ionicScrollDelegate.scrollTop(true);
          }
        }
      }
    };
  }];
}

function headerFooterBarDirective(isHeader) {
  return [function() {
    return {
      restrict: 'E',
      compile: function($element, $attr) {
        $element.addClass(isHeader ? 'bar bar-header' : 'bar bar-footer');

        return { pre: prelink };
        function prelink($scope, $element, $attr) {
          var hb = new ionic.views.HeaderBar({
            el: $element[0],
            alignTitle: $attr.alignTitle || 'center'
          });

          var el = $element[0];

          if (isHeader) {
            $scope.$watch(function() { return el.className; }, function(value) {
              var isShown = value.indexOf('ng-hide') === -1;
              var isSubheader = value.indexOf('bar-subheader') !== -1;
              $scope.$hasHeader = isShown && !isSubheader;
              $scope.$hasSubheader = isShown && isSubheader;
            });
            $scope.$on('$destroy', function() {
              delete $scope.$hasHeader;
              delete $scope.$hasSubheader;
            });
          } else {
            $scope.$watch(function() { return el.className; }, function(value) {
              var isShown = value.indexOf('ng-hide') === -1;
              var isSubfooter = value.indexOf('bar-subfooter') !== -1;
              $scope.$hasFooter = isShown && !isSubfooter;
              $scope.$hasSubfooter = isShown && isSubfooter;
            });
            $scope.$on('$destroy', function() {
              delete $scope.$hasFooter;
              delete $scope.$hasSubfooter;
            });
            $scope.$watch('$hasTabs', function(val) {
              $element.toggleClass('has-tabs', !!val);
            });
          }
        }
      }
    };
  }];
}

/**
 * @ngdoc directive
 * @name ionInfiniteScroll
 * @module ionic
 * @parent ionic.directive:ionContent, ionic.directive:ionScroll
 * @restrict E
 *
 * @description
 * The ionInfiniteScroll directive allows you to call a function whenever
 * the user gets to the bottom of the page or near the bottom of the page.
 *
 * The expression you pass in for `on-infinite` is called when the user scrolls
 * greater than `distance` away from the bottom of the content.  Once `on-infinite`
 * is done loading new data, it should broadcast the `scroll.infiniteScrollComplete`
 * event from your controller (see below example).
 *
 * @param {expression} on-infinite What to call when the scroller reaches the
 * bottom.
 * @param {string=} distance The distance from the bottom that the scroll must
 * reach to trigger the on-infinite expression. Default: 1%.
 * @param {string=} icon The icon to show while loading. Default: 'ion-loading-d'.
 *
 * @usage
 * ```html
 * <ion-content ng-controller="MyController">
 *   <ion-infinite-scroll
 *     on-infinite="loadMore()"
 *     distance="1%">
 *   </ion-infinite-scroll>
 * </ion-content>
 * ```
 * ```js
 * function MyController($scope, $http) {
 *   $scope.items = [];
 *   $scope.loadMore = function() {
 *     $http.get('/more-items').success(function(items) {
 *       useItems(items);
 *       $scope.$broadcast('scroll.infiniteScrollComplete');
 *     });
 *   };
 *
 *   $scope.$on('stateChangeSuccess', function() {
 *     $scope.loadMore();
 *   });
 * }
 * ```
 *
 * An easy to way to stop infinite scroll once there is no more data to load
 * is to use angular's `ng-if` directive:
 *
 * ```html
 * <ion-infinite-scroll
 *   ng-if="moreDataCanBeLoaded()"
 *   icon="ion-loading-c"
 *   on-infinite="loadMoreData()">
 * </ion-infinite-scroll>
 * ```
 */
IonicModule
.directive('ionInfiniteScroll', ['$timeout', function($timeout) {
  function calculateMaxValue(distance, maximum, isPercent) {
    return isPercent ?
      maximum * (1 - parseInt(distance,10) / 100) :
      maximum - parseInt(distance, 10);
  }
  return {
    restrict: 'E',
    require: ['^$ionicScroll', 'ionInfiniteScroll'],
    template:
      '<div class="scroll-infinite">' +
        '<div class="scroll-infinite-content">' +
          '<i class="icon {{icon()}} icon-refreshing"></i>' +
        '</div>' +
      '</div>',
    scope: true,
    controller: ['$scope', '$attrs', function($scope, $attrs) {
      this.isLoading = false;
      this.scrollView = null; //given by link function
      this.getMaxScroll = function() {
        var distance = ($attrs.distance || '1%').trim();
        var isPercent = distance.indexOf('%') !== -1;
        var maxValues = this.scrollView.getScrollMax();
        return {
          left: this.scrollView.options.scrollingX ?
            calculateMaxValue(distance, maxValues.left, isPercent) :
            -1,
          top: this.scrollView.options.scrollingY ?
            calculateMaxValue(distance, maxValues.top, isPercent) :
            -1
        };
      };
    }],
    link: function($scope, $element, $attrs, ctrls) {
      var scrollCtrl = ctrls[0];
      var infiniteScrollCtrl = ctrls[1];
      var scrollView = infiniteScrollCtrl.scrollView = scrollCtrl.scrollView;

      $scope.icon = function() {
        return angular.isDefined($attrs.icon) ? $attrs.icon : 'ion-loading-d';
      };

      var onInfinite = function() {
        $element[0].classList.add('active');
        infiniteScrollCtrl.isLoading = true;
        $scope.$parent && $scope.$parent.$apply($attrs.onInfinite || '');
      };

      var finishInfiniteScroll = function() {
        $element[0].classList.remove('active');
        $timeout(function() {
          scrollView.resize();
        }, 0, false);
        infiniteScrollCtrl.isLoading = false;
      };

      $scope.$on('scroll.infiniteScrollComplete', function() {
        finishInfiniteScroll();
      });

      $scope.$on('$destroy', function() {
        scrollCtrl.$element.off('scroll', checkBounds);
      });

      var checkBounds = ionic.animationFrameThrottle(checkInfiniteBounds);

      //Check bounds on start, after scrollView is fully rendered
      setTimeout(checkBounds);
      scrollCtrl.$element.on('scroll', checkBounds);

      function checkInfiniteBounds() {
        if (infiniteScrollCtrl.isLoading) return;

        var scrollValues = scrollView.getValues();
        var maxScroll = infiniteScrollCtrl.getMaxScroll();

        if ((maxScroll.left !== -1 && scrollValues.left >= maxScroll.left) ||
            (maxScroll.top !== -1 && scrollValues.top >= maxScroll.top)) {
          onInfinite();
        }
      }
    }
  };
}]);

var ITEM_TPL_CONTENT_ANCHOR =
  '<a class="item-content" ng-href="{{$href()}}" target="{{$target()}}"></a>';
var ITEM_TPL_CONTENT =
  '<div class="item-content"></div>';
/**
* @ngdoc directive
* @name ionItem
* @parent ionic.directive:ionList
* @module ionic
* @restrict E
* Creates a list-item that can easily be swiped,
* deleted, reordered, edited, and more.
*
* See {@link ionic.directive:ionList} for a complete example & explanation.
*
* Can be assigned any item class name. See the
* [list CSS documentation](/docs/components/#list).
*
* @usage
*
* ```html
* <ion-list>
*   <ion-item>Hello!</ion-item>
* </ion-list>
* ```
*/
IonicModule
.directive('ionItem', [
  '$animate',
  '$compile',
function($animate, $compile) {
  return {
    restrict: 'E',
    controller: ['$scope', '$element', function($scope, $element) {
      this.$scope = $scope;
      this.$element = $element;
    }],
    scope: true,
    compile: function($element, $attrs) {
      var isAnchor = angular.isDefined($attrs.href) ||
        angular.isDefined($attrs.ngHref) ||
        angular.isDefined($attrs.uiSref);
      var isComplexItem = isAnchor ||
        //Lame way of testing, but we have to know at compile what to do with the element
        /ion-(delete|option|reorder)-button/i.test($element.html());

        if (isComplexItem) {
          var innerElement = jqLite(isAnchor ? ITEM_TPL_CONTENT_ANCHOR : ITEM_TPL_CONTENT);
          innerElement.append($element.contents());

          $element.append(innerElement);
          $element.addClass('item item-complex');
        } else {
          $element.addClass('item');
        }

        return function link($scope, $element, $attrs) {
          $scope.$href = function() {
            return $attrs.href || $attrs.ngHref;
          };
          $scope.$target = function() {
            return $attrs.target || '_self';
          };
        };
    }
  };
}]);


var ITEM_TPL_DELETE_BUTTON =
  '<div class="item-left-edit item-delete enable-pointer-events">' +
  '</div>';
/**
* @ngdoc directive
* @name ionDeleteButton
* @parent ionic.directive:ionItem
* @module ionic
* @restrict E
* Creates a delete button inside a list item, that is visible when the
* {@link ionic.directive:ionList ionList parent's} `show-delete` evaluates to true or
* `$ionicListDelegate.showDelete(true)` is called.
*
* Takes any ionicon as a class.
*
* See {@link ionic.directive:ionList} for a complete example & explanation.
*
* @usage
*
* ```html
* <ion-list show-delete="shouldShowDelete">
*   <ion-item>
*     <ion-delete-button class="ion-minus-circled"></ion-delete-button>
*     Hello, list item!
*   </ion-item>
* </ion-list>
* <ion-toggle ng-model="shouldShowDelete">
*   Show Delete?
* </ion-toggle>
* ```
*/
IonicModule
.directive('ionDeleteButton', ['$animate', function($animate) {
  return {
    restrict: 'E',
    require: ['^ionItem', '^?ionList'],
    //Run before anything else, so we can move it before other directives process
    //its location (eg ngIf relies on the location of the directive in the dom)
    priority: Number.MAX_VALUE,
    compile: function($element, $attr) {
      //Add the classes we need during the compile phase, so that they stay
      //even if something else like ngIf removes the element and re-addss it
      $attr.$set('class', ($attr['class'] || '') + ' button icon button-icon', true);
      return function($scope, $element, $attr, ctrls) {
        var itemCtrl = ctrls[0];
        var listCtrl = ctrls[1];
        var container = jqLite(ITEM_TPL_DELETE_BUTTON);
        container.append($element);
        itemCtrl.$element.append(container).addClass('item-left-editable');

        if (listCtrl && listCtrl.showDelete()) {
          container.addClass('visible active');
        }
      };
    }
  };
}]);


IonicModule
.directive('itemFloatingLabel', function() {
  return {
    restrict: 'C',
    link: function(scope, element) {
      var el = element[0];
      var input = el.querySelector('input, textarea');
      var inputLabel = el.querySelector('.input-label');

      if ( !input || !inputLabel ) return;

      var onInput = function() {
        if ( input.value ) {
          inputLabel.classList.add('has-input');
        } else {
          inputLabel.classList.remove('has-input');
        }
      };

      input.addEventListener('input', onInput);

      var ngModelCtrl = angular.element(input).controller('ngModel');
      if ( ngModelCtrl ) {
        ngModelCtrl.$render = function() {
          input.value = ngModelCtrl.$viewValue || '';
          onInput();
        };
      }

      scope.$on('$destroy', function() {
        input.removeEventListener('input', onInput);
      });
    }
  };
});

var ITEM_TPL_OPTION_BUTTONS =
  '<div class="item-options invisible">' +
  '</div>';
/**
* @ngdoc directive
* @name ionOptionButton
* @parent ionic.directive:ionItem
* @module ionic
* @restrict E
* Creates an option button inside a list item, that is visible when the item is swiped
* to the left by the user.  Swiped open option buttons can be hidden with
* {@link ionic.service:$ionicListDelegate#closeOptionButtons $ionicListDelegate#closeOptionButtons}.
*
* Can be assigned any button class.
*
* See {@link ionic.directive:ionList} for a complete example & explanation.
*
* @usage
*
* ```html
* <ion-list>
*   <ion-item>
*     I love kittens!
*     <ion-option-button class="button-positive">Share</ion-option-button>
*     <ion-option-button class="button-assertive">Edit</ion-option-button>
*   </ion-item>
* </ion-list>
* ```
*/
IonicModule
.directive('ionOptionButton', ['$compile', function($compile) {
  function stopPropagation(e) {
    e.stopPropagation();
  }
  return {
    restrict: 'E',
    require: '^ionItem',
    priority: Number.MAX_VALUE,
    compile: function($element, $attr) {
      $attr.$set('class', ($attr['class'] || '') + ' button', true);
      return function($scope, $element, $attr, itemCtrl) {
        if (!itemCtrl.optionsContainer) {
          itemCtrl.optionsContainer = jqLite(ITEM_TPL_OPTION_BUTTONS);
          itemCtrl.$element.append(itemCtrl.optionsContainer);
        }
        itemCtrl.optionsContainer.append($element);

        //Don't bubble click up to main .item
        $element.on('click', stopPropagation);
      };
    }
  };
}]);

var ITEM_TPL_REORDER_BUTTON =
  '<div data-prevent-scroll="true" class="item-right-edit item-reorder enable-pointer-events">' +
  '</div>';

/**
* @ngdoc directive
* @name ionReorderButton
* @parent ionic.directive:ionItem
* @module ionic
* @restrict E
* Creates a reorder button inside a list item, that is visible when the
* {@link ionic.directive:ionList ionList parent's} `show-reorder` evaluates to true or
* `$ionicListDelegate.showReorder(true)` is called.
*
* Can be dragged to reorder items in the list. Takes any ionicon class.
*
* Note: Reordering works best when used with `ng-repeat`.  Be sure that all `ion-item` children of an `ion-list` are part of the same `ng-repeat` expression.
*
* When an item reorder is complete, the expression given in the `on-reorder` attribute is called. The `on-reorder` expression is given two locals that can be used: `$fromIndex` and `$toIndex`.  See below for an example.
*
* Look at {@link ionic.directive:ionList} for more examples.
*
* @usage
*
* ```html
* <ion-list ng-controller="MyCtrl">
*   <ion-item ng-repeat="item in items">
*     Item {{item}}
*     <ion-reorder-button class="ion-navicon"
*                         on-reorder="moveItem(item, $fromIndex, $toIndex)">
*     </ion-reorder>
*   </ion-item>
* </ion-list>
* ```
* ```js
* function MyCtrl($scope) {
*   $scope.items = [1, 2, 3, 4];
*   $scope.moveItem = function(item, fromIndex, toIndex) {
*     //Move the item in the array
*     $scope.items.splice(fromIndex, 1);
*     $scope.items.splice(toIndex, 0, item);
*   };
* }
* ```
*
* @param {expression=} on-reorder Expression to call when an item is reordered.
* Parameters given: $fromIndex, $toIndex.
*/
IonicModule
.directive('ionReorderButton', ['$animate', '$parse', function($animate, $parse) {
  return {
    restrict: 'E',
    require: ['^ionItem', '^?ionList'],
    priority: Number.MAX_VALUE,
    compile: function($element, $attr) {
      $attr.$set('class', ($attr['class'] || '') + ' button icon button-icon', true);
      $element[0].setAttribute('data-prevent-scroll', true);
      return function($scope, $element, $attr, ctrls) {
        var itemCtrl = ctrls[0];
        var listCtrl = ctrls[1];
        var onReorderFn = $parse($attr.onReorder);

        $scope.$onReorder = function(oldIndex, newIndex) {
          onReorderFn($scope, {
            $fromIndex: oldIndex,
            $toIndex: newIndex
          });
        };

        var container = jqLite(ITEM_TPL_REORDER_BUTTON);
        container.append($element);
        itemCtrl.$element.append(container).addClass('item-right-editable');

        if (listCtrl && listCtrl.showReorder()) {
          container.addClass('visible active');
        }
      };
    }
  };
}]);

/**
 * @ngdoc directive
 * @name keyboardAttach
 * @module ionic
 * @restrict A
 *
 * @description
 * keyboard-attach is an attribute directive which will cause an element to float above
 * the keyboard when the keyboard shows. Currently only supports the
 * [ion-footer-bar]({{ page.versionHref }}/api/directive/ionFooterBar/) directive.
 *
 * ### Notes
 * - This directive requires the
 * [Ionic Keyboard Plugin](https://github.com/driftyco/ionic-plugins-keyboard).
 * - On Android not in fullscreen mode, i.e. you have
 *   `<preference name="Fullscreen" value="false" />` or no preference in your `config.xml` file,
 *   this directive is unnecessary since it is the default behavior.
 * - On iOS, if there is an input in your footer, you will need to set
 *   `cordova.plugins.Keyboard.disableScroll(true)`.
 *
 * @usage
 *
 * ```html
 *  <ion-footer-bar align-title="left" keyboard-attach class="bar-assertive">
 *    <h1 class="title">Title!</h1>
 *  </ion-footer-bar>
 * ```
 */

IonicModule
.directive('keyboardAttach', function() {
  return function(scope, element, attrs) {
    ionic.on('native.keyboardshow', onShow, window);
    ionic.on('native.keyboardhide', onHide, window);

    //deprecated
    ionic.on('native.showkeyboard', onShow, window);
    ionic.on('native.hidekeyboard', onHide, window);


    var scrollCtrl;

    function onShow(e) {
      if (ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen) {
        return;
      }

      //for testing
      var keyboardHeight = e.keyboardHeight || e.detail.keyboardHeight;
      element.css('bottom', keyboardHeight + "px");
      scrollCtrl = element.controller('$ionicScroll');
      if ( scrollCtrl ) {
        scrollCtrl.scrollView.__container.style.bottom = keyboardHeight + keyboardAttachGetClientHeight(element[0]) + "px";
      }
    }

    function onHide() {
      if (ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen) {
        return;
      }

      element.css('bottom', '');
      if ( scrollCtrl ) {
        scrollCtrl.scrollView.__container.style.bottom = '';
      }
    }

    scope.$on('$destroy', function() {
      ionic.off('native.keyboardshow', onShow, window);
      ionic.off('native.keyboardhide', onHide, window);

      //deprecated
      ionic.off('native.showkeyboard', onShow, window);
      ionic.off('native.hidekeyboard', onHide, window);
    });
  };
});

function keyboardAttachGetClientHeight(element) {
  return element.clientHeight;
}

/**
* @ngdoc directive
* @name ionList
* @module ionic
* @delegate ionic.service:$ionicListDelegate
* @codepen JsHjf
* @restrict E
* @description
* The List is a widely used interface element in almost any mobile app, and can include
* content ranging from basic text all the way to buttons, toggles, icons, and thumbnails.
*
* Both the list, which contains items, and the list items themselves can be any HTML
* element. The containing element requires the `list` class and each list item requires
* the `item` class.
*
* However, using the ionList and ionItem directives make it easy to support various
* interaction modes such as swipe to edit, drag to reorder, and removing items.
*
* Related: {@link ionic.directive:ionItem}, {@link ionic.directive:ionOptionButton}
* {@link ionic.directive:ionReorderButton}, {@link ionic.directive:ionDeleteButton}, [`list CSS documentation`](/docs/components/#list).
*
* @usage
*
* Basic Usage:
*
* ```html
* <ion-list>
*   <ion-item ng-repeat="item in items">
*     {% raw %}Hello, {{item}}!{% endraw %}
*   </ion-item>
* </ion-list>
* ```
*
* Advanced Usage: Thumbnails, Delete buttons, Reordering, Swiping
*
* ```html
* <ion-list ng-controller="MyCtrl"
*           show-delete="shouldShowDelete"
*           show-reorder="shouldShowReorder"
*           can-swipe="listCanSwipe">
*   <ion-item ng-repeat="item in items"
*             class="item-thumbnail-left">
*
*     {% raw %}<img ng-src="{{item.img}}">
*     <h2>{{item.title}}</h2>
*     <p>{{item.description}}</p>{% endraw %}
*     <ion-option-button class="button-positive"
*                        ng-click="share(item)">
*       Share
*     </ion-option-button>
*     <ion-option-button class="button-info"
*                        ng-click="edit(item)">
*       Edit
*     </ion-option-button>
*     <ion-delete-button class="ion-minus-circled"
*                        ng-click="items.splice($index, 1)">
*     </ion-delete-button>
*     <ion-reorder-button class="ion-navicon"
*                         on-reorder="reorderItem(item, $fromIndex, $toIndex)">
*     </ion-reorder-button>
*
*   </ion-item>
* </ion-list>
* ```
*
* @param {string=} delegate-handle The handle used to identify this list with
* {@link ionic.service:$ionicListDelegate}.
* @param show-delete {boolean=} Whether the delete buttons for the items in the list are
* currently shown or hidden.
* @param show-reorder {boolean=} Whether the reorder buttons for the items in the list are
* currently shown or hidden.
* @param can-swipe {boolean=} Whether the items in the list are allowed to be swiped to reveal
* option buttons. Default: true.
*/
IonicModule
.directive('ionList', [
  '$animate',
  '$timeout',
function($animate, $timeout) {
  return {
    restrict: 'E',
    require: ['ionList', '^?$ionicScroll'],
    controller: '$ionicList',
    compile: function($element, $attr) {
      var listEl = jqLite('<div class="list">')
      .append( $element.contents() );
      $element.append(listEl);

      return function($scope, $element, $attrs, ctrls) {
        var listCtrl = ctrls[0];
        var scrollCtrl = ctrls[1];

        //Wait for child elements to render...
        $timeout(init);

        function init() {
          var listView = listCtrl.listView = new ionic.views.ListView({
            el: $element[0],
            listEl: $element.children()[0],
            scrollEl: scrollCtrl && scrollCtrl.element,
            scrollView: scrollCtrl && scrollCtrl.scrollView,
            onReorder: function(el, oldIndex, newIndex) {
              var itemScope = jqLite(el).scope();
              if (itemScope && itemScope.$onReorder) {
                //Make sure onReorder is called in apply cycle,
                //but also make sure it has no conflicts by doing
                //$evalAsync
                $timeout(function() {
                  itemScope.$onReorder(oldIndex, newIndex);
                });
              }
            },
            canSwipe: function() {
              return listCtrl.canSwipeItems();
            }
          });

          if (isDefined($attr.canSwipe)) {
            $scope.$watch('!!(' + $attr.canSwipe + ')', function(value) {
              listCtrl.canSwipeItems(value);
            });
          }
          if (isDefined($attr.showDelete)) {
            $scope.$watch('!!(' + $attr.showDelete + ')', function(value) {
              listCtrl.showDelete(value);
            });
          }
          if (isDefined($attr.showReorder)) {
            $scope.$watch('!!(' + $attr.showReorder + ')', function(value) {
              listCtrl.showReorder(value);
            });
          }

          $scope.$watch(function() {
            return listCtrl.showDelete();
          }, function(isShown, wasShown) {
            //Only use isShown=false if it was already shown
            if (!isShown && !wasShown) { return; }

            if (isShown) listCtrl.closeOptionButtons();
            listCtrl.canSwipeItems(!isShown);

            $element.children().toggleClass('list-left-editing', isShown);
            $element.toggleClass('disable-pointer-events', isShown);

            var deleteButton = jqLite($element[0].getElementsByClassName('item-delete'));
            setButtonShown(deleteButton, listCtrl.showDelete);
          });

          $scope.$watch(function() {
            return listCtrl.showReorder();
          }, function(isShown, wasShown) {
            //Only use isShown=false if it was already shown
            if (!isShown && !wasShown) { return; }

            if (isShown) listCtrl.closeOptionButtons();
            listCtrl.canSwipeItems(!isShown);

            $element.children().toggleClass('list-right-editing', isShown);
            $element.toggleClass('disable-pointer-events', isShown);

            var reorderButton = jqLite($element[0].getElementsByClassName('item-reorder'));
            setButtonShown(reorderButton, listCtrl.showReorder);
          });

          function setButtonShown(el, shown) {
            shown() && el.addClass('visible') || el.removeClass('active');
            ionic.requestAnimationFrame(function() {
              shown() && el.addClass('active') || el.removeClass('invisible');
            });
          }
        }

      };
    }
  };
}]);

/**
 * @ngdoc directive
 * @name menuClose
 * @module ionic
 * @restrict AC
 *
 * @description
 * Closes a side menu which is currently opened.
 *
 * @usage
 * Below is an example of a link within a side menu. Tapping this link would
 * automatically close the currently opened menu
 *
 * ```html
 * <a menu-close href="#/home" class="item">Home</a>
 * ```
 */
IonicModule
.directive('menuClose', ['$ionicViewService', function($ionicViewService) {
  return {
    restrict: 'AC',
    require: '^ionSideMenus',
    link: function($scope, $element, $attr, sideMenuCtrl) {
      $element.bind('click', function(){
        sideMenuCtrl.close();
      });
    }
  };
}]);

/**
 * @ngdoc directive
 * @name menuToggle
 * @module ionic
 * @restrict AC
 *
 * @description
 * Toggle a side menu on the given side
 *
 * @usage
 * Below is an example of a link within a nav bar. Tapping this link would
 * automatically open the given side menu
 *
 * ```html
 * <ion-view>
 *   <ion-nav-buttons side="left">
 *    <button menu-toggle="left" class="button button-icon icon ion-navicon"></button>
 *   </ion-nav-buttons>
 *  ...
 * </ion-view>
 * ```
 */
IonicModule
.directive('menuToggle', ['$ionicViewService', function($ionicViewService) {
  return {
    restrict: 'AC',
    require: '^ionSideMenus',
    link: function($scope, $element, $attr, sideMenuCtrl) {
      var side = $attr.menuToggle || 'left';
      $element.bind('click', function(){
        if(side === 'left') {
          sideMenuCtrl.toggleLeft();
        } else if(side === 'right') {
          sideMenuCtrl.toggleRight();
        }
      });
    }
  };
}]);


/*
 * We don't document the ionModal directive, we instead document
 * the $ionicModal service
 */
IonicModule
.directive('ionModal', [function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    controller: [function(){}],
    template: '<div class="modal-backdrop">' +
                '<div class="modal-wrapper" ng-transclude></div>' +
                '</div>'
  };
}]);

IonicModule
.directive('ionModalView', function() {
  return {
    restrict: 'E',
    compile: function(element, attr) {
      element.addClass('modal');
    }
  };
});

/**
 * @ngdoc directive
 * @name ionNavBackButton
 * @module ionic
 * @restrict E
 * @parent ionNavBar
 * @description
 * Creates a back button inside an {@link ionic.directive:ionNavBar}.
 *
 * Will show up when the user is able to go back in the current navigation stack.
 *
 * By default, will go back when clicked.  If you wish for more advanced behavior, see the
 * examples below.
 *
 * @usage
 *
 * With default click action:
 *
 * ```html
 * <ion-nav-bar>
 *   <ion-nav-back-button class="button-clear">
 *     <i class="ion-arrow-left-c"></i> Back
 *   </ion-nav-back-button>
 * </ion-nav-bar>
 * ```
 *
 * With custom click action, using {@link ionic.service:$ionicNavBarDelegate}:
 *
 * ```html
 * <ion-nav-bar ng-controller="MyCtrl">
 *   <ion-nav-back-button class="button-clear"
 *     ng-click="doSomethingCool()">
 *     <i class="ion-arrow-left-c"></i> Back
 *   </ion-nav-back-button>
 * </ion-nav-bar>
 * ```
 * ```js
 * function MyCtrl($scope, $ionicNavBarDelegate) {
 *   $scope.goBack = function() {
 *     $ionicNavBarDelegate.back();
 *   };
 * }
 * ```
 *
 * Displaying the previous title on the back button, again using
 * {@link ionic.service:$ionicNavBarDelegate}.
 *
 * ```html
 * <ion-nav-bar ng-controller="MyCtrl">
 *   <ion-nav-back-button class="button-icon">
 *     <i class="icon ion-arrow-left-c"></i>{% raw %}{{getPreviousTitle() || 'Back'}}{% endraw %}
 *   </ion-nav-back-button>
 * </ion-nav-bar>
 * ```
 * ```js
 * function MyCtrl($scope, $ionicNavBarDelegate) {
 *   $scope.getPreviousTitle = function() {
 *     return $ionicNavBarDelegate.getPreviousTitle();
 *   };
 * }
 * ```
 */
IonicModule
.directive('ionNavBackButton', [
  '$animate',
  '$rootScope',
  '$sanitize',
  '$ionicNavBarConfig',
  '$ionicNgClick',
function($animate, $rootScope, $sanitize, $ionicNavBarConfig, $ionicNgClick) {
  var backIsShown = false;
  //If the current viewstate does not allow a back button,
  //always hide it.
  $rootScope.$on('$viewHistory.historyChange', function(e, data) {
    backIsShown = !!data.showBack;
  });
  return {
    restrict: 'E',
    require: '^ionNavBar',
    compile: function(tElement, tAttrs) {
      tElement.addClass('button back-button ng-hide');

      var hasIconChild = !!(tElement.html() || '').match(/class=.*?ion-/);

      return function($scope, $element, $attr, navBarCtrl) {

        // Add a default back button icon based on the nav config, unless one is set
        if (!hasIconChild && $element[0].className.indexOf('ion-') === -1) {
          $element.addClass($ionicNavBarConfig.backButtonIcon);
        }

        //Default to ngClick going back, but don't override a custom one
        if (!isDefined($attr.ngClick)) {
          $ionicNgClick($scope, $element, navBarCtrl.back);
        }

        //Make sure both that a backButton is allowed in the first place,
        //and that it is shown by the current view.
        $scope.$watch(function() {
          if(isDefined($attr.fromTitle)) {
            $element[0].innerHTML = '<span class="back-button-title">' + $sanitize($scope.oldTitle) + '</span>';
          }
          return !!(backIsShown && $scope.backButtonShown);
        }, ionic.animationFrameThrottle(function(show) {
          if (show) $animate.removeClass($element, 'ng-hide');
          else $animate.addClass($element, 'ng-hide');
        }));
      };
    }
  };
}]);


IonicModule.constant('$ionicNavBarConfig', {
  transition: 'nav-title-slide-ios7',
  alignTitle: 'center',
  backButtonIcon: 'ion-ios7-arrow-back'
});

/**
 * @ngdoc directive
 * @name ionNavBar
 * @module ionic
 * @delegate ionic.service:$ionicNavBarDelegate
 * @restrict E
 *
 * @description
 * If we have an {@link ionic.directive:ionNavView} directive, we can also create an
 * `<ion-nav-bar>`, which will create a topbar that updates as the application state changes.
 *
 * We can add a back button by putting an {@link ionic.directive:ionNavBackButton} inside.
 *
 * We can add buttons depending on the currently visible view using
 * {@link ionic.directive:ionNavButtons}.
 *
 * Add an [animation class](/docs/components#animations) to the element via the
 * `animation` attribute to enable animated changing of titles 
 * (recommended: 'nav-title-slide-ios7').
 *
 * Note that the ion-nav-bar element will only work correctly if your content has an
 * ionView around it.
 *
 * @usage
 *
 * ```html
 * <body ng-app="starter">
 *   <!-- The nav bar that will be updated as we navigate -->
 *   <ion-nav-bar class="bar-positive" animation="nav-title-slide-ios7">
 *   </ion-nav-bar>
 *
 *   <!-- where the initial view template will be rendered -->
 *   <ion-nav-view>
 *     <ion-view>
 *       <ion-content>Hello!</ion-content>
 *     </ion-view>
 *   </ion-nav-view>
 * </body>
 * ```
 *
 * @param {string=} delegate-handle The handle used to identify this navBar
 * with {@link ionic.service:$ionicNavBarDelegate}.
 * @param align-title {string=} Where to align the title of the navbar.
 * Available: 'left', 'right', 'center'. Defaults to 'center'.
 * @param {boolean=} no-tap-scroll By default, the navbar will scroll the content
 * to the top when tapped.  Set no-tap-scroll to true to disable this behavior.
 *
 * </table><br/>
 *
 * ### Alternative Usage
 *
 * Alternatively, you may put ion-nav-bar inside of each individual view's ion-view element.
 * This will allow you to have the whole navbar, not just its contents, transition every view change.
 *
 * This is similar to using a header bar inside your ion-view, except it will have all the power of a navbar.
 *
 * If you do this, simply put nav buttons inside the navbar itself; do not use `<ion-nav-buttons>`.
 *
 *
 * ```html
 * <ion-view title="myTitle">
 *   <ion-nav-bar class="bar-positive">
 *     <ion-nav-back-button>
 *       Back
 *     </ion-nav-back-button>
 *     <div class="buttons right-buttons">
 *       <button class="button">
 *         Right Button
 *       </button>
 *     </div>
 *   </ion-nav-bar>
 * </ion-view>
 * ```
 */
IonicModule
.directive('ionNavBar', [
  '$ionicViewService',
  '$rootScope',
  '$animate',
  '$compile',
  '$ionicNavBarConfig',
function($ionicViewService, $rootScope, $animate, $compile, $ionicNavBarConfig) {

  return {
    restrict: 'E',
    controller: '$ionicNavBar',
    scope: true,
    compile: function(tElement, tAttrs) {
      //We cannot transclude here because it breaks element.data() inheritance on compile
      tElement
        .addClass('bar bar-header nav-bar')
        .append(
          '<div class="buttons left-buttons"> ' +
          '</div>' +
          '<h1 ng-bind-html="title" class="title"></h1>' +
          '<div class="buttons right-buttons"> ' +
          '</div>'
        );

      if (isDefined(tAttrs.animation)) {
        tElement.addClass(tAttrs.animation);
      } else {
        tElement.addClass($ionicNavBarConfig.transition);
      }

      return { pre: prelink };
      function prelink($scope, $element, $attr, navBarCtrl) {
        navBarCtrl._headerBarView = new ionic.views.HeaderBar({
          el: $element[0],
          alignTitle: $attr.alignTitle || $ionicNavBarConfig.alignTitle || 'center'
        });

        //defaults
        $scope.backButtonShown = false;
        $scope.shouldAnimate = true;
        $scope.isReverse = false;
        $scope.isInvisible = true;

        $scope.$on('$destroy', function() {
          $scope.$parent.$hasHeader = false;
        });

        $scope.$watch(function() {
          return ($scope.isReverse ? ' reverse' : '') +
            ($scope.isInvisible ? ' invisible' : '') +
            (!$scope.shouldAnimate ? ' no-animation' : '');
        }, function(className, oldClassName) {
          $element.removeClass(oldClassName);
          $element.addClass(className);
        });

      }
    }
  };
}]);


/**
 * @ngdoc directive
 * @name ionNavButtons
 * @module ionic
 * @restrict E
 * @parent ionNavView
 *
 * @description
 * Use ionNavButtons to set the buttons on your {@link ionic.directive:ionNavBar}
 * from within an {@link ionic.directive:ionView}.
 *
 * Any buttons you declare will be placed onto the navbar's corresponding side,
 * and then destroyed when the user leaves their parent view.
 *
 * @usage
 * ```html
 * <ion-nav-bar>
 * </ion-nav-bar>
 * <ion-nav-view>
 *   <ion-view>
 *     <ion-nav-buttons side="left">
 *       <button class="button" ng-click="doSomething()">
 *         I'm a button on the left of the navbar!
 *       </button>
 *     </ion-nav-buttons>
 *     <ion-content>
 *       Some super content here!
 *     </ion-content>
 *   </ion-view>
 * </ion-nav-view>
 * ```
 *
 * @param {string} side The side to place the buttons on in the parent
 * {@link ionic.directive:ionNavBar}. Available: 'left' or 'right'.
 */
IonicModule
.directive('ionNavButtons', ['$compile', '$animate', function($compile, $animate) {
  return {
    require: '^ionNavBar',
    restrict: 'E',
    compile: function($element, $attrs) {
      var content = $element.contents().remove();
      return function($scope, $element, $attrs, navBarCtrl) {
        var navElement = $attrs.side === 'right' ?
          navBarCtrl.rightButtonsElement :
          navBarCtrl.leftButtonsElement;

        //Put all of our inside buttons into their own span,
        //so we can remove them all when this element dies -
        //even if the buttons have changed through an ng-repeat or the like,
        //we just remove their div parent and they are gone.
        var buttons = jqLite('<span>').append(content);

        //Compile buttons inside content so they have access to everything
        //something inside content does (eg parent ionicScroll)
        $element.append(buttons);
        $compile(buttons)($scope);

        //Append buttons to navbar
        ionic.requestAnimationFrame(function() {
          //If the scope is destroyed before raf runs, be sure not to enter
          if (!$scope.$$destroyed) {
            $animate.enter(buttons, navElement);
          }
        });

        //When our ion-nav-buttons container is destroyed,
        //destroy everything in the navbar
        $scope.$on('$destroy', function() {
          $animate.leave(buttons);
        });

        // The original element is just a completely empty <ion-nav-buttons> element.
        // make it invisible just to be sure it doesn't change any layout
        $element.css('display', 'none');
      };
    }
  };
}]);


/**
 * @ngdoc directive
 * @name navClear
 * @module ionic
 * @restrict AC
 *
 * @description
 * nav-clear is an attribute directive which should be used with an element that changes
 * the view on click, for example an `<a href>` or a `<button ui-sref>`.
 *
 * nav-clear will cause the given element, when clicked, to disable the next view transition.
 * This directive is useful, for example, for links within a sideMenu.
 *
 * @usage
 * Below is a link in a side menu, with the nav-clear directive added to it.
 * Tapping this link will disable any animations that would normally occur
 * between views.
 *
 * ```html
 * <a nav-clear menu-close href="#/home" class="item">Home</a>
 * ```
 */
IonicModule
.directive('navClear', [
  '$ionicViewService',
  '$state',
  '$location',
  '$window',
  '$rootScope',
function($ionicViewService, $location, $state, $window, $rootScope) {
  $rootScope.$on('$stateChangeError', function() {
    $ionicViewService.nextViewOptions(null);
  });
  return {
    priority: 100,
    restrict: 'AC',
    compile: function($element) {
      return { pre: prelink };
      function prelink($scope, $element, $attrs) {
        var unregisterListener;
        function listenForStateChange() {
          unregisterListener = $scope.$on('$stateChangeStart', function() {
            $ionicViewService.nextViewOptions({
              disableAnimate: true,
              disableBack: true
            });
            unregisterListener();
          });
          $window.setTimeout(unregisterListener, 300);
        }

        $element.on('click', listenForStateChange);
      }
    }
  };
}]);

IonicModule.constant('$ionicNavViewConfig', {
  transition: 'slide-left-right-ios7'
});

/**
 * @ngdoc directive
 * @name ionNavView
 * @module ionic
 * @restrict E
 * @codepen odqCz
 *
 * @description
 * As a user navigates throughout your app, Ionic is able to keep track of their
 * navigation history. By knowing their history, transitions between views
 * correctly slide either left or right, or no transition at all. An additional
 * benefit to Ionic's navigation system is its ability to manage multiple
 * histories.
 *
 * Ionic uses the AngularUI Router module so app interfaces can be organized
 * into various "states". Like Angular's core $route service, URLs can be used
 * to control the views. However, the AngularUI Router provides a more powerful
 * state manager in that states are bound to named, nested, and parallel views,
 * allowing more than one template to be rendered on the same page.
 * Additionally, each state is not required to be bound to a URL, and data can
 * be pushed to each state which allows much flexibility.
 *
 * The ionNavView directive is used to render templates in your application. Each template
 * is part of a state. States are usually mapped to a url, and are defined programatically
 * using angular-ui-router (see [their docs](https://github.com/angular-ui/ui-router/wiki),
 * and remember to replace ui-view with ion-nav-view in examples).
 *
 * @usage
 * In this example, we will create a navigation view that contains our different states for the app.
 *
 * To do this, in our markup we use ionNavView top level directive. To display a header bar we use
 * the {@link ionic.directive:ionNavBar} directive that updates as we navigate through the
 * navigation stack.
 *
 * You can use any [animation class](/docs/components#animation) on the navView's `animation` attribute
 * to have its pages animate.
 *
 * Recommended for page transitions: 'slide-left-right', 'slide-left-right-ios7', 'slide-in-up'.
 *
 * ```html
 * <ion-nav-bar></ion-nav-bar>
 * <ion-nav-view animation="slide-left-right">
 *   <!-- Center content -->
 * </ion-nav-view>
 * ```
 *
 * Next, we need to setup our states that will be rendered.
 *
 * ```js
 * var app = angular.module('myApp', ['ionic']);
 * app.config(function($stateProvider) {
 *   $stateProvider
 *   .state('index', {
 *     url: '/',
 *     templateUrl: 'home.html'
 *   })
 *   .state('music', {
 *     url: '/music',
 *     templateUrl: 'music.html'
 *   });
 * });
 * ```
 * Then on app start, $stateProvider will look at the url, see it matches the index state,
 * and then try to load home.html into the `<ion-nav-view>`.
 *
 * Pages are loaded by the URLs given. One simple way to create templates in Angular is to put
 * them directly into your HTML file and use the `<script type="text/ng-template">` syntax.
 * So here is one way to put home.html into our app:
 *
 * ```html
 * <script id="home" type="text/ng-template">
 *   <!-- The title of the ion-view will be shown on the navbar -->
 *   <ion-view title="'Home'">
 *     <ion-content ng-controller="HomeCtrl">
 *       <!-- The content of the page -->
 *       <a href="#/music">Go to music page!</a>
 *     </ion-content>
 *   </ion-view>
 * </script>
 * ```
 *
 * This is good to do because the template will be cached for very fast loading, instead of
 * having to fetch them from the network.
 *
 * Please visit [AngularUI Router's docs](https://github.com/angular-ui/ui-router/wiki) for
 * more info. Below is a great video by the AngularUI Router guys that may help to explain
 * how it all works:
 *
 * <iframe width="560" height="315" src="//www.youtube.com/embed/dqJRoh8MnBo"
 * frameborder="0" allowfullscreen></iframe>
 *
 * @param {string=} name A view name. The name should be unique amongst the other views in the
 * same state. You can have views of the same name that live in different states. For more
 * information, see ui-router's [ui-view documentation](http://angular-ui.github.io/ui-router/site/#/api/ui.router.state.directive:ui-view).
 */
IonicModule
.directive('ionNavView', [
  '$ionicViewService',
  '$state',
  '$compile',
  '$controller',
  '$animate',
function( $ionicViewService,   $state,   $compile,   $controller,   $animate) {
  // IONIC's fork of Angular UI Router, v0.2.7
  // the navView handles registering views in the history, which animation to use, and which
  var viewIsUpdating = false;

  var directive = {
    restrict: 'E',
    terminal: true,
    priority: 2000,
    transclude: true,
    controller: function(){},
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
        if (name.indexOf('@') < 0) name  = name + '@' + ((parent && parent.state) ? parent.state.name : '');
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
        // scope.$on('$viewContentLoading', eventHook);
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

          var newElement = jqLite('<div></div>').html(locals.$template).contents();
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

          var viewHistoryData = $ionicViewService._getViewById(viewRegisterData.viewId) || {};
          viewScope.$broadcast('$viewContentLoaded', viewHistoryData);

          if (onloadExp) viewScope.$eval(onloadExp);

          newElement = null;
        }
      };
    }
  };
  return directive;
}]);


IonicModule

.config(['$provide', function($provide) {
  $provide.decorator('ngClickDirective', ['$delegate', function($delegate) {
    // drop the default ngClick directive
    $delegate.shift();
    return $delegate;
  }]);
}])

/**
 * @private
 */
.factory('$ionicNgClick', ['$parse', function($parse) {
  return function(scope, element, clickExpr) {
    var clickHandler = angular.isFunction(clickExpr) ?
      clickExpr :
      $parse(clickExpr);

    element.on('click', function(event) {
      scope.$apply(function() {
        clickHandler(scope, {$event: (event)});
      });
    });

    // Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
    // something else nearby.
    element.onclick = function(event) { };
  };
}])

.directive('ngClick', ['$ionicNgClick', function($ionicNgClick) {
  return function(scope, element, attr) {
    $ionicNgClick(scope, element, attr.ngClick);
  };
}])

.directive('ionStopEvent', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      element.bind(attr.ionStopEvent, eventStopPropagation);
    }
  };
});
function eventStopPropagation(e) {
  e.stopPropagation();
}


/**
 * @ngdoc directive
 * @name ionPane
 * @module ionic
 * @restrict E
 *
 * @description A simple container that fits content, with no side effects.  Adds the 'pane' class to the element.
 */
IonicModule
.directive('ionPane', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attr) {
      element.addClass('pane');
    }
  };
});

/**
 * @ngdoc directive
 * @name ionRadio
 * @module ionic
 * @restrict E
 * @codepen saoBG
 * @description
 * The radio directive is no different than the HTML radio input, except it's styled differently.
 *
 * Radio behaves like any [AngularJS radio](http://docs.angularjs.org/api/ng/input/input[radio]).
 *
 * @usage
 * ```html
 * <ion-radio ng-model="choice" ng-value="'A'">Choose A</ion-radio>
 * <ion-radio ng-model="choice" ng-value="'B'">Choose B</ion-radio>
 * <ion-radio ng-model="choice" ng-value="'C'">Choose C</ion-radio>
 * ```
 */
IonicModule
.directive('ionRadio', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: {
      ngModel: '=?',
      ngValue: '=?',
      ngDisabled: '=?',
      ngChange: '&',
      icon: '@',
      name: '@'
    },
    transclude: true,
    template: '<label class="item item-radio">' +
                '<input type="radio" name="radio-group"' +
                ' ng-model="ngModel" ng-value="getValue()" ng-change="ngChange()" ng-disabled="ngDisabled">' +
                '<div class="item-content disable-pointer-events" ng-transclude></div>' +
                '<i class="radio-icon disable-pointer-events icon ion-checkmark"></i>' +
              '</label>',

    compile: function(element, attr) {
      if(attr.name) element.children().eq(0).attr('name', attr.name);
      if(attr.icon) element.children().eq(2).removeClass('ion-checkmark').addClass(attr.icon);

      return function(scope, element, attr) {
        scope.getValue = function() {
          return scope.ngValue || attr.value;
        };
      };
    }
  };
});


/**
 * @ngdoc directive
 * @name ionRefresher
 * @module ionic
 * @restrict E
 * @parent ionic.directive:ionContent, ionic.directive:ionScroll
 * @description
 * Allows you to add pull-to-refresh to a scrollView.
 *
 * Place it as the first child of your {@link ionic.directive:ionContent} or
 * {@link ionic.directive:ionScroll} element.
 *
 * When refreshing is complete, $broadcast the 'scroll.refreshComplete' event
 * from your controller.
 *
 * @usage
 *
 * ```html
 * <ion-content ng-controller="MyController">
 *   <ion-refresher
 *     pulling-text="Pull to refresh..."
 *     on-refresh="doRefresh()">
 *   </ion-refresher>
 *   <ion-list>
 *     <ion-item ng-repeat="item in items"></ion-item>
 *   </ion-list>
 * </ion-content>
 * ```
 * ```js
 * angular.module('testApp', ['ionic'])
 * .controller('MyController', function($scope, $http) {
 *   $scope.items = [1,2,3];
 *   $scope.doRefresh = function() {
 *     $http.get('/new-items')
 *      .success(function(newItems) {
 *        $scope.items = newItems;
 *      })
 *      .finally(function() {
 *        // Stop the ion-refresher from spinning
 *        $scope.$broadcast('scroll.refreshComplete');
 *      });
 *   };
 * });
 * ```
 *
 * @param {expression=} on-refresh Called when the user pulls down enough and lets go
 * of the refresher.
 * @param {expression=} on-pulling Called when the user starts to pull down
 * on the refresher.
 * @param {string=} pulling-icon The icon to display while the user is pulling down.
 * Default: 'ion-arrow-down-c'.
 * @param {string=} pulling-text The text to display while the user is pulling down.
 * @param {string=} refreshing-icon The icon to display after user lets go of the
 * refresher.
 * @param {string=} refreshing-text The text to display after the user lets go of
 * the refresher.
 *
 */
IonicModule
.directive('ionRefresher', ['$ionicBind', function($ionicBind) {
  return {
    restrict: 'E',
    replace: true,
    require: '^$ionicScroll',
    template:
    '<div class="scroll-refresher">' +
      '<div class="ionic-refresher-content" ' +
      'ng-class="{\'ionic-refresher-with-text\': pullingText || refreshingText}">' +
        '<div class="icon-pulling">' +
          '<i class="icon {{pullingIcon}}"></i>' +
        '</div>' +
        '<div class="text-pulling" ng-bind-html="pullingText"></div>' +
        '<i class="icon {{refreshingIcon}} icon-refreshing"></i>' +
        '<div class="text-refreshing" ng-bind-html="refreshingText"></div>' +
      '</div>' +
    '</div>',
    compile: function($element, $attrs) {
      if (angular.isUndefined($attrs.pullingIcon)) {
        $attrs.$set('pullingIcon', 'ion-arrow-down-c');
      }
      if (angular.isUndefined($attrs.refreshingIcon)) {
        $attrs.$set('refreshingIcon', 'ion-loading-d');
      }
      return function($scope, $element, $attrs, scrollCtrl) {
        $ionicBind($scope, $attrs, {
          pullingIcon: '@',
          pullingText: '@',
          refreshingIcon: '@',
          refreshingText: '@',
          $onRefresh: '&onRefresh',
          $onPulling: '&onPulling'
        });

        scrollCtrl._setRefresher($scope, $element[0]);
        $scope.$on('scroll.refreshComplete', function() {
          $scope.$evalAsync(function() {
            $element[0].classList.remove('active');
            scrollCtrl.scrollView.finishPullToRefresh();
          });
        });
      };
    }
  };
}]);

/**
 * @ngdoc directive
 * @name ionScroll
 * @module ionic
 * @delegate ionic.service:$ionicScrollDelegate
 * @restrict E
 *
 * @description
 * Creates a scrollable container for all content inside.
 *
 * @param {string=} delegate-handle The handle used to identify this scrollView
 * with {@link ionic.service:$ionicScrollDelegate}.
 * @param {string=} direction Which way to scroll. 'x' or 'y' or 'xy'. Default 'y'.
 * @param {boolean=} paging Whether to scroll with paging.
 * @param {expression=} on-refresh Called on pull-to-refresh, triggered by an {@link ionic.directive:ionRefresher}.
 * @param {expression=} on-scroll Called whenever the user scrolls.
 * @param {boolean=} scrollbar-x Whether to show the horizontal scrollbar. Default true.
 * @param {boolean=} scrollbar-y Whether to show the vertical scrollbar. Default true.
 * @param {boolean=} zooming Whether to support pinch-to-zoom
 * @param {integer=} min-zoom The smallest zoom amount allowed (default is 0.5)
 * @param {integer=} max-zoom The largest zoom amount allowed (default is 3)
 * @param {boolean=} has-bouncing Whether to allow scrolling to bounce past the edges
 * of the content.  Defaults to true on iOS, false on Android.
 */
IonicModule
.directive('ionScroll', [
  '$timeout',
  '$controller',
  '$ionicBind',
function($timeout, $controller, $ionicBind) {
  return {
    restrict: 'E',
    scope: true,
    controller: function() {},
    compile: function(element, attr) {
      element.addClass('scroll-view ionic-scroll');

      //We cannot transclude here because it breaks element.data() inheritance on compile
      var innerElement = jqLite('<div class="scroll"></div>');
      innerElement.append(element.contents());
      element.append(innerElement);

      return { pre: prelink };
      function prelink($scope, $element, $attr) {
        var scrollView, scrollCtrl;

        $ionicBind($scope, $attr, {
          direction: '@',
          paging: '@',
          $onScroll: '&onScroll',
          scroll: '@',
          scrollbarX: '@',
          scrollbarY: '@',
          zooming: '@',
          minZoom: '@',
          maxZoom: '@'
        });
        $scope.direction = $scope.direction || 'y';

        if (angular.isDefined($attr.padding)) {
          $scope.$watch($attr.padding, function(newVal) {
            innerElement.toggleClass('padding', !!newVal);
          });
        }
        if($scope.$eval($scope.paging) === true) {
          innerElement.addClass('scroll-paging');
        }

        if(!$scope.direction) { $scope.direction = 'y'; }
        var isPaging = $scope.$eval($scope.paging) === true;

        var scrollViewOptions= {
          el: $element[0],
          delegateHandle: $attr.delegateHandle,
          bouncing: $scope.$eval($attr.hasBouncing),
          paging: isPaging,
          scrollbarX: $scope.$eval($scope.scrollbarX) !== false,
          scrollbarY: $scope.$eval($scope.scrollbarY) !== false,
          scrollingX: $scope.direction.indexOf('x') >= 0,
          scrollingY: $scope.direction.indexOf('y') >= 0,
          zooming: $scope.$eval($scope.zooming) === true,
          maxZoom: $scope.$eval($scope.maxZoom) || 3,
          minZoom: $scope.$eval($scope.minZoom) || 0.5
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

/**
 * @ngdoc directive
 * @name ionSideMenu
 * @module ionic
 * @restrict E
 * @parent ionic.directive:ionSideMenus
 *
 * @description
 * A container for a side menu, sibling to an {@link ionic.directive:ionSideMenuContent} directive.
 *
 * @usage
 * ```html
 * <ion-side-menu
 *   side="left"
 *   width="myWidthValue + 20"
 *   is-enabled="shouldLeftSideMenuBeEnabled()">
 * </ion-side-menu>
 * ```
 * For a complete side menu example, see the
 * {@link ionic.directive:ionSideMenus} documentation.
 *
 * @param {string} side Which side the side menu is currently on.  Allowed values: 'left' or 'right'.
 * @param {boolean=} is-enabled Whether this side menu is enabled.
 * @param {number=} width How many pixels wide the side menu should be.  Defaults to 275.
 */
IonicModule
.directive('ionSideMenu', function() {
  return {
    restrict: 'E',
    require: '^ionSideMenus',
    scope: true,
    compile: function(element, attr) {
      angular.isUndefined(attr.isEnabled) && attr.$set('isEnabled', 'true');
      angular.isUndefined(attr.width) && attr.$set('width', '275');

      element.addClass('menu menu-' + attr.side);

      return function($scope, $element, $attr, sideMenuCtrl) {
        $scope.side = $attr.side || 'left';

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
      };
    }
  };
});


/**
 * @ngdoc directive
 * @name ionSideMenuContent
 * @module ionic
 * @restrict E
 * @parent ionic.directive:ionSideMenus
 *
 * @description
 * A container for the main visible content, sibling to one or more
 * {@link ionic.directive:ionSideMenu} directives.
 *
 * @usage
 * ```html
 * <ion-side-menu-content
 *   edge-drag-threshold="true"
 *   drag-content="true">
 * </ion-side-menu-content>
 * ```
 * For a complete side menu example, see the
 * {@link ionic.directive:ionSideMenus} documentation.
 *
 * @param {boolean=} drag-content Whether the content can be dragged. Default true.
 * @param {boolean|number=} edge-drag-threshold Whether the content drag can only start if it is below a certain threshold distance from the edge of the screen.  Default false. Accepts three types of values:
   *  - If a non-zero number is given, that many pixels is used as the maximum allowed distance from the edge that starts dragging the side menu.
   *  - If true is given, the default number of pixels (25) is used as the maximum allowed distance.
   *  - If false or 0 is given, the edge drag threshold is disabled, and dragging from anywhere on the content is allowed.
 *
 */
IonicModule
.directive('ionSideMenuContent', [
  '$timeout',
  '$ionicGesture',
function($timeout, $ionicGesture) {

  return {
    restrict: 'EA', //DEPRECATED 'A'
    require: '^ionSideMenus',
    scope: true,
    compile: function(element, attr) {
      return { pre: prelink };
      function prelink($scope, $element, $attr, sideMenuCtrl) {

        $element.addClass('menu-content pane');

        if (isDefined(attr.dragContent)) {
          $scope.$watch(attr.dragContent, function(value) {
            sideMenuCtrl.canDragContent(value);
          });
        } else {
          sideMenuCtrl.canDragContent(true);
        }

        if (isDefined(attr.edgeDragThreshold)) {
          $scope.$watch(attr.edgeDragThreshold, function(value) {
            sideMenuCtrl.edgeDragThreshold(value);
          });
         }

        var defaultPrevented = false;
        var isDragging = false;

        // Listen for taps on the content to close the menu
        function contentTap(e) {
          if(sideMenuCtrl.getOpenAmount() !== 0) {
            sideMenuCtrl.close();
            e.gesture.srcEvent.preventDefault();
          }
        }
        ionic.on('tap', contentTap, $element[0]);

        var dragFn = function(e) {
          if(defaultPrevented || !sideMenuCtrl.isDraggableTarget(e)) return;
          isDragging = true;
          sideMenuCtrl._handleDrag(e);
          e.gesture.srcEvent.preventDefault();
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
          element: element[0],
          onDrag: function(e) {},
          endDrag: function(e) {},
          getTranslateX: function() {
            return $scope.sideMenuContentTranslateX || 0;
          },
          setTranslateX: ionic.animationFrameThrottle(function(amount) {
            $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(' + amount + 'px, 0, 0)';
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
          ionic.off('tap', contentTap, $element[0]);
        });
      }
    }
  };
}]);

IonicModule

/**
 * @ngdoc directive
 * @name ionSideMenus
 * @module ionic
 * @delegate ionic.service:$ionicSideMenuDelegate
 * @restrict E
 *
 * @description
 * A container element for side menu(s) and the main content. Allows the left
 * and/or right side menu to be toggled by dragging the main content area side
 * to side.
 *
 * ![Side Menu](http://ionicframework.com.s3.amazonaws.com/docs/controllers/sidemenu.gif)
 *
 * For more information on side menus, check out the documenation for
 * {@link ionic.directive:ionSideMenuContent} and
 * {@link ionic.directive:ionSideMenu}.
 *
 * @usage
 * To use side menus, add an `<ion-side-menus>` parent element,
 * an `<ion-side-menu-content>` for the center content,
 * and one or more `<ion-side-menu>` directives.
 *
 * ```html
 * <ion-side-menus>
 *   <!-- Center content -->
 *   <ion-side-menu-content ng-controller="ContentController">
 *   </ion-side-menu-content>
 *
 *   <!-- Left menu -->
 *   <ion-side-menu side="left">
 *   </ion-side-menu>
 *
 *   <!-- Right menu -->
 *   <ion-side-menu side="right">
 *   </ion-side-menu>
 * </ion-side-menus>
 * ```
 * ```js
 * function ContentController($scope, $ionicSideMenuDelegate) {
 *   $scope.toggleLeft = function() {
 *     $ionicSideMenuDelegate.toggleLeft();
 *   };
 * }
 * ```
 *
 * @param {string=} delegate-handle The handle used to identify this side menu
 * with {@link ionic.service:$ionicSideMenuDelegate}.
 *
 */
.directive('ionSideMenus', [function() {
  return {
    restrict: 'ECA',
    controller: '$ionicSideMenus',
    compile: function(element, attr) {
      attr.$set('class', (attr['class'] || '') + ' view');
    }
  };
}]);


/**
 * @ngdoc directive
 * @name ionSlideBox
 * @module ionic
 * @delegate ionic.service:$ionicSlideBoxDelegate
 * @restrict E
 * @description
 * The Slide Box is a multi-page container where each page can be swiped or dragged between:
 *
 * ![SlideBox](http://ionicframework.com.s3.amazonaws.com/docs/controllers/slideBox.gif)
 *
 * @usage
 * ```html
 * <ion-slide-box on-slide-changed="slideHasChanged($index)">
 *   <ion-slide>
 *     <div class="box blue"><h1>BLUE</h1></div>
 *   </ion-slide>
 *   <ion-slide>
 *     <div class="box yellow"><h1>YELLOW</h1></div>
 *   </ion-slide>
 *   <ion-slide>
 *     <div class="box pink"><h1>PINK</h1></div>
 *   </ion-slide>
 * </ion-slide-box>
 * ```
 *
 * @param {string=} delegate-handle The handle used to identify this slideBox
 * with {@link ionic.service:$ionicSlideBoxDelegate}.
 * @param {boolean=} does-continue Whether the slide box should loop.
 * @param {boolean=} auto-play Whether the slide box should automatically slide. Default true if does-continue is true.
 * @param {number=} slide-interval How many milliseconds to wait to change slides (if does-continue is true). Defaults to 4000.
 * @param {boolean=} show-pager Whether a pager should be shown for this slide box.
 * @param {expression=} pager-click Expression to call when a pager is clicked (if show-pager is true). Is passed the 'index' variable.
 * @param {expression=} on-slide-changed Expression called whenever the slide is changed.  Is passed an '$index' variable.
 * @param {expression=} active-slide Model to bind the current slide to.
 */
IonicModule
.directive('ionSlideBox', [
  '$timeout',
  '$compile',
  '$ionicSlideBoxDelegate',
function($timeout, $compile, $ionicSlideBoxDelegate) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      autoPlay: '=',
      doesContinue: '@',
      slideInterval: '@',
      showPager: '@',
      pagerClick: '&',
      disableScroll: '@',
      onSlideChanged: '&',
      activeSlide: '=?'
    },
    controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
      var _this = this;

      var continuous = $scope.$eval($scope.doesContinue) === true;
      var shouldAutoPlay = isDefined($attrs.autoPlay) ? !!$scope.autoPlay : false;
      var slideInterval = shouldAutoPlay ? $scope.$eval($scope.slideInterval) || 4000 : 0;

      var slider = new ionic.views.Slider({
        el: $element[0],
        auto: slideInterval,
        continuous: continuous,
        startSlide: $scope.activeSlide,
        slidesChanged: function() {
          $scope.currentSlide = slider.currentIndex();

          // Try to trigger a digest
          $timeout(function() {});
        },
        callback: function(slideIndex) {
          $scope.currentSlide = slideIndex;
          $scope.onSlideChanged({ index: $scope.currentSlide, $index: $scope.currentSlide});
          $scope.$parent.$broadcast('slideBox.slideChanged', slideIndex);
          $scope.activeSlide = slideIndex;
          // Try to trigger a digest
          $timeout(function() {});
        }
      });

      slider.enableSlide($scope.$eval($attrs.disableScroll) !== true);

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

      //Exposed for testing
      this.__slider = slider;

      var deregisterInstance = $ionicSlideBoxDelegate._registerInstance(slider, $attrs.delegateHandle);
      $scope.$on('$destroy', deregisterInstance);

      this.slidesCount = function() {
        return slider.slidesCount();
      };

      this.onPagerClick = function(index) {
        void 0;
        $scope.pagerClick({index: index});
      };

      $timeout(function() {
        slider.load();
      });
    }],
    template: '<div class="slider">' +
      '<div class="slider-slides" ng-transclude>' +
      '</div>' +
    '</div>',

    link: function($scope, $element, $attr, slideBoxCtrl) {
      // If the pager should show, append it to the slide box
      if($scope.$eval($scope.showPager) !== false) {
        var childScope = $scope.$new();
        var pager = jqLite('<ion-pager></ion-pager>');
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
      return function($scope, $element, $attr) {
      };
    },
  };
})

.directive('ionPager', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^ionSlideBox',
    template: '<div class="slider-pager"><span class="slider-pager-page" ng-repeat="slide in numSlides() track by $index" ng-class="{active: $index == currentSlide}" ng-click="pagerClick($index)"><i class="icon ion-record"></i></span></div>',
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

      $scope.pagerClick = function(index) {
        slideBox.onPagerClick(index);
      };

      $scope.numSlides = function() {
        return new Array(slideBox.slidesCount());
      };

      $scope.$watch('currentSlide', function(v) {
        selectPage(v);
      });
    }
  };

});

IonicModule.constant('$ionicTabConfig', {
  type: ''
});

/**
 * @ngdoc directive
 * @name ionTab
 * @module ionic
 * @restrict E
 * @parent ionic.directive:ionTabs
 *
 * @description
 * Contains a tab's content.  The content only exists while the given tab is selected.
 *
 * Each ionTab has its own view history.
 *
 * @usage
 * ```html
 * <ion-tab
 *   title="Tab!"
 *   icon="my-icon"
 *   href="#/tab/tab-link"
 *   on-select="onTabSelected()"
 *   on-deselect="onTabDeselected()">
 * </ion-tab>
 * ```
 * For a complete, working tab bar example, see the {@link ionic.directive:ionTabs} documentation.
 *
 * @param {string} title The title of the tab.
 * @param {string=} href The link that this tab will navigate to when tapped.
 * @param {string=} icon The icon of the tab. If given, this will become the default for icon-on and icon-off.
 * @param {string=} icon-on The icon of the tab while it is selected.
 * @param {string=} icon-off The icon of the tab while it is not selected.
 * @param {expression=} badge The badge to put on this tab (usually a number).
 * @param {expression=} badge-style The style of badge to put on this tab (eg tabs-positive).
 * @param {expression=} on-select Called when this tab is selected.
 * @param {expression=} on-deselect Called when this tab is deselected.
 * @param {expression=} ng-click By default, the tab will be selected on click. If ngClick is set, it will not.  You can explicitly switch tabs using {@link ionic.service:$ionicTabsDelegate#select $ionicTabsDelegate.select()}.
 */
IonicModule
.directive('ionTab', [
  '$rootScope',
  '$animate',
  '$ionicBind',
  '$compile',
function($rootScope, $animate, $ionicBind, $compile) {

  //Returns ' key="value"' if value exists
  function attrStr(k,v) {
    return angular.isDefined(v) ? ' ' + k + '="' + v + '"' : '';
  }
  return {
    restrict: 'E',
    require: ['^ionTabs', 'ionTab'],
    replace: true,
    controller: '$ionicTab',
    scope: true,
    compile: function(element, attr) {

      //We create the tabNavTemplate in the compile phase so that the
      //attributes we pass down won't be interpolated yet - we want
      //to pass down the 'raw' versions of the attributes
      var tabNavTemplate = '<ion-tab-nav' +
        attrStr('ng-click', attr.ngClick) +
        attrStr('title', attr.title) +
        attrStr('icon', attr.icon) +
        attrStr('icon-on', attr.iconOn) +
        attrStr('icon-off', attr.iconOff) +
        attrStr('badge', attr.badge) +
        attrStr('badge-style', attr.badgeStyle) +
        attrStr('hidden', attr.hidden) +
        attrStr('class', attr['class']) +
        '></ion-tab-nav>';

      //Remove the contents of the element so we can compile them later, if tab is selected
      //We don't use regular transclusion because it breaks element inheritance
      var tabContent = jqLite('<div class="pane">')
        .append( element.contents().remove() );

      return function link($scope, $element, $attr, ctrls) {
        var childScope;
        var childElement;
        var tabsCtrl = ctrls[0];
        var tabCtrl = ctrls[1];

        var navView = tabContent[0].querySelector('ion-nav-view') ||
          tabContent[0].querySelector('data-ion-nav-view');
        var navViewName = navView && navView.getAttribute('name');

        $ionicBind($scope, $attr, {
          animate: '=',
          onSelect: '&',
          onDeselect: '&',
          title: '@',
          uiSref: '@',
          href: '@',
        });

        tabsCtrl.add($scope);
        $scope.$on('$destroy', function() {
          tabsCtrl.remove($scope);
          tabNavElement.isolateScope().$destroy();
          tabNavElement.remove();
        });

        //Remove title attribute so browser-tooltip does not apear
        $element[0].removeAttribute('title');

        if (navViewName) {
          tabCtrl.navViewName = navViewName;
        }
        $scope.$on('$stateChangeSuccess', selectIfMatchesState);
        selectIfMatchesState();
        function selectIfMatchesState() {
          if (tabCtrl.tabMatchesState()) {
            tabsCtrl.select($scope);
          }
        }

        var tabNavElement = jqLite(tabNavTemplate);
        tabNavElement.data('$ionTabsController', tabsCtrl);
        tabNavElement.data('$ionTabController', tabCtrl);
        tabsCtrl.$tabsElement.append($compile(tabNavElement)($scope));

        $scope.$watch('$tabSelected', function(value) {
          childScope && childScope.$destroy();
          childScope = null;
          childElement && $animate.leave(childElement);
          childElement = null;
          if (value) {
            childScope = $scope.$new();
            childElement = tabContent.clone();
            $animate.enter(childElement, tabsCtrl.$element);
            $compile(childElement)(childScope);
          }
        });

      };
    }
  };
}]);

IonicModule
.directive('ionTabNav', [function() {
  return {
    restrict: 'E',
    replace: true,
    require: ['^ionTabs', '^ionTab'],
    template:
    '<a ng-class="{\'tab-item-active\': isTabActive(), \'has-badge\':badge, \'tab-hidden\':isHidden()}" ' +
      ' class="tab-item">' +
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
      hidden: '@',
      badgeStyle: '@',
      'class': '@'
    },
    compile: function(element, attr, transclude) {
      return function link($scope, $element, $attrs, ctrls) {
        var tabsCtrl = ctrls[0],
          tabCtrl = ctrls[1];

        //Remove title attribute so browser-tooltip does not apear
        $element[0].removeAttribute('title');

        $scope.selectTab = function(e) {
          e.preventDefault();
          tabsCtrl.select(tabCtrl.$scope, true);
        };
        if (!$attrs.ngClick) {
          $element.on('click', function(event) {
            $scope.$apply(function() {
              $scope.selectTab(event);
            });
          });
        }

        $scope.isHidden = function() {
          if($attrs.hidden === 'true' || $attrs.hidden === true)return true;
          return false;
        };

        $scope.getIconOn = function() {
          return $scope.iconOn || $scope.icon;
        };
        $scope.getIconOff = function() {
          return $scope.iconOff || $scope.icon;
        };

        $scope.isTabActive = function() {
          return tabsCtrl.selectedTab() === tabCtrl.$scope;
        };
      };
    }
  };
}]);

IonicModule.constant('$ionicTabsConfig', {
  position: '',
  type: ''
});

/**
 * @ngdoc directive
 * @name ionTabs
 * @module ionic
 * @delegate ionic.service:$ionicTabsDelegate
 * @restrict E
 * @codepen KbrzJ
 *
 * @description
 * Powers a multi-tabbed interface with a Tab Bar and a set of "pages" that can be tabbed
 * through.
 *
 * Assign any [tabs class](/docs/components#tabs) or
 * [animation class](/docs/components#animation) to the element to define
 * its look and feel.
 *
 * See the {@link ionic.directive:ionTab} directive's documentation for more details on
 * individual tabs.
 *
 * Note: do not place ion-tabs inside of an ion-content element; it has been known to cause a
 * certain CSS bug.
 *
 * @usage
 * ```html
 * <ion-tabs class="tabs-positive tabs-icon-only">
 *
 *   <ion-tab title="Home" icon-on="ion-ios7-filing" icon-off="ion-ios7-filing-outline">
 *     <!-- Tab 1 content -->
 *   </ion-tab>
 *
 *   <ion-tab title="About" icon-on="ion-ios7-clock" icon-off="ion-ios7-clock-outline">
 *     <!-- Tab 2 content -->
 *   </ion-tab>
 *
 *   <ion-tab title="Settings" icon-on="ion-ios7-gear" icon-off="ion-ios7-gear-outline">
 *     <!-- Tab 3 content -->
 *   </ion-tab>
 *
 * </ion-tabs>
 * ```
 *
 * @param {string=} delegate-handle The handle used to identify these tabs
 * with {@link ionic.service:$ionicTabsDelegate}.
 */

IonicModule
.directive('ionTabs', [
  '$ionicViewService', 
  '$ionicTabsDelegate', 
  '$ionicTabsConfig', 
function($ionicViewService, $ionicTabsDelegate, $ionicTabsConfig) {
  return {
    restrict: 'E',
    scope: true,
    controller: '$ionicTabs',
    compile: function(element, attr) {
      element.addClass('view');
      //We cannot use regular transclude here because it breaks element.data()
      //inheritance on compile
      var innerElement = jqLite('<div class="tabs"></div>');
      innerElement.append(element.contents());
      element.append(innerElement);
      element.addClass($ionicTabsConfig.position);
      element.addClass($ionicTabsConfig.type);

      return { pre: prelink };
      function prelink($scope, $element, $attr, tabsCtrl) {
        var deregisterInstance = $ionicTabsDelegate._registerInstance(
          tabsCtrl, $attr.delegateHandle
        );

        $scope.$on('$destroy', deregisterInstance);

        tabsCtrl.$scope = $scope;
        tabsCtrl.$element = $element;
        tabsCtrl.$tabsElement = jqLite($element[0].querySelector('.tabs'));

        var el = $element[0];
        $scope.$watch(function() { return el.className; }, function(value) {
          var isTabsTop = value.indexOf('tabs-top') !== -1;
          var isHidden = value.indexOf('tabs-item-hide') !== -1;
          $scope.$hasTabs = !isTabsTop && !isHidden;
          $scope.$hasTabsTop = isTabsTop && !isHidden;
        });
        $scope.$on('$destroy', function() {
          delete $scope.$hasTabs;
          delete $scope.$hasTabsTop;
        });
      }
    }
  };
}]);

/**
 * @ngdoc directive
 * @name ionToggle
 * @module ionic
 * @codepen tfAzj
 * @restrict E
 *
 * @description
 * A toggle is an animated switch which binds a given model to a boolean.
 *
 * Allows dragging of the switch's nub.
 *
 * The toggle behaves like any [AngularJS checkbox](http://docs.angularjs.org/api/ng/input/input[checkbox]) otherwise.
 *
 * @param toggle-class {string=} Sets the CSS class on the inner `label.toggle` element created by the directive.
 *
 * @usage
 * Below is an example of a toggle directive which is wired up to the `airplaneMode` model
 * and has the `toggle-calm` CSS class assigned to the inner element.
 *
 * ```html
 * <ion-toggle ng-model="airplaneMode" toggle-class="toggle-calm">Airplane Mode</ion-toggle>
 * ```
 */
IonicModule
.directive('ionToggle', [
  '$ionicGesture',
  '$timeout',
function($ionicGesture, $timeout) {

  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    transclude: true,
    template:
      '<div class="item item-toggle">' +
        '<div ng-transclude></div>' +
        '<label class="toggle">' +
          '<input type="checkbox">' +
          '<div class="track">' +
            '<div class="handle"></div>' +
          '</div>' +
        '</label>' +
      '</div>',

    compile: function(element, attr) {
      var input = element.find('input');
      forEach({
        'name': attr.name,
        'ng-value': attr.ngValue,
        'ng-model': attr.ngModel,
        'ng-checked': attr.ngChecked,
        'ng-disabled': attr.ngDisabled,
        'ng-true-value': attr.ngTrueValue,
        'ng-false-value': attr.ngFalseValue,
        'ng-change': attr.ngChange
      }, function(value, name) {
        if (isDefined(value)) {
          input.attr(name, value);
        }
      });

      return function($scope, $element, $attr) {
         var el, checkbox, track, handle;

         el = $element[0].getElementsByTagName('label')[0];
         checkbox = el.children[0];
         track = el.children[1];
         handle = track.children[0];

         var ngModelController = jqLite(checkbox).controller('ngModel');

         $scope.toggle = new ionic.views.Toggle({
           el: el,
           track: track,
           checkbox: checkbox,
           handle: handle,
           onChange: function() {
             if(checkbox.checked) {
               ngModelController.$setViewValue(true);
             } else {
               ngModelController.$setViewValue(false);
             }
             $scope.$apply();
           }
         });

         $scope.$on('$destroy', function() {
           $scope.toggle.destroy();
         });
      };
    }

  };
}]);

/**
 * @ngdoc directive
 * @name ionView
 * @module ionic
 * @restrict E
 * @parent ionNavView
 *
 * @description
 * A container for content, used to tell a parent {@link ionic.directive:ionNavBar}
 * about the current view.
 *
 * @usage
 * Below is an example where our page will load with a navbar containing "My Page" as the title.
 *
 * ```html
 * <ion-nav-bar></ion-nav-bar>
 * <ion-nav-view class="slide-left-right">
 *   <ion-view title="My Page">
 *     <ion-content>
 *       Hello!
 *     </ion-content>
 *   </ion-view>
 * </ion-nav-view>
 * ```
 *
 * @param {string=} title The title to display on the parent {@link ionic.directive:ionNavBar}.
 * @param {boolean=} hide-back-button Whether to hide the back button on the parent
 * {@link ionic.directive:ionNavBar} by default.
 * @param {boolean=} hide-nav-bar Whether to hide the parent
 * {@link ionic.directive:ionNavBar} by default.
 */
IonicModule
.directive('ionView', ['$ionicViewService', '$rootScope', '$animate',
           function( $ionicViewService,   $rootScope,   $animate) {
  return {
    restrict: 'EA',
    priority: 1000,
    require: ['^?ionNavBar', '^?ionModal'],
    compile: function(tElement, tAttrs, transclude) {
      tElement.addClass('pane');
      tElement[0].removeAttribute('title');

      return function link($scope, $element, $attr, ctrls) {
        var navBarCtrl = ctrls[0];
        var modalCtrl = ctrls[1];

        //Don't use the ionView if we're inside a modal or there's no navbar
        if (!navBarCtrl || modalCtrl) {
          return;
        }

        if (angular.isDefined($attr.title)) {

          var initialTitle = $attr.title;
          navBarCtrl.changeTitle(initialTitle, $scope.$navDirection);

          // watch for changes in the title, don't set initial value as changeTitle does that
          $attr.$observe('title', function(val, oldVal) {
            navBarCtrl.setTitle(val);
          });
        }

        var hideBackAttr = angular.isDefined($attr.hideBackButton) ?
          $attr.hideBackButton :
          'false';
        $scope.$watch(hideBackAttr, function(value) {
          // Should we hide a back button when this tab is shown
          navBarCtrl.showBackButton(!value);
        });

        var hideNavAttr = angular.isDefined($attr.hideNavBar) ?
          $attr.hideNavBar :
          'false';
        $scope.$watch(hideNavAttr, function(value) {
          // Should the nav bar be hidden for this view or not?
          navBarCtrl.showBar(!value);
        });

      };
    }
  };
}]);

})();