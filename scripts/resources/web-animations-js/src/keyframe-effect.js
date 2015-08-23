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

  function EffectTime(timing) {
    var timeFraction = 0;
    var activeDuration = shared.calculateActiveDuration(timing);
    var effectTime = function(localTime) {
      return shared.calculateTimeFraction(activeDuration, localTime, timing);
    };
    effectTime._totalDuration = timing.delay + activeDuration + timing.endDelay;
    effectTime._isCurrent = function(localTime) {
      var phase = shared.calculatePhase(activeDuration, localTime, timing);
      return phase === PhaseActive || phase === PhaseBefore;
    };
    return effectTime;
  }

  scope.KeyframeEffect = function(target, effectInput, timingInput) {
    var effectTime = EffectTime(shared.normalizeTimingInput(timingInput));
    var interpolations = scope.convertEffectInput(effectInput);
    var timeFraction;
    var keyframeEffect = function() {
      WEB_ANIMATIONS_TESTING && console.assert(typeof timeFraction !== 'undefined');
      interpolations(target, timeFraction);
    };
    // Returns whether the keyframeEffect is in effect or not after the timing update.
    keyframeEffect._update = function(localTime) {
      timeFraction = effectTime(localTime);
      return timeFraction !== null;
    };
    keyframeEffect._clear = function() {
      interpolations(target, null);
    };
    keyframeEffect._hasSameTarget = function(otherTarget) {
      return target === otherTarget;
    };
    keyframeEffect._isCurrent = effectTime._isCurrent;
    keyframeEffect._totalDuration = effectTime._totalDuration;
    return keyframeEffect;
  };

  scope.NullEffect = function(clear) {
    var nullEffect = function() {
      if (clear) {
        clear();
        clear = null;
      }
    };
    nullEffect._update = function() {
      return null;
    };
    nullEffect._totalDuration = 0;
    nullEffect._isCurrent = function() {
      return false;
    };
    nullEffect._hasSameTarget = function() {
      return false;
    };
    return nullEffect;
  };

  if (WEB_ANIMATIONS_TESTING) {
    testing.webAnimations1KeyframeEffect = scope.KeyframeEffect;
    testing.effectTime = EffectTime;
  }

})(webAnimationsShared, webAnimations1, webAnimationsTesting);
