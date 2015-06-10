suite('timing', function() {
  test('pause and scrub', function() {
    var animation = document.body.animate([], { duration: 1000 });
    animation.pause();

    animation.currentTime = 500;
    assert.equal(animation.currentTime, 500);
  });

  test('pause, scrub and play', function() {
    var target = document.createElement('div');
    document.body.appendChild(target);

    var animation = target.animate([
      { background: 'blue' },
      { background: 'red' }
    ], { duration: 1000 });
    tick(100);
    animation.pause();

    animation.currentTime = 200;
    // http://www.w3.org/TR/web-animations/#the-current-time-of-an-animation
    // currentTime should now mean 'hold time' - this allows scrubbing.
    assert.equal(animation.currentTime, 200);
    animation.play();

    tick(200);
    tick(300);
    assert.equal(animation.currentTime, 300);
    assert.equal(animation.startTime, 0);
  });

  test('sanity-check NaN timing', function() {
    // This has no actual tests, but will infinite loop without fix.

    var animation = document.body.animate([], {
      duration: 2000,
      easing: 'ease-in'  // fails only with cubic easing, not linear
    });
    tick(100);
    animation.currentTime = NaN;
    tick(200);

    animation = document.body.animate([], { duration: NaN, easing: 'ease-out' });
    tick(300);
  });

  test('can set fill:none on group', function() {
    var timing = webAnimationsShared.makeTiming({fill: 'none'}, true);
    assert.equal(timing.fill, 'none');
  });
});
