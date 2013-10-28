describe('List View', function() {
  var h, listEl;
  beforeEach(function() {
    h = document.createElement('div');
    h.id = 'content';
    h.className = 'scroll'
    var l = document.createElement('ul');
    l.className = 'list scroll';
    h.appendChild(l);

    listEl = l;

    for(var i = 0; i < 1000; i++) {
      var li = document.createElement('li');
      li.style.height = '50px';
      l.appendChild(li);
    }
  });

  it('Should init', function() {
    var list = new ionic.views.ListView({
      el: h,
    });
  });

  iit('Should init item height from CSS', function() {
    var list = new ionic.views.ListView({
      el: h,
      listEl: listEl,
      isVirtual: true,
    });

    expect(list.itemHeight).toEqual(50);
  });

  iit('Should support virtual scrolling', function() {
    var list = new ionic.views.ListView({
      el: h,
      listEl: listEl,
      isVirtual: true,
      itemHeight: 50
    });

    expect(list.itemHeight).toEqual(50);

    list.renderViewport = function(high, low, start, end) {
    };
  });

});
