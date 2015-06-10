suite('keyframe-effect-constructor', function() {
  setup(function() {
    document.timeline.getAnimations().forEach(function(animation) {
      animation.cancel();
    });
  });

  test('Playing a KeyframeEffect makes an Animation', function() {
    var keyframeEffect = new KeyframeEffect(document.body, [], 1000);
    assert.equal(document.body.getAnimations().length, 0);

    var animation = document.timeline.play(keyframeEffect);
    tick(200);
    assert.equal(document.body.getAnimations().length, 1);

    tick(1600);
    assert.equal(document.body.getAnimations().length, 0);
  });

  test('Setting the timing function on a KeyframeEffect works', function() {
    function leftAsNumber(target) {
      left = getComputedStyle(target).left;
      return Number(left.substring(0, left.length - 2));
    }

    var target1 = document.createElement('div');
    var target2 = document.createElement('div');
    target1.style.position = 'absolute';
    target2.style.position = 'absolute';
    document.body.appendChild(target1);
    document.body.appendChild(target2);

    var keyframeEffect1 = new KeyframeEffect(target1, [{left: '0px'}, {left: '50px'}], 1000);
    var keyframeEffect2 = new KeyframeEffect(target2, [{left: '0px'}, {left: '50px'}], {duration: 1000, easing: 'ease-in'});

    var animation1 = document.timeline.play(keyframeEffect1);
    var animation2 = document.timeline.play(keyframeEffect2);

    tick(0);
    assert.equal(leftAsNumber(target1), 0);
    assert.equal(leftAsNumber(target2), 0);

    tick(250);
    assert.closeTo(leftAsNumber(target1), 12.5, 1);
    assert.closeTo(leftAsNumber(target2), 4.65, 1);

    tick(500);
    assert.closeTo(leftAsNumber(target1), 25, 1);
    assert.closeTo(leftAsNumber(target2), 15.25, 1);
  });

  test('Timing is always converted to an AnimationEffectTiming', function() {
    var target = document.createElement('div');
    document.body.appendChild(target);

    var keyframes = [{background: 'blue'}, {background: 'red'}];

    var keyframeEffect = new KeyframeEffect(target, keyframes, 200);
    assert.equal(keyframeEffect.timing.duration, 200);

    keyframeEffect = new KeyframeEffect(target, keyframes);
    assert.isDefined(keyframeEffect.timing);

    keyframeEffect = new KeyframeEffect(target, keyframes, {duration: 200});
    var group = new GroupEffect([keyframeEffect]);
    assert.equal(group.timing.duration, 'auto');
  });

  test('Handle null target for KeyframeEffect', function() {
    var keyframeEffect = new KeyframeEffect(null, function(tf) {
      // noop
    }, 200);

    var animation = document.timeline.play(keyframeEffect);
    assert.isNotNull(animation);
    tick(50);
    tick(150);
    assert.equal(animation.currentTime, 100);
  });
});
