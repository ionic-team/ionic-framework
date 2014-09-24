describe('ionic.Utils.list', function() {
  function isEven(item, n) { return n % 2 === 0; }

  it('#items()', function() {
    var array = [1,2,3];
    expect(ionic.Utils.list(array).items()).toBe(array);
  });

  it('#add(item[, index])', function() {
    var list = ionic.Utils.list();
    expect(list.count()).toBe(0);
    list.add('a');
    expect(list.items()).toEqual(['a']);
    list.add('b', 0);
    expect(list.items()).toEqual(['b','a']);
  });

  it('#remove(index)', function() {
    var list = ionic.Utils.list(['a','b','c']);
    list.remove(3);
    expect(list.items()).toEqual(['a','b','c']);
    list.remove(1);
    expect(list.items()).toEqual(['a','c']);
    list.remove(-1);
    expect(list.items()).toEqual(['a','c']);
    list.remove(0);
    expect(list.items()).toEqual(['c']);
  });

  it('#at(index)', function() {
    var list = ionic.Utils.list(['a','b']);
    expect(list.at(-1)).toBeFalsy();
    expect(list.at(0)).toBe('a');
    expect(list.at(1)).toBe('b');
    expect(list.at(2)).toBeFalsy();
  });

  it('#count()', function() {
    var list = ionic.Utils.list(['a']);
    expect(list.count()).toBe(1);
    list.add('b');
    expect(list.count()).toBe(2);
  });

  it('#indexOf(item)', function() {
    var list = ionic.Utils.list(['a','b','c']);
    expect(list.indexOf('b')).toBe(1);
    expect(list.indexOf('c')).toBe(2);
    expect(list.indexOf('d')).toBe(-1);
  });

  it('#isInRange(index)', function() {
    var list = ionic.Utils.list(['a','b']);
    expect(list.isInRange(-1)).toBe(false);
    expect(list.isInRange(0)).toBe(true);
    expect(list.isInRange(1)).toBe(true);
    expect(list.isInRange(2)).toBe(false);
  });

  it('#loop([newLoop]', function() {
    var list = ionic.Utils.list();
    expect(list.loop()).toBe(false);
    list.loop(true);
    expect(list.loop()).toBe(true);
    list.loop(false);
    expect(list.loop()).toBe(false);
  });

  it('#delta(from, to), loop = false', function() {
    var list = ionic.Utils.list(['a','b','c']);
    expect(list.delta(0, 1)).toBe(1);
    expect(list.delta(0, 2)).toBe(2);
    expect(list.delta(2, 1)).toBe(-1);
    expect(list.delta(2, 0)).toBe(-2);
  });

  it('#delta(from, to), loop = true', function() {
    var list = ionic.Utils.list(['a','b','c']);
    list.loop(true);
    expect(list.delta(0, 1)).toBe(1);
    expect(list.delta(0, 2)).toBe(-1);
    expect(list.delta(2, 1)).toBe(-1);
    expect(list.delta(2, 0)).toBe(1);
  });

  it('#isRelevant(index, toOtherIndex)', function() {
    var list = ionic.Utils.list(['a','b','c','d','e']);
    expect(list.isRelevant(0, 2)).toBe(false);
    expect(list.isRelevant(1, 2)).toBe(true);
    expect(list.isRelevant(2, 2)).toBe(true);
    expect(list.isRelevant(3, 2)).toBe(true);
    expect(list.isRelevant(4, 2)).toBe(false);

    expect(list.isRelevant(-1, -1)).toBe(false);
  });

  it('#next(fromIndex, filterFn), loop = false', function() {
    var list = ionic.Utils.list(['a','b','c']);
    expect(list.next(0, isEven)).toBe(2);
    expect(list.next(1, isEven)).toBe(2);
    expect(list.next(2, isEven)).toBe(-1);
  });

  it('#next(fromIndex, filterFn), loop = true', function() {
    var list = ionic.Utils.list(['a','b','c']);
    list.loop(true);
    expect(list.next(0, isEven)).toBe(2);
    expect(list.next(1, isEven)).toBe(2);
    expect(list.next(2, isEven)).toBe(0);
  });

  it('#next(fromIndex, filterFn), nothing available, loop = true', function() {
    var list = ionic.Utils.list(['a','b','c']);
    var falseFn = function() { return false; };
    list.loop(true);
    expect(list.next(0, falseFn)).toBe(-1);
  });

  it('#previous(fromIndex, filterFn), loop = false', function() {
    var list = ionic.Utils.list(['a','b','c']);
    expect(list.previous(0, isEven)).toBe(-1);
    expect(list.previous(1, isEven)).toBe(0);
    expect(list.previous(2, isEven)).toBe(0);
  });

  it('#previous(fromIndex, filterFn), loop = true', function() {
    var list = ionic.Utils.list(['a','b','c']);
    list.loop(true);
    expect(list.previous(0, isEven)).toBe(2);
    expect(list.previous(1, isEven)).toBe(0);
    expect(list.previous(2, isEven)).toBe(0);
  });

  it('#previous(fromIndex, filterFn), nothing available, loop = true', function() {
    var list = ionic.Utils.list(['a','b','c']);
    var falseFn = function() { return false; };
    list.loop(true);
    expect(list.previous(0, falseFn)).toBe(-1);
  });

});
