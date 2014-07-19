IonicModule
.factory('$ionicTemplateLoader', [
  '$compile',
  '$controller',
  '$http',
  '$q',
  '$rootScope',
  '$templateCache',
function($compile, $controller, $http, $q, $rootScope, $templateCache) {

  return {
    load: fetchTemplate,
    compile: loadAndCompile
  };

  function fetchTemplate(url) {
    return $http.get(url, {cache: $templateCache})
    .then(function(response) {
      return response.data && response.data.trim();
    });
  }

  function loadAndCompile(options) {
    options = extend({
      template: '',
      templateUrl: '',
      scope: null,
      controller: null,
      locals: {},
      appendTo: null
    }, options || {});

    var templatePromise = options.templateUrl ?
      this.load(options.templateUrl) :
      $q.when(options.template);

    return templatePromise.then(function(template) {
      var controller;
      var scope = options.scope || $rootScope.$new();

      //Incase template doesn't have just one root element, do this
      var element = jqLite('<div>').html(template).contents();

      if (options.controller) {
        controller = $controller(
          options.controller,
          extend(options.locals, {
            $scope: scope
          })
        );
        element.children().data('$ngControllerController', controller);
      }
      if (options.appendTo) {
        jqLite(options.appendTo).append(element);
      }

      $compile(element)(scope);

      return {
        element: element,
        scope: scope
      };
    });
  }

}]);
