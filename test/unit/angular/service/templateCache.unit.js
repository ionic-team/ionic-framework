describe('$ionicTemplateCache', function() {
  beforeEach(module('ionic'));

  beforeEach(inject(function($ionicTemplateCache, $templateCache) {
    ionicTemplateCache = $ionicTemplateCache;
    templateCache = $templateCache;
  }));

  it('should run during initial startup', function () {
    var info = templateCache.info();
    expect(info.size).toBe(0);
    expect(ionicTemplateCache._runCount).toBe(1);
  });

  it('should run immediately after a new addition after initial run', inject(function ($templateCache, $httpBackend, $timeout) {
    $httpBackend.whenGET("/test").respond([{hello:"world"}]);
    ionicTemplateCache('/test');
    $timeout.flush();
    var info = templateCache.info();
    expect(info.size).toBe(1);
    expect(ionicTemplateCache._runCount).toBe(2);
  }));

  it('should cache 5 templates at a time', inject(function ($httpBackend, $timeout) {
    $httpBackend.whenGET("/test1").respond([{hello:"world"}]);
    $httpBackend.whenGET("/test2").respond([{hello:"world"}]);
    $httpBackend.whenGET("/test3").respond([{hello:"world"}]);
    $httpBackend.whenGET("/test4").respond([{hello:"world"}]);
    $httpBackend.whenGET("/test5").respond([{hello:"world"}]);
    $httpBackend.whenGET("/test6").respond([{hello:"world"}]);
    $httpBackend.whenGET("/test7").respond([{hello:"world"}]);
    ionicTemplateCache(['/test1','/test2','/test2','/test3','/test4','/test5','/test6','/test7']);
    $timeout.flush();
    var info = templateCache.info();
    expect(info.size).toBe(7);
    expect(ionicTemplateCache._runCount).toBe(3);
  }));
});
