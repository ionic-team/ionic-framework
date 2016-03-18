IonicModule
.controller('$ionicTab', [
  '$scope',
  '$ionicHistory',
  '$attrs',
  '$location',
  '$state',
function($scope, $ionicHistory, $attrs, $location, $state) {
  this.$scope = $scope;

  //All of these exposed for testing
  this.hrefMatchesState = function() {
    return $attrs.href && $location.path().indexOf(
      $attrs.href.replace(/^#/, '').replace(/\/$/, '')
    ) === 0;
  };
  this.srefMatchesState = function() {
    return $attrs.uiSref && $state.includes($attrs.uiSref.split('(')[0]);
  };
  this.navNameMatchesState = function() {
    return this.navViewName && $ionicHistory.isCurrentStateNavView(this.navViewName);
  };
  this.stateMatchesViewParents = function() {
    if(typeof $attrs.viewParents == undefined) {
      return false;
    }
    this.viewParentMatched = false;
    this.viewParents = $attrs.viewParents.split(' ');
    for(var i = 0; i < this.viewParents.length; i++) {
      if($state.includes(this.viewParents[i])) {
        this.viewParentMatched = true;
      }
    }
    return this.viewParentMatched;
  };
  this.tabMatchesState = function() {
    return this.hrefMatchesState() || this.srefMatchesState() || this.navNameMatchesState() || this.stateMatchesViewParents();
  };
}]);
