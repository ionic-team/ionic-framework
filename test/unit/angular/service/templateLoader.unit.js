describe('$ionicTemplateLoader', function() {
  beforeEach(module('ionic'));

  it('.load() should fetch with templateCache and return .data', inject(function($ionicTemplateLoader, $http, $templateCache, $q, $rootScope) {
    spyOn($http, 'get').andReturn($q.when({
      data: 'foo'
    }));
    var result = $ionicTemplateLoader.load('test.html');
    expect($http.get).toHaveBeenCalled();
    expect($http.get.mostRecentCall.args[0]).toBe('test.html');
    expect($http.get.mostRecentCall.args[1]).toEqual({cache: $templateCache});
    expect(TestUtil.unwrapPromise(result)).toBe('foo');
  }));

  describe('.loadAndCompile()', function() {
    var $loader;
    beforeEach(inject(function($ionicTemplateLoader) {
      $loader = $ionicTemplateLoader;
    }));

    it('should compile a template with default scope', inject(function($rootScope) {
      var data = TestUtil.unwrapPromise($loader.compile({
        template: '<div>hello!</div>'
      }));
      expect(data.element[0].outerHTML).toBe('<div>hello!</div>');
      expect(data.element.scope().$parent).toBe($rootScope);
    }));

    it('should compile a templateUrl', inject(function($http, $q) {
      spyOn($loader, 'load').andReturn($q.when('<span>woah!</span>'));
      var data = TestUtil.unwrapPromise($loader.compile({
        templateUrl: 'test.html'
      }));
      expect($loader.load).toHaveBeenCalledWith('test.html');
      expect(data.element[0].outerHTML).toBe('<span>woah!</span>');
    }));

    it('should add a scope', inject(function($rootScope) {
      var scope = $rootScope.$new().$new();
      var data = TestUtil.unwrapPromise($loader.compile({
        scope: scope,
        template: 'test'
      }));
      expect(data.scope).toBe(scope);
    }));

    it('should add a controller with locals', function() {
      function Ctrl($scope, banana) {
        this.$scope = $scope;
        this.banana = banana;
      }
      var banana = {};
      var scope = {};
      var data = TestUtil.unwrapPromise($loader.compile({
        controller: Ctrl,
        template: '<div>test1<span>inner</span></div>',
        scope: scope,
        locals: {
          banana: banana
        }
      }));
      var ctrl = data.element.children().controller('ngController');
      expect(ctrl instanceof Ctrl).toBe(true);
      expect(ctrl.banana).toBe(banana);
      expect(ctrl.$scope).toBe(scope);
    });

    it('should appendTo', function() {
      var parent = angular.element('<div class="parent">');
      var data = TestUtil.unwrapPromise($loader.compile({
        appendTo: parent,
        template: '<span class="child">'
      }));
      expect(data.element[0].parentNode).toBe(parent[0]);
    });
  });
});
