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

  it('Should be frozen after calling freeze', function(){
    var sv = new ionic.views.ScrollNative({
      el: sc
    });
    sv.freeze(true);
    expect(sv.__frozen).toEqual(true);
    sv.freeze(false);
    expect(sv.__frozen).toEqual(false);
  });

  it('Should be frozen shut after calling freezeShut', function(){
    var sv = new ionic.views.ScrollNative({
      el: sc
    });
    sv.freezeShut(true);
    expect(sv.__frozenShut).toEqual(true);
    sv.freezeShut(false);
    expect(sv.__frozenShut).toEqual(false);
  });

  it('Should shut down event completely when view is frozen shut', function(){
    var sv = new ionic.views.ScrollNative({
      el: sc
    });
    sv.freezeShut(true);

    var mockEvent = {
      preventDefault: jasmine.createSpy(),
      stopPropagation: jasmine.createSpy()
    };

    var result = sv.handleTouchMove(mockEvent);
    expect(result).toEqual(false);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockEvent.preventDefault.callCount).toEqual(1);
    expect(mockEvent.stopPropagation.callCount).toEqual(1);
  });

  it('Should prevent default on event when view is frozen', function(){
    var sv = new ionic.views.ScrollNative({
      el: sc
    });
    sv.freeze(true);

    var mockEvent = {
      preventDefault: jasmine.createSpy(),
      stopPropagation: jasmine.createSpy()
    };

    var result = sv.handleTouchMove(mockEvent);
    expect(result).toEqual(false);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
    expect(mockEvent.preventDefault.callCount).toEqual(1);
    expect(mockEvent.stopPropagation.callCount).toEqual(0);
  });
});
