'use strict';

describe('Ionic List', function() {
  var compile, scope;

  beforeEach(module('ionic.ui.list'));

  beforeEach(inject(function($compile, $rootScope, $controller) {
    compile = $compile;
    scope = $rootScope;
  }));

  it('Should init', function() {
    var element = compile('<list>' +
      '<list-item></list-item>' + 
      '<list-item></list-item>' + 
      '</list>')(scope);

    expect(element.children().length).toBe(2);
  });
});

describe('Ionic Link Item Directive', function () {
  var $rootScope, element, listCtrl, options, scope;

  beforeEach(module('ionic.ui.list'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $rootScope = _$rootScope_;
    $rootScope.isEditing = false;

    var list = angular.element('<list is-editing="isEditing">');
    list = _$compile_(list)($rootScope);

    listCtrl = list.controller('list');

    $rootScope.buttons = [];

    element = angular.element('<link-item>').appendTo(list);
    element = _$compile_(element)($rootScope);

    $rootScope.$digest();
    scope = element.isolateScope();
  }));

  it('Should show options when the list is not in edit mode', inject(function ($timeout) {
    scope.canSwipe = true;
    $rootScope.$digest();
    $timeout.flush();

    expect(scope.isEditing).toBe(false);
    expect(element.find('.item-options').length).toBe(1);
  }));

  it('Should hide options when the list is in edit mode', inject(function ($timeout) {
    scope.canSwipe = true;
    $rootScope.isEditing = true;
    $rootScope.$digest();
    $timeout.flush();

    expect(scope.isEditing).toBe(true);
    expect(element.find('.item-options').length).toBe(0);
  }));

  it('Should deregister watcher when scope destroyed', inject(function ($timeout) {
    $rootScope.isEditing = true;
    scope.$destroy();
    $rootScope.$digest();
    $timeout.flush();

    expect(scope.isEditing).toBe(false);
  }));
});

describe('Ionic Item Directive', function () {
  var $rootScope, element, listCtrl, options, scope;

  beforeEach(module('ionic.ui.list'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $rootScope = _$rootScope_;
    $rootScope.isEditing = false;

    var list = angular.element('<list is-editing="isEditing">');
    list = _$compile_(list)($rootScope);

    listCtrl = list.controller('list');

    $rootScope.buttons = [];

    element = angular.element('<item>').appendTo(list);
    element = _$compile_(element)($rootScope);

    $rootScope.$digest();
    scope = element.isolateScope();
  }));

  it('Should show options when the list is not in edit mode', inject(function ($timeout) {
    scope.canSwipe = true;
    $rootScope.$digest();
    $timeout.flush();

    expect(scope.isEditing).toBe(false);
    expect(element.find('.item-options').length).toBe(1);
  }));

  it('Should hide options when the list is in edit mode', inject(function ($timeout) {
    scope.canSwipe = true;
    $rootScope.isEditing = true;
    $rootScope.$digest();
    $timeout.flush();

    expect(scope.isEditing).toBe(true);
    expect(element.find('.item-options').length).toBe(0);
  }));

  it('Should deregister watcher when scope destroyed', inject(function ($timeout) {
    $rootScope.isEditing = true;
    scope.$destroy();
    $rootScope.$digest();
    $timeout.flush();

    expect(scope.isEditing).toBe(false);
  }));
});
