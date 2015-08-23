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

(function(shared, testing) {

  var fills = 'backwards|forwards|both|none'.split('|');
  var directions = 'reverse|alternate|alternate-reverse'.split('|');

  function cloneTimingInput(timingInput) {
    if (typeof timingInput == 'number') {
      return timingInput;
    }
    var clone = {};
    for (var m in timingInput) {
      clone[m] = timingInput[m];
    }
    return clone;
  }

  function AnimationEffectTiming() {
    this._delay = 0;
    this._endDelay = 0;
    this._fill = 'none';
    this._iterationStart = 0;
    this._iterations = 1;
    this._duration = 0;
    this._playbackRate = 1;
    this._direction = 'normal';
    this._easing = 'linear';
  }

  AnimationEffectTiming.prototype = {
    _setMember: function(member, value) {
      this['_' + member] = value;
      if (this._effect) {
        this._effect._timingInput[member] = value;
        this._effect._timing = shared.normalizeTimingInput(shared.normalizeTimingInput(this._effect._timingInput));
        this._effect.activeDuration = shared.calculateActiveDuration(this._effect._timing);
        if (this._effect._animation) {
          this._effect._animation._rebuildUnderlyingAnimation();
        }
      }
    },
    get playbackRate() {
      return this._playbackRate;
    },
    set delay(value) {
      this._setMember('delay', value);
    },
    get delay() {
      return this._delay;
    },
    set endDelay(value) {
      this._setMember('endDelay', value);
    },
    get endDelay() {
      return this._endDelay;
    },
    set fill(value) {
      this._setMember('fill', value);
    },
    get fill() {
      return this._fill;
    },
    set iterationStart(value) {
      this._setMember('iterationStart', value);
    },
    get iterationStart() {
      return this._iterationStart;
    },
    set duration(value) {
      this._setMember('duration', value);
    },
    get duration() {
      return this._duration;
    },
    set direction(value) {
      this._setMember('direction', value);
    },
    get direction() {
      return this._direction;
    },
    set easing(value) {
      this._setMember('easing', value);
    },
    get easing() {
      return this._easing;
    },
    set iterations(value) {
      this._setMember('iterations', value);
    },
    get iterations() {
      return this._iterations;
    }
  };

  function makeTiming(timingInput, forGroup, effect) {
    var timing = new AnimationEffectTiming();
    if (forGroup) {
      timing.fill = 'both';
      timing.duration = 'auto';
    }
    if (typeof timingInput == 'number' && !isNaN(timingInput)) {
      timing.duration = timingInput;
    } else if (timingInput !== undefined) {
      Object.getOwnPropertyNames(timingInput).forEach(function(property) {
        if (timingInput[property] != 'auto') {
          if (typeof timing[property] == 'number' || property == 'duration') {
            if (typeof timingInput[property] != 'number' || isNaN(timingInput[property])) {
              return;
            }
          }
          if ((property == 'fill') && (fills.indexOf(timingInput[property]) == -1)) {
            return;
          }
          if ((property == 'direction') && (directions.indexOf(timingInput[property]) == -1)) {
            return;
          }
          if (property == 'playbackRate' && timingInput[property] !== 1 && shared.isDeprecated('AnimationEffectTiming.playbackRate', '2014-11-28', 'Use Animation.playbackRate instead.')) {
            return;
          }
          timing[property] = timingInput[property];
        }
      });
    }
    return timing;
  }

  function numericTimingToObject(timingInput) {
    if (typeof timingInput == 'number') {
      if (isNaN(timingInput)) {
        timingInput = { duration: 0 };
      } else {
        timingInput = { duration: timingInput };
      }
    }
    return timingInput;
  }

  function normalizeTimingInput(timingInput, forGroup) {
    timingInput = shared.numericTimingToObject(timingInput);
    var timing = makeTiming(timingInput, forGroup);
    timing._easing = toTimingFunction(timing.easing);
    return timing;
  }

  function cubic(a, b, c, d) {
    if (a < 0 || a > 1 || c < 0 || c > 1) {
      return linear;
    }
    return function(x) {
      if (x == 0 || x == 1) {
        return x;
      }
      var start = 0, end = 1;
      while (1) {
        var mid = (start + end) / 2;
        function f(a, b, m) { return 3 * a * (1 - m) * (1 - m) * m + 3 * b * (1 - m) * m * m + m * m * m};
        var xEst = f(a, c, mid);
        if (Math.abs(x - xEst) < 0.001) {
          return f(b, d, mid);
        }
        if (xEst < x) {
          start = mid;
        } else {
          end = mid;
        }
      }
    }
  }

  var Start = 1;
  var Middle = 0.5;
  var End = 0;

  function step(count, pos) {
    return function(x) {
      if (x >= 1) {
        return 1;
      }
      var stepSize = 1 / count;
      x += pos * stepSize;
      return x - x % stepSize;
    }
  }

  var presets = {
    'ease': cubic(0.25, 0.1, 0.25, 1),
    'ease-in': cubic(0.42, 0, 1, 1),
    'ease-out': cubic(0, 0, 0.58, 1),
    'ease-in-out': cubic(0.42, 0, 0.58, 1),
    'step-start': step(1, Start),
    'step-middle': step(1, Middle),
    'step-end': step(1, End)
  };

  var numberString = '\\s*(-?\\d+\\.?\\d*|-?\\.\\d+)\\s*';
  var cubicBezierRe = new RegExp('cubic-bezier\\(' + numberString + ',' + numberString + ',' + numberString + ',' + numberString + '\\)');
  var stepRe = /steps\(\s*(\d+)\s*,\s*(start|middle|end)\s*\)/;
  var linear = function(x) { return x; };

  function toTimingFunction(easing) {
    var cubicData = cubicBezierRe.exec(easing);
    if (cubicData) {
      return cubic.apply(this, cubicData.slice(1).map(Number));
    }
    var stepData = stepRe.exec(easing);
    if (stepData) {
      return step(Number(stepData[1]), {'start': Start, 'middle': Middle, 'end': End}[stepData[2]]);
    }
    var preset = presets[easing];
    if (preset) {
      return preset;
    }
    return linear;
  };

  function calculateActiveDuration(timing) {
    return Math.abs(repeatedDuration(timing) / timing.playbackRate);
  }

  function repeatedDuration(timing) {
    return timing.duration * timing.iterations;
  }

  var PhaseNone = 0;
  var PhaseBefore = 1;
  var PhaseAfter = 2;
  var PhaseActive = 3;

  function calculatePhase(activeDuration, localTime, timing) {
    if (localTime == null) {
      return PhaseNone;
    }
    if (localTime < timing.delay) {
      return PhaseBefore;
    }
    if (localTime >= timing.delay + activeDuration) {
      return PhaseAfter;
    }
    return PhaseActive;
  }

  function calculateActiveTime(activeDuration, fillMode, localTime, phase, delay) {
    switch (phase) {
      case PhaseBefore:
        if (fillMode == 'backwards' || fillMode == 'both')
          return 0;
        return null;
      case PhaseActive:
        return localTime - delay;
      case PhaseAfter:
        if (fillMode == 'forwards' || fillMode == 'both')
          return activeDuration;
        return null;
      case PhaseNone:
        return null;
    }
  }

  function calculateScaledActiveTime(activeDuration, activeTime, startOffset, timing) {
    return (timing.playbackRate < 0 ? activeTime - activeDuration : activeTime) * timing.playbackRate + startOffset;
  }

  function calculateIterationTime(iterationDuration, repeatedDuration, scaledActiveTime, startOffset, timing) {
    if (scaledActiveTime === Infinity || scaledActiveTime === -Infinity || (scaledActiveTime - startOffset == repeatedDuration && timing.iterations && ((timing.iterations + timing.iterationStart) % 1 == 0))) {
      return iterationDuration;
    }

    return scaledActiveTime % iterationDuration;
  }

  function calculateCurrentIteration(iterationDuration, iterationTime, scaledActiveTime, timing) {
    if (scaledActiveTime === 0) {
      return 0;
    }
    if (iterationTime == iterationDuration) {
      return timing.iterationStart + timing.iterations - 1;
    }
    return Math.floor(scaledActiveTime / iterationDuration);
  }

  function calculateTransformedTime(currentIteration, iterationDuration, iterationTime, timing) {
    var currentIterationIsOdd = currentIteration % 2 >= 1;
    var currentDirectionIsForwards = timing.direction == 'normal' || timing.direction == (currentIterationIsOdd ? 'alternate-reverse' : 'alternate');
    var directedTime = currentDirectionIsForwards ? iterationTime : iterationDuration - iterationTime;
    var timeFraction = directedTime / iterationDuration;
    return iterationDuration * timing.easing(timeFraction);
  }

  function calculateTimeFraction(activeDuration, localTime, timing) {
    var phase = calculatePhase(activeDuration, localTime, timing);
    var activeTime = calculateActiveTime(activeDuration, timing.fill, localTime, phase, timing.delay);
    if (activeTime === null)
      return null;
    if (activeDuration === 0)
      return phase === PhaseBefore ? 0 : 1;
    var startOffset = timing.iterationStart * timing.duration;
    var scaledActiveTime = calculateScaledActiveTime(activeDuration, activeTime, startOffset, timing);
    var iterationTime = calculateIterationTime(timing.duration, repeatedDuration(timing), scaledActiveTime, startOffset, timing);
    var currentIteration = calculateCurrentIteration(timing.duration, iterationTime, scaledActiveTime, timing);
    return calculateTransformedTime(currentIteration, timing.duration, iterationTime, timing) / timing.duration;
  }

  shared.cloneTimingInput = cloneTimingInput;
  shared.makeTiming = makeTiming;
  shared.numericTimingToObject = numericTimingToObject;
  shared.normalizeTimingInput = normalizeTimingInput;
  shared.calculateActiveDuration = calculateActiveDuration;
  shared.calculateTimeFraction = calculateTimeFraction;
  shared.calculatePhase = calculatePhase;
  shared.toTimingFunction = toTimingFunction;

  if (WEB_ANIMATIONS_TESTING) {
    testing.normalizeTimingInput = normalizeTimingInput;
    testing.toTimingFunction = toTimingFunction;
    testing.calculateActiveDuration = calculateActiveDuration;
    testing.calculatePhase = calculatePhase;
    testing.PhaseNone = PhaseNone;
    testing.PhaseBefore = PhaseBefore;
    testing.PhaseActive = PhaseActive;
    testing.PhaseAfter = PhaseAfter;
    testing.calculateActiveTime = calculateActiveTime;
    testing.calculateScaledActiveTime = calculateScaledActiveTime;
    testing.calculateIterationTime = calculateIterationTime;
    testing.calculateCurrentIteration = calculateCurrentIteration;
    testing.calculateTransformedTime = calculateTransformedTime;
  }

})(webAnimationsShared, webAnimationsTesting);
