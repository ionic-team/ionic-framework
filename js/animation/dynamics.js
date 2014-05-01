(function(window) {

  /**
   * A HUGE thank you to dynamics.js which inspired these dynamics simulations.
   * https://github.com/michaelvillar/dynamics.js
   */

  // Namespace
  ionic.Animation = ionic.Animation || {};


  ionic.Animation.Dynamics = {};

  ionic.Animation.Dynamics.Spring = function(opts) {
    var defaults = {
      frequency: 15,
      friction: 200,
      anticipationStrength: 0,
      anticipationSize: 0
    };
    ionic.extend(this, defaults);

    var maxs = {
      frequency: 100,
      friction: 1000,
      anticipationStrength: 1000,
      anticipationSize: 99
    };

    var mins = {
      frequency: 0,
      friction: 1,
      anticipationStrength: 0,
      anticipationSize: 0
    };
    
    ionic.extend(this, opts);
  };

  ionic.Animation.Dynamics.Spring.prototype = {
    at: function(t) {
      var A, At, a, angle, b, decal, frequency, friction, frictionT, s, v, y0, yS,
        _this = this;
      frequency = Math.max(1, this.frequency);
      friction = Math.pow(20, this.friction / 100);
      s = this.anticipationSize / 100;
      decal = Math.max(0, s);
      frictionT = (t / (1 - s)) - (s / (1 - s));
      if (t < s) {
        A = function(t) {
          var M, a, b, x0, x1;
          M = 0.8;
          x0 = s / (1 - s);
          x1 = 0;
          b = (x0 - (M * x1)) / (x0 - x1);
          a = (M - b) / x0;
          return (a * t * _this.anticipationStrength / 100) + b;
        };
        yS = (s / (1 - s)) - (s / (1 - s));
        y0 = (0 / (1 - s)) - (s / (1 - s));
        b = Math.acos(1 / A(yS));
        a = (Math.acos(1 / A(y0)) - b) / (frequency * (-s));
      } else {
        A = function(t) {
          return Math.pow(friction / 10, -t) * (1 - t);
        };
        b = 0;
        a = 1;
      }
      At = A(frictionT);
      angle = frequency * (t - s) * a + b;
      v = 1 - (At * Math.cos(angle));
      //return [t, v, At, frictionT, angle];
      return v;
    }
  }
})(window);
