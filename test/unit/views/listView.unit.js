describe('List View', function() {
  var h, listEl;
  beforeEach(function() {
    h = document.createElement('div');
    h.id = 'content';
    h.className = 'scroll';
    var l = document.createElement('ul');
    l.className = 'list scroll';
    h.appendChild(l);

    listEl = l;

    for(var i = 0; i < 1000; i++) {
      var li = document.createElement('li');
      li.style.height = '50px';
      l.appendChild(li);
    }

    document.body.style.height='1000px';

    document.body.appendChild(h);
  });

  it('Should init', function() {
    var list = new ionic.views.ListView({
      el: h,
    });
  });

  it('Should init item height from CSS', function() {
    var list = new ionic.views.ListView({
      el: h,
      listEl: listEl,
      isVirtual: true,
    });

    expect(list.itemHeight).toEqual(50);
  });

  /*
  it('Should support virtual scrolling', function() {
    var list = new ionic.views.ListView({
      el: h,
      listEl: listEl,
      isVirtual: true,
      itemHeight: 50,
      virtualRemoveThreshold: -200,
      virtualAddThreshold: 200
    });
    list.renderViewport = function(high, low, start, end) {
    };

    var spy = spyOn(list, 'renderViewport');

    var height = h.scrollHeight;
    var itemHeight = list.itemHeight;
    var totalItems = height / itemHeight;
    var viewportHeight = list.el.parentNode.offsetHeight;
    var itemsPerViewport = (viewportHeight + -list.virtualRemoveThreshold + list.virtualAddThreshold) / itemHeight;

    // set up scroll top
    var scrollTop = 1000;
    var start = (scrollTop + list.virtualRemoveThreshold) / itemHeight;
    var end = (scrollTop + viewportHeight + list.virtualAddThreshold) / itemHeight;

    list.scrollTo(0, scrollTop);

    // Given a scrollTop of 1000px, an item height of 50px, and the given += 200px
    // render window, renderViewport should be called with the following
    // computed values:
    expect(list.renderViewport).toHaveBeenCalledWith(scrollTop + list.virtualRemoveThreshold,
        scrollTop + viewportHeight + list.virtualAddThreshold, start, end);
  });
  */

});
