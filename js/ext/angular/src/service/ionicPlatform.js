(function(ionic) {'use strict';

angular.module('ionic.service.platform', [])

/**
 * The platformProvider makes it easy to set and detect which platform
 * the app is currently running on. It has some auto detection built in
 * for PhoneGap and Cordova. This provider also takes care of
 * initializing some defaults that depend on the platform, such as the
 * height of header bars on iOS 7.
 */
.provider('$ionicPlatform', function() {

  return {
    $get: ['$q', '$rootScope', function($q, $rootScope) {
      return {
        /**
         * Some platforms have hardware back buttons, so this is one way to bind to it.
         *
         * @param {function} cb the callback to trigger when this event occurs
         */
        onHardwareBackButton: function(cb) {
          ionic.Platform.ready(function() {
            document.addEventListener('backbutton', cb, false);
          });
        },

        /**
         * Remove an event listener for the backbutton.
         *
         * @param {function} fn the listener function that was originally bound.
         */
        offHardwareBackButton: function(fn) {
          ionic.Platform.ready(function() {
            document.removeEventListener('backbutton', fn);
          });
        },

        /**
         * Register a hardware back button action. Only one action will execute when
         * the back button is clicked, so this method decides which of the registered
         * back button actions has the highest priority. For example, if an actionsheet
         * is showing, the back button should close the actionsheet, but it should not
         * also go back a page view or close a modal which may be open.
         *
         * @param {function} fn the listener function that was originally bound.
         * @param {number} priority Only the highest priority will execute.
         */
        registerBackButtonAction: function(fn, priority, actionId) {
          var self = this;

          if(!self._hasBackButtonHandler) {
            // add a back button listener if one hasn't been setup yet
            $rootScope.$backButtonActions = {};
            self.onHardwareBackButton(self.hardwareBackButtonClick);
            self._hasBackButtonHandler = true;
          }

          var action = {
            id: (actionId ? actionId : ionic.Utils.nextUid()),
            priority: (priority ? priority : 0),
            fn: fn
          };
          $rootScope.$backButtonActions[action.id] = action;

          // return a function to de-register this back button action
          return function() {
            delete $rootScope.$backButtonActions[action.id];
          };
        },

        hardwareBackButtonClick: function(e){
          // loop through all the registered back button actions
          // and only run the last one of the highest priority
          var priorityAction, actionId;
          for(actionId in $rootScope.$backButtonActions) {
            if(!priorityAction || $rootScope.$backButtonActions[actionId].priority >= priorityAction.priority) {
              priorityAction = $rootScope.$backButtonActions[actionId];
            }
          }
          if(priorityAction) {
            priorityAction.fn(e);
            return priorityAction;
          }
        },

        is: function(type) {
          return ionic.Platform.is(type);
        },

        /**
         * Trigger a callback once the device is ready, or immediately if the device is already
         * ready.
         */
        ready: function(cb) {
          var q = $q.defer();

          ionic.Platform.ready(function(){
            q.resolve();
            cb();
          });

          return q.promise;
        }
      };
    }]
  };

});

})(ionic);
