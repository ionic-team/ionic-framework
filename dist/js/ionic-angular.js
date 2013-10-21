/**
 * Create a wrapping module to ease having to include too many
 * modules.
 */
angular.module('ionic.ui', ['ionic.ui.content',
                            'ionic.ui.tabs',
                            'ionic.ui.nav',
                            'ionic.ui.sideMenu',
                            'ionic.ui.list',
                            'ionic.ui.checkbox',
                            'ionic.ui.toggle'
                           ]);

;
angular.module('ionic.service.actionSheet', ['ionic.service.templateLoad', 'ionic.ui.actionSheet'])

.factory('ActionSheet', ['$rootScope', '$document', '$compile', 'TemplateLoader', function($rootScope, $document, $compile, TemplateLoader) {
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

      scope.cancel = function() {
        scope.sheet.hide();
        //scope.$destroy();
        opts.cancel();
      };

      scope.buttonClicked = function(index) {
        // Check if the button click event returned true, which means
        // we can close the action sheet
        if((opts.buttonClicked && opts.buttonClicked(index)) === true) {
          scope.sheet.hide();
          //scope.$destroy();
        }
      };

      scope.destructiveButtonClicked = function() {
        // Check if the destructive button click event returned true, which means
        // we can close the action sheet
        if((opts.destructiveButtonClicked && opts.destructiveButtonClicked()) === true) {
          scope.sheet.hide();
          //scope.$destroy();
        }
      };

      // Compile the template
      var element = $compile('<action-sheet buttons="buttons"></action-sheet>')(scope);

      var s = element.scope();

      $document[0].body.appendChild(element[0]);

      var sheet = new ionic.views.ActionSheet({el: element[0] });
      s.sheet = sheet;

      sheet.show();

      return sheet;
    }
  };
}]);
;
angular.module('ionic.service.gesture', [])

.factory('Gesture', [function() {
  return {
    on: function(eventType, cb, element) {
      return window.ionic.onGesture(eventType, cb, element);
    }
  };
}]);
;
angular.module('ionic.service.loading', ['ionic.ui.loading'])

