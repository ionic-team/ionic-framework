angular.module('ionic.service.modal', ['ionic.service.templateLoad', 'ionic.service.platform', 'ngAnimate'])


.factory('$ionicModal', ['$rootScope', '$document', '$compile', '$animate', '$q', '$timeout', '$ionicPlatform', '$ionicTemplateLoader', function($rootScope, $document, $compile, $animate, $q, $timeout, $ionicPlatform, $ionicTemplateLoader) {
  var ModalView = ionic.views.Modal.inherit({
    initialize: function(opts) {
      ionic.views.Modal.prototype.initialize.call(this, opts);
      this.animation = opts.animation || 'slide-in-up';
    },
    // Show the modal
    show: function() {
      var self = this;
      var element = angular.element(this.el);

      document.body.classList.add('disable-pointer-events');
      this.el.classList.add('enable-pointer-events');

      self._isShown = true;

      if(!element.parent().length) {
        element.addClass(this.animation);
        $animate.enter(element, angular.element($document[0].body), null, function() {
        });
        ionic.views.Modal.prototype.show.call(self);
      } else {
        $animate.addClass(element, this.animation, function() {
        });
      }

      if(!this.didInitEvents) {
        var onHardwareBackButton = function() {
          self.hide();
        };

        self.scope.$on('$destroy', function() {
          $ionicPlatform.offHardwareBackButton(onHardwareBackButton);
        });

        // Support Android back button to close
        $ionicPlatform.onHardwareBackButton(onHardwareBackButton);

        this.didInitEvents = true;
      }

      this.scope.$parent.$broadcast('modal.shown', this);

    },
    // Hide the modal
    hide: function() {
      this._isShown = false;
      var element = angular.element(this.el);
      $animate.removeClass(element, this.animation, function() {
        onHideModal(element[0]);
      });

      ionic.views.Modal.prototype.hide.call(this);

      this.scope.$parent.$broadcast('modal.hidden', this);
    },

    // Remove and destroy the modal scope
    remove: function() {
      var self  = this,
          element = angular.element(this.el);
      this._isShown = false;
      $animate.leave(angular.element(this.el), function() {
        onHideModal(element[0]);
        self.scope.$parent.$broadcast('modal.removed', self);
        self.scope.$destroy();
      });
    },

    isShown: function() {
      return !!this._isShown;
    }
  });

  function onHideModal(element) {
    document.body.classList.remove('disable-pointer-events');
    element.classList.remove('enable-pointer-events');
  }

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
