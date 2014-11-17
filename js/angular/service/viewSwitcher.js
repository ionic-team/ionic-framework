/**
 * @private
 * TODO document
 */

IonicModule
.factory('$ionicViewSwitcher',[
  '$timeout',
  '$compile',
  '$controller',
  '$document',
  '$ionicClickBlock',
  '$ionicConfig',
  '$ionicNavBarDelegate',
function($timeout, $compile, $controller, $document, $ionicClickBlock, $ionicConfig, $ionicNavBarDelegate) {

  var TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
  var DATA_NO_CACHE = '$noCache';
  var DATA_DESTROY_ELE = '$destroyEle';
  var DATA_ELE_IDENTIFIER = '$eleId';
  var DATA_ACTIVE_ELE_IDENTIFIER = '$activeEleId';
  var DATA_VIEW_ACCESSED = '$accessed';
  var DATA_FALLBACK_TIMER = '$fallbackTimer';
  var NAV_VIEW_ATTR = 'nav-view';
  var HISTORY_CURSOR_ATTR = 'history-cursor';
  var HISTORY_ROOT = 'root';
  var HISTORY_AFTER_ROOT = 'after-root';
  var VIEW_STATUS_ACTIVE = 'active';
  var VIEW_STATUS_CACHED = 'cached';
  var VIEW_STATUS_STAGED = 'stage';

  var transitionCounter = 0;
  var nextTransition, nextDirection;
  ionic.transition = ionic.transition || {};
  ionic.transition.isActive = false;
  var isActiveTimer;
  var cachedAttr = ionic.DomUtil.cachedAttr;

  function getViewElementIdentifier(locals, view) {
    if (viewState(locals).abstract) return viewState(locals).name;
    if (view) return view.stateId || view.viewId;
    return ionic.Utils.nextUid();
  }

  function viewState(locals) {
    return locals && locals.$$state && locals.$$state.self || {};
  }

  function getTransitionData(viewLocals, enteringEle, direction, showBack, view) {
    // Priority
    // 1) attribute directive on the button/link to this view
    // 2) entering element's attribute
    // 3) entering view's $state config property
    // 4) view registration data
    // 5) global config
    // 6) fallback value

    var state = viewState(viewLocals);
    var transition = nextTransition || cachedAttr(enteringEle, 'view-transition') || state.viewTransition || $ionicConfig.views.transition() || 'ios';
    direction = nextDirection || cachedAttr(enteringEle, 'view-direction') || state.viewDirection || direction || 'none';

    return extend(getViewData(view), {
      transition: transition,
      direction: direction,
      shouldAnimate: (transition !== 'none' && direction !== 'none'),
      showBack: !!showBack
    });
  }

  function getViewData(view) {
    view = view || {};
    return {
      viewId: view.viewId,
      stateId: view.stateId,
      stateName: view.stateName,
      stateParams: view.stateParams
    };
  }

  function navViewAttr(ele, value) {
    cachedAttr(ele, NAV_VIEW_ATTR, value);
  }

  function historyCursorAttr(ele, value) {
    cachedAttr(ele, HISTORY_CURSOR_ATTR, value);
  }

  function destroyViewEle(ele) {
    // we found an element that should be removed
    // destroy its scope, then remove the element
    if (ele) {
      var viewScope = ele.scope();
      viewScope && viewScope.$destroy();
      ele.remove();
    }
  }


  var ionicViewSwitcher = {

    create: function(navViewScope, navViewElement, viewLocals, enteringView, leavingView) {
      // get a reference to an entering/leaving element if they exist
      // loop through to see if the view is already in the navViewElement
      var enteringEle, leavingEle;
      var transitionId = ++transitionCounter;
      var alreadyInDom;

      var switcher = {

        init: function(registerData, callback) {
          ionicViewSwitcher.isTransitioning(true);

          $ionicClickBlock.show();
          switcher.loadViewElements(registerData);

          switcher.render(registerData, function() {
            callback && callback();
          });
        },

        loadViewElements: function(registerData) {
          var viewEle, viewElements = navViewElement.children();
          var enteringEleIdentifier = getViewElementIdentifier(viewLocals, enteringView);
          var navViewActiveEleId = navViewElement.data(DATA_ACTIVE_ELE_IDENTIFIER);

          for (var x=0, l=viewElements.length; x < l; x++) {
            viewEle = viewElements.eq(x);

            if (viewEle.data(DATA_ELE_IDENTIFIER) === enteringEleIdentifier) {
              // we found an existing element in the DOM that should be entering the view
              if (viewEle.data(DATA_NO_CACHE)) {
                // the existing element should not be cached, don't use it
                viewEle.data(DATA_ELE_IDENTIFIER, enteringEleIdentifier + ionic.Utils.nextUid());
                viewEle.data(DATA_DESTROY_ELE, true);

              } else {
                enteringEle = viewEle;
              }

            } else if (viewEle.data(DATA_ELE_IDENTIFIER) === navViewActiveEleId) {
              leavingEle = viewEle;
            }

            if (enteringEle && leavingEle) break;
          }

          alreadyInDom = !!enteringEle;

          if (!alreadyInDom) {
            // still no existing element to use
            // create it using existing template/scope/locals
            enteringEle = registerData.ele || ionicViewSwitcher.createViewEle(viewLocals);

            // existing elements in the DOM are looked up by their state name and state id
            enteringEle.data(DATA_ELE_IDENTIFIER, enteringEleIdentifier);
          }

          navViewElement.data(DATA_ACTIVE_ELE_IDENTIFIER, enteringEleIdentifier);

          registerData.ele = null;
        },

        render: function(registerData, callback) {
          if (alreadyInDom) {
            // it was already found in the dom, just reconnect the scope
            ionic.Utils.reconnectScope(enteringEle.scope());

          } else {
            // the entering element is not already in the DOM
            // hasn't been compiled and isn't linked up yet

            // compile the entering element and get the link function
            var link = $compile(enteringEle);

            navViewAttr(enteringEle, VIEW_STATUS_STAGED);

            historyCursorAttr(enteringEle, registerData.isHistoryRoot ? HISTORY_ROOT : HISTORY_AFTER_ROOT);

            // if the current state has cache:false
            // or the element has cache-view="false" attribute
            if (viewState(viewLocals).cache === false || enteringEle.attr('cache-view') == 'false') {
              enteringEle.data(DATA_NO_CACHE, true);
            }

            // append the entering element to the DOM
            navViewElement.append(enteringEle);

            // create a new scope for the entering element
            var scope = navViewScope.$new();

            // if it's got a controller then spin it all up
            if (viewLocals.$$controller) {
              viewLocals.$scope = scope;
              var controller = $controller(viewLocals.$$controller, viewLocals);
              navViewElement.children().data('$ngControllerController', controller);
            }

            // run link with the view's scope
            link(scope);

            scope.$emit('$ionicView.loaded', enteringView);
          }

          // update that this view was just accessed
          enteringEle.data(DATA_VIEW_ACCESSED, Date.now());

          $timeout(callback, 16);
        },

        transition: function(direction, showBack) {
          var enteringData = getTransitionData(viewLocals, enteringEle, direction, showBack, enteringView);
          var leavingData = extend(extend({}, enteringData), getViewData(leavingView));
          enteringData.transitionId = leavingData.transitionId = transitionId;

          cachedAttr(enteringEle.parent(), 'nav-view-transition', enteringData.transition);
          cachedAttr(enteringEle.parent(), 'nav-view-direction', enteringData.direction);

          // cancel any previous transition complete fallbacks
          $timeout.cancel(enteringEle.data(DATA_FALLBACK_TIMER));

          switcher.emit('before', enteringData, leavingData);

          // 1) get the transition ready and see if it'll animate
          var transitionFn = $ionicConfig.transitions.views[$ionicConfig.views.transition()];
          var viewTransition = transitionFn(enteringEle, leavingEle, direction, enteringData.shouldAnimate);

          if (viewTransition.shouldAnimate) {
            // 2) attach transitionend events (and fallback timer)
            enteringEle.on(TRANSITIONEND_EVENT, transitionComplete);
            leavingEle && leavingEle.on(TRANSITIONEND_EVENT, transitionComplete);
            enteringEle.data(DATA_FALLBACK_TIMER, $timeout(transitionComplete, 750));
          }

          // 3) stage entering element, opacity 0, no transition duration
          navViewAttr(enteringEle, VIEW_STATUS_STAGED);

          if (enteringData.direction == 'swap') {
            historyCursorAttr(enteringEle, HISTORY_ROOT);
          }

          // 4) place the elements in the correct step to begin
          viewTransition.run(0);

          // 5) wait a frame so the styles apply
          $timeout(onReflow, 16);

          function onReflow() {
            // 6) remove that we're staging the entering element so it can transition
            navViewAttr(enteringEle, viewTransition.shouldAnimate ? 'entering' : VIEW_STATUS_ACTIVE);
            navViewAttr(leavingEle, viewTransition.shouldAnimate ? 'leaving' : VIEW_STATUS_CACHED);

            // 7) start the transition
            viewTransition.run(1);

            for (var x = 0; x < $ionicNavBarDelegate._instances.length; x++) {
              $ionicNavBarDelegate._instances[x].triggerTransitionStart(transitionId);
            }

            if (!viewTransition.shouldAnimate) {
              // no animated transition
              transitionComplete();
            }
          }

          function transitionComplete() {
            if (transitionComplete.x) return;
            transitionComplete.x = true;

            enteringEle.off(TRANSITIONEND_EVENT, transitionComplete);
            leavingEle && leavingEle.off(TRANSITIONEND_EVENT, transitionComplete);
            $timeout.cancel(enteringEle.data(DATA_FALLBACK_TIMER));

            switcher.emit('after', enteringData, leavingData);

            // 8) fire off that the entire transition has completed
            // only the most recent transition should do cleanup
            if (transitionId === transitionCounter) {
              ionicViewSwitcher.setActiveView(navViewElement);
              switcher.cleanup(enteringData);
              ionicViewSwitcher.isTransitioning(false);
              $ionicClickBlock.hide();
            }

            for (var x = 0; x < $ionicNavBarDelegate._instances.length; x++) {
              $ionicNavBarDelegate._instances[x].triggerTransitionEnd();
            }

            // remove any references that could cause memory issues
            nextTransition = nextDirection = enteringView = leavingView = enteringEle = leavingEle = null;
          }

        },

        emit: function(step, enteringData, leavingData) {
          var scope = enteringEle.scope();
          if (scope) {
            scope.$emit('$ionicView.' + step + 'Enter', enteringData);
            if (step == 'after') {
              scope.$emit('$ionicView.enter', enteringData);
            }
          }

          if (leavingEle) {
            scope = leavingEle.scope();
            if (scope) {
              scope.$emit('$ionicView.' + step + 'Leave', leavingData);
              if (step == 'after') {
                scope.$emit('$ionicView.leave', leavingData);
              }
            }
          }
        },

        cleanup: function(transData) {
          // check if any views should be removed
          if (leavingEle && transData.direction == 'back' && !$ionicConfig.views.forwardCache()) {
            // if they just navigated back we can destroy the forward view
            // do not remove forward views if cacheForwardViews config is true
            destroyViewEle(leavingEle);
          }

          var viewElements = navViewElement.children();
          var viewElementsLength = viewElements.length;
          var x, viewElement;
          var removeOldestAccess = (viewElementsLength - 1) > $ionicConfig.views.maxCache();
          var removableEle;
          var oldestAccess = Date.now();

          for (x = 0; x < viewElementsLength; x++) {
            viewElement = viewElements.eq(x);

            if (removeOldestAccess && viewElement.data(DATA_VIEW_ACCESSED) < oldestAccess) {
              // remember what was the oldest element to be accessed so it can be destroyed
              oldestAccess = viewElement.data(DATA_VIEW_ACCESSED);
              removableEle = viewElements.eq(x);

            } else if (viewElement.data(DATA_DESTROY_ELE) && cachedAttr(viewElement) != VIEW_STATUS_ACTIVE) {
              destroyViewEle(viewElement);
            }
          }

          destroyViewEle(removableEle);

          ionic.Utils.disconnectScope(leavingEle && leavingEle.scope());

          if (enteringEle.data(DATA_NO_CACHE)) {
            enteringEle.data(DATA_DESTROY_ELE, true);
          }
        },

        enteringEle: function() { return enteringEle; },
        leavingEle: function() { return leavingEle; }

      };

      return switcher;
    },

    setActiveView: function(navViewElement) {
      var viewElements = navViewElement.children();
      var viewElementsLength = viewElements.length;
      var navViewActiveEleId = navViewElement.data(DATA_ACTIVE_ELE_IDENTIFIER);
      var x, viewElement;
      var isHistoryRoot;

      for (x=0; x < viewElementsLength; x++) {
        viewElement = viewElements.eq(x);

        if (viewElement.data(DATA_ELE_IDENTIFIER) === navViewActiveEleId) {
          navViewAttr(viewElement, VIEW_STATUS_ACTIVE);
          isHistoryRoot = cachedAttr(viewElement, HISTORY_CURSOR_ATTR) === HISTORY_ROOT;

        } else if (cachedAttr(viewElement, NAV_VIEW_ATTR) === 'leaving' ||
                  (cachedAttr(viewElement, NAV_VIEW_ATTR) === VIEW_STATUS_ACTIVE && viewElement.data(DATA_ELE_IDENTIFIER) !== navViewActiveEleId)) {
          navViewAttr(viewElement, VIEW_STATUS_CACHED);
        }
      }

      if (isHistoryRoot) {
        for (x=0; x < viewElementsLength; x++) {
          viewElement = viewElements.eq(x);

          if (cachedAttr(viewElement, HISTORY_CURSOR_ATTR) === HISTORY_ROOT &&
              cachedAttr(viewElement, NAV_VIEW_ATTR) !== VIEW_STATUS_ACTIVE) {
            historyCursorAttr(viewElement, HISTORY_AFTER_ROOT);
          }
        }
      }
    },

    nextTransition: function(val) {
      nextTransition = val;
    },

    nextDirection: function(val) {
      nextDirection = val;
    },

    getTransitionData: getTransitionData,

    viewEleIsActive: function(viewEle, isActiveAttr) {
      navViewAttr(viewEle, isActiveAttr ? VIEW_STATUS_ACTIVE : VIEW_STATUS_CACHED);
    },

    isTransitioning: function(val) {
      if (arguments.length) {
        ionic.transition.isActive = !!val;
        $timeout.cancel(isActiveTimer);
        if (val) {
          isActiveTimer = $timeout(function() {
            ionicViewSwitcher.isTransitioning(false);
          }, 999);
        }
      }
      return ionic.transition.isActive;
    },

    createViewEle: function(viewLocals) {
      var containerEle = $document[0].createElement('div');
      if (viewLocals && viewLocals.$template) {
        containerEle.innerHTML = viewLocals.$template;
        if (containerEle.children.length === 1) {
          containerEle.children[0].classList.add('pane');
          return jqLite(containerEle.children[0]);
        }
      }
      containerEle.className = "pane";
      return jqLite(containerEle);
    }

  };

  return ionicViewSwitcher;

}]);