.factory('Loading', ['$rootScope', '$document', '$compile', function($rootScope, $document, $compile) {
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
        showDelay: 2000
      };

      opts = angular.extend(defaults, opts);

      var scope = $rootScope.$new(true);
      angular.extend(scope, opts);

      // Make sure there is only one loading element on the page at one point in time
      var existing = angular.element($document[0].querySelector('.loading-backdrop'));
      if(existing.length) {
        var scope = existing.scope();
        if(scope.loading) {
          scope.loading.show();
          return scope.loading;
        }
      }

      // Compile the template
      var element = $compile('<loading>' + opts.content + '</loading>')(scope);

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
angular.module('ionic.service.modal', ['ionic.service.templateLoad'])


.factory('Modal', ['$rootScope', '$document', '$compile', 'TemplateLoader', function($rootScope, $document, $compile, TemplateLoader) {
  return {
    /**
     * Load a modal with the given template string.
     *
     * A new isolated scope will be created for the 
     * modal and the new element will be appended into the body.
     */
    fromTemplate: function(templateString) {
      // Create a new isolated scope for the modal
      var scope = $rootScope.$new(true);

      // Compile the template
      var element = $compile(templateString)(scope);
      $document[0].body.appendChild(element[0]);

      var modal = new ionic.views.Modal({el: element[0] });
      scope.modal = modal;
      return modal;
    },
    fromTemplateUrl: function(url, cb) {
      TemplateLoader.load(url).then(function(templateString) {
        // Create a new isolated scope for the modal
        var scope = $rootScope.$new(true);

        // Compile the template
        var element = $compile(templateString)(scope);
        $document[0].body.appendChild(element[0]);
      
        var modal = new ionic.views.Modal({ el: element[0] });
        scope.modal = modal;

        cb(modal);
      });
    }
  };
}]);
;
angular.module('ionic.service.popup', ['ionic.service.templateLoad'])


.factory('Popup', ['$rootScope', '$document', '$compile', 'TemplateLoader', function($rootScope, $document, $compile, TemplateLoader) {

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
    alert: function(message) {

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

      var scope = $rootScope.$new(true);
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

.factory('TemplateLoader', ['$q', '$http', '$templateCache', function($q, $http, $templateCache) {
  return {
    load: function(url) {
      var deferred = $q.defer();

      $http.get(url, { cache: $templateCache }).success(function(html) {
        deferred.resolve(html && html.trim());
      });

      return deferred.promise;
    }
  };
}]);
;
(function() {
'use strict';

angular.module('ionic.ui.actionSheet', [])

.directive('actionSheet', function() {
  return {
    restrict: 'E',
    scope: true,
    replace: true,
    link: function($scope, $element){
      $scope.$on('$destroy', function() {
        $element.remove();
      });
    },
    template: '<div class="action-sheet slide-in-up">' +
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
              '</div>'
  };
});

})();
;
(function() {
'use strict';

angular.module('ionic.ui.checkbox', [])


.directive('checkbox', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: true,
    template: '<div class="checkbox"><input type="checkbox"><div class="handle"></div></div>',

    link: function($scope, $element, $attr, ngModel) {
      var checkbox, handle;

      if(!ngModel) { return; }

      checkbox = $element.children().eq(0);
      handle = $element.children().eq(1);

      if(!checkbox.length || !handle.length) { return; }

      $scope.checkbox = new ionic.views.Checkbox({ 
        el: $element[0],
        checkbox: checkbox[0],
        handle: handle[0]
      });

      $element.bind('click', function(e) {
        $scope.checkbox.tap(e);
        $scope.$apply(function() {
          ngModel.$setViewValue(checkbox[0].checked);
        });
      });

      ngModel.$render = function() {
        $scope.checkbox.val(ngModel.$viewValue);
      };
    }
  };
});

})();
;
(function() {
'use strict';

angular.module('ionic.ui.content', [])

// The content directive is a core scrollable content area
// that is part of many View hierarchies
.directive('content', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="content-wrapper"><div class="content"></div></div>',
    transclude: true,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr) {
        var c = $element.children().eq(0);

        c.addClass('content');

        if(attr.hasHeader) {
          c.addClass('has-header');
        }
        if(attr.hasFooter) {
          c.addClass('has-footer');
        }
        if(attr.hasTabs) {
          c.addClass('has-tabs');
        }
        c.append(transclude($scope));
      };
    }
  };
});
})();
;
(function() {
'use strict';

angular.module('ionic.ui.list', ['ionic.service.gesture', 'ngAnimate'])

.directive('listItem', function() {
  return {
    restrict: 'E',
    require: '^list',
    replace: true,
    transclude: true,
    scope: {
      item: '=',
      onSelect: '&',
      onDelete: '&',
      canDelete: '@',
      canReorder: '@',
      canSwipe: '@',
      buttons: '=',
    },
    template:   '<li class="list-item" ng-click="onSelect()">\
                   <div class="list-item-edit" ng-if="canDelete && isEditing">\
                     <button class="button button-icon" ng-click="onDelete()"><i ng-class="deleteIcon"></i></button>\
                   </div>\
                   <div class="list-item-content" ng-transclude>\
                   </div>\
                   <div class="list-item-drag" ng-if="canReorder && isEditing">\
                     <button data-ionic-action="reorder" class="button button-icon"><i ng-class="reorderIcon"></i></button>\
                   </div>\
                   <div class="list-item-buttons" ng-if="canSwipe && !isEditing">\
                     <button ng-click="buttonClicked(button)" class="button" ng-class="button.type" ng-repeat="button in buttons">{{button.text}}</button>\
                   </div>\
                </li>',
    link: function($scope, $element, $attr, list) {
      $scope.isEditing = false;
      $scope.deleteIcon = list.scope.deleteIcon;
      $scope.reorderIcon = list.scope.reorderIcon;

      $scope.buttonClicked = function(button) {
        button.onButtonClicked && button.onButtonClicked($scope.item, button);
      };

      list.scope.$watch('isEditing', function(v) {
        $scope.isEditing = v;
      });
    }
  };
})

.directive('listRefresher', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="list-refresher"><div class="list-refresher-content" ng-transclude></div></div>'
  }
})

