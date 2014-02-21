describe('TabBar view', function() {
  var element, tabBar, items;

  beforeEach(function() {
    element = $('<div class="tabs">' + 
      '<a href="#" class="tab-item"><i class="icon-home"></i> Tab 1</a>' +
      '<a href="#" class="tab-item has-badge"><i class="badge">Badge 1</i> Tab 2</a>' +
      '<a href="#" class="tab-item">Tab 3</a>');

    tabBar = new ionic.views.TabBar({
      el: element.get(0)
    });

    items = tabBar.getItems();
  });
  it('Should read tabs', function() {
    expect(items.length).toEqual(3);
    expect(items[0].getTitle()).toEqual('Tab 1');
    expect(items[1].getTitle()).toEqual('Tab 2');
    expect(items[2].getTitle()).toEqual('Tab 3');
  });

  it('Should read badge', function() {
    expect(items[1].getBadge()).toEqual('Badge 1');
  });

  it('Should select', function() {
    // Track selection object
    tabBar.setSelectedItem(1);
    expect(tabBar.getSelectedItem().getTitle()).toEqual('Tab 2');
    tabBar.setSelectedItem(0);
    expect(tabBar.getSelectedItem().getTitle()).toEqual('Tab 1');
    tabBar.setSelectedItem(2);
    expect(tabBar.getSelectedItem().getTitle()).toEqual('Tab 3');

    // Track class change
    expect(tabBar.getSelectedItem().el.classList.contains('active')).toEqual(true);

    // Make sure the other ones have theirs cleared
    expect(items[0].el.classList.contains('active')).toEqual(false);
    expect(items[1].el.classList.contains('active')).toEqual(false);
    expect(items[2].el.classList.contains('active')).toEqual(true);
    
    tabBar.setSelectedItem(0);
    expect(items[0].el.classList.contains('active')).toEqual(true);
    expect(items[1].el.classList.contains('active')).toEqual(false);
    expect(items[2].el.classList.contains('active')).toEqual(false);
  });


  it('Should handle item click event', function() {
    var item = items[0];
    spyOn(tabBar, 'trySelectItem');

    var event = document.createEvent('Event');
    event.initEvent('tap', true, true);
    event.detail = {
      target: item.el
    };
    item.el.dispatchEvent(event);

    //expect(item.onTap).toHaveBeenCalled();
    expect(tabBar.trySelectItem).toHaveBeenCalled();
  });


  it('Should unbind item on destroy', function() {
    var item = items[0];
    spyOn(item, 'onTap');

    var event = document.createEvent('Event');
    event.initEvent('tap', true, true);
    event.detail = {
      target: item.el
    };
    item.el.dispatchEvent(event);

    expect(item.onTap).toHaveBeenCalled();

    item.onTap.isSpy = false;
    spyOn(item, 'onTap');

    tabBar.destroy();

    event = document.createEvent('Event');
    event.initEvent('tap', true, true);
    event.detail = {
      target: item.el
    };
    item.el.dispatchEvent(event);

    expect(item.onTap).not.toHaveBeenCalled();
  });
});

describe('TabBarItem view', function() {
  var element, tabBar, items;

  beforeEach(function() {
    element = $('<div class="tabs">' + 
      '<a href="#" class="tab-item"><i class="icon-home"></i> Tab 1</a>' +
      '<a href="#" class="tab-item">Tab 2</a>' +
      '<a href="#" class="tab-item">Tab 3</a>');

    tabBar = new ionic.views.TabBar({
      el: element.get(0)
    });

    items = tabBar.getItems();
  });
  it('Should set item title', function() {
    var item = items[0];
    expect(item.getTitle()).toBe('Tab 1');
  });
  it('Should set item icon', function() {

    var item = items[0];
    expect(item.getIcon()).toBe('icon-home');
  });
  it('Should unbind item on destroy', function() {
    var item = items[0];
    spyOn(item, 'onTap');

    var event = document.createEvent('Event');
    event.initEvent('tap', true, true);
    event.detail = {
      target: item.el
    };
    item.el.dispatchEvent(event);

    expect(item.onTap).toHaveBeenCalled();

    item.onTap.isSpy = false;
    spyOn(item, 'onTap');

    item.destroy();

    event = document.createEvent('Event');
    event.initEvent('tap', true, true);
    event.detail = {
      target: item.el
    };
    item.el.dispatchEvent(event);

    expect(item.onTap).not.toHaveBeenCalled();
  });
});
