describe('$ionicView controller', function() {
  beforeEach(module('ionic'));
  var ctrl, beforeEnterData;

  function setup(attrs, scope) {
    var viewEle;
    var navBarCtrl = {
      beforeEnter: function(d){ beforeEnterData = d; }
    };
    inject(function($rootScope, $compile){
      var transData;
      viewEle = angular.element('<ion-view ' + (attrs || '') + '>');
      viewEle.data('$ionNavViewController', navBarCtrl);
      $compile(viewEle)(scope || $rootScope);
    });
    ctrl = viewEle.data('$ionViewController');
  }

  it('should send no title to navBarCtrl with no view-title attr', function() {
    setup();
    ctrl.beforeEnter(null, {});
    expect(beforeEnterData.title).toBeUndefined();
  });

  it('should send title to navBarCtrl with view-title attr', function() {
    setup('view-title="Sweet Caroline"');
    ctrl.beforeEnter(null, {});
    expect(beforeEnterData.title).toEqual('Sweet Caroline')
  });

  it('should send interpolated title to navBarCtrl with view-title attr', inject(function($rootScope) {
    var scope = $rootScope.$new();
    scope.color = 'Blue';
    setup('view-title="Song Sung {{ color }}"', scope);
    ctrl.beforeEnter(null, {});
    expect(beforeEnterData.title).toEqual('Song Sung Blue')
  }));

  it('should send title to navBarCtrl with title attr', function() {
    setup('title="Holly Holy"');
    ctrl.beforeEnter(null, {});
    expect(beforeEnterData.title).toEqual('Holly Holy')
  });

  it('should send interpolated title to navBarCtrl with view-title attr', inject(function($rootScope) {
    var scope = $rootScope.$new();
    scope.name = 'Rosie';
    setup('title="Cracklin {{ name }}"', scope);
    ctrl.beforeEnter(null, {});
    expect(beforeEnterData.title).toEqual('Cracklin Rosie')
  }));

  it('should prioritize view-title over title', function() {
    setup('view-title="I Am" title="I Said"');
    ctrl.beforeEnter(null, {});
    expect(beforeEnterData.title).toEqual('I Am')
  });

});
