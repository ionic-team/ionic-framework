/**
 * Adapted from Backbone.js
 */
(function(ionic) {
'use strict';
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  ionic.controllers.RouteViewController = ionic.controllers.ViewController.inherit({
    initialize: function(options) {
      this.options = options;

      this.root = this.options.root || '/';
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      this.handlers = [];

      this._bindEvents();

      this.location = window.location;
      this.history = window.history;
    },

    when: function(route, callback) {
      var _this = this;

      route = this._routeToRegExp(route);

      this.handlers.unshift({
        route: route,
        callback: function(fragment)  {
          var args = _this._extractParameters(route, fragment);
          callback && callback.apply(_this, args);
        }
      });
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional){
                     return optional ? match : '([^\/]+)';
                   })
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      var extracted = [];
      for(var i = 0; i < params.length; i++) {
        if(param) {
          extracted.push(decodeURIComponent(param));
        }
      }
    },

    _bindEvents: function() {
      var _this = this;

      window.addEventListener('popstate', function(event) {
        _this.checkUrl(event);
      });
    },
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment) return false;
      this.loadUrl() || this.loadUrl(this.getHash());
    },
    getFragment: function(fragment, forcePushState) {
      if (fragment === null) {
        fragment = this.location.pathname;
        var root = this.root.replace(this.trailingSlash, '');
        if (!fragment.indexOf(root)) fragment = fragment.substr(root.length);
      }
      return fragment.replace(routeStripper, '');
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
  });
})(window.ionic);
