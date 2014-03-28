var Vector = function(x, y) {
  this.x = x;
  this.y = y;
};
Vector.prototype = {
};

function v(x, y) { return new Vector(x, y); }


var CollisionBehavior = function() {
}

var GravityBehavior = function() {
}

var PhysicsEngine = {
};

angular.module('ionic.service.dynamics', [])

/**
 * @ngdoc service
 * @name $ionicDynamics
 * @module ionic
 * @description An angular service exposing ionic's dynamics and Physics based UI features.
 * {@link ionic.utility:ionic.EventController}'s gestures.
 */
.factory('$ionicDynamics', [function() {
  return {
  };
}])

.factory('$ionicDynamicAnimator', [function() {
  return {
  };
}]);
