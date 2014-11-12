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

  this.tabMatchesState = function() {
    return this.hrefMatchesState() || this.srefMatchesState() || this.navNameMatchesState();
  };
}]);
