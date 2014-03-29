angular.module('ionic.contrib.physics', ['ionic'])

.factory('$ionicGravityBehavior', function() {
  return function(vector) {
    return Physics.behavior('constant-acceleration', { acc: {x: vector[0] * 5e-4, y: vector[1] * 5e-4} });
  }
})

.factory('$ionicCollisionBehavior', function() {
  return function(opts) {
    var edgeCollision = Physics.behavior('edge-collision-detection', {
      aabb: opts.bounds,

      // Try 0.4 for a good default
      restitution: opts.elasticity,

      // 0.5 might be nice here
      cof: opts.damping
    });

    var bodyCollision = Physics.behavior('body-collision-detection', {
      checkAll: false
    });

    return {
      addBody: function(body) {
      },
      addBoundary: function(bounds) {
      },
      getEdgeCollisionBehavior: function() {
        return edgeCollision;
      },
      getBodyCollisionBehavior: function() {
        return bodyCollision;
      }
    }
  }
})

.factory('$ionicPushBehavior', function() {
  return function(opts) {
  }
})
.factory('$ionicSnapBehavior', function() {
  return function(opts) {
  }
})
.factory('$ionicAttachBehavior', function() {
  return function(opts) {
  }
})
.factory('$ionicItemBehavior', function() {
  return function(opts) {
  }
})

.factory('$ionicDynamicAnimator', ['$log', '$document', '$ionicGravityBehavior', '$ionicCollisionBehavior', function($log, $document, $ionicGravityBehavior, $ionicCollisionBehavior) {

  return function($viewport) {

    var world, selectedBody, tapPos, tapPosOld, tapOffset;

    this.$viewport = $viewport;
    this.viewport = $viewport[0];
    var stage = [
                  $viewport[0].offsetLeft,
                  $viewport[0].offsetTop,
                  $viewport[0].offsetWidth + 280,
                  $viewport[0].offsetHeight
                ];

    console.log('Built animator with view', $viewport, 'and stage', stage);

    // Some intial finger state stuff
    // TODO: Move this?
    tapPos = Physics.vector();
    tapPosOld = Physics.vector();
    tapOffset = Physics.vector();

    // Process one step of the integration
    var integrate = function(dt) {
      if(selectedBody) {
        // if we have a body, we need to move it the the new mouse position.
        // we'll also track the velocity of the mouse movement so that when it's released
        // the body can be "thrown"
        selectedBody.state.pos.clone(tapPos).vsub(tapOffset);
        selectedBody.state.vel.clone(selectedBody.state.pos).vsub(tapPosOld).vadd(tapOffset).mult(1 / 30);
        selectedBody.state.vel.clamp({ x: -1, y: -1 }, { x: 1, y: 1 });
        return;
      }

      if(!selectedBody) {
        return;
      }
    };

    var initWorld = function() {
      // Hardcoded, good simulation defaults
      var timeStep = 1000 / 260; 
      var iterations = 16;

      world = Physics({
        timestep: timeStep,
        maxIPF: iterations
      });

      world.subscribe('integrate:positions', integrate, this);

      // CREATE BEHAVIORS AND SHIT

      // walls
      var collision = $ionicCollisionBehavior({
        bounds:Physics.aabb.apply(null, stage),
        elasticity: 0.1,
        damping: 1.5,
        checkAll: false
      });

      world.add(collision.getEdgeCollisionBehavior());
      world.add(collision.getBodyCollisionBehavior());

      world.add(Physics.behavior('sweep-prune'));
      world.add(Physics.behavior('body-impulse-response'));

      // Standard verlet constraints
      constraints = Physics.behavior('verlet-constraints', {
        iterations: 2
      });

      world.add(constraints);
    };

    var loop = function(time) {
      world.step(time);
      world.render();
    };

    var go = function() {
      // renderer
      renderer = Physics.renderer('dom', {
        el: viewport,
        width: stage[2],
        height: stage[3]
      });

      world.add(renderer);
      // position the views
      world.render();

      Physics.util.ticker.subscribe(loop);
      Physics.util.ticker.start();
    };

    initWorld();
    go();

    /* MOVE

    console.log('Stage', stage);


    this._stage = stage;

    this._worldAABB = Physics.aabb.apply(null, stage);

    this._bodies = [];

    */
    return {
      addBehavior: function(behavior) {
        world.add(behavior)
      },
      removeBehavior: function(behavior) {
        return world.removeBehavior(behavior);
      },
      removeAllBehaviors: function() {
        world.removeAllBehaviors();
      },

      addView: function($element) {
        var properties = [parseFloat($element[0].style.left), parseFloat($element[0].style.top), parseFloat($element[0].style.width), parseFloat($element[0].style.height)];

        console.log(properties);

        $element[0].style.position = 'absolute';
        $element[0].style.left = (-properties[2]/2) + 'px';
        $element[0].style.top = (-properties[3]/2) + 'px';

        var body = Physics.body('convex-polygon', {
          // centerx
          x: properties[0] + properties[2]/2,
          // centery
          y: properties[1] + properties[3]/2,
          vertices: [
            { x: 0, y: 0 },
            { x: properties[2], y: 0 },
            { x: properties[2], y: properties[3] },
            { x: 0, y: properties[3] }
          ],
          vx: 0,
          cof: 0.99,
          restitution: 0.99,
        });
            
        body.view = $element[0];

        world.add(body);
      },

      startTouch: function(e) {
        e.gesture.srcEvent.preventDefault();

        
        var x = e.gesture.touches[0].pageX;
        var y = e.gesture.touches[0].pageY;

        tapPos.set(x, y);

        var body = world.findOne({ $at: Physics.vector(x, y) });
        console.log('Starting touch on', body);

        selectedBody = body;

        if(body) {
          body.fixed = true;
          tapOffset.clone(tapPos).vsub(body.state.pos);
        }
      },

      touchDrag: function(e) {
        e.gesture.srcEvent.preventDefault();
        tapPosOld.clone(tapPos);

        var x = e.gesture.touches[0].pageX;
        var y = e.gesture.touches[0].pageY;
        tapPos.set(x, y);
      },
      endTouch: function(e) {
        e.gesture.srcEvent.preventDefault();
        console.log('Ending touch');

        var x = e.gesture.touches[0].pageX;
        var y = e.gesture.touches[0].pageY;

        tapPosOld.clone(tapPos);
        tapPos.set(x, y);

        if(selectedBody) {
          console.log("not fixed");
          selectedBody.fixed = false;
        }

        selectedBody = null;
      }
    }
  }
}])

