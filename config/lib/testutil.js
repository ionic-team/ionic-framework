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
  }
};
