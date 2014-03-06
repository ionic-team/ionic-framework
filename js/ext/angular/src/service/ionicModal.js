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
      var element = angular.element(self.el);

      document.body.classList.add('modal-open');

      self._isShown = true;

      if(!element.parent().length) {
        self.el.classList.add(self.animation);
        $document[0].body.appendChild(self.el);
      }

      element.addClass('ng-enter active');
      element.removeClass('ng-leave ng-leave-active');

      $timeout(function(){
        element.addClass('ng-enter-active');
        self.scope.$parent.$broadcast('modal.shown');
      }, 20);

      self._deregisterBackButton = $ionicPlatform.registerBackButtonAction(function(){
        self.hide();
      }, 200);

    },
    // Hide the modal
    hide: function() {
      this._isShown = false;
      var element = angular.element(this.el);

      element.addClass('ng-leave');

      $timeout(function(){
        element.addClass('ng-leave-active');
        element.removeClass('ng-enter ng-enter-active active');
      }, 20);

      $timeout(function(){
        document.body.classList.remove('modal-open');
      }, 400);

      ionic.views.Modal.prototype.hide.call(this);

      this.scope.$parent.$broadcast('modal.hidden');

      this._deregisterBackButton && this._deregisterBackButton();
    },

    // Remove and destroy the modal scope
    remove: function() {
      var self = this;
      self.hide();
      self.scope.$parent.$broadcast('modal.removed');

      $timeout(function(){
        self.scope.$destroy();
      }, 500);
    },

    isShown: function() {
      return !!this._isShown;
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
    }
  };
}]);
