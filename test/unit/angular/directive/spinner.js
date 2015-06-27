describe('Ionic Spinner', function() {
  var el, scope, compile;

  beforeEach(module('ionic'));

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    scope = $rootScope;
  }));

  it('should compile and output an svg', function() {
    el = compile('<ion-spinner>')(scope);
    var spinner = el.find('svg');
    expect(spinner.length).toEqual(1);
  });

  it('should add config setting class', inject(function($ionicConfig){
    $ionicConfig.spinner.icon('android');
    el = compile('<ion-spinner>')(scope);
    expect(el.is('.spinner-android')).toEqual(true);
  }));

});
