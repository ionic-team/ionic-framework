(function(window) {

  /**
   * A HUGE thank you to dynamics.js which inspired these dynamics simulations.
   * https://github.com/michaelvillar/dynamics.js
   *
   * Also licensed under MIT
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
  };

  ionic.Animation.Dynamics.Gravity = function(opts) {
    this.options = {
      bounce: 40,
      gravity: 1000,
      initialForce: false
    };
    ionic.extend(this.options, opts);
    this.curves = [];
    this.init();
  };

  ionic.Animation.Dynamics.Gravity.prototype = {
    length: function() {
      var L, b, bounce, curve, gravity;
      bounce = Math.min(this.options.bounce / 100, 80);
      gravity = this.options.gravity / 100;
      b = Math.sqrt(2 / gravity);
      curve = {
        a: -b,
        b: b,
        H: 1
      };
      if (this.options.initialForce) {
        curve.a = 0;
        curve.b = curve.b * 2;
      }
      while (curve.H > 0.001) {
        L = curve.b - curve.a;
        curve = {
          a: curve.b,
          b: curve.b + L * bounce,
          H: curve.H * bounce * bounce
        };
      }
      return curve.b;
    },
    init: function() {
      var L, b, bounce, curve, gravity, _results;

      L = this.length();
      gravity = (this.options.gravity / 100) * L * L;
      bounce = Math.min(this.options.bounce / 100, 80);
      b = Math.sqrt(2 / gravity);
      this.curves = [];
      curve = {
        a: -b,
        b: b,
        H: 1
      };
      if (this.options.initialForce) {
        curve.a = 0;
        curve.b = curve.b * 2;
      }
      this.curves.push(curve);
      _results = [];
      while (curve.b < 1 && curve.H > 0.001) {
        L = curve.b - curve.a;
        curve = {
          a: curve.b,
          b: curve.b + L * bounce,
          H: curve.H * bounce * bounce
        };
        _results.push(this.curves.push(curve));
      }
      return _results;
    },
    curve: function(a, b, H, t){

      var L, c, t2;
      L = b - a;
      t2 = (2 / L) * t - 1 - (a * 2 / L);
      c = t2 * t2 * H - H + 1;
      if (this.initialForce) {
        c = 1 - c;
      }
      return c;
    },
    at: function(t) {
      var bounce, curve, gravity, i, v;
      bounce = this.options.bounce / 100;
      gravity = this.options.gravity;
      i = 0;
      curve = this.curves[i];
      while (!(t >= curve.a && t <= curve.b)) {
        i += 1;
        curve = this.curves[i];
        if (!curve) {
          break;
        }
      }
      if (!curve) {
        v = this.options.initialForce ? 0 : 1;
      } else {
        v = this.curve(curve.a, curve.b, curve.H, t);
      }
      //return [t, v];
      return v;
    }

  };
})(window);
