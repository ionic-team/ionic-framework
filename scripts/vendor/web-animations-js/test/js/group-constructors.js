suite('group-constructors', function() {
  function simpleGroupEffect() {
    return new SequenceEffect([
      new KeyframeEffect(document.body, [], 2000),
      new GroupEffect([
        new KeyframeEffect(document.body, [], 2000),
        new KeyframeEffect(document.body, [], 1000)
      ])
    ]);
  }

  test('animation getter for children in groups works as expected', function() {
    var anim = document.timeline.play(simpleGroupEffect());
    tick(0);
    assert.equal(anim.effect.animation, anim);
    assert.equal(anim._childAnimations[0].effect.animation, anim);
    assert.equal(anim._childAnimations[1].effect.animation, anim);
    tick(2100);
    assert.equal(anim._childAnimations[1]._childAnimations[0].effect.animation, anim);
    assert.equal(anim._childAnimations[1]._childAnimations[1].effect.animation, anim);
  });
});
