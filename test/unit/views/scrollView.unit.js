describe('Scroll View', function() {
  var sc;
  beforeEach(function() {
    sc = document.createElement('scroll-content');
    s = document.createElement('scroll');
    sc.appendChild(s);
  });

  it('Should init', function() {
    var sv = new ionic.views.Scroll({
      el: sc
    });
  });

  it('Should have Y and not X scroll and bars by default', function() {
    var sv = new ionic.views.Scroll({
      el: sc,
    });

    expect(sv.options.scrollingX).toBe(false);
    expect(sc.children[1].classList.contains('scroll-bar')).toBe(true);
    expect(sc.children[2]).toBe(undefined);
  });

  it('Should enable scrollbars', function() {
    var sv = new ionic.views.Scroll({
      el: sc,
      scrollbarsX: true,
      scrollingX: true,
      scrollbarsY: true,
      scrollingY: true,
    });

    expect(sc.children[1].classList.contains('scroll-bar')).toBe(true);
    expect(sc.children[2].classList.contains('scroll-bar')).toBe(true);
  });
});
