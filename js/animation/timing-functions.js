(function(window) {

  // Namespace
  ionic.Animation = ionic.Animation || {};


  ionic.Animation.TimingFn = {
    'ease-in-out': function(duration) {
      var bz = ionic.Animation.Bezier.getCubicBezier(0.42, 0.0, 0.58, 1.0, duration);
      return function(t) {
        //console.log(t);
        return bz(t);
      }
      /*
      0.42, 0.0, 0.58, 1.0)

      t /= d/2;
      if (t < 1) return c/2*t*t*t + b;
      t -= 2;
      return c/2*(t*t*t + 2) + b;
      */
    }
  };
})(window);
