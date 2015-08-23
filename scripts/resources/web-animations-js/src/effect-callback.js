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

  var nullTarget = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');

  var sequenceNumber = 0;
  scope.bindAnimationForCustomEffect = function(animation) {
    var target = animation.effect.target;
    var effectFunction;
    var isKeyframeEffect = typeof animation.effect.getFrames() == 'function';
    if (isKeyframeEffect) {
      effectFunction = animation.effect.getFrames();
    } else {
      effectFunction = animation.effect._onsample;
    }
    var timing = animation.effect.timing;
    var last = null;
    timing = shared.normalizeTimingInput(timing);
    var callback = function() {
      var t = callback._animation ? callback._animation.currentTime : null;
      if (t !== null) {
        t = shared.calculateTimeFraction(shared.calculateActiveDuration(timing), t, timing);
        if (isNaN(t))
          t = null;
      }
      // FIXME: There are actually more conditions under which the effectFunction
      // should be called.
      if (t !== last) {
        if (isKeyframeEffect) {
          effectFunction(t, target, animation.effect);
        } else {
          effectFunction(t, animation.effect, animation.effect._animation);
        }
      }
      last = t;
    };

    callback._animation = animation;
    callback._registered = false;
    callback._sequenceNumber = sequenceNumber++;
    animation._callback = callback;
    register(callback);
  };

  var callbacks = [];
  var ticking = false;
  function register(callback) {
    if (callback._registered)
      return;
    callback._registered = true;
    callbacks.push(callback);
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(tick);
    }
  }

  function tick(t) {
    var updating = callbacks;
    callbacks = [];
    updating.sort(function(left, right) {
      return left._sequenceNumber - right._sequenceNumber;
    });
    updating = updating.filter(function(callback) {
      callback();
      var playState = callback._animation ? callback._animation.playState : 'idle';
      if (playState != 'running' && playState != 'pending')
        callback._registered = false;
      return callback._registered;
    });
    callbacks.push.apply(callbacks, updating);

    if (callbacks.length) {
      ticking = true;
      requestAnimationFrame(tick);
    } else {
      ticking = false;
    }
  }

  scope.Animation.prototype._register = function() {
    if (this._callback)
      register(this._callback);
  };

})(webAnimationsShared, webAnimationsNext, webAnimationsTesting);
