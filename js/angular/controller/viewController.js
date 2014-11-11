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

  var deregIonNavBarInit = $scope.$on('ionNavBar.init', function(ev, delegateHandle){
    // this view has its own ion-nav-bar, remember the navBarDelegateHandle for this view
    ev.stopPropagation();
    navBarDelegateHandle = delegateHandle;
  });

  var deregIonHeaderBarInit = $scope.$on('ionHeaderBar.init', function(ev){
    // this view has its own ion-header-bar, remember it should trump other nav bars
    ev.stopPropagation();
    hasViewHeaderBar = true;
  });


  self.init = function() {
    deregIonNavBarInit();
    deregIonHeaderBarInit();

    var modalCtrl = $element.inheritedData('$ionModalController');
    navViewCtrl = $element.inheritedData('$ionNavViewController');

    // don't bother if inside a modal or there's no parent navView
    if (!navViewCtrl || modalCtrl) return;

    // add listeners for when this view changes
    $scope.$on('$ionicView.beforeEnter', self.beforeEnter);
    $scope.$on('$ionicView.afterEnter', self.afterEnter);

    // watch to see if the hideNavBar attribute changes
    var hideNavAttr = isDefined($attrs.hideNavBar) ? $attrs.hideNavBar : 'false';
    $scope.$watch(hideNavAttr, function(value) {
      navViewCtrl.showBar(!value);
    });
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
        showBack: transData.showBack && !$attrs.hideBackButton,
        buttons: buttons,
        navBarDelegate: navBarDelegateHandle || null,
        hasHeaderBar: !!hasViewHeaderBar
      });
    }
  };


  function generateButton(html) {
    if (html) {
      // every time a view enters we need to recreate its view buttons if they exist
      return $compile(html)($scope.$new());
    }
  }


  self.afterEnter = function(ev, transitionData) {
    $ionicViewSwitcher.setActiveView($element.parent());
  };


  self.navElement = function(type, html) {
    navElementHtml[type] = html;
  };

}]);

