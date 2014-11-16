IonicModule
.controller('$ionicView', [
  '$scope',
  '$element',
  '$attrs',
  '$compile',
  '$ionicHistory',
  '$ionicViewSwitcher',
function($scope, $element, $attrs, $compile, $ionicHistory, $ionicViewSwitcher) {
  var self = this;
  var navElementHtml = {};
  var navViewCtrl;
  var navBarDelegateHandle;
  var hasViewHeaderBar;
  var deregisters = [];

  var deregIonNavBarInit = $scope.$on('ionNavBar.init', function(ev, delegateHandle){
    // this view has its own ion-nav-bar, remember the navBarDelegateHandle for this view
    ev.stopPropagation();
    navBarDelegateHandle = delegateHandle;
  });


  self.init = function() {
    deregIonNavBarInit();

    var modalCtrl = $element.inheritedData('$ionModalController');
    navViewCtrl = $element.inheritedData('$ionNavViewController');

    // don't bother if inside a modal or there's no parent navView
    if (!navViewCtrl || modalCtrl) return;

    // add listeners for when this view changes
    $scope.$on('$ionicView.beforeEnter', self.beforeEnter);
    $scope.$on('$ionicView.afterEnter', afterEnter);
    $scope.$on('$ionicView.beforeLeave', deregisterFns);
  };

  self.beforeEnter = function(ev, transData) {
    // this event was emitted, starting at intial ion-view, then bubbles up
    // only the first ion-view should do something with it, parent ion-views should ignore
    if (transData && !transData.viewNotified) {
      transData.viewNotified = true;

      var viewTitle = $attrs.viewTitle || $attrs.title;

      $ionicHistory.currentTitle(viewTitle);

      var buttons = {};
      for (var n in navElementHtml) {
        buttons[n] = generateButton(navElementHtml[n]);
      }

      navViewCtrl.beforeEnter({
        title: viewTitle,
        direction: transData.direction,
        transition: transData.transition,
        transitionId: transData.transitionId,
        shouldAnimate: transData.shouldAnimate,
        showBack: transData.showBack && !attrTrue('hideBackButton'),
        buttons: buttons,
        navBarDelegate: navBarDelegateHandle || null,
        showNavBar: !attrTrue('hideNavBar'),
        hasHeaderBar: !!hasViewHeaderBar
      });

      // make sure any existing observers are cleaned up
      deregisterFns();
    }
  };


  function afterEnter() {
    // only listen for title updates after it has entered
    // but also deregister the observe before it leaves
    var viewTitleAttr = isDefined($attrs.viewTitle) && 'viewTitle' || isDefined($attrs.title) && 'title';
    if (viewTitleAttr) {
      deregisters.push($attrs.$observe(viewTitleAttr, function(val) {
        navViewCtrl.title(val);
        $ionicHistory.currentTitle(val);
      }));
    }

    if (isDefined($attrs.hideBackButton)) {
      deregisters.push($scope.$watch($attrs.hideBackButton, function(val) {
        navViewCtrl.showBackButton(!val);
      }));
    }

    if (isDefined($attrs.hideNavBar)) {
      deregisters.push($scope.$watch($attrs.hideNavBar, function(val) {
        navViewCtrl.showBar(!val);
      }));
    }

    $ionicViewSwitcher.setActiveView($element.parent());
  }


  function deregisterFns() {
    // remove all existing $attrs.$observe's
    for (var x = 0; x < deregisters.length; x++) {
      deregisters[x]();
    }
    deregisters = [];
  }


  function generateButton(html) {
    if (html) {
      // every time a view enters we need to recreate its view buttons if they exist
      return $compile(html)($scope.$new());
    }
  }


  function attrTrue(key) {
    return $attrs[key] == 'true' || $attrs[key] === '';
  }


  self.navElement = function(type, html) {
    navElementHtml[type] = html;
  };

}]);

