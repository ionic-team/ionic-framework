describe('Toggle view', function() {
  var element, toggle;

  beforeEach(function() {
    element = $('<div class="item item-toggle disable-pointer-events">' +
                '<div>Cats</div>' +
                '<label class="toggle enable-pointer-events">' +
                  '<input type="checkbox">' +
                  '<div class="track disable-pointer-events">' +
                    '<div class="handle"></div>' +
                  '</div>' +
                '</label>' +
              '</div>');

    el = element[0].getElementsByTagName('label')[0];
    checkbox = el.children[0];
    track = el.children[1];
    handle = track.children[0];
    toggle = new ionic.views.Toggle({
      el: el,
      checkbox: checkbox,
      track: track,
      handle: handle
    });
  });

  it('Should init', function() {
    expect(toggle.el).not.toBe(undefined);
  });
});
