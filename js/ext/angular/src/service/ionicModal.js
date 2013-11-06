angular.module('ionic.service.modal', ['ionic.service.templateLoad'])


.factory('Modal', ['$rootScope', '$document', '$compile', '$animate', 'TemplateLoader', function($rootScope, $document, $compile, $animate, TemplateLoader) {
  var ModalView = ionic.views.Modal.inherit({
    initialize: function(opts) {
      ionic.views.Modal.prototype.initialize.call(this, opts);
      this.animation = opts.animation;
    },
    // Show the modal
    show: function() {
      var element = angular.element(this.el);
      if(!element.parent().length) {
        $animate.enter(element, angular.element($document[0].body));
      } 
      $animate.addClass(element, this.animation);
    },
    // Hide the modal
    hide: function() {
      var element = angular.element(this.el);
      $animate.removeClass(element, this.animation);
    },

    // Remove and destroy the modal scope
    remove: function() {
      var element = angular.element(this.el);
      $animate.leave(angular.element(this.el), function() {
        scope.$destroy();
      });
    }
  });

  return {
    /**
     * Load a modal with the given template string.
     *
     * A new isolated scope will be created for the 
     * modal and the new element will be appended into the body.
     */
    fromTemplate: function(templateString, options) {
      options = options || {};
      // Create a new scope for the modal
      var scope = options.scope && options.scope.$new() || $rootScope.$new(true);

      // Compile the template
      var element = $compile(templateString)(scope);

      options.el = element[0];
      var modal = new ModalView(options);
      return modal;
    },
    fromTemplateUrl: function(url, cb, options) {
      TemplateLoader.load(url).then(function(templateString) {
        options = options || {};

        // Create a new scope for the modal
        var scope = options.scope && options.scope.$new() || $rootScope.$new(true);

        // Compile the template
        var element = $compile(templateString)(scope);

        options.el = element[0];
        var modal = new ModalView(options);

        cb(modal);
      });
    },
  };
}]);