.directive('list', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,

    scope: {
      isEditing: '=',
      deleteIcon: '@',
      reorderIcon: '@',
      onRefreshOpening: '&',
      onRefreshHolding: '&',
      onRefresh: '&',
    },

    // So we can require being under this
    controller: function($scope) {
      var _this = this;

      this.scope = $scope;

      $scope.$watch('isEditing', function(v) {
        _this.isEditing = true;
      });
    },

    template: '<ul class="list" ng-class="{\'list-editing\': isEditing}" ng-transclude>\
              </ul>',

    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr) {
        var lv = new ionic.views.List({
          el: $element[0],
          onRefreshOpening: function(ratio) { $scope.onRefreshOpening({ratio: ratio}) },
          onRefreshHolding: function() { $scope.onRefreshHolding(); },
          onRefresh: function() { $scope.onRefresh(); }
        });

        if(attr.animation) {
          $element.addClass(attr.animation);
        }
      };
    }
  };
});

})();
;
(function() {
'use strict';

angular.module('ionic.ui.loading', [])

.directive('loading', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    link: function($scope, $element){
      $scope.$on('$destroy', function() {
        $element.remove();
      });
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
(function() {
'use strict';

angular.module('ionic.ui.nav', ['ionic.service.templateLoad', 'ionic.service.gesture', 'ngAnimate'])

.controller('NavCtrl', ['$scope', '$element', '$animate', '$compile', 'TemplateLoader', function($scope, $element, $animate, $compile, TemplateLoader) {
  var _this = this;

  angular.extend(this, ionic.controllers.NavController.prototype);

  ionic.controllers.NavController.call(this, {
    content: {
    },
    navBar: {
      shouldGoBack: function() {
      },
      show: function() {
        this.isVisible = true;
      },
      hide: function() {
        this.isVisible = false;
      },
      setTitle: function(title) {
        $scope.navController.title = title;
      },
      showBackButton: function(show) {
      },
    }
  });

  this.handleDrag = function(e) {
  };

  this.endDrag = function(e) {
  };

  this.pushFromTemplate = function(templateUrl) {
    var childScope = $scope.$new();
    childScope.isVisible = true;

    TemplateLoader.load(templateUrl).then(function(templateString) {
      var el = $compile(templateString)(childScope, function(cloned, scope) {
        angular.element($element[0].children[1].firstElementChild).append(cloned);
      });
    });
  };

  $scope.pushController = function(scope, element) {
    _this.push(scope);

    /*
    var old = angular.element($element[0].children[1]);
    $animate.enter(element, $element, $element[0].firstElementChild, function() {
    });
    $animate.leave(old, function() {
    });
    */
  };

  $scope.navController = this;
}])

.directive('navs', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    controller: 'NavCtrl',
    //templateUrl: 'ext/angular/tmpl/ionicTabBar.tmpl.html',
    template: '<div class="view" ng-transclude></div>',
  };
})

.directive('navBar', function() {
  return {
    restrict: 'E',
    require: '^navs',
    replace: true,
    scope: true,
    template: '<header class="bar bar-header bar-dark nav-bar" ng-class="{hidden: !navController.navBar.isVisible}">' + 
        '<a href="#" ng-click="goBack()" class="button" ng-if="navController.controllers.length > 1">Back</a>' +
        '<h1 class="title">{{navController.getTopController().title}}</h1>' + 
      '</header>',
    link: function(scope, element, attrs, navCtrl) {
      scope.navController = navCtrl;
      scope.$watch('navController.controllers.length', function(value) {
      });
      scope.goBack = function() {
        navCtrl.pop();
      };
    }
  };
})

.directive('navContent', ['Gesture', '$animate', function(Gesture, $animate) {
  return {
    restrict: 'ECA',
    require: '^navs',
    scope: true,
    transclude: 'element',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, navCtrl) {
        var lastParent, lastIndex, childScope, childElement;

        $scope.title = $attr.title;

        if($attr.navBar === "false") {
          navCtrl.hideNavBar();
        } else {
          navCtrl.showNavBar();
        }

        $scope.pushController($scope, $element);

        
        $scope.$watch('isVisible', function(value) {
          if(childElement) {
            $animate.leave(childElement);
            childElement = undefined;
          }
          if(childScope) {
            childScope.$destroy();
            childScope = undefined;
          }
          if(value) {
            childScope = $scope.$new();
            transclude(childScope, function(clone) {
              childElement = clone;
              Gesture.on('drag', function(e) {
                //navCtrl.handleDrag(e);
                console.log('Content drag', e);
              }, childElement[0]);

              Gesture.on('release', function(e) {
                //navCtrl._endDrag(e);
              }, childElement[0]);

              var title = $element.parent().parent().parent()[0].querySelector('.title');
              $animate.enter(clone, $element.parent(), $element);
              $animate.addClass(angular.element(title), 'slide-left-fade', function() {
                $animate.removeClass(angular.element(title), 'slide-left-fade', function() {
                });
              });
            });
          }
        });
      }
    }
  };
}]);

})();
;
;
(function() {
'use strict';

/**
 * @description
 * The sideMenuCtrl lets you quickly have a draggable side
 * left and/or right menu, which a center content area.
 */

angular.module('ionic.ui.sideMenu', ['ionic.service.gesture'])

/**
 * The internal controller for the side menu controller. This
 * extends our core Ionic side menu controller and exposes
 * some side menu stuff on the current scope.
 */
.controller('SideMenuCtrl', function($scope) {
  var _this = this;

  angular.extend(this, ionic.controllers.SideMenuController.prototype);

  ionic.controllers.SideMenuController.call(this, {
    left: {
      width: 270,
      pushDown: function() {
        $scope.leftZIndex = -1;
      },
      bringUp: function() {
        $scope.leftZIndex = 0;
      }
    },
    right: {
      width: 270,
      pushDown: function() {
        $scope.rightZIndex = -1;
      },
      bringUp: function() {
        $scope.rightZIndex = 0;
      }
    }
  });

  $scope.contentTranslateX = 0;

  $scope.sideMenuCtrl = this;
})

.directive('sideMenuCtrl', function() {
  return {
    restrict: 'CA',
    controller: 'SideMenuCtrl',
  };
})

.directive('sideMenuContent', ['Gesture', function(Gesture) {
  return {
    restrict: 'CA',
    require: '^sideMenuCtrl',
    scope: true,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, sideMenuCtrl) {

        Gesture.on('drag', function(e) {
          sideMenuCtrl._handleDrag(e);
        }, $element[0]);

        Gesture.on('release', function(e) {
          sideMenuCtrl._endDrag(e);
        }, $element[0]);

        sideMenuCtrl.setContent({
          onDrag: function(e) {},
          endDrag: function(e) {},
          getTranslateX: function() {
            return $scope.contentTranslateX || 0;
          },
          setTranslateX: function(amount) {
            $scope.contentTranslateX = amount;
            $element[0].style.webkitTransform = 'translate3d(' + amount + 'px, 0, 0)';
          },
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
      };
    }
  };
}])


.directive('menu', function() {
  return {
    restrict: 'E',
    require: '^sideMenuCtrl',
    replace: true,
    transclude: true,
    template: '<div class="menu menu-{{side}}"></div>',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, sideMenuCtrl) {
        $scope.side = attr.side;

        if($scope.side == 'left') {
          sideMenuCtrl.left.isEnabled = true;
        } else if($scope.side == 'right') {
          sideMenuCtrl.right.isEnabled = true;
        }

        $element.append(transclude($scope));
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
 * The sideMenuCtrl lets you quickly have a draggable side
 * left and/or right menu, which a center content area.
 */

angular.module('ionic.ui.slideBox', [])

/**
 * The internal controller for the side menu controller. This
 * extends our core Ionic side menu controller and exposes
 * some side menu stuff on the current scope.
 */
.controller('SlideBoxCtrl', ['$scope', '$element', function($scope, $element) {
  $scope.slides = [];
  this.slideAdded = function() {
    $scope.slides.push({});
  };
}])

.directive('slideBox', ['$compile', function($compile) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    controller: 'SlideBoxCtrl',
    scope: {},
    template: '<div class="slide-box">\
            <div class="slide-box-slides" ng-transclude>\
            </div>\
          </div>',

    postLink: function() {
      console.log('POST LINK');
    },
    link: function($scope, $element, $attr, slideBoxCtrl) {
      // If the pager should show, append it to the slide box
      if($attr.showPager !== "false") {
        var childScope = $scope.$new();
        var pager = $compile('<pager></pager>')(childScope);
        $element.append(pager);

        $scope.slideBox = new ionic.views.SlideBox({
          el: $element[0]
        });
      }
    }
  }
}])

.directive('slide', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^slideBox',
    transclude: true,
    template: '<div class="slide-box-slide" ng-transclude></div>',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, slideBoxCtrl) {
        slideBoxCtrl.slideAdded();
      }
    }
  }
})

