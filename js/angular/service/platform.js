var PLATFORM_BACK_BUTTON_PRIORITY_VIEW = 100;
var PLATFORM_BACK_BUTTON_PRIORITY_SIDE_MENU = 150;
var PLATFORM_BACK_BUTTON_PRIORITY_ACTION_SHEET = 300;
var PLATFORM_BACK_BUTTON_PRIORITY_POPUP = 400;
var PLATFORM_BACK_BUTTON_PRIORITY_LOADING = 500;

IonicModule
.constant('$ionicPlatformDefaultsIOS7', {
  '$ionicNavBarConfig': {
    transition: 'nav-title-slide-ios7'
  },
  '$ionicNavViewConfig': {
    transition: 'slide-left-right-ios7'
  }
})

.constant('$ionicPlatformDefaultsAndroid', {
  '$ionicNavBarConfig': {
    transition: 'no-animation'
  },
  '$ionicNavViewConfig': {
    transition: 'fade-implode'
  },
  '$ionicTabConfig': {
    style: 'tab-item-stripe'
  }
});

IonicModule.factory('$ionicPlatformConfig', [
  '$ionicPlatformDefaultsIOS7',
  '$ionicPlatformDefaultsAndroid',

  '$ionicNavBarConfig',
  '$ionicNavViewConfig',

function($ionicPlatformDefaultsIOS7, $ionicPlatformDefaultsAndroid, $ionicNavBarConfig, $ionicNavViewConfig) {
  var applyConfig = function(obj) {
    angular.extend($ionicNavViewConfig, obj['$ionicNavViewConfig']);
    angular.extend($ionicNavBarConfig, obj['$ionicNavBarConfig']);
  };

  return {
    fromDetectedPlatform: function(platform) {
      console.log('Doing config from detected', platform);

      switch(platform) {
        case 'ios':
          applyConfig($ionicPlatformDefaultsIOS7);
          break;
        case 'android':
          applyConfig($ionicPlatformDefaultsAndroid);
          break;
      }
    }
  }
}]);

/**
 * @ngdoc service
 * @name $ionicPlatform
 * @module ionic
 * @description
 * An angular abstraction of {@link ionic.utility:ionic.Platform}.
 *
 * Used to detect the current platform, as well as do things like override the
 * Android back button in PhoneGap/Cordova.
 */
IonicModule
.provider('$ionicPlatform', function() {
  return {
    $get: ['$q', '$rootScope', '$ionicPlatformConfig', function($q, $rootScope, $ionicPlatformConfig) {
      var self = {

        setPlatformDefaults: function() {
          var platform = ionic.Platform.platform();
          $ionicPlatformConfig.fromDetectedPlatform(platform);
        },

        /**
         * @ngdoc method
         * @name $ionicPlatform#onHardwareBackButton
         * @description
         * Some platforms have a hardware back button, so this is one way to
         * bind to it.
         * @param {function} callback the callback to trigger when this event occurs
         */
        onHardwareBackButton: function(cb) {
          ionic.Platform.ready(function() {
            document.addEventListener('backbutton', cb, false);
          });
        },

        /**
         * @ngdoc method
         * @name $ionicPlatform#offHardwareBackButton
         * @description
         * Remove an event listener for the backbutton.
         * @param {function} callback The listener function that was
         * originally bound.
         */
        offHardwareBackButton: function(fn) {
          ionic.Platform.ready(function() {
            document.removeEventListener('backbutton', fn);
          });
        },

        /**
         * @ngdoc method
         * @name $ionicPlatform#registerBackButtonAction
         * @description
         * Register a hardware back button action. Only one action will execute
         * when the back button is clicked, so this method decides which of
         * the registered back button actions has the highest priority.
         *
         * For example, if an actionsheet is showing, the back button should
         * close the actionsheet, but it should not also go back a page view
         * or close a modal which may be open.
         *
         * @param {function} callback Called when the back button is pressed,
         * if this listener is the highest priority.
         * @param {number} priority Only the highest priority will execute.
         * @param {*=} actionId The id to assign this action. Default: a
         * random unique id.
         * @returns {function} A function that, when called, will deregister
         * this backButtonAction.
         */
        $backButtonActions: {},
        registerBackButtonAction: function(fn, priority, actionId) {

          if(!self._hasBackButtonHandler) {
            // add a back button listener if one hasn't been setup yet
            self.$backButtonActions = {};
            self.onHardwareBackButton(self.hardwareBackButtonClick);
            self._hasBackButtonHandler = true;
          }

          var action = {
            id: (actionId ? actionId : ionic.Utils.nextUid()),
            priority: (priority ? priority : 0),
            fn: fn
          };
          self.$backButtonActions[action.id] = action;

          // return a function to de-register this back button action
          return function() {
            delete self.$backButtonActions[action.id];
          };
        },

        /**
         * @private
         */
        hardwareBackButtonClick: function(e){
          // loop through all the registered back button actions
          // and only run the last one of the highest priority
          var priorityAction, actionId;
          for(actionId in self.$backButtonActions) {
            if(!priorityAction || self.$backButtonActions[actionId].priority >= priorityAction.priority) {
              priorityAction = self.$backButtonActions[actionId];
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
         * @ngdoc method
         * @name $ionicPlatform#ready
         * @description
         * Trigger a callback once the device is ready,
         * or immediately if the device is already ready.
         * @param {function=} callback The function to call.
         * @returns {promise} A promise which is resolved when the device is ready.
         */
        ready: function(cb) {
          var q = $q.defer();

          ionic.Platform.ready(function(){
            q.resolve();
            cb && cb();
          });

          return q.promise;
        }
      };
      return self;
    }]
  };

});

IonicModule
.run(['$ionicPlatform', function($ionicPlatform) {
  $ionicPlatform.setPlatformDefaults();
}]);

