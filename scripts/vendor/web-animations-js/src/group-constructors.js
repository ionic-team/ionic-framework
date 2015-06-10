// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
// limitations under the License.

(function(shared, scope, testing) {

  function groupChildDuration(node) {
    return node._timing.delay + node.activeDuration + node._timing.endDelay;
  }

  function constructor(children, timingInput) {
    this.children = children || [];
    this._timing = shared.normalizeTimingInput(timingInput, true);
    this.timing = shared.makeTiming(timingInput, true);

    if (this._timing.duration === 'auto')
      this._timing.duration = this.activeDuration;
  }

  window.SequenceEffect = function() {
    constructor.apply(this, arguments);
  };

  window.GroupEffect = function() {
    constructor.apply(this, arguments);
  };

  window.SequenceEffect.prototype = {
    get activeDuration() {
      var total = 0;
      this.children.forEach(function(child) {
        total += groupChildDuration(child);
      });
      return Math.max(total, 0);
    }
  };

  window.GroupEffect.prototype = {
    get activeDuration() {
      var max = 0;
      this.children.forEach(function(child) {
        max = Math.max(max, groupChildDuration(child));
      });
      return max;
    }
  };

  scope.newUnderlyingAnimationForGroup = function(group) {
    var underlyingAnimation;
    var timing = null;
    var ticker = function(tf) {
      var animation = underlyingAnimation._wrapper;
      if (animation.playState == 'pending')
        return;

      if (!animation.effect)
        return;

      if (tf == null) {
        animation._removeChildren();
        return;
      }

      // If the group has a negative playback rate and is not fill backwards/both, then it should go
      // out of effect when it reaches the start of its active interval (tf == 0). If it is fill
      // backwards/both then it should stay in effect. calculateTimeFraction will return 0 in the
      // backwards-filling case, and null otherwise.
      if (tf == 0 && animation.playbackRate < 0) {
        if (!timing) {
          timing = shared.normalizeTimingInput(animation.effect.timing);
        }
        tf = shared.calculateTimeFraction(shared.calculateActiveDuration(timing), -1, timing);
        if (isNaN(tf) || tf == null) {
          animation._forEachChild(function(child) {
            child.currentTime = -1;
          });
          animation._removeChildren();
          return;
        }
      }
    };

    underlyingAnimation = scope.timeline.play(new scope.KeyframeEffect(null, ticker, group._timing));
    return underlyingAnimation;
  };

  scope.bindAnimationForGroup = function(animation) {
    animation._animation._wrapper = animation;
    animation._isGroup = true;
    scope.awaitStartTime(animation);
    animation._constructChildren();
    animation._setExternalAnimation(animation);
  };

  scope.groupChildDuration = groupChildDuration;

  // Alias GroupEffect & SequenceEffect to AnimationGroup & AnimationSequence respectively, to
  // support old constructors (Animation*) for a deprecation period. Should be removed after 23 June
  // 2015.
  window.AnimationSequence = function() {
    shared.deprecated('window.AnimationSequence', '2015-03-23', 'Use window.SequenceEffect instead.');
    window.SequenceEffect.apply(this, arguments);
  };
  window.AnimationSequence.prototype = Object.create(window.SequenceEffect.prototype);
  window.AnimationSequence.prototype.constructor = window.AnimationSequence;

  window.AnimationGroup = function() {
    shared.deprecated('window.AnimationGroup', '2015-03-23', 'Use window.GroupEffect instead.');
    window.GroupEffect.apply(this, arguments);
  };
  window.AnimationGroup.prototype = Object.create(window.GroupEffect.prototype);
  window.AnimationGroup.prototype.constructor = window.AnimationGroup;

})(webAnimationsShared, webAnimationsNext, webAnimationsTesting);