.directive('pager', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^slideBox',
    template: '<div class="slide-box-pager"><span ng-repeat="slide in slides"><i class="icon-record"></i></span></div>'
  }

});

})();
;
angular.module('ionic.ui.tabs', ['ngAnimate'])

.controller('TabsCtrl', ['$scope', '$element', '$animate', function($scope, $element, $animate) {
  var _this = this;

  angular.extend(this, ionic.controllers.TabBarController.prototype);

  ionic.controllers.TabBarController.call(this, {
    tabBar: {
      tryTabSelect: function() {},
      setSelectedItem: function(index) {},
      addItem: function(item) {}
    }
  });

  this.add = function(controller) {
    this.addController(controller);
      this.select(0);
  };

  this.select = function(controllerIndex) {
    var oldIndex = _this.getSelectedIndex();

    $scope.activeAnimation = $scope.animation;
    /*
    if(controllerIndex > oldIndex) {
    } else if(controllerIndex < oldIndex) {
      $scope.activeAnimation = $scope.animation + '-reverse';
    }
    */
    _this.selectController(controllerIndex);
  };

  $scope.controllers = this.controllers;
}])

.directive('tabs', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      animation: '@'
    },
    transclude: true,
    controller: 'TabsCtrl',
    //templateUrl: 'ext/angular/tmpl/ionicTabBar.tmpl.html',
    template: '<div class="view"><tab-controller-bar></tab-controller-bar></div>',
    compile: function(element, attr, transclude, tabsCtrl) {
      return function($scope, $element, $attr) {
        $scope.$watch('activeAnimation', function(value) {
          //$element.removeClass($scope.animation + ' ' + $scope.animation + '-reverse');
          $element.addClass($scope.activeAnimation);
        });
        transclude($scope, function(cloned) {
          $element.prepend(cloned);
        });
      };
    }
  };
})

