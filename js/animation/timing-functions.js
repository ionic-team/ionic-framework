(function(window) {

  // Namespace
  ionic.Animation = ionic.Animation || {};


  ionic.Animation.TimingFn = {
    'linear': function(duration) {
      return function(t) {
        return ionic.Animation.Bezier.linear(t, duration);
      }
    },
    'ease': function(duration) {
      return function(t) {
        return ionic.Animation.Bezier.ease(t, duration);
      }
    },
    'ease-in': function(duration) {
      return function(t) {
        return ionic.Animation.Bezier.easeIn(t, duration);
      }
    },
    'ease-out': function(duration) {
      return function(t) {
        return ionic.Animation.Bezier.easeOut(t, duration);
      }
    },
    'ease-in-out': function(duration) {
      return function(t) {
        return ionic.Animation.Bezier.easeInOut(t, duration);
      }
    }
  };
})(window);
