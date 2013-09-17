describe('NavController', function() {
  var ctrl;

  beforeEach(function() {
    ctrl = new NavController({
      navBar: new NavBar()
    });
  });

  it('Should load controllers', function() {
    ctrl = new NavController({
      controllers: [{}]
    });
    expect(ctrl.getControllers().length).toEqual(1);
  });

  it('Should push controller', function() {
    ctrl.push({
      title: 'Page 1'
    });
    expect(ctrl.getControllers().length).toEqual(1);
    ctrl.push({
      title: 'Page 2'
    });
    expect(ctrl.getControllers().length).toEqual(2);
    var last = ctrl.pop();
    expect(ctrl.getControllers().length).toEqual(1);
    expect(last.title).toEqual('Page 2');
  });

  it('Should change top view controller', function() {
    expect(ctrl.getTopController()).toBe(undefined);
    var c1 = {
      title: 'Page 1'
    };
    var c2 = {
      title: 'Page 2'
    };
    ctrl.push(c1);
    expect(ctrl.getTopController()).toEqual(c1);
    ctrl.push(c2);
    expect(ctrl.getTopController()).toEqual(c2);
    ctrl.pop();
    expect(ctrl.getTopController()).toEqual(c1);
    ctrl.pop();
    expect(ctrl.getTopController()).toEqual(undefined);
  });
});