.directive('ionBody', ['$timeout', '$ionicBind', '$ionicDynamicAnimator', function($timeout, $ionicBind, $ionicDynamicAnimator) {
  return {
    restrict: 'E',
    scope: true,
    require: '^ionScene',
    compile: function(element, attr) {
      return { pre: prelink, post: postlink };

      function prelink($scope, $element, $attr) {
        $element.addClass('physics-body');

        $ionicBind($scope, $attr, {
          width: '@',
          height: '@',
          x: '@',
          y: '@'
        });
        $element[0].style.display = 'block';
        $element[0].style.left = $scope.x + 'px',//, -parseInt($scope.width)/2;
        $element[0].style.top = $scope.y + 'px',//-parseInt($scope.height)/2;
        $element[0].style.width = $scope.width + 'px';
        $element[0].style.height = $scope.height + 'px';
      }

      function postlink($scope, $element, $attr, animatorCtrl) {
        $timeout(function() {
          animatorCtrl.addView($element);
        });
      }
    }
  }
}])

.directive('ionScene', ['$timeout', '$ionicBind', '$ionicDynamicAnimator', '$ionicGravityBehavior', '$ionicGesture', function($timeout, $ionicBind, $ionicDynamicAnimator, $ionicGravityBehavior, $ionicGesture) {
  return {
    restrict: 'AE',
    scope: true,
    controller: ['$scope', '$element', function($scope, $element) {
      return $ionicDynamicAnimator($element);
    }],
    compile: function(element, attr) {
      return { pre: prelink, post: postlink };

      function prelink($scope, $element, $attr) {
        $element.addClass('physics-body');

        $ionicBind($scope, $attr, {
          gravity: '='
        });
      }

      function postlink($scope, $element, $attr, animator) {
        $element.addClass('scene');

        $scope.dynamicAnimator = animator;

        $scope.$watch('gravity', function(gravity) {
          var gravity = $ionicGravityBehavior(gravity);
          console.log('Adding gravity', gravity);
          animator.addBehavior(gravity);
        });

        $ionicGesture.on('touch', function(e) {
          animator.startTouch(e);
        }, $element);

        $ionicGesture.on('dragstop', function(e) {
          animator.endTouch(e);
        }, $element);

        $ionicGesture.on('release', function(e) {
          animator.endTouch(e);
        }, $element);

        $ionicGesture.on('drag', function(e) {
          animator.touchDrag(e);
        }, $element);
      }
    }
  }
}])
