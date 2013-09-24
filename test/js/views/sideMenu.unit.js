describe('SideMenu', function() {
  var menu;

  beforeEach(function() {
    var d = document.createElement('div');
    menu = new ionic.views.SideMenu({
      el: d,
      width: 270
    });
  });

  it('Should init', function() {
    expect(menu.width).toEqual(270);
    expect(menu.isEnabled).toEqual(true);
  });
});
