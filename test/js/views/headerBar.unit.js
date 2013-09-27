describe('HeaderBar View', function() {
  beforeEach(function() {
    var h = document.createElement('header');
    h.innerHTML = '<a class="button">Click</a><h2 class="title">What what what</h2>';
    h.appendChild('h1');
  });

  it('Should init', function() {
    var bar = new ionic.views.HeaderBar({
      el: h
    });
  });
});
