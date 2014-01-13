angular.module('ionic.service.modal', ['ionic.service.templateLoad', 'ionic.service.platform', 'ngAnimate'])


.factory('$ionicModal', ['$rootScope', '$document', '$compile', '$animate', '$q', '$timeout', '$ionicPlatform', '$ionicTemplateLoader', function($rootScope, $document, $compile, $animate, $q, $timeout, $ionicPlatform, $ionicTemplateLoader) {
  var ModalView = ionic.views.Modal.inherit({
    initialize: function(opts) {
      ionic.views.Modal.prototype.initialize.call(this, opts);
      this.animation = opts.animation || 'slide-in-up';
    },
    // Show the modal
    show: function() {
      var _this = this;
      var element = angular.element(this.el);
      if(!element.parent().length) {
        element.addClass(this.animation);
        $animate.enter(element, angular.element($document[0].body), null, function() {
        });
        ionic.views.Modal.prototype.show.call(_this);
      } else {
        $animate.addClass(element, this.animation, function() {
        });
      }

      if(!this.didInitEvents) {
        var onHardwareBackButton = function() {
          _this.hide();
        };

        _this.scope.$on('$destroy', function() {
          $ionicPlatform.offHardwareBackButton(onHardwareBackButton);
        });

        // Support Android back button to close
        $ionicPlatform.onHardwareBackButton(onHardwareBackButton);

        this.didInitEvents = true;
      }

    },
    // Hide the modal
    hide: function() {
      var element = angular.element(this.el);
      $animate.removeClass(element, this.animation);

      ionic.views.Modal.prototype.hide.call(this);
    },

    // Remove and destroy the modal scope
    remove: function() {
      var self  = this,
          element = angular.element(this.el);
      $animate.leave(angular.element(this.el), function() {
        self.scope.$destroy();
      });
    }
  });

  var createModal = function(templateString, options) {
    // Create a new scope for the modal
    var scope = options.scope && options.scope.$new() || $rootScope.$new(true);

    // Compile the template
    var element = $compile(templateString)(scope);

    options.el = element[0];
    var modal = new ModalView(options);

    modal.scope = scope;

    // If this wasn't a defined scope, we can assign 'modal' to the isolated scope
    // we created
    if(!options.scope) {
      scope.modal = modal;
    }

    return modal;
  };

  return {
    /**
     * Load a modal with the given template string.
     *
     * A new isolated scope will be created for the 
     * modal and the new element will be appended into the body.
     */
    fromTemplate: function(templateString, options) {
      var modal = createModal(templateString, options || {});
      return modal;
    },
    fromTemplateUrl: function(url, cb, options) {
      return $ionicTemplateLoader.load(url).then(function(templateString) {
        var modal = createModal(templateString, options || {});
        cb ? cb(modal) : null;
        return modal;
      });
    },
  };
}]);
