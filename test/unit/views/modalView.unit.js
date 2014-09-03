describe('Modal View', function() {
  var h;
  beforeEach(function() {
    m = document.createElement('modal');
    m.innerHTML = '<a class="button">Click</a><h1 class="title">What what what</h1>';
  });

  it('Should init', function() {
    var mod = new ionic.views.Modal({
      el: m
    });
    expect(mod.focusFirstInput).toBe(false);
    expect(mod.unfocusOnHide).toBe(true);
    expect(mod.focusFirstDelay).toBe(600);
    expect(mod.backdropClickToClose).toBe(true);
    expect(mod.hardwareBackButtonClose).toBe(true);

  });
});
