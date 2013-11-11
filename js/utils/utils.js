(function(ionic) {
  
  ionic.Utils = {

    // Return a function that will be called with the given context
    proxy: function(func, context) {
      var args = Array.prototype.slice.call(arguments, 2);
      return function() {
        return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
      };
    },

    throttle: function(func, wait, options) {
      var context, args, result;
      var timeout = null;
      var previous = 0;
      options || (options = {});
      var later = function() {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
      };
      return function() {
        var now = Date.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0) {
          clearTimeout(timeout);
          timeout = null;
          previous = now;
          result = func.apply(context, args);
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };
    },
     // Borrowed from Backbone.js's extend
     // Helper function to correctly set up the prototype chain, for subclasses.
     // Similar to `goog.inherits`, but uses a hash of prototype properties and
     // class properties to be extended.
    inherit: function(protoProps, staticProps) {
      var parent = this;
      var child;

      // The constructor function for the new subclass is either defined by you
      // (the "constructor" property in your `extend` definition), or defaulted
      // by us to simply call the parent's constructor.
      if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
      } else {
        child = function(){ return parent.apply(this, arguments); };
      }

      // Add static properties to the constructor function, if supplied.
      ionic.extend(child, parent, staticProps);

      // Set the prototype chain to inherit from `parent`, without calling
      // `parent`'s constructor function.
      var Surrogate = function(){ this.constructor = child; };
      Surrogate.prototype = parent.prototype;
      child.prototype = new Surrogate;

      // Add prototype properties (instance properties) to the subclass,
      // if supplied.
      if (protoProps) ionic.extend(child.prototype, protoProps);

      // Set a convenience property in case the parent's prototype is needed
      // later.
      child.__super__ = parent.prototype;

      return child;
    },

    // Extend adapted from Underscore.js
    extend: function(obj) {
       var args = Array.prototype.slice.call(arguments, 1);
       for(var i = 0; i < args.length; i++) {
         var source = args[i];
         if (source) {
           for (var prop in source) {
             obj[prop] = source[prop];
           }
         }
       }
       return obj;
    }
  };

  // Bind a few of the most useful functions to the ionic scope
  ionic.inherit = ionic.Utils.inherit;
  ionic.extend = ionic.Utils.extend;
  ionic.throttle = ionic.Utils.throttle;
  ionic.proxy = ionic.Utils.proxy;

})(window.ionic);
