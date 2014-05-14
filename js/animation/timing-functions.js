(function(window) {

  // Namespace
  ionic.Animation = ionic.Animation || {};


  ionic.Animation.TimingFn = {
    'spring': function(duration) {
      return function(t) {
        return ionic.Animation.Dynamics.Spring(t, duration);
      };
    },
    'gravity': function(duration) {
      return function(t) {
        return ionic.Animation.Dynamics.Gravity(t, duration);
      };
    },
    'linear': function(duration) {
      return function(t) {
        return ionic.Animation.Bezier.linear(t, duration);
      };
    },
    'ease': function(duration) {
      return function(t) {
        return ionic.Animation.Bezier.ease(t, duration);
      };
    },
    'ease-in': function(duration) {
      return function(t) {
        return ionic.Animation.Bezier.easeIn(t, duration);
      };
    },
    'ease-out': function(duration) {
      return function(t) {
        return ionic.Animation.Bezier.easeOut(t, duration);
      };
    },
    'ease-in-out': function(duration) {
      return function(t) {
        return ionic.Animation.Bezier.easeInOut(t, duration);
      };
    },
    'cubic-bezier': function(x1, y1, x2, y2, duration) {
      var bz = ionic.Animation.Bezier.cubicBezier(x1, y1, x2, y2);//, t, duration);
      return function(t) {
        return bz(t, duration);
      };
    }
  };
})(window);
