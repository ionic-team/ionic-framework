'use strict';

describe('Ionic List', function() {
  var compile, scope, listElement, listCtrl;

  beforeEach(module('ionic.ui.list'));

  beforeEach(inject(function($compile, $rootScope, $controller) {
    compile = $compile;
    scope = $rootScope;
  }));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    compile = _$compile_;
    scope.showDelete = false;
    scope.showReorder = false;

    listElement = angular.element('<ion-list show-delete="showDelete" show-reorder="showReorder">');
    listElement = _$compile_(listElement)(scope);

    listCtrl = listElement.controller('list');

    scope.$digest();
  }));

  it('Should init', function() {
    var element = compile('<ion-list>' +
      '<ion-item></ion-item>' + 
      '<ion-item></ion-item>' + 
      '</ion-list>')(scope);

    expect(element.children().length).toBe(2);
  });

  it('Should add animation class', function() {
    var element = compile('<ion-list animation="my-animation">')(scope);
    expect(element.hasClass('my-animation')).toBe(true);
  });

  it('Should add list-editing class', function() {
    expect(listElement.hasClass('list-editing')).toBe(false);
    scope.showDelete = true;
    scope.$digest();
    expect(listElement.hasClass('list-editing')).toBe(true);
  });

  it('Should add list-reordering class', function() {
    expect(listElement.hasClass('list-reordering')).toBe(false);
    scope.showReorder = true;
    scope.$digest();
    expect(listElement.hasClass('list-reordering')).toBe(true);
  });

  it('Should add item-options-hide class', function() {
    expect(listElement.hasClass('item-options-hide')).toBe(false);
    scope.showReorder = true;
    scope.$digest();
    expect(listElement.hasClass('item-options-hide')).toBe(true);
  });

  it('Should reorder', function() {
    scope.onReorder = function(el, start, end) {
    };

    listElement = angular.element('<ion-list on-reorder="onReorder(el, start, end)"></ion-list>');
    listElement = compile(listElement)(scope);

    var lv = listElement.isolateScope().listView;

    spyOn(scope, 'onReorder');

    lv.onReorder({}, 0, 1);

    expect(scope.onReorder).toHaveBeenCalledWith({}, 0, 1);
  });
});

