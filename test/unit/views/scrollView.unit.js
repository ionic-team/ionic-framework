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
      scrollingY: true
    });

    expect(sc.children[1].classList.contains('scroll-bar')).toBe(true);
    expect(sc.children[2].classList.contains('scroll-bar')).toBe(true);
  });

  it('Should shrink on scrollChildIntoView if not already', function() {
    ionic.Platform.setPlatform('ios');

    var input = document.createElement('input');
    s.appendChild(input);
    document.body.appendChild(sc);

    var sv = new ionic.views.Scroll({
      el: sc
    });

    sc.style.height =  "500px";
    sc.style.display = "block";

    var _scrollGetBoundingClientRect = sc.getBoundingClientRect;
    var _RAF = ionic.requestAnimationFrame;

    sc.getBoundingClientRect = function(){
      return { bottom: 520 };
    };
    ionic.requestAnimationFrame = function(cb){ cb(); };

    var details = {
      target: input,
      elementTop: 500,
      elementBottom: 510,
      keyboardHeight: 300,
      viewportHeight: 568,
      windowHeight: 268,
      isElementUnderKeyboard: true
    };

    spyOn(sv, 'resize');
    expect(sv.isShrunkForKeyboard).toBeUndefined();
    ionic.trigger('scrollChildIntoView', details, true);
    expect(sv.resize).toHaveBeenCalled();
    expect(sv.isShrunkForKeyboard).toBe(true);
    expect(sc.style.height).toEqual("248px");
    expect(sc.style.overflow).toEqual("visible");

    ionic.trigger('scrollChildIntoView', details, true);
    //already shrunk, so shouldn't resize again
    expect(sv.resize.calls.length).toBe(1);

    ionic.requestAnimationFrame = _RAF;
    sc.getBoundingClientRect = _scrollGetBoundingClientRect;
  });
});
