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
                    $viewportEl[0].offsetWidth,
                    $viewportEl[0].offsetHeight
                  ];

      $log.log('Stage', stage);

      this._stage = stage;

	    this._worldAABB = Physics.aabb.apply(null, stage);

      this._bodies = [];

      this._initWorld();
    },
    _initWorld: function() {
			this._gravity = { x: 0, y: 1 };
      this._delta = [0, 0];

			var timeStep = 1000 / 260; 
			var iterations = 16;

      var world = Physics({
        timestep: timeStep,
        maxIPF: iterations
      });


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

    addBody: function($element) {
      var properties = [parseFloat($element[0].style.left), parseFloat($element[0].style.top), parseFloat($element[0].style.width), parseFloat($element[0].style.height)];

      console.log(properties);

      $element[0].style.position = 'absolute';
      $element[0].style.left = (-properties[2]/2) + 'px';
      $element[0].style.top = (-properties[3]/2);

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
        ]
      });
					
      body.view = $element[0];

      this._bodies.push(body);
    },

    go: function() {
      console.log('GOING', this._bodies);
      this._world.add( this._bodies );
      // renderer
      var renderer = Physics.renderer('dom', {
        el: this._viewportEl,
        width: this._stage[2],
        height: this._stage[3]
      });

      this._world.add(renderer);
      // position the views
      this._world.render();
      this._world.pause();

      Physics.util.ticker.subscribe(ionic.proxy(this._loop, this));
      Physics.util.ticker.start();
		  this._world.unpause();


      // magic to trigger GPU
      /*
      this._world.subscribe('render', function( data ){
        var style;
        for ( var i = 0, l = data.bodies.length; i < l; ++i ){
          style = data.bodies[ i ].view.style;
          style[ionic.CSS.TRANSFORM] += ' translateZ(0)';
        }
      });
      */
    },
    _loop: function(time) {
	    this._delta[0] += (0 - this._delta[0]) * .5;
			this._delta[1] += (0 - this._delta[1]) * .5;

      this._gravityBehavior.setAcceleration({ 
        x: this._gravity.x * 5e-4 + this._delta[0], 
        y: this._gravity.y * 5e-4 + this._delta[1]
      });

      this._world.step(time);
      this._world.render();
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
        $ionicPhysics.addBody($element);
      }
    }
  }
}])

.directive('ionScene', ['$timeout', '$ionicPhysics', function($timeout, $ionicPhysics) {
  return {
    restrict: 'AE',
    link: function($scope, $element, $attr) {
      $element.addClass('scene');

      $ionicPhysics.init($element);

      $timeout(function() {
        $ionicPhysics.go();
      });
    }
  }
}])
