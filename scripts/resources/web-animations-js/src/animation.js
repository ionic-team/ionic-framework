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

  shared.sequenceNumber = 0;

  var AnimationEvent = function(target, currentTime, timelineTime) {
    this.target = target;
    this.currentTime = currentTime;
    this.timelineTime = timelineTime;

    this.type = 'finish';
    this.bubbles = false;
    this.cancelable = false;
    this.currentTarget = target;
    this.defaultPrevented = false;
    this.eventPhase = Event.AT_TARGET;
    this.timeStamp = Date.now();
  };

  scope.Animation = function(effect) {
    this._sequenceNumber = shared.sequenceNumber++;
    this._currentTime = 0;
    this._startTime = null;
    this._paused = false;
    this._playbackRate = 1;
    this._inTimeline = true;
    this._finishedFlag = false;
    this.onfinish = null;
    this._finishHandlers = [];
    this._effect = effect;
    this._inEffect = this._effect._update(0);
    this._idle = true;
    this._currentTimePending = false;
  };

  scope.Animation.prototype = {
    _ensureAlive: function() {
      // If an animation is playing backwards and is not fill backwards/both
      // then it should go out of effect when it reaches the start of its
      // active interval (currentTime == 0).
      if (this.playbackRate < 0 && this.currentTime === 0) {
        this._inEffect = this._effect._update(-1);
      } else {
        this._inEffect = this._effect._update(this.currentTime);
      }
      if (!this._inTimeline && (this._inEffect || !this._finishedFlag)) {
        this._inTimeline = true;
        scope.timeline._animations.push(this);
      }
    },
    _tickCurrentTime: function(newTime, ignoreLimit) {
      if (newTime != this._currentTime) {
        this._currentTime = newTime;
        if (this._isFinished && !ignoreLimit)
          this._currentTime = this._playbackRate > 0 ? this._totalDuration : 0;
        this._ensureAlive();
      }
    },
    get currentTime() {
      if (this._idle || this._currentTimePending)
        return null;
      return this._currentTime;
    },
    set currentTime(newTime) {
      newTime = +newTime;
      if (isNaN(newTime))
        return;
      scope.restart();
      if (!this._paused && this._startTime != null) {
        this._startTime = this._timeline.currentTime - newTime / this._playbackRate;
      }
      this._currentTimePending = false;
      if (this._currentTime == newTime)
        return;
      this._tickCurrentTime(newTime, true);
      scope.invalidateEffects();
    },
    get startTime() {
      return this._startTime;
    },
    set startTime(newTime) {
      newTime = +newTime;
      if (isNaN(newTime))
        return;
      if (this._paused || this._idle)
        return;
      this._startTime = newTime;
      this._tickCurrentTime((this._timeline.currentTime - this._startTime) * this.playbackRate);
      scope.invalidateEffects();
    },
    get playbackRate() {
      return this._playbackRate;
    },
    set playbackRate(value) {
      if (value == this._playbackRate) {
        return;
      }
      var oldCurrentTime = this.currentTime;
      this._playbackRate = value;
      this._startTime = null;
      if (this.playState != 'paused' && this.playState != 'idle') {
        this.play();
      }
      if (oldCurrentTime != null) {
        this.currentTime = oldCurrentTime;
      }
    },
    get _isFinished() {
      return !this._idle && (this._playbackRate > 0 && this._currentTime >= this._totalDuration ||
          this._playbackRate < 0 && this._currentTime <= 0);
    },
    get _totalDuration() { return this._effect._totalDuration; },
    get playState() {
      if (this._idle)
        return 'idle';
      if ((this._startTime == null && !this._paused && this.playbackRate != 0) || this._currentTimePending)
        return 'pending';
      if (this._paused)
        return 'paused';
      if (this._isFinished)
        return 'finished';
      return 'running';
    },
    play: function() {
      this._paused = false;
      if (this._isFinished || this._idle) {
        this._currentTime = this._playbackRate > 0 ? 0 : this._totalDuration;
        this._startTime = null;
        scope.invalidateEffects();
      }
      this._finishedFlag = false;
      scope.restart();
      this._idle = false;
      this._ensureAlive();
    },
    pause: function() {
      if (!this._isFinished && !this._paused && !this._idle) {
        this._currentTimePending = true;
      }
      this._startTime = null;
      this._paused = true;
    },
    finish: function() {
      if (this._idle)
        return;
      this.currentTime = this._playbackRate > 0 ? this._totalDuration : 0;
      this._startTime = this._totalDuration - this.currentTime;
      this._currentTimePending = false;
    },
    cancel: function() {
      if (!this._inEffect)
        return;
      this._inEffect = false;
      this._idle = true;
      this.currentTime = 0;
      this._startTime = null;
      this._effect._update(null);
      // effects are invalid after cancellation as the animation state
      // needs to un-apply.
      scope.invalidateEffects();
      // in the absence of effect revalidation via getComputedStyle, we
      // need a single tick to remove the effect of the cancelled
      // animation.
      scope.restart();
    },
    reverse: function() {
      this.playbackRate *= -1;
      this.play();
    },
    addEventListener: function(type, handler) {
      if (typeof handler == 'function' && type == 'finish')
        this._finishHandlers.push(handler);
    },
    removeEventListener: function(type, handler) {
      if (type != 'finish')
        return;
      var index = this._finishHandlers.indexOf(handler);
      if (index >= 0)
        this._finishHandlers.splice(index, 1);
    },
    _fireEvents: function(baseTime) {
      var finished = this._isFinished;
      if ((finished || this._idle) && !this._finishedFlag) {
        var event = new AnimationEvent(this, this._currentTime, baseTime);
        var handlers = this._finishHandlers.concat(this.onfinish ? [this.onfinish] : []);

        // IONIC HACK!
        // CANNOT SETTIMEOUT OR ELSE THE BROWSER HAS A CHANCE TO
        // RENDER AND CAUSES A FLICKER ON SAFAR
        //setTimeout(function() {
          handlers.forEach(function(handler) {
            handler.call(event.target, event);
          });
        //}, 0);
      }
      this._finishedFlag = finished;
    },
    _tick: function(timelineTime) {
      if (!this._idle && !this._paused) {
        if (this._startTime == null)
          this.startTime = timelineTime - this._currentTime / this.playbackRate;
        else if (!this._isFinished)
          this._tickCurrentTime((timelineTime - this._startTime) * this.playbackRate);
      }

      this._currentTimePending = false;
      this._fireEvents(timelineTime);
      return !this._idle && (this._inEffect || !this._finishedFlag);
    },
  };

  if (WEB_ANIMATIONS_TESTING) {
    testing.webAnimations1Animation = scope.Animation;
  }

})(webAnimationsShared, webAnimations1, webAnimationsTesting);
