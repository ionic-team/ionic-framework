suite('group-animation', function() {
  setup(function() {
    document.timeline._animations = [];
    webAnimations1.timeline._animations = [];
    this.elements = [];

    var marginEffect = function(target) {
      return new KeyframeEffect(
          target,
          [
           {marginLeft: '0px'},
           {marginLeft: '100px'}
          ],
          500);
    };
    var colorEffect = function(target) {
      return new KeyframeEffect(
          target,
          [
           {backgroundColor: 'black'},
           {backgroundColor: 'white'}
          ],
          500);
    };
    var sequenceEmpty = function() {
      return new SequenceEffect();
    };
    var groupEmpty = function() {
      return new GroupEffect();
    };
    var sequenceWithContent = function(target) {
      return new SequenceEffect(
          [
           marginEffect(target),
           colorEffect(target)
          ]);
    };
    var groupWithContent = function(target) {
      return new GroupEffect(
          [
           marginEffect(target),
           colorEffect(target)
          ]);
    };

    var emptySeq = sequenceEmpty();

    var seqSimple_target = document.createElement('div');
    this.elements.push(seqSimple_target);
    var seqSimple = sequenceWithContent(seqSimple_target);

    var seqWithSeq_target = document.createElement('div');
    this.elements.push(seqWithSeq_target);
    var seqWithSeq = new SequenceEffect(
        [
         marginEffect(seqWithSeq_target),
         colorEffect(seqWithSeq_target),
         sequenceWithContent(seqWithSeq_target)
        ]);

    var seqWithGroup_target = document.createElement('div');
    this.elements.push(seqWithGroup_target);
    var seqWithGroup = new SequenceEffect(
        [
         marginEffect(seqWithGroup_target),
         colorEffect(seqWithGroup_target),
         groupWithContent(seqWithGroup_target)
        ]);

    var seqWithEmptyGroup = new SequenceEffect([groupEmpty()]);
    var seqWithEmptySeq = new SequenceEffect([sequenceEmpty()]);

    var emptyGroup = groupEmpty();

    var groupSimple_target = document.createElement('div');
    var groupSimple = groupWithContent(groupSimple_target);

    var groupWithSeq_target = document.createElement('div');
    this.elements.push(groupWithSeq_target);
    var groutWithSeq = new GroupEffect(
        [
         marginEffect(groupWithSeq_target),
         colorEffect(groupWithSeq_target),
         sequenceWithContent(groupWithSeq_target)
        ]);

    var groupWithGroup_target = document.createElement('div');
    this.elements.push(groupWithGroup_target);
    var groupWithGroup = new GroupEffect(
        [
         marginEffect(groupWithGroup_target),
         colorEffect(groupWithGroup_target),
         groupWithContent(groupWithGroup_target)
        ]);

    var groupWithEmptyGroup = new GroupEffect([groupEmpty()]);
    var groupWithEmptySeq = new GroupEffect([sequenceEmpty()]);

    this.emptySeq = emptySeq;
    this.seqSimple = seqSimple;
    this.seqWithSeq = seqWithSeq;
    this.seqWithGroup = seqWithGroup;
    this.seqWithEmptyGroup = seqWithEmptyGroup;
    this.seqWithEmptySeq = seqWithEmptySeq;

    this.emptyGroup = emptyGroup;
    this.groupSimple = groupSimple;
    this.groutWithSeq = groutWithSeq;
    this.groupWithGroup = groupWithGroup;
    this.groupWithEmptyGroup = groupWithEmptyGroup;
    this.groupWithEmptySeq = groupWithEmptySeq;

    this.staticEffect = function(target, value, duration) {
      var keyframeEffect = new KeyframeEffect(target, [{marginLeft: value}, {marginLeft: value}], duration);
      keyframeEffect.testValue = value;
      return keyframeEffect;
    };
    // The following animation structure looks like:
    // 44444
    // 11
    //   33
    //   2
    // 0
    this.complexTarget = document.createElement('div');
    this.elements.push(this.complexTarget);
    this.complexSource = new GroupEffect([
      this.staticEffect(this.complexTarget, '4px', 5),
      new SequenceEffect([
        this.staticEffect(this.complexTarget, '1px', 2),
        new GroupEffect([
          this.staticEffect(this.complexTarget, '3px', 2),
          this.staticEffect(this.complexTarget, '2px', 1),
        ]),
      ]),
      this.staticEffect(this.complexTarget, '0px', 1),
    ]);

    this.target = document.createElement('div');
    this.target1 = document.createElement('div');
    this.target2 = document.createElement('div');
    this.target3 = document.createElement('div');
    this.elements.push(this.target);
    this.elements.push(this.target1);
    this.elements.push(this.target2);
    this.elements.push(this.target3);

    for (var i = 0; i < this.elements.length; i++)
      document.documentElement.appendChild(this.elements[i]);

    // Playback rate test helpers.
    var target1 = this.target1;
    var target2 = this.target2;
    var target3 = this.target3;
    target1.style.transform = 'translate(500px)';
    target2.style.transform = 'translate(500px)';
    target3.style.transform = 'translate(500px)';
    var underlyingPosition = 'matrix(1, 0, 0, 1, 500, 0)';
    var startPosition = 'matrix(1, 0, 0, 1, 0, 0)';
    var endPosition = 'matrix(1, 0, 0, 1, 300, 0)';
    this.prChildDuration = 100;
    this.sequenceForPR = function(parentFill, childFill) {
      return new SequenceEffect([
        new KeyframeEffect(
            target1,
            [{transform: 'translate(0,0)'}, {transform: 'translate(300px)'}],
            {duration: this.prChildDuration, fill: childFill}),
        new KeyframeEffect(
            target2,
            [{transform: 'translate(0,0)'}, {transform: 'translate(300px)'}],
            {duration: this.prChildDuration, fill: childFill}),
        new KeyframeEffect(
            target3,
            [{transform: 'translate(0,0)'}, {transform: 'translate(300px)'}],
            {duration: this.prChildDuration, fill: childFill})
      ],
      {fill: parentFill});
    };
    this.isUnderlyingPosition = function() {
      assert.equal(getComputedStyle(target1).transform, startPosition);
      assert.equal(getComputedStyle(target2).transform, underlyingPosition);
      assert.equal(getComputedStyle(target3).transform, underlyingPosition);
    };
    this.isFillingForwards = function() {
      assert.equal(getComputedStyle(target1).transform, endPosition);
      assert.equal(getComputedStyle(target2).transform, endPosition);
    };
    this.isNotFillingForwards = function() {
      assert.equal(getComputedStyle(target1).transform, underlyingPosition);
      assert.equal(getComputedStyle(target2).transform, underlyingPosition);
    };
    this.isFillingBackwardsDuring = function() {
      assert.equal(getComputedStyle(target2).transform, startPosition);
      assert.equal(getComputedStyle(target3).transform, startPosition);
    };
    this.isNotFillingBackwardsDuring = function() {
      assert.equal(getComputedStyle(target2).transform, underlyingPosition);
      assert.equal(getComputedStyle(target3).transform, underlyingPosition);
    };
    this.isFillingBackwards = function() {
      assert.equal(getComputedStyle(target1).transform, startPosition);
      assert.equal(getComputedStyle(target2).transform, startPosition);
      assert.equal(getComputedStyle(target3).transform, startPosition);
    };
    this.isNotFillingBackwards = function() {
      assert.equal(getComputedStyle(target1).transform, underlyingPosition);
      assert.equal(getComputedStyle(target2).transform, underlyingPosition);
      assert.equal(getComputedStyle(target3).transform, underlyingPosition);
    };
    this.checkFills = function(parentFillMode, childFillMode, startFill, normalFill, reverseFill, endFill, reverse) {
      var animation = document.timeline.play(this.sequenceForPR(parentFillMode, childFillMode));
      tick(0);
      startFill();
      tick(2 * this.prChildDuration);
      normalFill();
      tick(this.prChildDuration * 2.5);
      reverse ? animation.reverse() : animation.playbackRate *= -1;
      tick(3.5 * this.prChildDuration);
      tick(5 * this.prChildDuration);
      reverseFill();
      tick(6);
      tick(7.5 * this.prChildDuration);
      endFill();
      animation.cancel();
    };
  });

  teardown(function() {
    for (var i = 0; i < this.elements.length; i++) {
      if (this.elements[i].parent)
        this.elements[i].parent.removeChild(this.elements[i]);
    }
  });

  function simpleGroupEffect() {
    return new GroupEffect([new KeyframeEffect(document.body, [], 2000), new KeyframeEffect(document.body, [], 1000), new KeyframeEffect(document.body, [], 3000)]);
  }

  function simpleSequenceEffect() {
    return new SequenceEffect([new KeyframeEffect(document.body, [], 2000), new KeyframeEffect(document.body, [], 1000), new KeyframeEffect(document.body, [], 3000)]);
  }

  // FIXME: Remove _startOffset.
  // animationState is [startTime, currentTime, _startOffset?, offset?]
  // innerAnimationStates is a nested array tree of animationStates e.g. [[0, 0], [[1, -1], [2, -2]]]
  function checkTimes(animation, animationState, innerAnimationStates, description) {
    description = description ? (description + ' ') : '';
    _checkTimes(animation, animationState, 0, description + 'top animation');
    _checkTimes(animation, innerAnimationStates, 0, description + 'inner animation');
  }

  function _checkTimes(animation, timingList, index, trace) {
    assert.isDefined(animation, trace + ' exists');
    if (timingList.length == 0) {
      assert.equal(animation._childAnimations.length, index, trace + ' no remaining animations');
      return;
    }
    if (timingList[0] === null || typeof timingList[0] == 'number') {
      assert.equal(animation.startTime, timingList[0], trace + ' startTime');
      assert.equal(animation.currentTime, timingList[1], trace + ' currentTime');
    } else {
      _checkTimes(animation._childAnimations[index], timingList[0], 0, trace + ' ' + index);
      _checkTimes(animation, timingList.slice(1), index + 1, trace);
    }
  }

  test('playing a GroupEffect works as expected', function() {
    tick(90);
    var a = document.timeline.play(simpleGroupEffect());
    checkTimes(a, [null, 0], [[null, 0], [null, 0], [null, 0]]);
    tick(100);
    checkTimes(a, [100, 0], [[100, 0], [100, 0], [100, 0]]);
    tick(300);
    checkTimes(a, [100, 200], [[100, 200], [100, 200], [100, 200]]);
    tick(1200);
    checkTimes(a, [100, 1100], [[100, 1100], [100, 1000], [100, 1100]]);
    tick(2200);
    checkTimes(a, [100, 2100], [[100, 2000], [100, 1000], [100, 2100]]);
    tick(3200);
    checkTimes(a, [100, 3000], [[100, 2000], [100, 1000], [100, 3000]]);
  });

  test('can seek a GroupEffect', function() {
    tick(90);
    var a = document.timeline.play(simpleGroupEffect());
    tick(100);
    checkTimes(a, [100, 0], [[100, 0], [100, 0], [100, 0]]);
    a.currentTime = 200;
    checkTimes(a, [-100, 200], [[-100, 200], [-100, 200], [-100, 200]]);
    a.currentTime = 1100;
    checkTimes(a, [-1000, 1100], [[-1000, 1100], [-1000, 1100], [-1000, 1100]]);
    a.currentTime = 2100;
    checkTimes(a, [-2000, 2100], [[-2000, 2100], [-2000, 2100], [-2000, 2100]]);
    a.currentTime = 3100;
    checkTimes(a, [-3000, 3100], [[-3000, 3100], [-3000, 3100], [-3000, 3100]]);
  });

  test('can startTime seek a GroupEffect', function() {
    tick(90);
    var a = document.timeline.play(simpleGroupEffect());
    tick(100);
    checkTimes(a, [100, 0], [[100, 0], [100, 0], [100, 0]]);
    a.startTime = -100;
    checkTimes(a, [-100, 200], [[-100, 200], [-100, 200], [-100, 200]]);
    a.startTime = -1000;
    checkTimes(a, [-1000, 1100], [[-1000, 1100], [-1000, 1000], [-1000, 1100]]);
    a.startTime = -2000;
    checkTimes(a, [-2000, 2100], [[-2000, 2000], [-2000, 1000], [-2000, 2100]]);
    a.startTime = -3000;
    checkTimes(a, [-3000, 3000], [[-3000, 2000], [-3000, 1000], [-3000, 3000]]);
  });

  test('playing a SequenceEffect works as expected', function() {
    tick(100);
    var a = document.timeline.play(simpleSequenceEffect());
    tick(110);
    checkTimes(a, [110, 0], [[110, 0], [2110, -2000], [3110, -3000]]);
    tick(210);
    checkTimes(a, [110, 100], [[110, 100], [2110, -1900], [3110, -2900]]);
    tick(2210);
    checkTimes(a, [110, 2100], [[110, 2000], [2110, 100], [3110, -900]]);
    tick(3210);
    checkTimes(a, [110, 3100], [[110, 2000], [2110, 1000], [3110, 100]]);
    tick(6210);
    checkTimes(a, [110, 6000], [[110, 2000], [2110, 1000], [3110, 3000]]);
  });

  test('can seek a SequenceEffect', function() {
    tick(100);
    var a = document.timeline.play(simpleSequenceEffect());
    tick(110);
    checkTimes(a, [110, 0], [[110, 0], [2110, -2000], [3110, -3000]]);
    a.currentTime = 100;
    checkTimes(a, [10, 100], [[10, 100], [2010, -1900], [3010, -2900]]);
    a.currentTime = 2100;
    checkTimes(a, [-1990, 2100], [[-1990, 2100], [10, 100], [1010, -900]]);
    a.currentTime = 3100;
    checkTimes(a, [-2990, 3100], [[-2990, 3100], [-990, 1100], [10, 100]]);
    a.currentTime = 6100;
    checkTimes(a, [-5990, 6100], [[-5990, 6100], [-3990, 4100], [-2990, 3100]]);
  });

  test('can startTime seek a SequenceEffect', function() {
    tick(100);
    var a = document.timeline.play(simpleSequenceEffect());
    tick(110);
    checkTimes(a, [110, 0], [[110, 0], [2110, -2000], [3110, -3000]]);
    a.startTime = 10;
    checkTimes(a, [10, 100], [[10, 100], [2010, -1900], [3010, -2900]]);
    a.startTime = -1990;
    checkTimes(a, [-1990, 2100], [[-1990, 2000], [10, 100], [1010, -900]]);
    a.startTime = -2990;
    checkTimes(a, [-2990, 3100], [[-2990, 2000], [-990, 1000], [10, 100]]);
    a.startTime = -5990;
    checkTimes(a, [-5990, 6000], [[-5990, 2000], [-3990, 1000], [-2990, 3000]]);
  });

  test('complex animation tree timing while playing', function() {
    tick(90);
    var animation = document.timeline.play(this.complexSource);
    tick(100);
    checkTimes(animation, [100, 0], [
      [100, 0], [ // 4
        [100, 0], [ // 1
          [102, -2], // 3
          [102, -2]]], // 2
      [100, 0], // 0
    ], 't = 100');
    tick(101);
    checkTimes(animation, [100, 1], [
      [100, 1], [ // 4
        [100, 1], [ // 1
          [102, -1], // 3
          [102, -1]]], // 2
      [100, 1], // 0
    ], 't = 101');
    tick(102);
    checkTimes(animation, [100, 2], [
      [100, 2], [ // 4
        [100, 2], [ // 1
          [102, 0], // 3
          [102, 0]]], // 2
      [100, 1], // 0
    ], 't = 102');
  });

  test('effects apply in the correct order', function() {
    tick(0);
    var animation = document.timeline.play(this.complexSource);
    animation.currentTime = 0;
    assert.equal(getComputedStyle(this.complexTarget).marginLeft, '0px');
    animation.currentTime = 1;
    checkTimes(animation, [-1, 1], [[-1, 1, 0], [[-1, 1, 0], [[1, -1, 0], [1, -1, 0]]], [-1, 1, 0]]);
    assert.equal(getComputedStyle(this.complexTarget).marginLeft, '1px');
    animation.currentTime = 2;
    // TODO: When we seek we don't limit. Is this OK?
    checkTimes(animation, [-2, 2], [[-2, 2, 0], [[-2, 2, 0], [[0, 0, 0], [0, 0, 0]]], [-2, 2, 0]]);
    assert.equal(getComputedStyle(this.complexTarget).marginLeft, '2px');
    animation.currentTime = 3;
    assert.equal(getComputedStyle(this.complexTarget).marginLeft, '3px');
    animation.currentTime = 4;
    assert.equal(getComputedStyle(this.complexTarget).marginLeft, '4px');
    animation.currentTime = 5;
    assert.equal(getComputedStyle(this.complexTarget).marginLeft, '0px');
  });

  test('cancelling group animations', function() {
    tick(0);
    var animation = document.timeline.play(this.complexSource);
    tick(1);
    tick(4);
    assert.equal(getComputedStyle(this.complexTarget).marginLeft, '3px');
    animation.cancel();
    assert.equal(animation.currentTime, null);
    assert.equal(getComputedStyle(this.complexTarget).marginLeft, '0px');
  });

  test('cancelling group animations before tick', function() {
    tick(0);
    var animation = document.timeline.play(this.complexSource);
    animation.cancel();
    assert.equal(animation.currentTime, null);
    assert.equal(getComputedStyle(this.complexTarget).marginLeft, '0px');
    tick(4);
    assert.equal(animation.currentTime, null);
    assert.equal(getComputedStyle(this.complexTarget).marginLeft, '0px');
  });

  test('redundant effect node wrapping', function() {
    tick(100);
    var sequenceEffect = new SequenceEffect([
      this.staticEffect(this.target, '0px', 1),
      new GroupEffect([
        new SequenceEffect([
          this.staticEffect(this.target, '1px', 1),
          this.staticEffect(this.target, '2px', 1),
        ]),
      ]),
    ]);
    var animation = document.timeline.play(sequenceEffect);
    assert.equal(getComputedStyle(this.target).marginLeft, '0px');
    checkTimes(animation, [100, 0], [
      [100, 0, 0, 0], [[ // 0
        [101, -1, 0, 1], // 1
        [102, -2, 1, 2]]] // 2
    ], 't = 100');
    tick(101);
    assert.equal(getComputedStyle(this.target).marginLeft, '1px');
    checkTimes(animation, [100, 1], [
      [100, 1, 0, 0], [[ // 0
        [101, 0, 0, 1], // 1
        [102, -1, 1, 2]]] // 2
    ], 't = 101');
    tick(102);
    assert.equal(getComputedStyle(this.target).marginLeft, '2px');
    assert.equal(document.timeline.currentTime, 102);
    checkTimes(animation, [100, 2], [ // FIXME: Implement limiting on group animations
      [100, 1, 0, 0], [[ // 0
        [101, 1, 0, 1], // 1
        [102, 0, 1, 2]]] // 2
    ], 't = 102');
    tick(103);
    assert.equal(getComputedStyle(this.target).marginLeft, '0px');
    checkTimes(animation, [100, 3], [ // FIXME: Implement limiting on group animations
      [100, 1, 0, 0], [[ // 0
        [101, 1, 0, 1], // 1
        [102, 1, 1, 2]]] // 2
    ], 't = 103');
    if (this.target.parent)
      this.target.parent.removeChild(target);
  });

  test('Fill modes work for sequence fill both with children none after setting playbackRate from positive to negative.', function() {
    this.checkFills(
        'both',
        'none',
        this.isUnderlyingPosition,
        this.isNotFillingForwards,
        this.isNotFillingBackwardsDuring,
        this.isNotFillingBackwards,
        false
    );
  });
  test('Fill modes work for sequence fill both with children both after setting playbackRate from positive to negative.', function() {
    this.checkFills(
        'both',
        'both',
        this.isFillingBackwards,
        this.isFillingForwards,
        this.isFillingBackwardsDuring,
        this.isFillingBackwards,
        false
    );
  });
  test('Fill modes work for sequence fill both with children backwards after setting playbackRate from positive to negative.', function() {
    this.checkFills(
        'both',
        'backwards',
        this.isFillingBackwards,
        this.isNotFillingForwards,
        this.isFillingBackwardsDuring,
        this.isFillingBackwards,
        false
    );
  });
  test('Fill modes work for sequence fill both with children forwards after setting playbackRate from positive to negative.', function() {
    this.checkFills(
        'both',
        'forwards',
        this.isUnderlyingPosition,
        this.isFillingForwards,
        this.isNotFillingBackwardsDuring,
        this.isNotFillingBackwards,
        false
    );
  });
  test('Fill modes work for sequence fill none with children fill none after setting playbackRate from positive to negative.', function() {
    this.checkFills(
        'none',
        'none',
        this.isUnderlyingPosition,
        this.isNotFillingForwards,
        this.isNotFillingBackwardsDuring,
        this.isNotFillingBackwards,
        false
    );
  });
  test('Fill modes work for sequence fill none with children fill both after setting playbackRate from positive to negative.', function() {
    this.checkFills(
        'none',
        'both',
        this.isFillingBackwards,
        this.isFillingForwards,
        this.isFillingBackwardsDuring,
        this.isNotFillingBackwards,
        false
    );
  });
  test('Fill modes work for sequence fill none with children fill backwards after setting playbackRate from positive to negative.', function() {
    this.checkFills(
        'none',
        'backwards',
        this.isFillingBackwards,
        this.isNotFillingForwards,
        this.isFillingBackwardsDuring,
        this.isNotFillingBackwards,
        false
    );
  });
  test('Fill modes work for sequence fill none with children fill forwards after setting playbackRate from positive to negative.', function() {
    this.checkFills(
        'none',
        'forwards',
        this.isUnderlyingPosition,
        this.isFillingForwards,
        this.isNotFillingBackwardsDuring,
        this.isNotFillingBackwards,
        false
    );
  });

  test('Fill modes work for sequence fill both with children none after reverse.', function() {
    this.checkFills(
        'both',
        'none',
        this.isUnderlyingPosition,
        this.isNotFillingForwards,
        this.isNotFillingBackwardsDuring,
        this.isNotFillingBackwards,
        true
    );
  });
  test('Fill modes work for sequence fill both with children both after reverse.', function() {
    this.checkFills(
        'both',
        'both',
        this.isFillingBackwards,
        this.isFillingForwards,
        this.isFillingBackwardsDuring,
        this.isFillingBackwards,
        true
    );
  });
  test('Fill modes work for sequence fill both with children backwards after reverse.', function() {
    this.checkFills(
        'both',
        'backwards',
        this.isFillingBackwards,
        this.isNotFillingForwards,
        this.isFillingBackwardsDuring,
        this.isFillingBackwards,
        true
    );
  });
  test('Fill modes work for sequence fill both with children forwards after reverse.', function() {
    this.checkFills(
        'both',
        'forwards',
        this.isUnderlyingPosition,
        this.isFillingForwards,
        this.isNotFillingBackwardsDuring,
        this.isNotFillingBackwards,
        true
    );
  });
  test('Fill modes work for sequence fill none with children fill none after reverse.', function() {
    this.checkFills(
        'none',
        'none',
        this.isUnderlyingPosition,
        this.isNotFillingForwards,
        this.isNotFillingBackwardsDuring,
        this.isNotFillingBackwards,
        true
    );
  });
  test('Fill modes work for sequence fill none with children fill both after reverse.', function() {
    this.checkFills(
        'none',
        'both',
        this.isFillingBackwards,
        this.isFillingForwards,
        this.isFillingBackwardsDuring,
        this.isNotFillingBackwards,
        true
    );
  });
  test('Fill modes work for sequence fill none with children fill backwards after reverse.', function() {
    this.checkFills(
        'none',
        'backwards',
        this.isFillingBackwards,
        this.isNotFillingForwards,
        this.isFillingBackwardsDuring,
        this.isNotFillingBackwards,
        true
    );
  });
  test('Fill modes work for sequence fill none with children fill forwards after reverse.', function() {
    this.checkFills(
        'none',
        'forwards',
        this.isUnderlyingPosition,
        this.isFillingForwards,
        this.isNotFillingBackwardsDuring,
        this.isNotFillingBackwards,
        true
    );
  });

  test('Setting the playbackRate on sequence animations updates child timing. ' +
      'Any children who are not finished go into effect.', function() {
        var sequenceEffect = new SequenceEffect([
          new KeyframeEffect(null, [], 1000),
          new KeyframeEffect(null, [], 1000),
        ]);
        var a = document.timeline.play(sequenceEffect);
        tick(0);

        a.playbackRate = 2;
        assert.equal(a._animation.playbackRate, 2, 'Updates the playbackRate of the inner animation');
        a._childAnimations.forEach(function(childAnimation) {
          assert.equal(childAnimation.playbackRate, 2, 'It also updates the child animations');
        });
        assert.equal(a.currentTime, 0);
        assert.equal(a._childAnimations[0].currentTime, 0);
        assert.equal(a._childAnimations[1].currentTime, -1000);
        assert.equal(a.startTime, null);
        assert.equal(a._childAnimations[0].startTime, null);
        assert.equal(a._childAnimations[1].startTime, null);

        tick(1);
        assert.equal(a.currentTime, 0);
        assert.equal(a._childAnimations[0].currentTime, 0);
        assert.equal(a._childAnimations[1].currentTime, -1000);
        assert.equal(a.startTime, 1);
        assert.equal(a._childAnimations[0].startTime, 1);
        assert.equal(a._childAnimations[1].startTime, 501);

        tick(601);
        assert.equal(a.currentTime, 1200);
        assert.equal(a._childAnimations[0].currentTime, 1000);
        assert.equal(a._childAnimations[1].currentTime, 200);
        assert.equal(a.startTime, 1);
        assert.equal(a._childAnimations[0].startTime, 1);
        assert.equal(a._childAnimations[1].startTime, 501);

        tick(1101);
        assert.equal(a.currentTime, 2000);
        assert.equal(a._childAnimations[0].currentTime, 1000);
        assert.equal(a._childAnimations[1].currentTime, 1000);
        assert.equal(a.startTime, 1);
        assert.equal(a._childAnimations[0].startTime, 1);
        assert.equal(a._childAnimations[1].startTime, 501);

        a.playbackRate = -1;
        assert.equal(a._animation.playbackRate, -1, 'Updates the playbackRate of the inner animation');
        a._childAnimations.forEach(function(childAnimation) {
          assert.equal(childAnimation.playbackRate, -1, 'It also updates the child animations');
        });
        assert.equal(a.currentTime, 2000);
        assert.equal(a._childAnimations[0].currentTime, 2000);
        assert.equal(a._childAnimations[1].currentTime, 1000);
        assert.equal(a.startTime, null);
        assert.equal(a._childAnimations[0].startTime, null);
        assert.equal(a._childAnimations[1].startTime, null);

        tick(1102);
        assert.equal(a.currentTime, 2000);
        assert.equal(a._childAnimations[0].currentTime, 2000);
        assert.equal(a._childAnimations[1].currentTime, 1000);
        assert.equal(a.startTime, 3102);
        assert.equal(a._childAnimations[0].startTime, 3102);
        assert.equal(a._childAnimations[1].startTime, 2102);

        tick(1602);
        assert.equal(a.currentTime, 1500);
        assert.equal(a._childAnimations[0].currentTime, 1500);
        assert.equal(a._childAnimations[1].currentTime, 500);
        assert.equal(a.startTime, 3102);
        assert.equal(a._childAnimations[0].startTime, 3102);
        assert.equal(a._childAnimations[1].startTime, 2102);

        tick(3103);
        assert.equal(a.currentTime, 0);
        assert.equal(a._childAnimations[0].currentTime, 0);
        assert.equal(a._childAnimations[1].currentTime, 0);
        assert.equal(a.startTime, 3102);
        assert.equal(a._childAnimations[0].startTime, 3102);
        assert.equal(a._childAnimations[1].startTime, 2102);

        a.playbackRate = 1;
        assert.equal(a._animation.playbackRate, 1, 'Updates the playbackRate of the inner animation');
        a._childAnimations.forEach(function(childAnimation) {
          assert.equal(childAnimation.playbackRate, 1, 'It also updates the child animations');
        });
        assert.equal(a.currentTime, 0);
        assert.equal(a._childAnimations[0].currentTime, 0);
        assert.equal(a._childAnimations[1].currentTime, -1000);
        assert.equal(a.startTime, null);
        assert.equal(a._childAnimations[0].startTime, null);
        assert.equal(a._childAnimations[1].startTime, null);

        tick(3104);
        assert.equal(a.currentTime, 0);
        assert.equal(a._childAnimations[0].currentTime, 0);
        assert.equal(a._childAnimations[1].currentTime, -1000);
        assert.equal(a.startTime, 3104);
        assert.equal(a._childAnimations[0].startTime, 3104);
        assert.equal(a._childAnimations[1].startTime, 4104);

        tick(3604);
        assert.equal(a.currentTime, 500);
        assert.equal(a._childAnimations[0].currentTime, 500);
        assert.equal(a._childAnimations[1].currentTime, -500);
        assert.equal(a.startTime, 3104);
        assert.equal(a._childAnimations[0].startTime, 3104);
        assert.equal(a._childAnimations[1].startTime, 4104);
      }
  );

  test('Reversing a sequence animation updates child timing correctly', function() {
    var sequenceEffect = new SequenceEffect([
      new KeyframeEffect(null, [], 1000),
      new KeyframeEffect(null, [], 1000),
    ]);
    var a = document.timeline.play(sequenceEffect);
    tick(0);

    a.playbackRate = 2;
    assert.equal(a._animation.playbackRate, 2, 'Updates the playbackRate of the inner animation');
    a._childAnimations.forEach(function(childAnimation) {
      assert.equal(childAnimation.playbackRate, 2, 'It also updates the child animations');
    });
    tick(1);
    tick(1101);
    assert.equal(a.currentTime, 2000);
    assert.equal(a._childAnimations[0].currentTime, 1000);
    assert.equal(a._childAnimations[1].currentTime, 1000);
    assert.equal(a.startTime, 1);
    assert.equal(a._childAnimations[0].startTime, 1);
    assert.equal(a._childAnimations[1].startTime, 501);

    a.reverse();
    assert.equal(a._animation.playbackRate, -2, 'Updates the playbackRate of the inner animation');
    a._childAnimations.forEach(function(childAnimation) {
      assert.equal(childAnimation.playbackRate, -2, 'It also updates the child animations');
    });
    assert.equal(a.currentTime, 2000);
    assert.equal(a._childAnimations[0].currentTime, 2000);
    assert.equal(a._childAnimations[1].currentTime, 1000);
    assert.equal(a.startTime, null);
    assert.equal(a._childAnimations[0].startTime, null);
    assert.equal(a._childAnimations[1].startTime, null);

    tick(1102);
    assert.equal(a.currentTime, 2000);
    assert.equal(a._childAnimations[0].currentTime, 2000);
    assert.equal(a._childAnimations[1].currentTime, 1000);
    assert.equal(a.startTime, 2102);
    assert.equal(a._childAnimations[0].startTime, 2102);
    assert.equal(a._childAnimations[1].startTime, 1602);

    tick(1602);
    assert.equal(a.currentTime, 1000);
    assert.equal(a._childAnimations[0].currentTime, 1000);
    assert.equal(a._childAnimations[1].currentTime, 0);
    assert.equal(a.startTime, 2102);
    assert.equal(a._childAnimations[0].startTime, 2102);
    assert.equal(a._childAnimations[1].startTime, 1602);

    tick(3103);
    assert.equal(a.currentTime, 0);
    assert.equal(a._childAnimations[0].currentTime, 0);
    assert.equal(a._childAnimations[1].currentTime, 0);
    assert.equal(a.startTime, 2102);
    assert.equal(a._childAnimations[0].startTime, 2102);
    assert.equal(a._childAnimations[1].startTime, 1602);

    a.reverse();
    assert.equal(a._animation.playbackRate, 2, 'Updates the playbackRate of the inner animation');
    a._childAnimations.forEach(function(childAnimation) {
      assert.equal(childAnimation.playbackRate, 2, 'It also updates the child animations');
    });
    assert.equal(a.currentTime, 0);
    assert.equal(a._childAnimations[0].currentTime, 0);
    assert.equal(a._childAnimations[1].currentTime, -1000);
    assert.equal(a.startTime, null);
    assert.equal(a._childAnimations[0].startTime, null);
    assert.equal(a._childAnimations[1].startTime, null);

    tick(3104);
    assert.equal(a.currentTime, 0);
    assert.equal(a._childAnimations[0].currentTime, 0);
    assert.equal(a._childAnimations[1].currentTime, -1000);
    assert.equal(a.startTime, 3104);
    assert.equal(a._childAnimations[0].startTime, 3104);
    assert.equal(a._childAnimations[1].startTime, 3604);

    tick(3604);
    assert.equal(a.currentTime, 1000);
    assert.equal(a._childAnimations[0].currentTime, 1000);
    assert.equal(a._childAnimations[1].currentTime, 0);
    assert.equal(a.startTime, 3104);
    assert.equal(a._childAnimations[0].startTime, 3104);
    assert.equal(a._childAnimations[1].startTime, 3604);
  });

  test('delays on groups work correctly', function() {
    //   444
    //  1
    // 0
    //   33
    //   2
    var groupEffect = new GroupEffect([
      new GroupEffect([
        this.staticEffect(this.target, '4px', {duration: 3, delay: 1}),
        this.staticEffect(this.target, '1px', {duration: 1, delay: 0}),
      ], {delay: 1}),
      new SequenceEffect([
        this.staticEffect(this.target, '0px', {duration: 1, delay: 0}),
        this.staticEffect(this.target, '3px', {duration: 2, delay: 1}),
        this.staticEffect(this.target, '2px', {duration: 1, delay: -2}),
      ]),
    ]);
    var animation = document.timeline.play(groupEffect);
    tick(100);
    checkTimes(animation, [100, 0], [
      [
        [101, -1],
        [101, -1],
      ], [
        [100, 0],
        [101, -1],
        [104, -4],
      ]
    ]);
    assert.equal(getComputedStyle(this.target).marginLeft, '0px');
    tick(101);
    assert.equal(getComputedStyle(this.target).marginLeft, '1px');
    tick(102);
    assert.equal(getComputedStyle(this.target).marginLeft, '2px');
    tick(103);
    assert.equal(getComputedStyle(this.target).marginLeft, '3px');
    tick(104);
    assert.equal(getComputedStyle(this.target).marginLeft, '4px');
    tick(105);
    assert.equal(getComputedStyle(this.target).marginLeft, '0px');
  });

  test('end delays on groups work correctly', function() {
    // 11
    //     4
    // 0
    //   33
    //   2
    var sequenceEffect = new SequenceEffect([
      new SequenceEffect([
        this.staticEffect(this.target, '1px', {duration: 2, endDelay: 2}),
        this.staticEffect(this.target, '4px', {duration: 1, endDelay: 1}),
      ], {endDelay: -6}),
      new SequenceEffect([
        this.staticEffect(this.target, '0px', {duration: 1, endDelay: 1}),
        this.staticEffect(this.target, '3px', {duration: 2, endDelay: -2}),
        this.staticEffect(this.target, '2px', {duration: 1, endDelay: 2}),
      ]),
    ]);
    var animation = document.timeline.play(sequenceEffect);
    tick(100);
    checkTimes(animation, [100, 0], [
      [
        [100, 0],
        [104, -4],
      ], [
        [100, 0],
        [102, -2],
        [102, -2],
      ]
    ]);
    assert.equal(getComputedStyle(this.target).marginLeft, '0px');
    tick(101);
    assert.equal(getComputedStyle(this.target).marginLeft, '1px');
    tick(102);
    assert.equal(getComputedStyle(this.target).marginLeft, '2px');
    tick(103);
    assert.equal(getComputedStyle(this.target).marginLeft, '3px');
    tick(104);
    // FIXME: Group child animation limiting bounds should match the parent animation's limiting bounds.
    // assert.equal(getComputedStyle(this.target).marginLeft, '4px');
    // tick(105);
    // assert.equal(getComputedStyle(this.target).marginLeft, '0px');
  });

  test('basic animation operations are working', function() {
    var animations = [];
    animations.push(document.timeline.play(this.emptySeq));
    animations.push(document.timeline.play(this.seqSimple));
    animations.push(document.timeline.play(this.seqWithSeq));
    animations.push(document.timeline.play(this.seqWithGroup));
    animations.push(document.timeline.play(this.seqWithEmptyGroup));
    animations.push(document.timeline.play(this.seqWithEmptySeq));

    animations.push(document.timeline.play(this.emptyGroup));
    animations.push(document.timeline.play(this.groupSimple));
    animations.push(document.timeline.play(this.groutWithSeq));
    animations.push(document.timeline.play(this.groupWithGroup));
    animations.push(document.timeline.play(this.groupWithEmptyGroup));
    animations.push(document.timeline.play(this.groupWithEmptySeq));

    var length = animations.length;

    tick(50);
    for (var i = 0; i < length; i++)
      animations[i].pause();

    tick(100);
    for (var i = 0; i < length; i++)
      animations[i].play();

    tick(200);
    for (var i = 0; i < length; i++)
      animations[i].currentTime += 1;

    tick(300);
    for (var i = 0; i < length; i++)
      animations[i].startTime += 1;

    tick(350);
    for (var i = 0; i < length; i++)
      animations[i].reverse();

    tick(400);
    for (var i = 0; i < length; i++)
      animations[i].finish();

    tick(500);
    tick(600);
    for (var i = 0; i < length; i++)
      animations[i].cancel();

    for (var i = 0; i < length; i++)
      animations[i].play();
  });

  test('pausing works as expected with an empty SequenceEffect', function() {
    var animation = document.timeline.play(this.emptySeq);
    tick(0);
    assert.equal(animation.startTime, 0);
    assert.equal(animation.currentTime, 0);

    animation.pause();
    assert.equal(animation.startTime, null);
    assert.equal(animation.currentTime, 0);
  });

  test('pausing works as expected with a simple SequenceEffect', function() {
    var animation = document.timeline.play(this.seqSimple);
    var target = this.seqSimple.children[0].target;
    tick(0);
    checkTimes(animation, [0, 0], [[0, 0], [500, -500]], 't = 0');

    tick(200);
    checkTimes(animation, [0, 200], [[0, 200], [500, -300]], 't = 200');

    animation.pause();
    checkTimes(animation, [null, null], [[null, null], [null, null]], 't = 200');
    assert.equal(getComputedStyle(target).marginLeft, '40px');

    tick(300);
    checkTimes(animation, [null, 200], [[null, 200], [null, -300]], 't = 300');
    assert.equal(getComputedStyle(target).marginLeft, '40px');

    animation.play();
    checkTimes(animation, [null, 200], [[null, 200], [null, -300]], 't = 300');
    assert.equal(getComputedStyle(target).marginLeft, '40px');

    tick(301);
    checkTimes(animation, [101, 200], [[101, 200], [601, -300]], 't = 301');
    assert.equal(getComputedStyle(target).marginLeft, '40px');

    tick(401);
    checkTimes(animation, [101, 300], [[101, 300], [601, -200]], 't = 401');
    assert.equal(getComputedStyle(target).marginLeft, '60px');

    tick(700);
    checkTimes(animation, [101, 599], [[101, 500], [601, 99]], 't = 700');
    assert.equal(getComputedStyle(target).marginLeft, '0px');
  });

  test('pausing before tick works as expected with a simple SequenceEffect', function() {
    var animation = document.timeline.play(this.seqSimple);
    var target = this.seqSimple.children[0].target;
    checkTimes(animation, [null, 0], [[null, 0], [null, -500]], 't = 0');

    animation.pause();
    checkTimes(animation, [null, null], [[null, null], [null, null]], 't = 0');
    assert.equal(getComputedStyle(target).marginLeft, '0px');

    tick(10);
    checkTimes(animation, [null, 0], [[null, 0], [null, -500]], 't = 10');
    assert.equal(getComputedStyle(target).marginLeft, '0px');

    tick(20);
    checkTimes(animation, [null, 0], [[null, 0], [null, -500]], 't = 10');
    assert.equal(getComputedStyle(target).marginLeft, '0px');
  });

  test('pausing and seeking before tick works as expected with a simple SequenceEffect', function() {
    var animation = document.timeline.play(this.seqSimple);
    animation.pause();

    animation.currentTime = 0;
    checkTimes(animation, [null, 0], [[null, 0], [null, -500]], 't = 10');

    animation.currentTime = 250;
    checkTimes(animation, [null, 250], [[null, 250], [null, -250]], 't = 10');

    animation.currentTime = 500;
    checkTimes(animation, [null, 500], [[null, 500], [null, 0]], 't = 10');

    // FIXME: Expectation should be [null, 1000], [[null, 500], [null, 500]].
    animation.currentTime = 1000;
    checkTimes(animation, [null, 1000], [[null, 1000], [null, 500]], 't = 10');
  });

  test('pausing works as expected with an SequenceEffect inside an SequenceEffect', function() {
    var animation = document.timeline.play(this.seqWithSeq);
    tick(0);
    checkTimes(
        animation,
        [0, 0], [
          [0, 0],
          [500, -500], [
            [1000, -1000],
            [1500, -1500]]],
        't = 0');

    tick(200);
    checkTimes(
        animation,
        [0, 200], [
          [0, 200],
          [500, -300], [
            [1000, -800],
            [1500, -1300]]],
        't = 200');

    animation.pause();
    checkTimes(
        animation,
        [null, null], [
          [null, null],
          [null, null], [
            [null, null],
            [null, null]]],
        't = 200');

    tick(300);
    checkTimes(
        animation,
        [null, 200], [
          [null, 200],
          [null, -300], [
            [null, -800],
            [null, -1300]]],
        't = 300');

    animation.play();
    tick(310);
    checkTimes(
        animation,
        [110, 200], [
          [110, 200],
          [610, -300], [
            [1110, -800],
            [1610, -1300]]],
        't = 310');

    tick(1300);
    checkTimes(
        animation,
        [110, 1190], [
          [110, 500],
          [610, 500], [
            [1110, 190],
            [1610, -310]]],
        't = 1300');

    animation.pause();
    checkTimes(
        animation,
        [null, null], [
          [null, 500],
          [null, 500], [
            [null, null],
            [null, null]]],
        't = 1300');

    tick(1400);
    checkTimes(
        animation,
        [null, 1190], [
          [null, 500],
          [null, 500], [
            [null, 190],
            [null, -310]]],
        't = 1400');

    animation.play();
    checkTimes(
        animation,
        [null, 1190], [
          [null, 500],
          [null, 500], [
            [null, 190],
            [null, -310]]],
        't = 1400');

    tick(1410);
    checkTimes(
        animation,
        [220, 1190], [
          [220, 500],
          [720, 500], [
            [1220, 190],
            [1720, -310]]],
        't = 1410');

    tick(1600);
    checkTimes(
        animation,
        [220, 1380], [
          [220, 500],
          [720, 500], [
            [1220, 380],
            [1720, -120]]],
        't = 1600');

    animation.pause();
    checkTimes(
        animation,
        [null, null], [
          [null, 500],
          [null, 500], [
            [null, null],
            [null, null]]],
        't = 1600');

    tick(1700);
    checkTimes(
        animation,
        [null, 1380], [
          [null, 500],
          [null, 500], [
            [null, 380],
            [null, -120]]],
        't = 1700');

    animation.play();
    tick(1710);
    checkTimes(
        animation,
        [330, 1380], [
          [330, 500],
          [830, 500], [
            [1330, 380],
            [1830, -120]]],
        't = 1710');

    tick(2400);
    checkTimes(
        animation,
        [330, 2000], [
          [330, 500],
          [830, 500], [
            [1330, 500],
            [1830, 500]]],
        't = 2400');
  });

  test('pausing works as expected with a GroupEffect inside an SequenceEffect', function() {
    var animation = document.timeline.play(this.seqWithGroup);
    tick(0);
    checkTimes(
        animation,
        [0, 0], [
          [0, 0],
          [500, -500], [
            [1000, -1000],
            [1000, -1000]]],
        't = 0');

    tick(200);
    checkTimes(
        animation,
        [0, 200], [
          [0, 200],
          [500, -300], [
            [1000, -800],
            [1000, -800]]],
        't = 200');

    animation.pause();
    checkTimes(
        animation,
        [null, null], [
          [null, null],
          [null, null], [
            [null, null],
            [null, null]]],
        't = 200');

    tick(300);
    checkTimes(
        animation,
        [null, 200], [
          [null, 200],
          [null, -300], [
            [null, -800],
            [null, -800]]],
        't = 300');

    animation.play();
    tick(310);
    checkTimes(
        animation,
        [110, 200], [
          [110, 200],
          [610, -300], [
            [1110, -800],
            [1110, -800]]],
        't = 310');

    tick(1310);
    checkTimes(
        animation,
        [110, 1200], [
          [110, 500],
          [610, 500], [
            [1110, 200],
            [1110, 200]]],
        't = 1310');

    animation.pause();
    checkTimes(
        animation,
        [null, null], [
          [null, 500],
          [null, 500], [
            [null, null],
            [null, null]]],
        't = 1310');

    tick(1400);
    checkTimes(
        animation,
        [null, 1200], [
          [null, 500],
          [null, 500], [
            [null, 200],
            [null, 200]]],
        't = 1410');

    animation.play();
    tick(1410);
    checkTimes(
        animation,
        [210, 1200], [
          [210, 500],
          [710, 500], [
            [1210, 200],
            [1210, 200]]],
        't = 1410');

    tick(1610);
    checkTimes(
        animation,
        [210, 1400], [
          [210, 500],
          [710, 500], [
            [1210, 400],
            [1210, 400]]],
        't = 1610');

    animation.pause();
    tick(1810);
    checkTimes(
        animation,
        [null, 1400], [
          [null, 500],
          [null, 500], [
            [null, 400],
            [null, 400]]],
        't = 1810');

    animation.play();
    tick(1820);
    checkTimes(
        animation,
        [420, 1400], [
          [420, 500],
          [920, 500], [
            [1420, 400],
            [1420, 400]]],
        't = 1820');

    tick(2020);
    checkTimes(
        animation,
        [420, 1500], [
          [420, 500],
          [920, 500], [
            [1420, 500],
            [1420, 500]]],
        't = 2020');

    animation.pause();
    checkTimes(
        animation,
        [null, 1500], [
          [null, 500],
          [null, 500], [
            [null, 500],
            [null, 500]]],
        't = 2020');
  });

  test('pausing works as expected with an empty SequenceEffect inside an SequenceEffect', function() {
    var animation = document.timeline.play(this.seqWithEmptySeq);
    tick(0);
    checkTimes(
        animation,
        [0, 0], [0, 0],
        't = 0');

    animation.pause();
    checkTimes(
        animation,
        [null, 0], [null, 0],
        't = 0 after pause');
  });

  test('pausing works as expected with an empty GroupEffect inside an SequenceEffect', function() {
    var animation = document.timeline.play(this.seqWithEmptyGroup);
    tick(0);
    checkTimes(
        animation,
        [0, 0], [0, 0],
        't = 0');

    animation.pause();
    checkTimes(
        animation,
        [null, 0], [null, 0],
        't = 0 after pause');
  });

  test('playState works for groups', function() {
    var target = document.createElement('div');
    document.body.appendChild(target);
    var sequenceEffect = new SequenceEffect([new KeyframeEffect(target, [], 100), new KeyframeEffect(target, [], 100)]);
    var a = document.timeline.play(sequenceEffect);
    assert.equal(a.playState, 'pending');
    tick(1);
    assert.equal(a.playState, 'running');
    assert.equal(a._childAnimations[0]._animation.playState, 'running');
    assert.equal(a._childAnimations[1]._animation.playState, 'running');
    tick(101);
    assert.equal(a.playState, 'running');
    assert.equal(a._childAnimations[0]._animation.playState, 'finished');
    assert.equal(a._childAnimations[1]._animation.playState, 'running');
    a.pause();
    assert.equal(a.playState, 'pending');
    assert.equal(a._childAnimations[0]._animation.playState, 'paused');
    assert.equal(a._childAnimations[1]._animation.playState, 'pending');
    tick(102);
    assert.equal(a.playState, 'paused');
    assert.equal(a._childAnimations[0]._animation.playState, 'paused');
    assert.equal(a._childAnimations[1]._animation.playState, 'paused');
    a.play();
    assert.equal(a.playState, 'pending');
    assert.equal(a._childAnimations[0]._animation.playState, 'pending');
    assert.equal(a._childAnimations[1]._animation.playState, 'pending');
    tick(103);
    assert.equal(a.playState, 'running');
    assert.equal(a._childAnimations[0]._animation.playState, 'finished');
    assert.equal(a._childAnimations[1]._animation.playState, 'running');
    tick(204);
    assert.equal(a.playState, 'finished');
    assert.equal(a._childAnimations[0]._animation.playState, 'finished');
    assert.equal(a._childAnimations[1]._animation.playState, 'finished');
  });

  test('pausing then seeking out of range then seeking into range works', function() {
    var target = document.createElement('div');
    var keyframeEffect = new KeyframeEffect(target, [], {duration: 2000, fill: 'both'});
    var groupEffect = new GroupEffect([keyframeEffect], {fill: 'none'});
    var animation = document.timeline.play(groupEffect);

    animation.pause();
    animation.currentTime = 3000;
    assert.equal(animation._childAnimations.length, 0);
    tick(100);
    animation.currentTime = 1000;
    assert.equal(animation._childAnimations.length, 1);
    assert.equal(animation._childAnimations[0]._animation.playState, 'paused');
    assert.equal(animation._childAnimations[0]._animation.currentTime, 1000);

  });

  test('reversing then seeking out of range then seeking into range works', function() {
    var target = document.createElement('div');
    var keyframeEffect = new KeyframeEffect(target, [], {duration: 2000, fill: 'both'});
    var groupEffect = new GroupEffect([keyframeEffect], {fill: 'none'});
    var animation = document.timeline.play(groupEffect);

    animation.currentTime = 1000;
    tick(100);
    animation.reverse();
    tick(105);
    animation.currentTime = 3000;
    assert.equal(animation._childAnimations.length, 0);
    tick(110);
    animation.currentTime = 1000;
    assert.equal(animation.playbackRate, -1);
    assert.equal(animation._childAnimations.length, 1);
    assert.equal(animation._childAnimations[0]._animation.playState, 'running');
    assert.equal(animation._childAnimations[0]._animation.currentTime, 1000);
    assert.equal(animation._childAnimations[0]._animation.playbackRate, -1);

  });

  test('fill none groups with fill none children do not fill', function() {
    var keyframeEffect = new KeyframeEffect(
        this.target,
        [{marginLeft: '0px'}, {marginLeft: '100px'}],
        {duration: 500, fill: 'none'});
    var groupEffect = new GroupEffect([keyframeEffect], {fill: 'none'});
    var animation = document.timeline.play(groupEffect);

    tick(0);
    assert.equal(getComputedStyle(this.target).marginLeft, '0px');
    tick(250);
    assert.equal(getComputedStyle(this.target).marginLeft, '50px');
    tick(501);
    assert.equal(getComputedStyle(this.target).marginLeft, '0px');
    tick(502);
  });
});