// Generic controller directive
.directive('tab', ['$animate', function($animate) {
  return {
    restrict: 'E',
    replace: true,
    require: '^tabs',
    scope: true,
    transclude: 'element',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, tabsCtrl) {
        var childScope, childElement;

        
        $scope.$watch('isVisible', function(value) {
          if(childElement) {
            $animate.leave(childElement);
            childElement = undefined;
          }
          if(childScope) {
            childScope.$destroy();
            childScope = undefined;
          }
          if(value) {
            childScope = $scope.$new();
            transclude(childScope, function(clone) {
              childElement = clone;
              childElement.addClass('view-full');
              $animate.enter(clone, $element.parent(), $element);
            });
          }
        });

        $scope.title = $attr.title;
        $scope.icon = $attr.icon;
        $scope.iconOn = $attr.iconOn;
        $scope.iconOff = $attr.iconOff;
        tabsCtrl.add($scope);

      }
    }
  };
}])


.directive('tabControllerBar', function() {
  return {
    restrict: 'E',
    require: '^tabs',
    transclude: true,
    replace: true,
    scope: true,
    template: '<div class="tabs tabs-primary">' + 
      '<tab-controller-item title="{{controller.title}}" icon="{{controller.icon}}" icon-on="{{controller.iconOn}}" icon-off="{{controller.iconOff}}" active="controller.isVisible" index="$index" ng-repeat="controller in controllers"></tab-controller-item>' + 
    '</div>'
  };
})

.directive('tabControllerItem', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^tabs',
    scope: {
      title: '@',
      iconOn: '@',
      iconOff: '@',
      active: '=',
      tabSelected: '@',
      index: '='
    },
    link: function(scope, element, attrs, tabsCtrl) {
      scope.selectTab = function(index) {
        tabsCtrl.select(scope.index);
      };
    },
    template: 
      '<a href="#" ng-class="{active:active}" ng-click="selectTab()" class="tab-item">' +
        '<i class="{{icon}}" ng-if="icon"></i>' +
        '<i class="{{iconOn}}" ng-if="active"></i>' +
        '<i class="{{iconOff}}" ng-if="!active"></i> {{title}}' +
      '</a>'
  };
})

.directive('tabBar', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="tabs tabs-primary" ng-transclude>' + 
    '</div>'
  }
})

.directive('tabItem', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      title: '@',
      iconOn: '@',
      iconOff: '@',
      active: '=',
      tabSelected: '@',
      index: '='
    },
    link: function(scope, element, attrs) {
    },
    template: 
      '<a href="#" ng-class="{active:active}" ng-click="tabSelected()" class="tab-item">' +
        '<i class="{{icon}}" ng-if="icon"></i>' +
        '<i class="{{iconOn}}" ng-if="active"></i>' +
        '<i class="{{iconOff}}" ng-if="!active"></i> {{title}}' +
      '</a>'
  };
});
;
angular.module('ionic.ui.toggle', [])

// The content directive is a core scrollable content area
// that is part of many View hierarchies
.directive('toggle', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: true,
    template: '<div class="toggle"><input type="checkbox"><div class="handle"></div></div>',

    link: function($scope, $element, $attr, ngModel) {
      var checkbox, handle;

      if(!ngModel) { return; }

      checkbox = $element.children().eq(0);
      handle = track.children().eq(0);

      if(!checkbox.length || !handle.length) { return; }

      $scope.toggle = new ionic.views.Toggle({ 
        el: $element[0],
        checkbox: checkbox[0],
        handle: handle[0]
      });

      $element.bind('click', function(e) {
        $scope.toggle.tap(e);
        $scope.$apply(function() {
          ngModel.$setViewValue(checkbox[0].checked);
        });
      });

      ngModel.$render = function() {
        $scope.toggle.val(ngModel.$viewValue);
      };
    }
  };
});
