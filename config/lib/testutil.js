/*
 * Included by karma
 * Usage: var result = TestUtil.unwrapPromise(promise);
 */
var TestUtil = {
  unwrapPromise: function(value) {
    var result;
    inject(function($rootScope, $q) {
      $q.when(value).then(function(data) {
        result = data;
      });
      $rootScope.$apply();
    });
    return result;
  },
  createMockTimeout: function(shouldApply) {
    var timeoutQueue = [];
    function timeout(fn, delay) {
      timeoutQueue.push({fn: fn, delay: delay});
    }
    timeout.queue = timeoutQueue;
    timeout.expect = function(expectedDelay) {
      if (timeoutQueue.length > 0) {
        return {
          process: function() {
            var tick = timeoutQueue.shift();
            if (angular.isDefined(expectedDelay)) {
              expect(tick.delay).toEqual(expectedDelay);
            }
            tick.fn();
            shouldApply && inject(function($rootScope) {
              $rootScope.$apply();
            });
          }
        };
      } else {
        expect('TimoutQueue empty. Expecting delay of ').toEqual(delay);
      }
    };
    return timeout;
  },

  setPlatform: function(platformName) {
    switch(platformName) {
      case 'ios':
        ionic.Platform.ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25';
        ionic.Platform.setPlatform('ios');
        ionic.Platform.setVersion(null);
        break;
      case 'android':
        ionic.Platform.ua = 'Mozilla/5.0 (Linux; U; Android 2.2.1; fr-ch; A43 Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1';
        ionic.Platform.setPlatform('android');
        ionic.Platform.setVersion(undefined);
        break;
    }
  }
};

beforeEach(module('ng', function($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}));
