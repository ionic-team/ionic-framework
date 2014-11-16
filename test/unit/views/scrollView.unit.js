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

  it('Should resize when the keyboard is showing', function() {
    var element = document.createElement('textarea');
    ionic.Platform.setPlatform('ios');
    s.appendChild(element);
    document.body.appendChild(sc);

    var sv = new ionic.views.Scroll({
      el: sc,
    });

    var scHeight = 500;
    sc.style.height = scHeight + "px";
    sc.style.display = "block";

    var viewportHeight = 480;
    var scBottom = 460;

    //hack to get this to work
    sc.getBoundingClientRect = function(){
      return { bottom: scBottom };
    };

    var keyboardHeight  = 200;
    details = {
      contentHeight: 260,
      elementBottom: 400,
      elementTop: 300,
      isElementUnderKeyboard: true,
      keyboardHeight: keyboardHeight,
      keyboardTopOffset: 40,
      target: element,
      viewportHeight: viewportHeight
    };

    var scOffsetToBottom = viewportHeight - scBottom;

    expect( sv.isScrolledIntoView ).toBeFalsy();
    ionic.trigger('scrollChildIntoView', details, true);
    expect( sv.isScrolledIntoView ).toEqual(true);
    expect( sc.style.height ).toEqual(scHeight - keyboardHeight + scOffsetToBottom + "px");
    expect( sc.clientHeight ).toEqual(scHeight - keyboardHeight + scOffsetToBottom);
  });

});