describe('Ionic Item Directive', function () {
  var $rootScope, $compile, listCtrl, options, listScope, itemScope, listElement, itemElement;

  beforeEach(module('ionic.ui.list'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $rootScope.showDelete = false;

    listElement = angular.element('<ion-list show-delete="showDelete">');
    listElement = _$compile_(listElement)($rootScope);
    listScope = listElement.isolateScope();

    listCtrl = listElement.controller('list');

    itemElement = angular.element('<ion-item>').appendTo(listElement);
    itemElement = _$compile_(itemElement)($rootScope);

    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
  }));

  it('Should set item type from item attribute', inject(function ($timeout) {
    itemElement = angular.element('<ion-item>').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.itemClass).toBe(undefined);

    itemElement = angular.element('<ion-item item-type="item-type-test">').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.itemType).toBe("item-type-test");
    expect(itemElement.hasClass('item-type-test')).toBe(true);
  }));

  it('Should set item type from list attribute', inject(function ($timeout) {
    listElement = angular.element('<ion-list item-type="list-item-type-test">');
    listElement = $compile(listElement)($rootScope);
    itemElement = angular.element('<ion-item>').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemElement.hasClass('list-item-type-test')).toBe(true);
  }));

  it('Should item option buttons from item attribute', inject(function ($timeout) {
    itemElement = angular.element('<ion-item>').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.optionButtons()).toBe(undefined);
    expect(itemScope.itemOptionButtons).toBe(undefined);
    expect(itemElement.find('.item-options').length).toBe(0);

    $rootScope.buttons = [
      { text: 'Edit' }, { text: 'Cancel' }
    ];
    itemElement = angular.element('<ion-item option-buttons="buttons">').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.optionButtons().length).toBe(2);
    expect(itemScope.itemOptionButtons.length).toBe(2);
    expect(itemElement.find('.item-options').find('button').length).toBe(2);
  }));

  it('Should item option buttons from list attribute', inject(function ($timeout) {
    $rootScope.buttons = [
      { text: 'Edit' }, { text: 'Cancel' }
    ];

    listElement = angular.element('<ion-list option-buttons="buttons">');
    listElement = $compile(listElement)($rootScope);
    listScope = listElement.isolateScope();
    expect(listScope.optionButtons().length ).toBe(2);

    itemElement = angular.element('<ion-item>').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();

    expect(itemScope.optionButtons()).toBe(undefined);
    expect(itemScope.itemOptionButtons.length).toBe(2);
    expect(itemElement.find('.item-options').find('button').length).toBe(2);
  }));

  it('Should have no option buttons by disabling item canSwipe', inject(function ($timeout) {
    $rootScope.buttons = [
      { text: 'Edit' }, { text: 'Cancel' }
    ];

    itemElement = angular.element('<ion-item can-swipe="false" option-buttons="buttons">').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();

    expect(itemScope.itemOptionButtons).toBe(undefined);
  }));

  it('Should have no option buttons by disabling list canSwipe', inject(function ($timeout) {
    $rootScope.buttons = [
      { text: 'Edit' }, { text: 'Cancel' }
    ];

    listElement = angular.element('<ion-list can-swipe="false" option-buttons="buttons">');
    listElement = $compile(listElement)($rootScope);
    listScope = listElement.isolateScope();
    expect(listScope.optionButtons().length ).toBe(2);

    itemElement = angular.element('<ion-item>').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();

    expect(itemScope.itemOptionButtons).toBe(undefined);
  }));

  it('Should hide delete w/ item can-delete attribute true but no list or item onDelete', inject(function ($timeout) {
    itemElement = angular.element('<ion-item can-delete="true">').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.deleteClick).toBe(undefined);
    expect(itemElement.find('.item-edit').length).toBe(0);
  }));

  it('Should hide delete w/ item can-delete attribute false but with item onDelete', inject(function ($timeout) {
    $rootScope.onDelete = function() {};
    itemElement = angular.element('<ion-item can-delete="false" on-delete="onDelete">').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.deleteClick).toBe(undefined);
    expect(itemElement.find('.item-edit').length).toBe(0);
  }));

  it('Should show delete w/ no item can-delete attribute but with item onDelete', inject(function ($timeout) {
    $rootScope.onDelete = function() {};
    itemElement = angular.element('<ion-item on-delete="onDelete" delete-icon="test-icon">').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.deleteClick).not.toBe(undefined);
    expect(itemElement.find('.item-edit').length).toBe(1);
    expect(itemScope.deleteIconClass).toBe("test-icon");
  }));

  it('Should hide delete w/ list can-delete attribute true but no list or item onDelete', inject(function ($timeout) {
    $rootScope.onDelete = function() {};
    listElement = angular.element('<ion-list can-delete="true">');
    listElement = $compile(listElement)($rootScope);
    listScope = listElement.isolateScope();

    itemElement = angular.element('<ion-item>').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.deleteClick).toBe(undefined);
    expect(itemElement.find('.item-edit').length).toBe(0);
  }));

  it('Should hide delete w/ list can-delete attribute false but with list onDelete', inject(function ($timeout) {
    $rootScope.onDelete = function() {};
    listElement = angular.element('<ion-list can-delete="false" on-delete="onDelete">');
    listElement = $compile(listElement)($rootScope);
    listScope = listElement.isolateScope();

    itemElement = angular.element('<ion-item>').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.deleteClick).toBe(undefined);
    expect(itemElement.find('.item-edit').length).toBe(0);
  }));

  it('Should hide delete w/ list can-delete attribute false but with item onDelete', inject(function ($timeout) {
    $rootScope.onDelete = function() {};
    listElement = angular.element('<ion-list can-delete="false">');
    listElement = $compile(listElement)($rootScope);
    listScope = listElement.isolateScope();

    itemElement = angular.element('<ion-item on-delete="onDelete">').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.deleteClick).toBe(undefined);
    expect(itemElement.find('.item-edit').length).toBe(0);
  }));

  it('Should show delete w/ no can-delete attribute but with list onDelete', inject(function ($timeout) {
    $rootScope.onDelete = function() {};
    listElement = angular.element('<ion-list on-delete="onDelete" delete-icon="test-icon">');
    listElement = $compile(listElement)($rootScope);
    listScope = listElement.isolateScope();
    itemElement = angular.element('<ion-item>').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.deleteClick).not.toBe(undefined);
    expect(itemElement.find('.item-edit').length).toBe(1);

    expect(itemScope.deleteIconClass).toBe("test-icon");
  }));

  it('Should not be able to reorder cuz no item or list can-reorder attribute true', inject(function ($timeout) {
    itemElement = angular.element('<ion-item reorder-icon="test-icon">').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.reorderIconClass).toBe(undefined);
    expect(itemElement.find('.item-drag').length).toBe(0);
  }));

  it('Should be able to reorder cuz item can-reorder attribute true', inject(function ($timeout) {
    itemElement = angular.element('<ion-item can-reorder="true" reorder-icon="test-icon">').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.reorderIconClass).toBe('test-icon');
    expect(itemElement.find('.item-drag').length).toBe(1);
  }));

  it('Should be able to reorder cuz list can-reorder attribute true', inject(function ($timeout) {
    listElement = angular.element('<ion-list can-reorder="true" reorder-icon="test-icon">');
    listElement = $compile(listElement)($rootScope);
    listScope = listElement.isolateScope();
    itemElement = angular.element('<ion-item>').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.reorderIconClass).toBe('test-icon');
    expect(itemElement.find('.item-drag').length).toBe(1);
  }));

  it('Should not have options cuz no optionButtons', inject(function ($timeout) {
    itemElement = angular.element('<ion-item>').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.itemOptionButtons).toBe(undefined);
    expect(itemElement.find('.item-options').length).toBe(0);
  }));

  it('Should be able to reorder cuz list can-reorder attribute false and item can-reorder true', inject(function ($timeout) {
    listElement = angular.element('<ion-list can-reorder="false">');
    listElement = $compile(listElement)($rootScope);
    listScope = listElement.isolateScope();
    itemElement = angular.element('<ion-item can-reorder="true">').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.reorderIconClass).toBe('ion-navicon');
    expect(itemElement.find('.item-drag').length).toBe(1);
  }));

  it('Should not have options cuz item can-swipe false', inject(function ($timeout) {
    $rootScope.optionButtons = [{text:'BUTTON'}];
    itemElement = angular.element('<ion-item option-buttons="optionButtons" can-swipe="false">').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.itemOptionButtons).toBe(undefined);
    expect(itemElement.find('.item-options').length).toBe(0);
  }));

  it('Should not have options cuz list can-swipe false', inject(function ($timeout) {
    $rootScope.optionButtons = [{text:'BUTTON'}];
    listElement = angular.element('<ion-list option-buttons="optionButtons" can-swipe="false">');
    listElement = $compile(listElement)($rootScope);
    listScope = listElement.isolateScope();
    itemElement = angular.element('<ion-item>').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.itemOptionButtons).toBe(undefined);
    expect(itemElement.find('.item-options').length).toBe(0);
  }));

  it('Should have options cuz item option-buttons and no can-swipe false', inject(function ($timeout) {
    $rootScope.optionButtons = [{text:'BUTTON'}];
    itemElement = angular.element('<ion-item option-buttons="optionButtons">').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.itemOptionButtons.length).toBe(1);
    expect(itemElement.find('.item-options').find('button').length).toBe(1);
  }));

  it('Should have options cuz list option-buttons and no can-swipe false', inject(function ($timeout) {
    $rootScope.optionButtons = [{text:'BUTTON'}];
    listElement = angular.element('<ion-list option-buttons="optionButtons">');
    listElement = $compile(listElement)($rootScope);
    listScope = listElement.isolateScope();
    itemElement = angular.element('<ion-item>').appendTo(listElement);
    itemElement = $compile(itemElement)($rootScope);
    $rootScope.$digest();
    itemScope = itemElement.isolateScope();
    expect(itemScope.itemOptionButtons.length).toBe(1);
    expect(itemElement.find('.item-options').find('button').length).toBe(1);
  }));

});

