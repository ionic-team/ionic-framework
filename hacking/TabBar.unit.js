describe('TabBar view', function() {
  var element, tabBar, items;

  beforeEach(function() {
    element = $('<div class="tabs">' + 
      '<a href="#" class="tab-item">Tab 1</a>' +
      '<a href="#" class="tab-item">Tab 2</a>' +
      '<a href="#" class="tab-item">Tab 3</a>');

    tabBar = new TabBar({
      el: element.get(0)
    });

  });
  it('Should read tabs', function() {

    items = tabBar.getItems();

    expect(items.length).toEqual(3);
    expect(items[0].el.innerText).toEqual('Tab 1');
    expect(items[1].el.innerText).toEqual('Tab 2');
    expect(items[2].el.innerText).toEqual('Tab 3');
  });

  it('Should select', function() {
    items = tabBar.getItems();

    // Track selection object
    tabBar.setSelectedItem(1);
    expect(tabBar.getSelectedItem().el.innerText).toEqual('Tab 2');
    tabBar.setSelectedItem(0);
    expect(tabBar.getSelectedItem().el.innerText).toEqual('Tab 1');
    tabBar.setSelectedItem(2);
    expect(tabBar.getSelectedItem().el.innerText).toEqual('Tab 3');

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
});
