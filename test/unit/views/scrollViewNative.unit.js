describe('Scroll View', function() {
  var sc;
  beforeEach(function() {
    sc = document.createElement('scroll-content');
    s = document.createElement('scroll');
    sc.appendChild(s);
  });

  it('Should init', function() {
    var sv = new ionic.views.ScrollNative({
      el: sc
    });
  });

  it('Should bind to event listeners', function() {
    spyOn(sc,'addEventListener');
    spyOn(document,'addEventListener');
    var sv = new ionic.views.ScrollNative({
      el: sc
    });

    expect(document.addEventListener).toHaveBeenCalled();
    expect(document.addEventListener.mostRecentCall.args[0]).toBe('resetScrollView');
    expect(sc.addEventListener).toHaveBeenCalled();
    expect(sc.addEventListener.callCount).toBe(2);
    expect(sc.addEventListener.mostRecentCall.args[0]).toBe('scrollChildIntoView');
  });

  it('Should remove event listeners on cleanup', function() {
    spyOn(sc,'removeEventListener');
    var sv = new ionic.views.ScrollNative({
      el: sc
    });
    sv.__cleanup();

    expect(sc.removeEventListener).toHaveBeenCalled();
    expect(sc.removeEventListener.callCount).toBe(4);
    expect(sc.removeEventListener.mostRecentCall.args[0]).toBe('resetScrollView');
  });

});
