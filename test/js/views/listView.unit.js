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

    document.body.style.height='1000px';

    document.body.appendChild(h);
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

    // set up scroll top
    var scrollTop = 1000;
    var start = (scrollTop + -list.virtualRemoveThreshold) / itemHeight;
    var end = (scrollTop + viewportHeight + list.virtualAddThreshold) / itemHeight;

    //console.log(height, itemHeight, totalItems, viewportHeight);

    list.scrollTo(0, scrollTop);

    expect(list.renderViewport).toHaveBeenCalledWith(scrollTop + -list.virtualRemoveThreshold,
        scrollTop + viewportHeight + list.virtualAddThreshold, start, end);
  });

});
