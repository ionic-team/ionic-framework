IonicModule

.controller('$ionicNavBar', [
  '$scope',
  '$element',
  '$attrs',
  '$compile',
  '$timeout',
  '$ionicNavBarDelegate',
  '$ionicConfig',
function($scope, $element, $attrs, $compile, $timeout, $ionicNavBarDelegate, $ionicConfig) {

  var CSS_HIDE = 'hide';
  var DATA_NAV_BAR_CTRL = '$ionNavBarController';
  var PRIMARY_BUTTONS = 'primaryButtons';
  var SECONDARY_BUTTONS = 'secondaryButtons';
  var BACK_BUTTON = 'backButton';
  var BUTTON_TYPES = 'primaryButtons secondaryButtons leftButtons rightButtons'.split(' ');

  var self = this;
  var headerBars = [];
  var navElementHtml = {};
  var isVisible = true;
  var queuedTransitionStart, queuedTransitionEnd, latestTransitionId;

  $element.parent().data(DATA_NAV_BAR_CTRL, self);

  var delegateHandle = $attrs.delegateHandle || 'navBar' + ionic.Utils.nextUid();

  var deregisterInstance = $ionicNavBarDelegate._registerInstance(self, delegateHandle);


  self.init = function() {
    $element.addClass('nav-bar-container');
    ionic.DomUtil.cachedAttr($element, 'nav-bar-transition', $ionicConfig.navBar.transition());

    // create two nav bar blocks which will trade out which one is shown
    self.createHeaderBar(false);
    self.createHeaderBar(true);

    $scope.$emit('ionNavBar.init', delegateHandle);
  };


  self.createHeaderBar = function(isActive, navBarClass) {
    var containerEle = jqLite('<div class="nav-bar-block">');
    ionic.DomUtil.cachedAttr(containerEle, 'nav-bar', isActive ? 'active' : 'cached');

    var headerBarEle = jqLite('<ion-header-bar>').addClass($attrs.class);
    var titleEle = jqLite('<div class="title title-' + $ionicConfig.navBar.alignTitle() + '">');
    var navEle = {};
    var lastViewBtnsEle = {};
    var leftButtonsEle, rightButtonsEle;

    //navEle[BACK_BUTTON] = self.createBackButtonElement(headerBarEle);
    navEle[BACK_BUTTON] = createNavElement(BACK_BUTTON);
    navEle[BACK_BUTTON] && headerBarEle.append(navEle[BACK_BUTTON]);

    // append title in the header, this is the rock to where buttons append
    headerBarEle.append(titleEle);

    forEach(BUTTON_TYPES, function(buttonType) {
      // create default button elements
      navEle[buttonType] = createNavElement(buttonType);
      // append and position buttons
      positionButtons(navEle[buttonType], buttonType);
    });

    // compile header and append to the DOM
    containerEle.append(headerBarEle);
    $element.append($compile(containerEle)($scope.$new()));

    var headerBarCtrl = headerBarEle.data('$ionHeaderBarController');

    var headerBarInstance = {
      isActive: isActive,
      showBack: function(shouldShow) {
        headerBarCtrl.showBack(shouldShow);
      },
      title: function(newTitleText) {
        headerBarCtrl.title(newTitleText);
      },
      setButtons: function(viewBtnsEle, side) {
        // first make sure any exiting view buttons have been removed
        headerBarInstance.removeButtons(side);

        if (viewBtnsEle) {
          // there's a view button for this side
          positionButtons(viewBtnsEle, side);

          // make sure the default button on this side is hidden
          if (navEle[side]) {
            navEle[side].addClass(CSS_HIDE);
          }
          lastViewBtnsEle[side] = viewBtnsEle;

        } else if (navEle[side]) {
          // there's a default button for this side and no view button
          navEle[side].removeClass(CSS_HIDE);
        }
      },
      removeButtons: function(side) {
        if (lastViewBtnsEle[side]) {
          lastViewBtnsEle[side].scope().$destroy();
          lastViewBtnsEle[side].remove();
          lastViewBtnsEle[side] = null;
        }
      },
      containerEle: function() {
        return containerEle;
      },
      headerBarEle: function() {
        return headerBarEle;
      },
      afterLeave: function() {
        forEach(BUTTON_TYPES, function(buttonType) {
          headerBarInstance.removeButtons(buttonType);
        });
        headerBarCtrl.resetBackButton();
      },
      controller: function() {
        return headerBarCtrl;
      },
      destroy: function() {
        forEach(BUTTON_TYPES, function(buttonType) {
          headerBarInstance.removeButtons(buttonType);
        });
        containerEle.scope().$destroy();
        for (var n in navEle) {
          if (navEle[n]) {
            navEle[n].removeData();
            navEle[n] = null;
          }
        }
        leftButtonsEle && leftButtonsEle.removeData();
        rightButtonsEle && rightButtonsEle.removeData();
        titleEle.removeData();
        headerBarEle.removeData();
        containerEle.remove();
        containerEle = headerBarEle = titleEle = leftButtonsEle = rightButtonsEle = null;
      }
    };

    function positionButtons(btnsEle, buttonType) {
      if (!btnsEle) return;

      var appendToRight = (buttonType == 'rightButtons') ||
                          (buttonType == SECONDARY_BUTTONS && $ionicConfig.navBar.positionSecondaryButtons() != 'left') ||
                          (buttonType == PRIMARY_BUTTONS && $ionicConfig.navBar.positionPrimaryButtons() == 'right');

      if (appendToRight) {
        // right side
        if (!rightButtonsEle) {
          rightButtonsEle = jqLite('<div class="buttons buttons-right">');
          headerBarEle.append(rightButtonsEle);
        }
        if (buttonType == SECONDARY_BUTTONS) {
          rightButtonsEle.append(btnsEle);
        } else {
          rightButtonsEle.prepend(btnsEle);
        }

      } else {
        // left side
        if (!leftButtonsEle) {
          leftButtonsEle = jqLite('<div class="buttons buttons-left">');
          if (navEle[BACK_BUTTON]) {
            navEle[BACK_BUTTON].after(leftButtonsEle);
          } else {
            headerBarEle.prepend(leftButtonsEle);
          }
        }
        if (buttonType == SECONDARY_BUTTONS) {
          leftButtonsEle.append(btnsEle);
        } else {
          leftButtonsEle.prepend(btnsEle);
        }
      }

    }

    headerBars.push(headerBarInstance);

    return headerBarInstance;
  };


  self.navElement = function(type, html) {
    if (isDefined(html)) {
      navElementHtml[type] = html;
    }
    return navElementHtml[type];
  };


  self.update = function(viewData) {
    var showNavBar = !viewData.hasHeaderBar && viewData.showNavBar;
    viewData.transition = $ionicConfig.navBar.transition();

    if (!showNavBar) {
      viewData.direction = 'none';
    }

    self.enable(showNavBar);
    var enteringHeaderBar = self.isInitialized ? getOffScreenHeaderBar() : getOnScreenHeaderBar();
    var leavingHeaderBar = self.isInitialized ? getOnScreenHeaderBar() : null;

    // update if the entering header should show the back button or not
    self.showBackButton(viewData.showBack, enteringHeaderBar);

    // update the entering header bar's title
    self.title(viewData.title, enteringHeaderBar);

    self.showBar(showNavBar);

    // update the buttons, depending if the view has their own or not
    if (viewData.buttons) {
      forEach(BUTTON_TYPES, function(buttonType) {
        enteringHeaderBar.setButtons(viewData.buttons[buttonType], buttonType);
      });
    }

    // begin transition of entering and leaving header bars
    self.transition(enteringHeaderBar, leavingHeaderBar, viewData);

    self.isInitialized = true;
  };


  self.transition = function(enteringHeaderBar, leavingHeaderBar, viewData) {
    var enteringHeaderBarCtrl = enteringHeaderBar.controller();
    var transitionFn = $ionicConfig.transitions.navBar[$ionicConfig.navBar.transition()];
    var transitionId = viewData.transitionId;

    enteringHeaderBarCtrl.beforeEnter(viewData);

    var navBarTransition = transitionFn(enteringHeaderBar, leavingHeaderBar, viewData.direction, viewData.shouldAnimate && self.isInitialized);

    ionic.DomUtil.cachedAttr($element, 'nav-bar-transition', $ionicConfig.navBar.transition());
    ionic.DomUtil.cachedAttr($element, 'nav-bar-direction', viewData.direction);

    if (navBarTransition.shouldAnimate) {
      navBarAttr(enteringHeaderBar, 'stage');
    } else {
      navBarAttr(enteringHeaderBar, 'entering');
      navBarAttr(leavingHeaderBar, 'leaving');
    }

    enteringHeaderBarCtrl.resetBackButton();

    navBarTransition.run(0);

    $timeout(enteringHeaderBarCtrl.alignTitle, 16);

    queuedTransitionStart = function() {
      if (latestTransitionId !== transitionId) return;

      navBarAttr(enteringHeaderBar, 'entering');
      navBarAttr(leavingHeaderBar, 'leaving');

      navBarTransition.run(1);

      queuedTransitionEnd = function() {
        if (latestTransitionId == transitionId || !navBarTransition.shouldAnimate) {
          for (var x = 0; x < headerBars.length; x++) {
            headerBars[x].isActive = false;
          }
          enteringHeaderBar.isActive = true;

          navBarAttr(enteringHeaderBar, 'active');
          navBarAttr(leavingHeaderBar, 'cached');

          queuedTransitionEnd = null;
        }
      };

      queuedTransitionStart = null;
    };

    queuedTransitionStart();

  };


  self.triggerTransitionStart = function(triggerTransitionId) {
    latestTransitionId = triggerTransitionId;
    queuedTransitionStart && queuedTransitionStart();
  };


  self.triggerTransitionEnd = function() {
    queuedTransitionEnd && queuedTransitionEnd();
  };


  self.showBar = function(shouldShow) {
    if (arguments.length) {
      self.visibleBar(shouldShow);
      $scope.$parent.$hasHeader = !!shouldShow;
    }
    return !!$scope.$parent.$hasHeader;
  };


  self.visibleBar = function(shouldShow) {
    if (shouldShow && !isVisible) {
      $element.removeClass(CSS_HIDE);
    } else if (!shouldShow && isVisible) {
      $element.addClass(CSS_HIDE);
    }
    isVisible = shouldShow;
  };


  self.enable = function(val) {
    // set primary to show first
    self.visibleBar(val);

    // set non primary to hide second
    for (var x = 0; x < $ionicNavBarDelegate._instances.length; x++) {
      if ($ionicNavBarDelegate._instances[x] !== self) $ionicNavBarDelegate._instances[x].visibleBar(false);
    }
  };


  self.showBackButton = function(show, headerBar) {
    headerBar = headerBar || getOnScreenHeaderBar();
    headerBar && headerBar.showBack(show);
    $scope.$isBackButtonShown = !!show;
  };


  self.title = function(newTitleText, headerBar) {
    if (arguments.length) {
      newTitleText = newTitleText || '';
      headerBar = headerBar || getOnScreenHeaderBar();
      headerBar && headerBar.title(newTitleText);
      $scope.$title = newTitleText;
    }
    return $scope.$title;
  };


  function createNavElement(type) {
    if (navElementHtml[type]) {
      return jqLite(navElementHtml[type]);
    }
  }


  function getOnScreenHeaderBar() {
    for (var x = 0; x < headerBars.length; x++) {
      if (headerBars[x].isActive) return headerBars[x];
    }
  }


  function getOffScreenHeaderBar() {
    for (var x = 0; x < headerBars.length; x++) {
      if (!headerBars[x].isActive) return headerBars[x];
    }
  }


  function navBarAttr(ctrl, val) {
    ctrl && ionic.DomUtil.cachedAttr(ctrl.containerEle(), 'nav-bar', val);
  }


  $scope.$on('ionHeaderBar.init', function(ev) {
    ev.stopPropagation();
  });


  $scope.$on('$destroy', function() {
    $scope.$parent.$hasHeader = false;
    $element.parent().removeData(DATA_NAV_BAR_CTRL);
    for (var x = 0; x < headerBars.length; x++) {
      headerBars[x].destroy();
    }
    $element.remove();
    $element = headerBars = null;
    deregisterInstance();
  });

}]);
