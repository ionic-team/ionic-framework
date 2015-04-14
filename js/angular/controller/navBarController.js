IonicModule

.controller('$ionicNavBar', [
  '$scope',
  '$element',
  '$attrs',
  '$compile',
  '$timeout',
  '$ionicNavBarDelegate',
  '$ionicConfig',
  '$ionicHistory',
function($scope, $element, $attrs, $compile, $timeout, $ionicNavBarDelegate, $ionicConfig, $ionicHistory) {

  var CSS_HIDE = 'hide';
  var DATA_NAV_BAR_CTRL = '$ionNavBarController';
  var PRIMARY_BUTTONS = 'primaryButtons';
  var SECONDARY_BUTTONS = 'secondaryButtons';
  var BACK_BUTTON = 'backButton';
  var ITEM_TYPES = 'primaryButtons secondaryButtons leftButtons rightButtons title'.split(' ');

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
    ionic.DomUtil.cachedAttr($element, 'nav-bar-transition', $ionicConfig.views.transition());

    // create two nav bar blocks which will trade out which one is shown
    self.createHeaderBar(false);
    self.createHeaderBar(true);

    $scope.$emit('ionNavBar.init', delegateHandle);
  };


  self.createHeaderBar = function(isActive, navBarClass) {
    var containerEle = jqLite('<div class="nav-bar-block">');
    ionic.DomUtil.cachedAttr(containerEle, 'nav-bar', isActive ? 'active' : 'cached');

    var alignTitle = $attrs.alignTitle || $ionicConfig.navBar.alignTitle();
    var headerBarEle = jqLite('<ion-header-bar>').addClass($attrs['class']).attr('align-title', alignTitle);
    if (isDefined($attrs.noTapScroll)) headerBarEle.attr('no-tap-scroll', $attrs.noTapScroll);
    var titleEle = jqLite('<div class="title title-' + alignTitle + '">');
    var navEle = {};
    var lastViewItemEle = {};
    var leftButtonsEle, rightButtonsEle;

    navEle[BACK_BUTTON] = createNavElement(BACK_BUTTON);
    navEle[BACK_BUTTON] && headerBarEle.append(navEle[BACK_BUTTON]);

    // append title in the header, this is the rock to where buttons append
    headerBarEle.append(titleEle);

    forEach(ITEM_TYPES, function(itemType) {
      // create default button elements
      navEle[itemType] = createNavElement(itemType);
      // append and position buttons
      positionItem(navEle[itemType], itemType);
    });

    // add header-item to the root children
    for (var x = 0; x < headerBarEle[0].children.length; x++) {
      headerBarEle[0].children[x].classList.add('header-item');
    }

    // compile header and append to the DOM
    containerEle.append(headerBarEle);
    $element.append($compile(containerEle)($scope.$new()));

    var headerBarCtrl = headerBarEle.data('$ionHeaderBarController');
    headerBarCtrl.backButtonIcon = $ionicConfig.backButton.icon();
    headerBarCtrl.backButtonText = $ionicConfig.backButton.text();

    var headerBarInstance = {
      isActive: isActive,
      title: function(newTitleText) {
        headerBarCtrl.title(newTitleText);
      },
      setItem: function(navBarItemEle, itemType) {
        // first make sure any exiting nav bar item has been removed
        headerBarInstance.removeItem(itemType);

        if (navBarItemEle) {
          if (itemType === 'title') {
            // clear out the text based title
            headerBarInstance.title("");
          }

          // there's a custom nav bar item
          positionItem(navBarItemEle, itemType);

          if (navEle[itemType]) {
            // make sure the default on this itemType is hidden
            navEle[itemType].addClass(CSS_HIDE);
          }
          lastViewItemEle[itemType] = navBarItemEle;

        } else if (navEle[itemType]) {
          // there's a default button for this side and no view button
          navEle[itemType].removeClass(CSS_HIDE);
        }
      },
      removeItem: function(itemType) {
        if (lastViewItemEle[itemType]) {
          lastViewItemEle[itemType].scope().$destroy();
          lastViewItemEle[itemType].remove();
          lastViewItemEle[itemType] = null;
        }
      },
      containerEle: function() {
        return containerEle;
      },
      headerBarEle: function() {
        return headerBarEle;
      },
      afterLeave: function() {
        forEach(ITEM_TYPES, function(itemType) {
          headerBarInstance.removeItem(itemType);
        });
        headerBarCtrl.resetBackButton();
      },
      controller: function() {
        return headerBarCtrl;
      },
      destroy: function() {
        forEach(ITEM_TYPES, function(itemType) {
          headerBarInstance.removeItem(itemType);
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

    function positionItem(ele, itemType) {
      if (!ele) return;

      if (itemType === 'title') {
        // title element
        titleEle.append(ele);

      } else if (itemType == 'rightButtons' ||
                (itemType == SECONDARY_BUTTONS && $ionicConfig.navBar.positionSecondaryButtons() != 'left') ||
                (itemType == PRIMARY_BUTTONS && $ionicConfig.navBar.positionPrimaryButtons() == 'right')) {
        // right side
        if (!rightButtonsEle) {
          rightButtonsEle = jqLite('<div class="buttons buttons-right">');
          headerBarEle.append(rightButtonsEle);
        }
        if (itemType == SECONDARY_BUTTONS) {
          rightButtonsEle.append(ele);
        } else {
          rightButtonsEle.prepend(ele);
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
        if (itemType == SECONDARY_BUTTONS) {
          leftButtonsEle.append(ele);
        } else {
          leftButtonsEle.prepend(ele);
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
    viewData.transition = $ionicConfig.views.transition();

    if (!showNavBar) {
      viewData.direction = 'none';
    }

    self.enable(showNavBar);
    var enteringHeaderBar = self.isInitialized ? getOffScreenHeaderBar() : getOnScreenHeaderBar();
    var leavingHeaderBar = self.isInitialized ? getOnScreenHeaderBar() : null;
    var enteringHeaderCtrl = enteringHeaderBar.controller();

    // update if the entering header should show the back button or not
    enteringHeaderCtrl.enableBack(viewData.enableBack, true);
    enteringHeaderCtrl.showBack(viewData.showBack, true);
    enteringHeaderCtrl.updateBackButton();

    // update the entering header bar's title
    self.title(viewData.title, enteringHeaderBar);

    self.showBar(showNavBar);

    // update the nav bar items, depending if the view has their own or not
    if (viewData.navBarItems) {
      forEach(ITEM_TYPES, function(itemType) {
        enteringHeaderBar.setItem(viewData.navBarItems[itemType], itemType);
      });
    }

    // begin transition of entering and leaving header bars
    self.transition(enteringHeaderBar, leavingHeaderBar, viewData);

    self.isInitialized = true;
    navSwipeAttr('');
  };


  self.transition = function(enteringHeaderBar, leavingHeaderBar, viewData) {
    var enteringHeaderBarCtrl = enteringHeaderBar.controller();
    var transitionFn = $ionicConfig.transitions.navBar[viewData.navBarTransition] || $ionicConfig.transitions.navBar.none;
    var transitionId = viewData.transitionId;

    enteringHeaderBarCtrl.beforeEnter(viewData);

    var navBarTransition = transitionFn(enteringHeaderBar, leavingHeaderBar, viewData.direction, viewData.shouldAnimate && self.isInitialized);

    ionic.DomUtil.cachedAttr($element, 'nav-bar-transition', viewData.navBarTransition);
    ionic.DomUtil.cachedAttr($element, 'nav-bar-direction', viewData.direction);

    if (navBarTransition.shouldAnimate && viewData.renderEnd) {
      navBarAttr(enteringHeaderBar, 'stage');
    } else {
      navBarAttr(enteringHeaderBar, 'entering');
      navBarAttr(leavingHeaderBar, 'leaving');
    }

    enteringHeaderBarCtrl.resetBackButton(viewData);

    navBarTransition.run(0);

    self.activeTransition = {
      run: function(step) {
        navBarTransition.shouldAnimate = false;
        navBarTransition.direction = 'back';
        navBarTransition.run(step);
      },
      cancel: function(shouldAnimate, speed, cancelData) {
        navSwipeAttr(speed);
        navBarAttr(leavingHeaderBar, 'active');
        navBarAttr(enteringHeaderBar, 'cached');
        navBarTransition.shouldAnimate = shouldAnimate;
        navBarTransition.run(0);
        self.activeTransition = navBarTransition = null;

        var runApply;
        if (cancelData.showBar !== self.showBar()) {
          self.showBar(cancelData.showBar);
        }
        if (cancelData.showBackButton !== self.showBackButton()) {
          self.showBackButton(cancelData.showBackButton);
        }
        if (runApply) {
          $scope.$apply();
        }
      },
      complete: function(shouldAnimate, speed) {
        navSwipeAttr(speed);
        navBarTransition.shouldAnimate = shouldAnimate;
        navBarTransition.run(1);
        queuedTransitionEnd = transitionEnd;
      }
    };

    $timeout(enteringHeaderBarCtrl.align, 16);

    queuedTransitionStart = function() {
      if (latestTransitionId !== transitionId) return;

      navBarAttr(enteringHeaderBar, 'entering');
      navBarAttr(leavingHeaderBar, 'leaving');

      navBarTransition.run(1);

      queuedTransitionEnd = function() {
        if (latestTransitionId == transitionId || !navBarTransition.shouldAnimate) {
          transitionEnd();
        }
      };

      queuedTransitionStart = null;
    };

    function transitionEnd() {
      for (var x = 0; x < headerBars.length; x++) {
        headerBars[x].isActive = false;
      }
      enteringHeaderBar.isActive = true;

      navBarAttr(enteringHeaderBar, 'active');
      navBarAttr(leavingHeaderBar, 'cached');

      self.activeTransition = navBarTransition = queuedTransitionEnd = null;
    }

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
      self.align();
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


  /**
   * @ngdoc method
   * @name $ionicNavBar#showBackButton
   * @description Show/hide the nav bar back button when there is a
   * back view. If the back button is not possible, for example, the
   * first view in the stack, then this will not force the back button
   * to show.
   */
  self.showBackButton = function(shouldShow) {
    if (arguments.length) {
      for (var x = 0; x < headerBars.length; x++) {
        headerBars[x].controller().showNavBack(!!shouldShow);
      }
      $scope.$isBackButtonShown = !!shouldShow;
    }
    return $scope.$isBackButtonShown;
  };


  /**
   * @ngdoc method
   * @name $ionicNavBar#showActiveBackButton
   * @description Show/hide only the active header bar's back button.
   */
  self.showActiveBackButton = function(shouldShow) {
    var headerBar = getOnScreenHeaderBar();
    if (headerBar) {
      if (arguments.length) {
        return headerBar.controller().showBack(shouldShow);
      }
      return headerBar.controller().showBack();
    }
  };


  self.title = function(newTitleText, headerBar) {
    if (isDefined(newTitleText)) {
      newTitleText = newTitleText || '';
      headerBar = headerBar || getOnScreenHeaderBar();
      headerBar && headerBar.title(newTitleText);
      $scope.$title = newTitleText;
      $ionicHistory.currentTitle(newTitleText);
    }
    return $scope.$title;
  };


  self.align = function(val, headerBar) {
    headerBar = headerBar || getOnScreenHeaderBar();
    headerBar && headerBar.controller().align(val);
  };


  self.hasTabsTop = function(isTabsTop) {
    $element[isTabsTop ? 'addClass' : 'removeClass']('nav-bar-tabs-top');
  };

  self.hasBarSubheader = function(isBarSubheader) {
    $element[isBarSubheader ? 'addClass' : 'removeClass']('nav-bar-has-subheader');
  };

  // DEPRECATED, as of v1.0.0-beta14 -------
  self.changeTitle = function(val) {
    deprecatedWarning('changeTitle(val)', 'title(val)');
    self.title(val);
  };
  self.setTitle = function(val) {
    deprecatedWarning('setTitle(val)', 'title(val)');
    self.title(val);
  };
  self.getTitle = function() {
    deprecatedWarning('getTitle()', 'title()');
    return self.title();
  };
  self.back = function() {
    deprecatedWarning('back()', '$ionicHistory.goBack()');
    $ionicHistory.goBack();
  };
  self.getPreviousTitle = function() {
    deprecatedWarning('getPreviousTitle()', '$ionicHistory.backTitle()');
    $ionicHistory.goBack();
  };
  function deprecatedWarning(oldMethod, newMethod) {
    var warn = console.warn || console.log;
    warn && warn.call(console, 'navBarController.' + oldMethod + ' is deprecated, please use ' + newMethod + ' instead');
  }
  // END DEPRECATED -------


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

  function navSwipeAttr(val) {
    ionic.DomUtil.cachedAttr($element, 'nav-swipe', val);
  }


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
