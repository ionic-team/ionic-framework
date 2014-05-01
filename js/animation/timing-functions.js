(function(window) {

  // Namespace
  ionic.Animation = ionic.Animation || {};


  ionic.Animation.TimingFn = {
    'linear': function(duration) {
      return function(t) {
        return t;
      }
    },
    'ease': function(duration) {
      var bz = ionic.Animation.Bezier.getCubicBezier(0.25, 0.1, 0.25, 1.0, duration);
      return function(t) {
        return bz(t);
      }
    },
    'ease-in': function(duration) {
      //0.42, 0.0, 1.0, 1.0
      var bz = ionic.Animation.Bezier.getCubicBezier(0.42, 0.0, 1.0, 1.0, duration);
      return function(t) {
        return bz(t);
      }
    },
    'ease-out': function(duration) {
      var bz = ionic.Animation.Bezier.getCubicBezier(0.0, 0.0, 0.58, 1.0, duration);
      return function(t) {
        return bz(t);
      }
    },
    'ease-in-out': function(duration) {
      var bz = ionic.Animation.Bezier.getCubicBezier(0.42, 0.0, 0.58, 1.0, duration);
      return function(t) {
        return bz(t);
      }
    }
  };
})(window);
