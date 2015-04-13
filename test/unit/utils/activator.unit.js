describe('Ionic Element Activator', function() {
  var timeout, rAF;
  beforeEach(function() {
    timeout = window.setTimeout;
    rAF = ionic.requestAnimationFrame;
    window.setTimeout = ionic.requestAnimationFrame = function(cb) { cb(); };
  });

  afterEach(function(){
    window.setTimeout = timeout;
    ionic.requestAnimationFrame = rAF;
  });

  it('should not active an <a> if ionic.tap.requiresNativeClick is true', function() {
    spyOn(ionic.tap, 'requiresNativeClick').andReturn(true);
    var e = { target: document.createElement('a') };
    ionic.activator.start(e);
    expect(e.target.classList.contains('activated')).toEqual(false);
  });

  it('Should activate an <a>', function() {
    var e = { target: document.createElement('a') };
    ionic.activator.start(e);
    expect(e.target.classList.contains('activated')).toEqual(true);
  });

  it('Should activate a <button>', function() {
    var e = { target: document.createElement('button') };
    ionic.activator.start(e);
    expect(e.target.classList.contains('activated')).toEqual(true);
  });

  it('Should activate an element with ng-click', function() {
    var e = { target: document.createElement('div') };
    e.target.setAttribute('ng-click', 'test()');
    ionic.activator.start(e);
    expect(e.target.classList.contains('activated')).toEqual(true);
  });

  it('Should activate a .button', function() {
    var e = { target: document.createElement('div') };
    e.target.className = 'button';
    ionic.activator.start(e);
    expect(e.target.classList.contains('activated')).toEqual(true);
  });

  it('Should not activate just .item', function() {
    var e = { target: document.createElement('div') };
    e.target.className = 'item';
    ionic.activator.start(e);
    expect(e.target.classList.contains('activated')).toEqual(false);
  });

  it('Should activate "a" in a .item', function() {
    var itemEle = document.createElement('div');
    itemEle.className = 'item';

    var aEle = document.createElement('a');
    itemEle.appendChild(aEle);

    var e = { target: aEle };

    ionic.activator.start(e);
    expect(itemEle.classList.contains('activated')).toEqual(false);
    expect(aEle.classList.contains('activated')).toEqual(true);
  });

  it('Should activate "div.item-content a" child of .item', function() {
    var itemEle = document.createElement('div');
    itemEle.className = 'item';

    var itemContentEle = document.createElement('div');
    itemContentEle.className = 'item-content';
    itemEle.appendChild(itemContentEle);

    var aEle = document.createElement('a');
    itemContentEle.appendChild(aEle);

    var e = { target: aEle };

    ionic.activator.start(e);
    expect(itemEle.classList.contains('activated')).toEqual(false);
    expect(itemContentEle.classList.contains('activated')).toEqual(false);
    expect(aEle.classList.contains('activated')).toEqual(true);
  });
  it('Should activate 5 levels up, but not 6', function() {
    var itemEle = document.createElement('div');
    itemEle.className = 'item';

    var itemContentEle = document.createElement('a');
    itemContentEle.className = 'item-content';
    itemEle.appendChild(itemContentEle);

    var div1 = document.createElement('div');
    itemContentEle.appendChild(div1);
    var div2 = document.createElement('div');
    div1.appendChild(div2);
    var div3 = document.createElement('div');
    div2.appendChild(div3);
    var div4 = document.createElement('div');
    div3.appendChild(div4);
    var div5 = document.createElement('div');
    div4.appendChild(div5);
    var div6 = document.createElement('div');
    div5.appendChild(div6);

    var e = { target: div6 };
    ionic.activator.start(e);
    expect(itemContentEle.classList.contains('activated')).toEqual(false);

    var e = { target: div5 };
    ionic.activator.start(e);
    expect(itemContentEle.classList.contains('activated')).toEqual(true);
  });

  it('Should activate child "div.item-content div[ng-click]" of a .item', function() {
    var itemEle = document.createElement('div');
    itemEle.className = 'item';

    var itemContentEle = document.createElement('div');
    itemContentEle.className = 'item-content';
    itemEle.appendChild(itemContentEle);

    var divEle = document.createElement('div');
    divEle.setAttribute('ng-click', 'test()');
    itemContentEle.appendChild(divEle);

    var e = { target: divEle };

    ionic.activator.start(e);
    expect(itemEle.classList.contains('activated')).toEqual(false);
    expect(itemContentEle.classList.contains('activated')).toEqual(false);
    expect(divEle.classList.contains('activated')).toEqual(true);
  });

});
