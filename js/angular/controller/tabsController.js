IonicModule
.controller('$ionicTabs', [
  '$scope',
  '$element',
  '$ionicHistory',
function($scope, $element, $ionicHistory) {
  var self = this;
  var selectedTab = null;
  var selectedTabIndex;
  self.tabs = [];

  self.selectedIndex = function() {
    return self.tabs.indexOf(selectedTab);
  };
  self.selectedTab = function() {
    return selectedTab;
  };

  self.add = function(tab) {
    $ionicHistory.registerHistory(tab);
    self.tabs.push(tab);
  };

  self.remove = function(tab) {
    var tabIndex = self.tabs.indexOf(tab);
    if (tabIndex === -1) {
      return;
    }
    //Use a field like '$tabSelected' so developers won't accidentally set it in controllers etc
    if (tab.$tabSelected) {
      self.deselect(tab);
      //Try to select a new tab if we're removing a tab
      if (self.tabs.length === 1) {
        //do nothing if there are no other tabs to select
      } else {
        //Select previous tab if it's the last tab, else select next tab
        var newTabIndex = tabIndex === self.tabs.length - 1 ? tabIndex - 1 : tabIndex + 1;
        self.select(self.tabs[newTabIndex]);
      }
    }
    self.tabs.splice(tabIndex, 1);
  };

  self.deselect = function(tab) {
    if (tab.$tabSelected) {
      selectedTab = selectedTabIndex = null;
      tab.$tabSelected = false;
      (tab.onDeselect || angular.noop)();
      tab.$broadcast && tab.$broadcast('$ionicHistory.deselect');
    }
  };

  self.select = function(tab, shouldEmitEvent) {
    var tabIndex;
    if (angular.isNumber(tab)) {
      tabIndex = tab;
      if (tabIndex >= self.tabs.length) return;
      tab = self.tabs[tabIndex];
    } else {
      tabIndex = self.tabs.indexOf(tab);
    }

    if (arguments.length === 1) {
      shouldEmitEvent = !!(tab.navViewName || tab.uiSref);
    }

    if (selectedTab && selectedTab.$historyId == tab.$historyId) {
      if (shouldEmitEvent) {
        $ionicHistory.goToHistoryRoot(tab.$historyId);
      }

    } else if (selectedTabIndex !== tabIndex) {
      forEach(self.tabs, function(tab) {
        self.deselect(tab);
      });

      selectedTab = tab;
      selectedTabIndex = tabIndex;

      if (self.$scope && self.$scope.$parent) {
        self.$scope.$parent.$activeHistoryId = tab.$historyId;
      }

      //Use a funny name like $tabSelected so the developer doesn't overwrite the var in a child scope
      tab.$tabSelected = true;
      (tab.onSelect || angular.noop)();

      if (shouldEmitEvent) {
        $scope.$emit('$ionicHistory.change', {
          type: 'tab',
          tabIndex: tabIndex,
          historyId: tab.$historyId,
          navViewName: tab.navViewName,
          hasNavView: !!tab.navViewName,
          title: tab.title,
          url: tab.href,
          uiSref: tab.uiSref
        });
      }
    }
  };

  self.hasActiveScope = function() {
    for (var x = 0; x < self.tabs.length; x++) {
      if ($ionicHistory.isActiveScope(self.tabs[x])) {
        return true;
      }
    }
    return false;
  };

}]);
