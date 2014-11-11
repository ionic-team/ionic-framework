IonicModule
.controller('$ionicNavView', [
  '$scope',
  '$element',
  '$attrs',
  '$ionicNavBarDelegate',
  '$ionicHistory',
  '$ionicViewSwitcher',
  '$ionicConfig',
function($scope, $element, $attrs, $ionicNavBarDelegate, $ionicHistory, $ionicViewSwitcher, $ionicConfig) {
  var self = this;
  var direction;
  var isPrimary = false;
  var navBarDelegate;


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

    return viewData;
  };


  self.register = function(viewLocals) {
    // register that a view is coming in and get info on how it should transition
    var isAbstractView = viewLocals && viewLocals.$$state && viewLocals.$$state.self && viewLocals.$$state.self.abstract;
    var registerData = $ionicHistory.register($scope, isAbstractView);

    // update which direction
    self.update(registerData);

    // begin rendering and transitioning
    self.render(registerData, viewLocals);
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


  self.render = function(registerData, viewLocals) {
    var enteringView = $ionicHistory.getViewById(registerData.viewId) || {};

    // register the view and figure out where it lives in the various
    // histories and nav stacks, along with how views should enter/leave
    var switcher = $ionicViewSwitcher.create($scope, $element, viewLocals, enteringView);

    // init the rendering of views for this navView directive
    switcher.init(registerData, function(){
      // the view is now compiled, in the dom and linked, now lets transition the views.
      // this uses a callback incase THIS nav-view has a nested nav-view, and after the NESTED
      // nav-view links, the NESTED nav-view would update which direction THIS nav-view should use
      switcher.transition( self.direction(), registerData.showBack );
    });

  };


  self.beforeEnter = function(transData) {
    if (isPrimary) {
      // only update this nav-view's nav-bar if this is the primary nav-view
      navBarDelegate = transData.navBarDelegate;
      var associatedNavBarCtrl = getAssociatedNavBarCtrl();
      associatedNavBarCtrl && associatedNavBarCtrl.update(transData);
    }
  };


  self.showBar = function(val) {
    var associatedNavBarCtrl = getAssociatedNavBarCtrl();
    associatedNavBarCtrl && associatedNavBarCtrl.showBar(val);
  };


  self.showBackButton = function(val) {
    var associatedNavBarCtrl = getAssociatedNavBarCtrl();
    associatedNavBarCtrl && associatedNavBarCtrl.showBackButton(val);
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
      for (var x=0; x<$ionicNavBarDelegate._instances.length; x++) {
        if ($ionicNavBarDelegate._instances[x].$$delegateHandle == navBarDelegate) {
          return $ionicNavBarDelegate._instances[x];
        }
      }
    }
    return $element.inheritedData('$ionNavBarController');
  }

}]);
