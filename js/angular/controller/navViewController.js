IonicModule
.controller('$ionicNavView', [
  '$scope',
  '$element',
  '$attrs',
  '$compile',
  '$controller',
  '$ionicNavBarDelegate',
  '$ionicNavViewDelegate',
  '$ionicHistory',
  '$ionicViewSwitcher',
function($scope, $element, $attrs, $compile, $controller, $ionicNavBarDelegate, $ionicNavViewDelegate, $ionicHistory, $ionicViewSwitcher) {

  var DATA_ELE_IDENTIFIER = '$eleId';
  var DATA_DESTROY_ELE = '$destroyEle';
  var DATA_NO_CACHE = '$noCache';
  var VIEW_STATUS_ACTIVE = 'active';
  var VIEW_STATUS_CACHED = 'cached';

  var self = this;
  var direction;
  var isPrimary = false;
  var navBarDelegate;
  var activeEleId;
  var navViewAttr = $ionicViewSwitcher.navViewAttr;

  self.scope = $scope;

  self.init = function() {
    var navViewName = $attrs.name || '';

    // Find the details of the parent view directive (if any) and use it
    // to derive our own qualified view name, then hang our own details
    // off the DOM so child directives can find it.
    var parent = $element.parent().inheritedData('$uiView');
    var parentViewName = ((parent && parent.state) ? parent.state.name : '');
    if (navViewName.indexOf('@') < 0) navViewName  = navViewName + '@' + parentViewName;

    var viewData = { name: navViewName, state: null };
    $element.data('$uiView', viewData);

    var deregisterInstance = $ionicNavViewDelegate._registerInstance(self, $attrs.delegateHandle);
    $scope.$on('$destroy', deregisterInstance);

    $scope.$on('$ionicHistory.deselect', self.cacheCleanup);

    return viewData;
  };


  self.register = function(viewLocals) {
    var leavingView = extend({}, $ionicHistory.currentView());

    // register that a view is coming in and get info on how it should transition
    var registerData = $ionicHistory.register($scope, viewLocals);

    // update which direction
    self.update(registerData);

    // begin rendering and transitioning
    self.render(registerData, viewLocals, leavingView);
  };


  self.update = function(registerData) {
    // always reset that this is the primary navView
    isPrimary = true;

    // remember what direction this navView should use
    // this may get updated later by a child navView
    direction = registerData.direction;

    var parentNavViewCtrl = $element.parent().inheritedData('$ionNavViewController');
    if (parentNavViewCtrl) {
      // this navView is nested inside another one
      // update the parent to use this direction and not
      // the other it originally was set to

      // inform the parent navView that it is not the primary navView
      parentNavViewCtrl.isPrimary(false);

      if (direction === 'enter' || direction === 'exit') {
        // they're entering/exiting a history
        // find parent navViewController
        parentNavViewCtrl.direction(direction);

        if (direction === 'enter') {
          // reset the direction so this navView doesn't animate
          // because it's parent will
          direction = 'none';
        }
      }
    }
  };


  self.render = function(registerData, viewLocals, leavingView) {
    var enteringView = $ionicHistory.getViewById(registerData.viewId) || {};

    // register the view and figure out where it lives in the various
    // histories and nav stacks, along with how views should enter/leave
    var switcher = $ionicViewSwitcher.create(self, viewLocals, enteringView, leavingView);

    // init the rendering of views for this navView directive
    switcher.init(registerData, function() {
      // the view is now compiled, in the dom and linked, now lets transition the views.
      // this uses a callback incase THIS nav-view has a nested nav-view, and after the NESTED
      // nav-view links, the NESTED nav-view would update which direction THIS nav-view should use
      switcher.transition(self.direction(), registerData.enableBack);
    });

  };


  self.beforeEnter = function(transitionData) {
    if (isPrimary) {
      // only update this nav-view's nav-bar if this is the primary nav-view
      navBarDelegate = transitionData.navBarDelegate;
      var associatedNavBarCtrl = getAssociatedNavBarCtrl();
      associatedNavBarCtrl && associatedNavBarCtrl.update(transitionData);
    }
  };


  self.activeEleId = function(eleId) {
    if (arguments.length) {
      activeEleId = eleId;
    }
    return activeEleId;
  };


  self.transitionEnd = function() {
    var viewElements = $element.children();
    var x, l, viewElement;

    for (x = 0, l = viewElements.length; x < l; x++) {
      viewElement = viewElements.eq(x);

      if (viewElement.data(DATA_ELE_IDENTIFIER) === activeEleId) {
        // this is the active element
        navViewAttr(viewElement, VIEW_STATUS_ACTIVE);

      } else if (navViewAttr(viewElement) === 'leaving' || navViewAttr(viewElement) === VIEW_STATUS_ACTIVE || navViewAttr(viewElement) === VIEW_STATUS_CACHED) {
        // this is a leaving element or was the former active element, or is an cached element
        if (viewElement.data(DATA_DESTROY_ELE) || viewElement.data(DATA_NO_CACHE)) {
          // this element shouldn't stay cached
          $ionicViewSwitcher.destroyViewEle(viewElement);
        } else {
          // keep in the DOM, mark as cached
          navViewAttr(viewElement, VIEW_STATUS_CACHED);
        }
      }
    }
  };


  self.cacheCleanup = function() {
    var viewElements = $element.children();
    for (var x = 0, l = viewElements.length; x < l; x++) {
      if (viewElements.eq(x).data(DATA_DESTROY_ELE)) {
        $ionicViewSwitcher.destroyViewEle(viewElements.eq(x));
      }
    }
  };


  self.clearCache = function() {
    var viewElements = $element.children();
    var viewElement, viewScope;

    for (var x = 0, l = viewElements.length; x < l; x++) {
      viewElement = viewElements.eq(x);
      if (navViewAttr(viewElement) == VIEW_STATUS_CACHED) {
        $ionicViewSwitcher.destroyViewEle(viewElement);
      } else if (navViewAttr(viewElement) == VIEW_STATUS_ACTIVE) {
        viewScope = viewElement.scope();
        viewScope && viewScope.$broadcast('$ionicView.clearCache');
      }
    }

  };


  self.getViewElements = function() {
    return $element.children();
  };


  self.appendViewElement = function(viewEle, viewLocals) {
    // compile the entering element and get the link function
    var linkFn = $compile(viewEle);

    $element.append(viewEle);

    var viewScope = $scope.$new();

    if (viewLocals && viewLocals.$$controller) {
      viewLocals.$scope = viewScope;
      var controller = $controller(viewLocals.$$controller, viewLocals);
      $element.children().data('$ngControllerController', controller);
    }

    linkFn(viewScope);

    return viewScope;
  };


  self.title = function(val) {
    var associatedNavBarCtrl = getAssociatedNavBarCtrl();
    associatedNavBarCtrl && associatedNavBarCtrl.title(val);
  };


  /**
   * @ngdoc method
   * @name $ionicNavView#enableBackButton
   * @description Enable/disable if the back button can be shown or not. For
   * example, the very first view in the navigation stack would not have a
   * back view, so the back button would be disabled.
   */
  self.enableBackButton = function(shouldEnable) {
    var associatedNavBarCtrl = getAssociatedNavBarCtrl();
    associatedNavBarCtrl && associatedNavBarCtrl.enableBackButton(shouldEnable);
  };


  /**
   * @ngdoc method
   * @name $ionicNavView#showBackButton
   * @description Show/hide the nav bar active back button. If the back button
   * is not possible this will not force the back button to show. The
   * `enableBackButton()` method handles if a back button is even possible or not.
   */
  self.showBackButton = function(shouldShow) {
    var associatedNavBarCtrl = getAssociatedNavBarCtrl();
    associatedNavBarCtrl && associatedNavBarCtrl.showActiveBackButton(shouldShow);
  };


  self.showBar = function(val) {
    var associatedNavBarCtrl = getAssociatedNavBarCtrl();
    associatedNavBarCtrl && associatedNavBarCtrl.showBar(val);
  };


  self.isPrimary = function(val) {
    if (arguments.length) {
      isPrimary = val;
    }
    return isPrimary;
  };


  self.direction = function(val) {
    if (arguments.length) {
      direction = val;
    }
    return direction;
  };


  function getAssociatedNavBarCtrl() {
    if (navBarDelegate) {
      for (var x=0; x < $ionicNavBarDelegate._instances.length; x++) {
        if ($ionicNavBarDelegate._instances[x].$$delegateHandle == navBarDelegate) {
          return $ionicNavBarDelegate._instances[x];
        }
      }
    }
    return $element.inheritedData('$ionNavBarController');
  }

}]);
