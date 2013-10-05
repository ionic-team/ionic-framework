angular.module('ionic.service.modal', ['ionic.service'])


.factory('Modal', ['$rootScope', '$document', '$compile', 'TemplateLoader', function($rootScope, $document, $compile, TemplateLoader) {
  return {
    /**
     * Load a modal with the given template string.
     *
     * A new isolated scope will be created for the 
     * modal and the new element will be appended into the body.
     */
    fromTemplate: function(templateString) {
      // Create a new isolated scope for the modal
      var scope = $rootScope.$new(true);

      // Compile the template
      var element = $compile(templateString)(scope);
      $document[0].body.appendChild(element[0]);

      var modal = ionic.views.Modal({el: element[0] });
      scope.modal = modal;
      return modal;
    },
    fromTemplateUrl: function(url, cb) {
      TemplateLoader.load(url).then(function(templateString) {
        // Create a new isolated scope for the modal
        var scope = $rootScope.$new(true);

        // Compile the template
        var element = $compile(templateString)(scope);
        $document[0].body.appendChild(element[0]);
      
        var modal = new ionic.views.Modal({ el: element[0] });
        scope.modal = modal;

        cb(modal);
      });
    }
  };
}]);
