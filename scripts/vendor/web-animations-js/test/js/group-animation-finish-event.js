suite('group-animation-finish-event', function() {
  setup(function() {
    document.timeline.currentTime = undefined;
    this.element = document.createElement('div');
    document.documentElement.appendChild(this.element);
    var sequenceEffect = new SequenceEffect([
      new KeyframeEffect(this.element, [], 500),
      new GroupEffect([
        new KeyframeEffect(this.element, [], 250),
        new KeyframeEffect(this.element, [], 500),
      ]),
    ]);
    this.animation = document.timeline.play(sequenceEffect, 1000);
  });
  teardown(function() {
    if (this.element.parent)
      this.element.removeChild(this.element);
  });

  test('fire when animation completes', function(done) {
    var ready = false;
    var fired = false;
    var animation = this.animation;
    animation.onfinish = function(event) {
      assert(ready, 'must not be called synchronously');
      assert.equal(this, animation);
      assert.equal(event.target, animation);
      assert.equal(event.currentTime, 1000);
      assert.equal(event.timelineTime, 1100);
      if (fired)
        assert(false, 'must not get fired twice');
      fired = true;
      done();
    };
    tick(100);
    tick(1100);
    tick(2100);
    ready = true;
  });

  test('fire when reversed animation completes', function(done) {
    this.animation.onfinish = function(event) {
      assert.equal(event.currentTime, 0);
      assert.equal(event.timelineTime, 1001);
      done();
    };
    tick(0);
    tick(500);
    this.animation.reverse();
    tick(501);
    tick(1001);
  });

  test('fire after animation is cancelled', function(done) {
    this.animation.onfinish = function(event) {
      assert.equal(event.currentTime, 0);
      assert.equal(event.timelineTime, 1, 'event must be fired on next sample');
      done();
    };
    tick(0);
    this.animation.cancel();
    tick(1);
  });

  test('multiple event listeners', function(done) {
    var count = 0;
    function createHandler(expectedCount) {
      return function() {
        count++;
        assert.equal(count, expectedCount);
      };
    }
    var toRemove = createHandler(0);
    this.animation.addEventListener('finish', createHandler(1));
    this.animation.addEventListener('finish', createHandler(2));
    this.animation.addEventListener('finish', toRemove);
    this.animation.addEventListener('finish', createHandler(3));
    this.animation.removeEventListener('finish', toRemove);
    this.animation.onfinish = function() {
      assert.equal(count, 3);
      done();
    };
    tick(0);
    this.animation.cancel();
    tick(1000);
  });
});
