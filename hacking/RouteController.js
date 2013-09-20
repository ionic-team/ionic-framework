/**
 * Adapted from Backbone.js
 */
(function(window, document, ionic) {
  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  RouteViewController = function(options) {
    this.options = options;

    this.root = this.options.root || '/';

    this.handlers = [];

    this._bindEvents();

    this.location = window.location;
    this.history = window.history;
  };

  RouteViewController.prototype = {

    _bindEvents: function() {
      var _this = this;

      window.addEventListener('popstate', function(event) {
        console.log("POP STATE", event, window.location, window.location.hash);
        _this.checkUrl(event);
      });
      window.addEventListener('pushstate', function(event) {
        console.log("PUSH STATE", event, window.location);
      });
    },
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment) return false;
      this.loadUrl() || this.loadUrl(this.getHash());
    },
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = this.location.pathname;
          var root = this.root.replace(this.trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.substr(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(this.routeStripper, '');
    },
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = false;
      for(var i = 0; i < this.handlers.length; i++) {
        var h = this.handlers[i];
        if (h.route.test(fragment)) {
          h.callback(fragment);
          matched = true;
        }
      }
      return matched;
    },
  };
})(this, document, ion = this.ionic || {});
