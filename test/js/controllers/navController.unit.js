describe('NavController', function() {
  var ctrl, navBarEl, contentEl;

  var content = function(title) {
    return {
      el: document.createElement('div'),
      title: title,
      detach: function() {
        this.el.parentNode && this.el.parentNode.removeChild(this.el);
      },
      attach: function() {
      }
    };
  };

  beforeEach(function() {
    navBarEl = document.createElement('div');
    contentEl = document.createElement('div');

    ctrl = new ionic.controllers.NavController({
      navBar: new ionic.views.NavBar({el: navBarEl }),
      content: { el: contentEl }
    });
  });

  it('Should load controllers', function() {
    ctrl = new ionic.controllers.NavController({
      navBar: new ionic.views.NavBar({el: navBarEl }),
      content: { el: contentEl },
      controllers: [{}]
    });
    expect(ctrl.getControllers().length).toEqual(1);
  });

  it('Should push controller', function() {
    ctrl.push(content('Page 1'));
    expect(ctrl.getControllers().length).toEqual(1);
    ctrl.push(content('Page 2'));
    expect(ctrl.getControllers().length).toEqual(2);
    var last = ctrl.pop();
    expect(ctrl.getControllers().length).toEqual(1);
    expect(last.title).toEqual('Page 2');
  });

  it('Should change top view controller', function() {
    expect(ctrl.getTopController()).toBe(undefined);
    var c1 = content('Page 1');
    var c2 = content('Page 2');
    ctrl.push(c1);
    expect(ctrl.getTopController()).toEqual(c1);
    ctrl.push(c2);
    expect(ctrl.getTopController()).toEqual(c2);
    ctrl.pop();
    expect(ctrl.getTopController()).toEqual(c1);

    // Make sure we can't pop the first one off
    ctrl.pop();
    expect(ctrl.getTopController()).toEqual(c1);
  });
});
