
// iOS9 Patch for $browser
// https://github.com/angular/angular.js/issues/12241#issuecomment-130744518

angular.module('ng').config(['$provide', function($provide) {
  $provide.decorator('$browser', ['$delegate', '$window', '$document', '$log', '$sniffer', function($browser, window, document, $log, $sniffer) {


  // only provide the patch for iOS9 on UIWebView
  // var isIOS9 = (navigator.userAgent.indexOf('Version/9.') != -1) && (navigator.appVersion.indexOf('9_0') != -1);
  // if (false) {
  //   // do not patch if not iOS9 UIWebView
  //   return $browser;
  // }


  console.log('iOS9 $browser patch applied');


  // private methods not public within angular
  var slice = [].slice;
  function sliceArgs(args, startIndex) {
    return slice.call(args, startIndex || 0);
  }
  function stripHash(url) {
    var index = url.indexOf('#');
    return index == -1 ? url : url.substr(0, index);
  }


  // $ Angular 1.4 $browser with patch below
  var self = $browser,
      rawDocument = document[0],
      location = window.location,
      history = window.history,
      setTimeout = window.setTimeout,
      clearTimeout = window.clearTimeout,
      pendingDeferIds = {};

  self.isMock = false;

  var outstandingRequestCount = 0;
  var outstandingRequestCallbacks = [];

  // TODO(vojta): remove this temporary api
  self.$$completeOutstandingRequest = completeOutstandingRequest;
  self.$$incOutstandingRequestCount = function() { outstandingRequestCount++; };

  /**
   * Executes the `fn` function(supports currying) and decrements the `outstandingRequestCallbacks`
   * counter. If the counter reaches 0, all the `outstandingRequestCallbacks` are executed.
   */
  function completeOutstandingRequest(fn) {
    try {
      fn.apply(null, sliceArgs(arguments, 1));
    } finally {
      outstandingRequestCount--;
      if (outstandingRequestCount === 0) {
        while (outstandingRequestCallbacks.length) {
          try {
            outstandingRequestCallbacks.pop()();
          } catch (e) {
            $log.error(e);
          }
        }
      }
    }
  }

  function getHash(url) {
    var index = url.indexOf('#');
    return index === -1 ? '' : url.substr(index + 1);
  }

  /**
   * @private
   * Note: this method is used only by scenario runner
   * TODO(vojta): prefix this method with $$ ?
   * @param {function()} callback Function that will be called when no outstanding request
   */
  self.notifyWhenNoOutstandingRequests = function(callback) {
    // force browser to execute all pollFns - this is needed so that cookies and other pollers fire
    // at some deterministic time in respect to the test runner's actions. Leaving things up to the
    // regular poller would result in flaky tests.
    forEach(pollFns, function(pollFn) { pollFn(); });

    if (outstandingRequestCount === 0) {
      callback();
    } else {
      outstandingRequestCallbacks.push(callback);
    }
  };

  //////////////////////////////////////////////////////////////
  // Poll Watcher API
  //////////////////////////////////////////////////////////////
  var pollFns = [],
      pollTimeout;

  /**
   * @name $browser#addPollFn
   *
   * @param {function()} fn Poll function to add
   *
   * @description
   * Adds a function to the list of functions that poller periodically executes,
   * and starts polling if not started yet.
   *
   * @returns {function()} the added function
   */
  self.addPollFn = function(fn) {
    if (angular.isUndefined(pollTimeout)) startPoller(100, setTimeout);
    pollFns.push(fn);
    return fn;
  };

  /**
   * @param {number} interval How often should browser call poll functions (ms)
   * @param {function()} setTimeout Reference to a real or fake `setTimeout` function.
   *
   * @description
   * Configures the poller to run in the specified intervals, using the specified
   * setTimeout fn and kicks it off.
   */
  function startPoller(interval, setTimeout) {
    (function check() {
      forEach(pollFns, function(pollFn) { pollFn(); });
      pollTimeout = setTimeout(check, interval);
    })();
  }

  //////////////////////////////////////////////////////////////
  // URL API
  //////////////////////////////////////////////////////////////

  var cachedState, lastHistoryState,
      lastBrowserUrl = location.href,
      baseElement = document.find('base'),
      reloadLocation = null,
      pendingHref = null,       // PATCH 1 ********************
      pendingHrefTimer = null;  // PATCH 2 ********************

  cacheState();
  lastHistoryState = cachedState;

  /**
   * @name $browser#url
   *
   * @description
   * GETTER:
   * Without any argument, this method just returns current value of location.href.
   *
   * SETTER:
   * With at least one argument, this method sets url to new value.
   * If html5 history api supported, pushState/replaceState is used, otherwise
   * location.href/location.replace is used.
   * Returns its own instance to allow chaining
   *
   * NOTE: this api is intended for use only by the $location service. Please use the
   * {@link ng.$location $location service} to change url.
   *
   * @param {string} url New url (when used as setter)
   * @param {boolean=} replace Should new url replace current history record?
   * @param {object=} state object to use with pushState/replaceState
   */
  self.url = function(url, replace, state) {
    // In modern browsers `history.state` is `null` by default; treating it separately
    // from `undefined` would cause `$browser.url('/foo')` to change `history.state`
    // to undefined via `pushState`. Instead, let's change `undefined` to `null` here.
    if (angular.isUndefined(state)) {
      state = null;
    }

    // Android Browser BFCache causes location, history reference to become stale.
    if (location !== window.location) location = window.location;
    if (history !== window.history) history = window.history;



    // ******************** START PATCH 3 ********************
    // Schedule cleaning up pendingHref on the next run loop for setting URL. This is to handle
    // the case where the browser doesn't update the location.* properties immediately
    if (!pendingHrefTimer && pendingHref && url) {
      pendingHrefTimer = setTimeout(function() {
        if (location.href == pendingHref) {
          //console.log('Actual href updated... setting pendingHref to null from setTimeout');
          pendingHref = null;
        }
        pendingHrefTimer = null;
      }, 0);
    }
    // ******************** END PATCH 3 ********************



    // setter
    if (url) {
      var sameState = lastHistoryState === state;

      // Don't change anything if previous and current URLs and states match. This also prevents
      // IE<10 from getting into redirect loop when in LocationHashbangInHtml5Url mode.
      // See https://github.com/angular/angular.js/commit/ffb2701
      if (lastBrowserUrl === url && (!$sniffer.history || sameState)) {
        return self;
      }
      var sameBase = lastBrowserUrl && stripHash(lastBrowserUrl) === stripHash(url);
      lastBrowserUrl = url;
      lastHistoryState = state;
      // Don't use history API if only the hash changed
      // due to a bug in IE10/IE11 which leads
      // to not firing a `hashchange` nor `popstate` event
      // in some cases (see #9143).
      if ($sniffer.history && (!sameBase || !sameState)) {
        history[replace ? 'replaceState' : 'pushState'](state, '', url);
        cacheState();
        // Do the assignment again so that those two variables are referentially identical.
        lastHistoryState = cachedState;
      } else {


        pendingHref = url;   // PATCH 4 ********************


        if (!sameBase) {
          reloadLocation = url;
        }
        if (replace) {
          location.replace(url);
        } else if (!sameBase) {
          location.href = url;
        } else {
          location.hash = getHash(url);
        }
      }
      return self;
    // getter
    } else {



      // ******************** START PATCH 5 ********************
      var href = location.href.replace(/%27/g, "'");
      if (pendingHref) {
        //console.log('.. using pendingHref for url() return value');
        href = pendingHref;
      }

      if (location.href == pendingHref) {
        //console.log('Actual href updated... setting pendingHref to null in getter');
        pendingHref = null;
      }
      // ******************** END PATCH 5 ********************


      // - reloadLocation is needed as browsers don't allow to read out
      //   the new location.href if a reload happened.
      // - the replacement is a workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=407172
      // return reloadLocation || location.href.replace(/%27/g,"'");  // PATCH 5 ********************
      return reloadLocation || href;
    }
  };

  /**
   * @name $browser#state
   *
   * @description
   * This method is a getter.
   *
   * Return history.state or null if history.state is undefined.
   *
   * @returns {object} state
   */
  self.state = function() {
    return cachedState;
  };

  var urlChangeListeners = [],
      urlChangeInit = false;

  function cacheStateAndFireUrlChange() {
    cacheState();
    fireUrlChange();
  }

  // This variable should be used *only* inside the cacheState function.
  var lastCachedState = null;
  function cacheState() {
    // This should be the only place in $browser where `history.state` is read.
    cachedState = window.history.state;
    cachedState = angular.isUndefined(cachedState) ? null : cachedState;

    // Prevent callbacks fo fire twice if both hashchange & popstate were fired.
    if (angular.equals(cachedState, lastCachedState)) {
      cachedState = lastCachedState;
    }
    lastCachedState = cachedState;
  }

  function fireUrlChange() {
    if (lastBrowserUrl === self.url() && lastHistoryState === cachedState) {
      return;
    }

    lastBrowserUrl = self.url();
    lastHistoryState = cachedState;
    forEach(urlChangeListeners, function(listener) {
      listener(self.url(), cachedState);
    });
  }

  /**
   * @name $browser#onUrlChange
   *
   * @description
   * Register callback function that will be called, when url changes.
   *
   * It's only called when the url is changed from outside of angular:
   * - user types different url into address bar
   * - user clicks on history (forward/back) button
   * - user clicks on a link
   *
   * It's not called when url is changed by $browser.url() method
   *
   * The listener gets called with new url as parameter.
   *
   * NOTE: this api is intended for use only by the $location service. Please use the
   * {@link ng.$location $location service} to monitor url changes in angular apps.
   *
   * @param {function(string)} listener Listener function to be called when url changes.
   * @return {function(string)} Returns the registered listener fn - handy if the fn is anonymous.
   */
  self.onUrlChange = function(callback) {
    // TODO(vojta): refactor to use node's syntax for events
    if (!urlChangeInit) {
      // We listen on both (hashchange/popstate) when available, as some browsers (e.g. Opera)
      // don't fire popstate when user change the address bar and don't fire hashchange when url
      // changed by push/replaceState

      // html5 history api - popstate event
      if ($sniffer.history) angular.element(window).on('popstate', cacheStateAndFireUrlChange);
      // hashchange event
      angular.element(window).on('hashchange', cacheStateAndFireUrlChange);

      urlChangeInit = true;
    }

    urlChangeListeners.push(callback);
    return callback;
  };

  /**
   * Checks whether the url has changed outside of Angular.
   * Needs to be exported to be able to check for changes that have been done in sync,
   * as hashchange/popstate events fire in async.
   */
  self.$$checkUrlChange = fireUrlChange;

  //////////////////////////////////////////////////////////////
  // Misc API
  //////////////////////////////////////////////////////////////

  /**
   * @name $browser#baseHref
   *
   * @description
   * Returns current <base href>
   * (always relative - without domain)
   *
   * @returns {string} The current base href
   */
  self.baseHref = function() {
    var href = baseElement.attr('href');
    return href ? href.replace(/^(https?\:)?\/\/[^\/]*/, '') : '';
  };

  //////////////////////////////////////////////////////////////
  // Cookies API
  //////////////////////////////////////////////////////////////
  var lastCookies = {};
  var lastCookieString = '';
  var cookiePath = self.baseHref();

  function safeDecodeURIComponent(str) {
    try {
      return decodeURIComponent(str);
    } catch (e) {
      return str;
    }
  }

  /**
   * @name $browser#cookies
   *
   * @param {string=} name Cookie name
   * @param {string=} value Cookie value
   *
   * @description
   * The cookies method provides a 'private' low level access to browser cookies.
   * It is not meant to be used directly, use the $cookie service instead.
   *
   * The return values vary depending on the arguments that the method was called with as follows:
   *
   * - cookies() -> hash of all cookies, this is NOT a copy of the internal state, so do not modify
   *   it
   * - cookies(name, value) -> set name to value, if value is undefined delete the cookie
   * - cookies(name) -> the same as (name, undefined) == DELETES (no one calls it right now that
   *   way)
   *
   * @returns {Object} Hash of all cookies (if called without any parameter)
   */
  self.cookies = function(name, value) {
    var cookieLength, cookieArray, cookie, i, index;

    if (name) {
      if (value === undefined) {
        rawDocument.cookie = encodeURIComponent(name) + "=;path=" + cookiePath +
                                ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } else {
        if (isString(value)) {
          cookieLength = (rawDocument.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) +
                                ';path=' + cookiePath).length + 1;

          // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
          // - 300 cookies
          // - 20 cookies per unique domain
          // - 4096 bytes per cookie
          if (cookieLength > 4096) {
            $log.warn("Cookie '" + name +
              "' possibly not set or overflowed because it was too large (" +
              cookieLength + " > 4096 bytes)!");
          }
        }
      }
    } else {
      if (rawDocument.cookie !== lastCookieString) {
        lastCookieString = rawDocument.cookie;
        cookieArray = lastCookieString.split("; ");
        lastCookies = {};

        for (i = 0; i < cookieArray.length; i++) {
          cookie = cookieArray[i];
          index = cookie.indexOf('=');
          if (index > 0) { //ignore nameless cookies
            name = safeDecodeURIComponent(cookie.substring(0, index));
            // the first value that is seen for a cookie is the most
            // specific one.  values for the same cookie name that
            // follow are for less specific paths.
            if (lastCookies[name] === undefined) {
              lastCookies[name] = safeDecodeURIComponent(cookie.substring(index + 1));
            }
          }
        }
      }
      return lastCookies;
    }
  };


  /**
   * @name $browser#defer
   * @param {function()} fn A function, who's execution should be deferred.
   * @param {number=} [delay=0] of milliseconds to defer the function execution.
   * @returns {*} DeferId that can be used to cancel the task via `$browser.defer.cancel()`.
   *
   * @description
   * Executes a fn asynchronously via `setTimeout(fn, delay)`.
   *
   * Unlike when calling `setTimeout` directly, in test this function is mocked and instead of using
   * `setTimeout` in tests, the fns are queued in an array, which can be programmatically flushed
   * via `$browser.defer.flush()`.
   *
   */
  self.defer = function(fn, delay) {
    var timeoutId;
    outstandingRequestCount++;
    timeoutId = setTimeout(function() {
      delete pendingDeferIds[timeoutId];
      completeOutstandingRequest(fn);
    }, delay || 0);
    pendingDeferIds[timeoutId] = true;
    return timeoutId;
  };


  /**
   * @name $browser#defer.cancel
   *
   * @description
   * Cancels a deferred task identified with `deferId`.
   *
   * @param {*} deferId Token returned by the `$browser.defer` function.
   * @returns {boolean} Returns `true` if the task hasn't executed yet and was successfully
   *                    canceled.
   */
  self.defer.cancel = function(deferId) {
    if (pendingDeferIds[deferId]) {
      delete pendingDeferIds[deferId];
      clearTimeout(deferId);
      completeOutstandingRequest(angular.noop);
      return true;
    }
    return false;
  };



     return self;
  }]);
}]);
