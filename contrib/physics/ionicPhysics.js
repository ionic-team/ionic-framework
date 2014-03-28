angular.module('ionic.contrib.physics', ['ionic'])

/**
 * @ngdoc service
 * @name $ionicDynamics
 * @module ionic
 * @description An angular service exposing ionic's dynamics and Physics based UI features.
 * {@link ionic.utility:ionic.EventController}'s gestures.
 */
.factory('$ionicPhysics', ['$log', '$document', function($log, $document) {
  return {
    init: function($viewportEl) {
      this._viewportEl = $viewportEl[0];

      console.log($viewportEl);

			var stage = [
                    $viewportEl[0].offsetLeft,
                    $viewportEl[0].offsetTop,
                    $viewportEl[0].offsetWidth + 280,
                    $viewportEl[0].offsetHeight
                  ];

      console.log('Stage', stage);

      this._tapPos = Physics.vector();
      this._tapPosOld = Physics.vector();
      this._tapOffset = Physics.vector();

      this._stage = stage;

	    this._worldAABB = Physics.aabb.apply(null, stage);

      this._bodies = [];

      this._initWorld();
    },
    _initWorld: function() {
			this._gravity = [1, 0];
      this._delta = [0, 0];

			var timeStep = 1000 / 260; 
			var iterations = 16;

      var world = Physics({
        timestep: timeStep,
        maxIPF: iterations
      });

      world.subscribe('integrate:positions', this.integrate, this);


      // CREATE BEHAVIORS AND SHIT

      // walls
      edgeBounce = Physics.behavior('edge-collision-detection', {
        aabb: this._worldAABB,
        restitution: 0.4,
        cof: 0.5
      });

      world.add( edgeBounce );

      world.add( Physics.behavior('body-collision-detection', { checkAll: false }) );
      world.add( Physics.behavior('sweep-prune') );
      world.add( Physics.behavior('body-impulse-response') );

      // constraints
      constraints = Physics.behavior('verlet-constraints', {
        iterations: 2
      });

      world.add( constraints );

      // add gravity
      gravityBehavior = Physics.behavior('constant-acceleration', { acc: this._gravity });
      world.add( gravityBehavior );
      this._gravityBehavior = gravityBehavior;

      this._world = world;
    },

    // Process one step of the integration
    integrate: function(dt) {
      if(this._selectedBody) {
        // if we have a body, we need to move it the the new mouse position.
        // we'll also track the velocity of the mouse movement so that when it's released
        // the body can be "thrown"
        this._selectedBody.state.pos.clone(this._tapPos).vsub(this._tapOffset);
        this._selectedBody.state.vel.clone(this._selectedBody.state.pos).vsub(this._tapPosOld).vadd(this._tapOffset).mult(1 / 30);
        this._selectedBody.state.vel.clamp({ x: -1, y: -1 }, { x: 1, y: 1 });
        return;
      }

      if(!this._selectedBody) {
        return;
      }

    },

    addBody: function($element) {
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

      this._world.add(body);
    },

    setGravity: function(gravity) {
      console.log('Gravity', gravity);
      /*
      this._gravity = gravity;
      this._gravityBehavior.setAcceleration(gravity);
      */
    },

    go: function() {
      // renderer
      var renderer = Physics.renderer('dom', {
        el: this._viewportEl,
        width: this._stage[2],
        height: this._stage[3]
      });

      this._world.add(renderer);
      // position the views
      this._world.render();

      Physics.util.ticker.subscribe(ionic.proxy(this._loop, this));
      Physics.util.ticker.start();
    },
    _loop: function(time) {
	    this._delta[0] += (0 - this._delta[0]) * .5;
			this._delta[1] += (0 - this._delta[1]) * .5;

      this._gravityBehavior.setAcceleration({ 
        x: this._gravity[0] * 5e-4 + this._delta[0], 
        //y: this._gravity[1] * 5e-4 + this._delta[1]
      });

      this._world.step(time);
      this._world.render();
    },


    startTouch: function(e) {
      e.gesture.srcEvent.preventDefault();

      
      var x = e.gesture.touches[0].pageX;
      var y = e.gesture.touches[0].pageY;

      this._tapPos.set(x, y);

		  var body = this._world.findOne({ $at: Physics.vector(x, y) });
      console.log('Starting touch on', body);

      this._selectedBody = body;

      if(body) {
        body.fixed = true;
        this._tapOffset.clone(this._tapPos).vsub(body.state.pos);

        /*
        var md = Physics.body('point', {
          x: x,
          y: y
        });

        this._tapJoint = constraints.distanceConstraint(md, body, 0.2);
        */
      }
    },
    touchDrag: function(e) {
      e.gesture.srcEvent.preventDefault();
      this._tapPosOld.clone(this._tapPos);

      var x = e.gesture.touches[0].pageX;
      var y = e.gesture.touches[0].pageY;
      this._tapPos.set(x, y);
    },
    endTouch: function(e) {
      e.gesture.srcEvent.preventDefault();
      console.log('Ending touch');

      var x = e.gesture.touches[0].pageX;
      var y = e.gesture.touches[0].pageY;

      this._tapPosOld.clone(this._tapPos);
      this._tapPos.set(x, y);

      if(this._selectedBody) {
        console.log("not fixed");
        this._selectedBody.fixed = false;
      }

      this._tapJoint = null;
      this._selectedBody = null;
    }
  };
}])

.factory('$ionicDynamicAnimator', [function() {
  return {
  };
}])

.directive('ionBody', ['$timeout', '$ionicBind', '$ionicPhysics', function($timeout, $ionicBind, $ionicPhysics) {
  return {
    restrict: 'E',
    scope: true,
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

      function postlink($scope, $element, $attr) {
        $timeout(function() {
          $ionicPhysics.addBody($element);
        });
      }
    }
  }
}])

.directive('ionScene', ['$timeout', '$ionicBind', '$ionicPhysics', '$ionicGesture', function($timeout, $ionicBind, $ionicPhysics, $ionicGesture) {
  return {
    restrict: 'AE',
    scope: true,
    compile: function(element, attr) {
      return { pre: prelink, post: postlink };

      function prelink($scope, $element, $attr) {
        $element.addClass('physics-body');

        $ionicBind($scope, $attr, {
          gravity: '='
        });

        $scope.$watch('gravity', function(gravity) {
          $ionicPhysics.setGravity(gravity);
        });
      }

      function postlink($scope, $element, $attr) {
        $element.addClass('scene');

        console.log('Gravity', $scope.gravity);

        $ionicPhysics.init($element);

        $ionicGesture.on('touch', function(e) {
          $ionicPhysics.startTouch(e);
        }, $element);

        $ionicGesture.on('dragstop', function(e) {
          $ionicPhysics.endTouch(e);
        }, $element);

        $ionicGesture.on('release', function(e) {
          $ionicPhysics.endTouch(e);
        }, $element);

        $ionicGesture.on('drag', function(e) {
          $ionicPhysics.touchDrag(e);
        }, $element);

        $ionicPhysics.go();
      }
    }
  }
}])
