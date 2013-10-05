angular.module('ionic.ui', ['ionic.ui.content', 'ionic.ui.tabs', 'ionic.ui.nav', 'ionic.ui.sideMenu']);
;
angular.module('ionic.service.actionSheet', ['ionic.service', 'ionic.ui.actionSheet'])

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
        scope.$destroy();
        opts.cancel();
      }

      scope.buttonClicked = function(index) {
        // Check if the button click event returned true, which means
        // we can close the action sheet
        if((opts.buttonClicked && opts.buttonClicked(index)) === true) {
          scope.$destroy();
        }
      };

      scope.destructiveButtonClicked = function() {
        // Check if the destructive button click event returned true, which means
        // we can close the action sheet
        if((opts.destructiveButtonClicked && opts.destructiveButtonClicked()) === true) {
          scope.$destroy();
        }
      }

      // Compile the template
      var element = $compile('<action-sheet buttons="buttons"></action-sheet>')(scope);

      var scope = element.scope();

      $document[0].body.appendChild(element[0]);

      var sheet = ionic.views.ActionSheet({el: element[0] });
      scope.sheet = sheet;
      return sheet;
    }
  };
}]);
;
;
angular.module('ionic.service.modal', ['ionic.service'])


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

      var modal = ionic.views.Modal({el: element[0] });
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
angular.module('ionic.service', [])

.factory('TemplateLoader', ['$q', '$http', '$templateCache', function($q, $http, $templateCache) {
  return {
    load: function(url) {
      var deferred = $q.defer();

      $http.get(url, { cache: $templateCache }).success(function(html) {
        deferred.resolve(html && html.trim());
      });

      return deferred.promise;
    }
  }
}]);
;
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
    template: '<div class="action-sheet">' +
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
  }
});
;
angular.module('ionic.ui.content', [])

// The content directive is a core scrollable content area
// that is part of many View hierarchies
.directive('content', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: false,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr) {
        $element.addClass('content');

        if(attr.hasHeader) {
          $element.addClass('has-header');
        }
        if(attr.hasTabs) {
          $element.addClass('has-tabs');
        }
      }
    }
  }
})
;
angular.module('ionic.ui.nav', ['ionic.service'])

.controller('NavCtrl', ['$scope', '$element', '$compile', 'TemplateLoader', function($scope, $element, $compile, TemplateLoader) {
  var _this = this;

  angular.extend(this, ionic.controllers.NavController.prototype);

  this.pushFromTemplate = function(tmpl) {
    data = TemplateLoader.load(tmpl).then(function(data) {
      console.log('Nav loaded template', data);

      var childScope = $scope.$new();
      childScope.isVisible = true;
      
      $compile(data)(childScope, function(cloned, scope) {
        $element.append(cloned);
      });
    });
  }

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

  $scope.pushController = function(scope) {
    _this.push(scope);
  };

  $scope.navController = this;
}])

.directive('navCtrl', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    controller: 'NavCtrl',
    //templateUrl: 'ext/angular/tmpl/ionicTabBar.tmpl.html',
    template: '<div class="view" ng-transclude></div>',
    compile: function(element, attr, transclude, navCtrl) {
      return function($scope, $element, $attr) {
      };
    }
  }
})

.directive('navBar', function() {
  return {
    restrict: 'E',
    require: '^navCtrl',
    transclude: true,
    replace: true,
    scope: true,
    template: '<header class="bar bar-header bar-dark nav-bar" ng-class="{hidden: !navController.navBar.isVisible}">' + 
        '<a href="#" ng-click="goBack()" class="button" ng-if="navController.controllers.length > 1">Back</a>' +
        '<h1 class="title">{{navController.getTopController().title}}</h1>' + 
      '</header>',
    link: function(scope, element, attrs, navCtrl) {
      scope.navController = navCtrl;
      scope.goBack = function() {
        navCtrl.pop();
      }
    }
  }
})

.directive('navContent', function() {
  return {
    restrict: 'ECA',
    require: '^navCtrl',
    scope: true,
    link: function(scope, element, attrs, navCtrl) {
      scope.title = attrs.title;

      if(attrs.navBar === "false") {
        navCtrl.hideNavBar();
      } else {
        navCtrl.showNavBar();
      }

      scope.isVisible = true;
      scope.pushController(scope);

      scope.$watch('isVisible', function(value) {
        console.log('Visiblity changed', value);
        if(value) {
          element[0].classList.remove('hidden');
        } else {
          element[0].classList.add('hidden');
        }
      });
    }
  }
});
;
angular.module('ionic.ui.sideMenu', [])

