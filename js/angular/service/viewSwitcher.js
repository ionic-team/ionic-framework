/**
 * @private
 * TODO document
 */

IonicModule.factory('$ionicViewSwitcher', [
  '$timeout',
  '$document',
  '$q',
  '$ionicClickBlock',
  '$ionicConfig',
  '$ionicNavBarDelegate',
function($timeout, $document, $q, $ionicClickBlock, $ionicConfig, $ionicNavBarDelegate) {

  var TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
  var DATA_NO_CACHE = '$noCache';
  var DATA_DESTROY_ELE = '$destroyEle';
  var DATA_ELE_IDENTIFIER = '$eleId';
  var DATA_VIEW_ACCESSED = '$accessed';
  var DATA_FALLBACK_TIMER = '$fallbackTimer';
  var DATA_VIEW = '$viewData';
  var NAV_VIEW_ATTR = 'nav-view';
  var VIEW_STATUS_ACTIVE = 'active';
  var VIEW_STATUS_CACHED = 'cached';
  var VIEW_STATUS_STAGED = 'stage';

  var transitionCounter = 0;
  var nextTransition, nextDirection;
  ionic.transition = ionic.transition || {};
  ionic.transition.isActive = false;
  var isActiveTimer;
  var cachedAttr = ionic.DomUtil.cachedAttr;
  var transitionPromises = [];
  var defaultTimeout = 1100;

  var ionicViewSwitcher = {

    create: function(navViewCtrl, viewLocals, enteringView, leavingView, renderStart, renderEnd) {
      // get a reference to an entering/leaving element if they exist
      // loop through to see if the view is already in the navViewElement
      var enteringEle, leavingEle;
      var transitionId = ++transitionCounter;
      var alreadyInDom;

      var switcher = {

        init: function(registerData, callback) {
          ionicViewSwitcher.isTransitioning(true);

          switcher.loadViewElements(registerData);

          switcher.render(registerData, function() {
            callback && callback();
          });
        },

        loadViewElements: function(registerData) {
          var x, l, viewEle;
          var viewElements = navViewCtrl.getViewElements();
          var enteringEleIdentifier = getViewElementIdentifier(viewLocals, enteringView);
          var navViewActiveEleId = navViewCtrl.activeEleId();

          for (x = 0, l = viewElements.length; x < l; x++) {
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

            } else if (isDefined(navViewActiveEleId) && viewEle.data(DATA_ELE_IDENTIFIER) === navViewActiveEleId) {
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

          if (renderEnd) {
            navViewCtrl.activeEleId(enteringEleIdentifier);
          }

          registerData.ele = null;
        },

        render: function(registerData, callback) {
          if (alreadyInDom) {
            // it was already found in the DOM, just reconnect the scope
            ionic.Utils.reconnectScope(enteringEle.scope());

          } else {
            // the entering element is not already in the DOM
            // set that the entering element should be "staged" and its
            // styles of where this element will go before it hits the DOM
            navViewAttr(enteringEle, VIEW_STATUS_STAGED);

            var enteringData = getTransitionData(viewLocals, enteringEle, registerData.direction, enteringView);
            var transitionFn = $ionicConfig.transitions.views[enteringData.transition] || $ionicConfig.transitions.views.none;
            transitionFn(enteringEle, null, enteringData.direction, true).run(0);

            enteringEle.data(DATA_VIEW, {
              viewId: enteringData.viewId,
              historyId: enteringData.historyId,
              stateName: enteringData.stateName,
              stateParams: enteringData.stateParams
            });

            // if the current state has cache:false
            // or the element has cache-view="false" attribute
            if (viewState(viewLocals).cache === false || viewState(viewLocals).cache === 'false' ||
                enteringEle.attr('cache-view') == 'false' || $ionicConfig.views.maxCache() === 0) {
              enteringEle.data(DATA_NO_CACHE, true);
            }

            // append the entering element to the DOM, create a new scope and run link
            var viewScope = navViewCtrl.appendViewElement(enteringEle, viewLocals);

            delete enteringData.direction;
            delete enteringData.transition;
            viewScope.$emit('$ionicView.loaded', enteringData);
          }

          // update that this view was just accessed
          enteringEle.data(DATA_VIEW_ACCESSED, Date.now());

          callback && callback();
        },

        transition: function(direction, enableBack, allowAnimate) {
          var deferred;
          var enteringData = getTransitionData(viewLocals, enteringEle, direction, enteringView);
          var leavingData = extend(extend({}, enteringData), getViewData(leavingView));
          enteringData.transitionId = leavingData.transitionId = transitionId;
          enteringData.fromCache = !!alreadyInDom;
          enteringData.enableBack = !!enableBack;
          enteringData.renderStart = renderStart;
          enteringData.renderEnd = renderEnd;

          cachedAttr(enteringEle.parent(), 'nav-view-transition', enteringData.transition);
          cachedAttr(enteringEle.parent(), 'nav-view-direction', enteringData.direction);

          // cancel any previous transition complete fallbacks
          $timeout.cancel(enteringEle.data(DATA_FALLBACK_TIMER));

          // get the transition ready and see if it'll animate
          var transitionFn = $ionicConfig.transitions.views[enteringData.transition] || $ionicConfig.transitions.views.none;
          var viewTransition = transitionFn(enteringEle, leavingEle, enteringData.direction,
                                            enteringData.shouldAnimate && allowAnimate && renderEnd);

          if (viewTransition.shouldAnimate) {
            // attach transitionend events (and fallback timer)
            enteringEle.on(TRANSITIONEND_EVENT, completeOnTransitionEnd);
            enteringEle.data(DATA_FALLBACK_TIMER, $timeout(transitionComplete, defaultTimeout));
            $ionicClickBlock.show(defaultTimeout);
          }

          if (renderStart) {
            // notify the views "before" the transition starts
            switcher.emit('before', enteringData, leavingData);

            // stage entering element, opacity 0, no transition duration
            navViewAttr(enteringEle, VIEW_STATUS_STAGED);

            // render the elements in the correct location for their starting point
            viewTransition.run(0);
          }

          if (renderEnd) {
            // create a promise so we can keep track of when all transitions finish
            // only required if this transition should complete
            deferred = $q.defer();
            transitionPromises.push(deferred.promise);
          }

          if (renderStart && renderEnd) {
            // CSS "auto" transitioned, not manually transitioned
            // wait a frame so the styles apply before auto transitioning
            $timeout(onReflow, 16);

          } else if (!renderEnd) {
            // just the start of a manual transition
            // but it will not render the end of the transition
            navViewAttr(enteringEle, 'entering');
            navViewAttr(leavingEle, 'leaving');

            // return the transition run method so each step can be ran manually
            return {
              run: viewTransition.run,
              cancel: function(shouldAnimate) {
                if (shouldAnimate) {
                  enteringEle.on(TRANSITIONEND_EVENT, cancelOnTransitionEnd);
                  enteringEle.data(DATA_FALLBACK_TIMER, $timeout(cancelTransition, defaultTimeout));
                  $ionicClickBlock.show(defaultTimeout);
                } else {
                  cancelTransition();
                }
                viewTransition.shouldAnimate = shouldAnimate;
                viewTransition.run(0);
                viewTransition = null;
              }
            };

          } else if (renderEnd) {
            // just the end of a manual transition
            // happens after the manual transition has completed
            // and a full history change has happened
            onReflow();
          }


          function onReflow() {
            // remove that we're staging the entering element so it can auto transition
            navViewAttr(enteringEle, viewTransition.shouldAnimate ? 'entering' : VIEW_STATUS_ACTIVE);
            navViewAttr(leavingEle, viewTransition.shouldAnimate ? 'leaving' : VIEW_STATUS_CACHED);

            // start the auto transition and let the CSS take over
            viewTransition.run(1);

            // trigger auto transitions on the associated nav bars
            $ionicNavBarDelegate._instances.forEach(function(instance) {
              instance.triggerTransitionStart(transitionId);
            });

            if (!viewTransition.shouldAnimate) {
              // no animated auto transition
              transitionComplete();
            }
          }

          // Make sure that transitionend events bubbling up from children won't fire
          // transitionComplete. Will only go forward if ev.target == the element listening.
          function completeOnTransitionEnd(ev) {
            if (ev.target !== this) return;
            transitionComplete();
          }
          function transitionComplete() {
            if (transitionComplete.x) return;
            transitionComplete.x = true;

            enteringEle.off(TRANSITIONEND_EVENT, completeOnTransitionEnd);
            $timeout.cancel(enteringEle.data(DATA_FALLBACK_TIMER));
            leavingEle && $timeout.cancel(leavingEle.data(DATA_FALLBACK_TIMER));

            // emit that the views have finished transitioning
            // each parent nav-view will update which views are active and cached
            switcher.emit('after', enteringData, leavingData);

            // resolve that this one transition (there could be many w/ nested views)
            deferred && deferred.resolve(navViewCtrl);

            // the most recent transition added has completed and all the active
            // transition promises should be added to the services array of promises
            if (transitionId === transitionCounter) {
              $q.all(transitionPromises).then(ionicViewSwitcher.transitionEnd);
              switcher.cleanup(enteringData);
            }

            // tell the nav bars that the transition has ended
            $ionicNavBarDelegate._instances.forEach(function(instance) {
              instance.triggerTransitionEnd();
            });

            // remove any references that could cause memory issues
            nextTransition = nextDirection = enteringView = leavingView = enteringEle = leavingEle = null;
          }

          // Make sure that transitionend events bubbling up from children won't fire
          // transitionComplete. Will only go forward if ev.target == the element listening.
          function cancelOnTransitionEnd(ev) {
            if (ev.target !== this) return;
            cancelTransition();
          }
          function cancelTransition() {
            navViewAttr(enteringEle, VIEW_STATUS_CACHED);
            navViewAttr(leavingEle, VIEW_STATUS_ACTIVE);
            enteringEle.off(TRANSITIONEND_EVENT, cancelOnTransitionEnd);
            $timeout.cancel(enteringEle.data(DATA_FALLBACK_TIMER));
            ionicViewSwitcher.transitionEnd([navViewCtrl]);
          }

        },

        emit: function(step, enteringData, leavingData) {
          var enteringScope = enteringEle.scope(),
            leavingScope = leavingEle && leavingEle.scope();

          if (step == 'after') {
            if (enteringScope) {
              enteringScope.$emit('$ionicView.enter', enteringData);
            }

            if (leavingScope) {
              leavingScope.$emit('$ionicView.leave', leavingData);

            } else if (enteringScope && leavingData && leavingData.viewId) {
              enteringScope.$emit('$ionicNavView.leave', leavingData);
            }
          }

          if (enteringScope) {
            enteringScope.$emit('$ionicView.' + step + 'Enter', enteringData);
          }

          if (leavingScope) {
            leavingScope.$emit('$ionicView.' + step + 'Leave', leavingData);

          } else if (enteringScope && leavingData && leavingData.viewId) {
            enteringScope.$emit('$ionicNavView.' + step + 'Leave', leavingData);
          }
        },

        cleanup: function(transData) {
          // check if any views should be removed
          if (leavingEle && transData.direction == 'back' && !$ionicConfig.views.forwardCache()) {
            // if they just navigated back we can destroy the forward view
            // do not remove forward views if cacheForwardViews config is true
            destroyViewEle(leavingEle);
          }

          var viewElements = navViewCtrl.getViewElements();
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

            } else if (viewElement.data(DATA_DESTROY_ELE) && navViewAttr(viewElement) != VIEW_STATUS_ACTIVE) {
              destroyViewEle(viewElement);
            }
          }

          destroyViewEle(removableEle);

          if (enteringEle.data(DATA_NO_CACHE)) {
            enteringEle.data(DATA_DESTROY_ELE, true);
          }
        },

        enteringEle: function() { return enteringEle; },
        leavingEle: function() { return leavingEle; }

      };

      return switcher;
    },

    transitionEnd: function(navViewCtrls) {
      forEach(navViewCtrls, function(navViewCtrl) {
        navViewCtrl.transitionEnd();
      });

      ionicViewSwitcher.isTransitioning(false);
      $ionicClickBlock.hide();
      transitionPromises = [];
    },

    nextTransition: function(val) {
      nextTransition = val;
    },

    nextDirection: function(val) {
      nextDirection = val;
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
    },

    viewEleIsActive: function(viewEle, isActiveAttr) {
      navViewAttr(viewEle, isActiveAttr ? VIEW_STATUS_ACTIVE : VIEW_STATUS_CACHED);
    },

    getTransitionData: getTransitionData,
    navViewAttr: navViewAttr,
    destroyViewEle: destroyViewEle

  };

  return ionicViewSwitcher;


  function getViewElementIdentifier(locals, view) {
    if (viewState(locals)['abstract']) return viewState(locals).name;
    if (view) return view.stateId || view.viewId;
    return ionic.Utils.nextUid();
  }

  function viewState(locals) {
    return locals && locals.$$state && locals.$$state.self || {};
  }

  function getTransitionData(viewLocals, enteringEle, direction, view) {
    // Priority
    // 1) attribute directive on the button/link to this view
    // 2) entering element's attribute
    // 3) entering view's $state config property
    // 4) view registration data
    // 5) global config
    // 6) fallback value

    var state = viewState(viewLocals);
    var viewTransition = nextTransition || cachedAttr(enteringEle, 'view-transition') || state.viewTransition || $ionicConfig.views.transition() || 'ios';
    var navBarTransition = $ionicConfig.navBar.transition();
    direction = nextDirection || cachedAttr(enteringEle, 'view-direction') || state.viewDirection || direction || 'none';

    return extend(getViewData(view), {
      transition: viewTransition,
      navBarTransition: navBarTransition === 'view' ? viewTransition : navBarTransition,
      direction: direction,
      shouldAnimate: (viewTransition !== 'none' && direction !== 'none')
    });
  }

  function getViewData(view) {
    view = view || {};
    return {
      viewId: view.viewId,
      historyId: view.historyId,
      stateId: view.stateId,
      stateName: view.stateName,
      stateParams: view.stateParams
    };
  }

  function navViewAttr(ele, value) {
    if (arguments.length > 1) {
      cachedAttr(ele, NAV_VIEW_ATTR, value);
    } else {
      return cachedAttr(ele, NAV_VIEW_ATTR);
    }
  }

  function destroyViewEle(ele) {
    // we found an element that should be removed
    // destroy its scope, then remove the element
    if (ele && ele.length) {
      var viewScope = ele.scope();
      if (viewScope) {
        viewScope.$emit('$ionicView.unloaded', ele.data(DATA_VIEW));
        viewScope.$destroy();
      }
      ele.remove();
    }
  }

}]);
