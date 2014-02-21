describe('TabBarController', function() {
  var ctrl;

  beforeEach(function() {
    var tabEl = $('<div class="tabs"></div>');
    ctrl = new ionic.controllers.TabBarController({
      tabBar: new ionic.views.TabBar({ 
        el: tabEl.get(0)
      })
    });
  });

  it('Should add Controllers', function() {
    ctrl.addController({
      title: 'Item 1',
      icon: 'icon-home',
      badge: 'Badge 1'
    });

    expect(ctrl.getController(0).title).toEqual('Item 1');
    expect(ctrl.getController(0).badge).toEqual('Badge 1');

    var items = ctrl.tabBar.getItems();
    expect(items.length).toEqual(1);

    expect(items[0].getTitle()).toEqual('Item 1');
    expect(items[0].getBadge()).toEqual('Badge 1');
    expect(items[0].getIcon()).toEqual('icon-home');

  });

  it('Should set Controllers', function() {
    var Controllers = [
      { title: 'Item 1' },
      { title: 'Item 2' },
      { title: 'Item 3' },
    ];
    ctrl.setControllers(Controllers);

    expect(ctrl.getControllers()).toBe(Controllers);
  });

  it('Should select Controller', function() {
    Controller = {
      title: 'Item 1'
    };

    ctrl.addController(Controller);

    ctrl.selectController(0);

    expect(ctrl.getSelectedController()).toEqual(Controller);
  });

  it('Should trigger lifecycle methods', function() {
    Controller = {
      title: 'Item 1'
    };

    spyOn(ctrl, 'controllerWillChange');
    spyOn(ctrl, 'controllerChanged');

    ctrl.addController(Controller);
    ctrl.selectController(0);
    expect(ctrl.controllerWillChange).toHaveBeenCalled();
    expect(ctrl.controllerChanged).toHaveBeenCalled();
  });

  it('Should allow cancelling Controller switch', function() {
    var tabEl = $('<div class="tabs"></div>');
    ctrl = new ionic.controllers.TabBarController({
      tabBar: new ionic.views.TabBar({ el: tabEl.get(0) }),
      controllerWillChange: function(Controller) { return false; }
    });

    ctrl.addController({
      title: 'Item 1'
    });
    ctrl.addController({
      title: 'Item 2'
    });
    ctrl.selectController(1);

    // Make sure the Controller didn't switch
    expect(ctrl.getSelectedController()).toBe(ctrl.getController(0));
  });

});
