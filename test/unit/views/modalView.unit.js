describe('Modal View', function() {
  var h;
  beforeEach(function() {
    h = document.createElement('modal');
    h.innerHTML = '<a class="button">Click</a><h1 class="title">What what what</h1>';
  });

  it('Should init', function() {
    var bar = new ionic.views.Modal({
      el: h
    });
  });
});
