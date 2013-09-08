describe('TabBarController', function() {
  var ctrl;

  beforeEach(function() {
    ctrl = new TabBarController({
      tabBar: new TabBar()
    });
  })

  it('Should add tabs', function() {
    ctrl.addTab({
      text: 'Item 1'
    });

    expect(ctrl.getTab(0).text).toEqual('Item 1');
  });

  it('Should set tabs', function() {
    var tabs = [
      { text: 'Item 1' },
      { text: 'Item 2' },
      { text: 'Item 3' },
    ];
    ctrl.setTabs(tabs);

    expect(ctrl.getTabs()).toBe(tabs);
  });

  it('Should select tab', function() {
    tab = {
      text: 'Item 1'
    };

    ctrl.addTab(tab);

    ctrl.selectTab(0);

    expect(ctrl.getSelectedTab()).toEqual(tab);
  });

  it('Should trigger lifecycle methods', function() {
    tab = {
      text: 'Item 1'
    };

    spyOn(ctrl, 'tabWillChange');
    spyOn(ctrl, 'tabChanged');

    ctrl.addTab(tab);
    ctrl.selectTab(0);
    expect(ctrl.tabWillChange).toHaveBeenCalled();
    expect(ctrl.tabChanged).toHaveBeenCalled();
  });

  it('Should allow cancelling tab switch', function() {
    ctrl = new TabBarController({
      tabBar: new TabBar(),
      tabWillChange: function(tab) { return false; }
    });

    ctrl.addTab({
      text: 'Item 1'
    });
    ctrl.addTab({
      text: 'Item 2'
    });
    ctrl.selectTab(1);

    // Make sure the tab didn't switch
    expect(ctrl.getSelectedTab()).toBe(ctrl.getTab(0));
  });

})