.controller('SideMenuCtrl', function($scope) {
  var _this = this;

  angular.extend(this, ionic.controllers.SideMenuController.prototype);

  ionic.controllers.SideMenuController.call(this, {
    left: {
      width: 270,
      isEnabled: true,
      pushDown: function() {
        $scope.leftZIndex = -1;
      },
      bringUp: function() {
        $scope.leftZIndex = 0;
      }
    },
    right: {
      width: 270,
      isEnabled: true,
      pushDown: function() {
        $scope.rightZIndex = -1;
      },
      bringUp: function() {
        $scope.rightZIndex = 0;
      }
    }
  });

  $scope.contentTranslateX = 0;
})

.directive('sideMenuCtrl', function() {
  return {
    restrict: 'E',
    controller: 'SideMenuCtrl',
    replace: true,
    transclude: true,
    template: '<div class="view" ng-transclude></div>',
  }
})

.directive('sideMenuContent', function() {
  return {
    restrict: 'CA',
    require: '^sideMenuCtrl',
    scope: true,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, sideMenuCtrl) {
        window.ionic.onGesture('drag', function(e) {
          sideMenuCtrl._handleDrag(e);
        }, $element[0]);

        window.ionic.onGesture('release', function(e) {
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
            $scope.$apply();
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
  }
})


.directive('menu', function() {
  return {
    restrict: 'E',
    require: '^sideMenuCtrl',
    replace: true,
    transclude: true,
    scope: true,
    template: '<div class="menu menu-{{side}}" ng-transclude></div>',
    compile: function(element, attr, transclude, sideMenuCtrl) {
      return function($scope, $element, $attr) {
        $scope.side = attr.side;
      };
    }
  }
})
;
angular.module('ionic.ui.tabs', [])

.controller('TabsCtrl', function($scope) {
  var _this = this;

  angular.extend(this, ionic.controllers.TabBarController.prototype);

  ionic.controllers.TabBarController.call(this, {
    tabBar: {
      tryTabSelect: function() {},
      setSelectedItem: function(index) {
        console.log('TAB BAR SET SELECTED INDEX', index);
      },
      addItem: function(item) {
        console.log('TAB BAR ADD ITEM', item);
      }
    }
  });

  $scope.controllers = this.controllers;

  $scope.$watch('controllers', function(newV, oldV) {
    console.log("CControlelrs changed", newV, oldV);
    //$scope.$apply();
  });
})

.directive('tabController', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    transclude: true,
    controller: 'TabsCtrl',
    //templateUrl: 'ext/angular/tmpl/ionicTabBar.tmpl.html',
    template: '<div class="view"><div ng-transclude></div><tab-bar></tab-bar></div>',
    compile: function(element, attr, transclude, tabsCtrl) {
      return function($scope, $element, $attr) {
      };
    }
  }
})

// Generic controller directive
.directive('tabContent', function() {
  return {
    restrict: 'CA',
    replace: true,
    transclude: true,
    template: '<div ng-show="isVisible" ng-transclude></div>',
    require: '^tabController',
    scope: true,
    link: function(scope, element, attrs, tabsCtrl) {
      scope.title = attrs.title;
      scope.icon = attrs.icon;
      tabsCtrl.addController(scope);
    }
  }
})


.directive('tabBar', function() {
  return {
    restrict: 'E',
    require: '^tabController',
    transclude: true,
    replace: true,
    scope: true,
    template: '<div class="tabs tabs-primary">' + 
      '<tab-item title="{{controller.title}}" icon="{{controller.icon}}" active="controller.isVisible" index="$index" ng-repeat="controller in controllers"></tab-item>' + 
    '</div>'
  }
})

.directive('tabItem', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^tabController',
    scope: {
      title: '@',
      icon: '@',
      active: '=',
      tabSelected: '@',
      index: '='
    },
    link: function(scope, element, attrs, tabsCtrl) {
      console.log('Linked item', scope);
      scope.selectTab = function(index) {
        tabsCtrl.selectController(scope.index);
      };
    },
    template: 
      '<a href="#" ng-class="{active:active}" ng-click="selectTab()" class="tab-item">' +
        '<i class="{{icon}}"></i> {{title}}' +
      '</a>'
  }
});
