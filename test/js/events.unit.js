describe('Ionic Events', function() {
  it('Should block all click events', function() {
    var a = document.createElement('a');

    ionic.trigger('click', {
      target: a
    });
  });
});
