describe('ionItem directive', function() {
  beforeEach(module('ionic'));
  function setup(attrs, content) {
    var el;
    inject(function($rootScope, $compile) {
      el = angular.element('<ion-item '+(attrs||'')+'>').html(content || '');
      el.data('$ionListController', {});
      $compile(el)($rootScope);
      $rootScope.$apply();
    });
    return el;
  }

  it('should be simple item by default', function() {
    var el = setup('', '{{1}} <b>2</b>');
    expect(el.html()).toBe('1 <b>2</b>');
    expect(el.hasClass('item')).toBe(true);
    expect(el.hasClass('item-complex')).toBe(false);
  });
  it('should be complex if ui-sref', function() {
    var el = setup('ui-sref="something"');
    expect(el.hasClass('item item-complex')).toBe(true);
    expect(el.children()[0].tagName).toBe('A');
    expect(el.children().hasClass('item-content')).toBe(true);
  });
  ['href', 'ng-href'].forEach(function(attr) {
    it('should be complex anchor if '+attr+' is defined', function() {
      var el = setup(attr+'="something/{{foo}}"');
      expect(el.hasClass('item item-complex')).toBe(true);
      expect(el.children()[0].tagName).toBe('A');
      expect(el.children().hasClass('item-content')).toBe(true);
      expect(el.children().attr('href')).toBe('something/');
      el.scope().$apply('foo = 44');
      expect(el.children().attr('href')).toBe('something/44');
    });
  });
  it('complex item should not have target by default', function() {
    var el = setup('href="foo"');
    expect(el.find('a').attr('target')).toBeUndefined();
  });
  it('complex item should have target if specified', function() {
    var el = setup('href="foo" target="bar"');
    expect(el.find('a').attr('target')).toBe('bar');
  });
  ['ion-option-button','ion-reorder-button','ion-delete-button'].forEach(function(tag) {
    it('should be complex div if '+tag+' is found', function() {
      var el = setup('', tag);
      expect(el.hasClass('item item-complex')).toBe(true);
      expect(el.children()[0].tagName).toBe('DIV');
      expect(el.children().hasClass('item-content')).toBe(true);
      expect(el.children().html()).toBe(tag);
    });
  });
});

describe('ionDeleteButton directive', function() {
  beforeEach(module('ionic'));
  it('should have delete button', inject(function($compile, $rootScope) {
    var setSpy = jasmine.createSpy('setDeleteButton');
    var el = angular.element('<ion-item><ion-delete-button></ion-delete-button></ion-item>');
    el.data('$ionListController', {
      showDelete: function() { return false; }
    });
    $compile(el)($rootScope.$new());
    $rootScope.$apply();

    var deleteContainer = angular.element(el[0].querySelector('.item-left-edit.item-delete'));
    expect(deleteContainer.length).toBe(1);
    expect(deleteContainer.children().hasClass('button icon button-icon')).toBe(true);
  }));
  it('should unhide if delete is shown', inject(function($compile, $rootScope) {
    var setSpy = jasmine.createSpy('setDeleteButton');
    var el = angular.element('<ion-item><ion-delete-button></ion-delete-button></ion-item>');
    el.data('$ionListController', {
      showDelete: function() { return true; }
    });
    $compile(el)($rootScope.$new());
    $rootScope.$apply();

    var deleteContainer = angular.element(el[0].querySelector('.item-left-edit.item-delete'));
    expect(deleteContainer.length).toBe(1);
    expect(deleteContainer.hasClass('visible')).toBe(true);
    expect(deleteContainer.hasClass('active')).toBe(true);
  }));
});

describe('ionReorderButton directive', function() {
  beforeEach(module('ionic'));
  it('should have reorder button', inject(function($compile, $rootScope) {
    var setSpy = jasmine.createSpy('setReorderButton');
    var el = angular.element('<ion-item><ion-reorder-button></ion-reorder-button></ion-item>');
    el.data('$ionListController', {
      showReorder: function() { return false; }
    });
    $compile(el)($rootScope.$new());
    $rootScope.$apply();

    var reorderContainer = angular.element(el[0].querySelector('.item-right-edit.item-reorder'));
    expect(reorderContainer.length).toBe(1);
    expect(reorderContainer.children().hasClass('button icon button-icon')).toBe(true);
    expect(reorderContainer.attr('data-prevent-scroll')).toBe('true');
    expect(reorderContainer.children().attr('data-prevent-scroll')).toBe('true');
  }));
  it('should show if reorder is already active', inject(function($compile, $rootScope) {
    var setSpy = jasmine.createSpy('setReorderButton');
    var el = angular.element('<ion-item><ion-reorder-button></ion-reorder-button></ion-item>');
    el.data('$ionListController', {
      showReorder: function() { return true; }
    });
    $compile(el)($rootScope.$new());
    $rootScope.$apply();
    var reorderContainer = angular.element(el[0].querySelector('.item-right-edit.item-reorder'));
    expect(reorderContainer.length).toBe(1);
    expect(reorderContainer.hasClass('visible')).toBe(true);
    expect(reorderContainer.hasClass('active')).toBe(true);
  }));
  it('should allow click handlers, but not bubble up to item\'s click event', inject(function($compile, $rootScope) {
    $rootScope.click = jasmine.createSpy('click');;

    var el = angular.element('<ion-item ng-click="click()"><ion-reorder-button></ion-reorder-button></ion-item>');
    $compile(el)($rootScope);
    $rootScope.$apply();
    var reorderContainer = angular.element(el[0].querySelector('ion-reorder-button'));
    reorderContainer.triggerHandler('click');
    expect($rootScope.click).not.toHaveBeenCalled();

    var el = angular.element('<ion-item><ion-reorder-button  ng-click="click()"></ion-reorder-button></ion-item>');
    $compile(el)($rootScope);
    $rootScope.$apply();
    var reorderContainer = angular.element(el[0].querySelector('ion-reorder-button'));
    reorderContainer.triggerHandler('click');
    expect($rootScope.click).toHaveBeenCalled();
  }));
});

describe('ionOptionButton directive', function() {
  beforeEach(module('ionic'));
  it('should have option button', inject(function($compile, $rootScope) {
    var setSpy = jasmine.createSpy('setOptionButton');
    var el = angular.element('<ion-item><ion-option-button></ion-option-button></ion-item>');
    el.data('$ionListController', {
      showDelete: function() { return false; }
    });
    $compile(el)($rootScope.$new());
    $rootScope.$apply();

    var optionContainer = angular.element(el[0].querySelector('.item-options'));
    expect(optionContainer.length).toBe(1);
    expect(optionContainer.children().hasClass('button')).toBe(true);
  }));
});
