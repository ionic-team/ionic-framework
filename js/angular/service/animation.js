
/**
 * @ngdoc service
 * @name $ionicAnimation
 * @module ionic
 * @description
 *
 * A powerful animation and transition system for Ionic apps.
 *
 * @usage
 *
 * ```js
 * angular.module('mySuperApp', ['ionic'])
 * .controller(function($scope, $ionicAnimation) {
 *    var anim = $ionicAnimate({
 *     // A unique, reusable name
 *     name: 'popIn',
 *
 *     // The duration of an auto playthrough
 *     duration: 0.5,
 *
 *     // How long to wait before running the animation
 *     delay: 0,
 *
 *     // Whether to reverse after doing one run through
 *     autoReverse: false,
 *
 *     // How many times to repeat? -1 or null for infinite
 *     repeat: -1,
 *
 *     // Timing curve to use (same as CSS timing functions), or a function of time "t" to handle it yourself
 *     curve: 'ease-in-out'
 *
 *     onStart: function() {
 *       // Callback on start
 *     },
 *     onEnd: function() {
 *       // Callback on end
 *     },
 *     step: function(amt) {
 *
 *     }
 *   })
 * });
 * ```
 *
 */
IonicModule
.provider('$ionicAnimation', function() {
  var useSlowAnimations = false;
  this.setSlowAnimations = function(isSlow) {
    useSlowAnimations = isSlow;
  };

  this.create = function(animation) {
    return ionic.Animation.create(animation);
  };

  this.$get = [function() {
    return function(opts) {
      opts.useSlowAnimations = useSlowAnimations;
      return ionic.Animation.create(opts);
    };
  }];
});
