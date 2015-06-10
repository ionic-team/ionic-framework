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
  scope.Animation = function(effect) {
    this.effect = effect;
    if (effect) {
      // FIXME: detach existing animation.
      effect.animation = this;
    }
    this._isGroup = false;
    this._animation = null;
    this._childAnimations = [];
    this._callback = null;
    this._rebuildUnderlyingAnimation();
    // Animations are constructed in the idle state.
    this._animation.cancel();
  };

  // TODO: add an effect getter/setter
  scope.Animation.prototype = {
    _rebuildUnderlyingAnimation: function() {
      if (this._animation) {
        this._animation.cancel();
        this._animation = null;
      }

      if (!this.effect || this.effect instanceof window.KeyframeEffect) {
        this._animation = scope.newUnderlyingAnimationForKeyframeEffect(this.effect);
        scope.bindAnimationForKeyframeEffect(this);
      }
      if (this.effect instanceof window.SequenceEffect || this.effect instanceof window.GroupEffect) {
        this._animation = scope.newUnderlyingAnimationForGroup(this.effect);
        scope.bindAnimationForGroup(this);
      }

      // FIXME: move existing currentTime/startTime/playState to new animation
    },
    _updateChildren: function() {
      if (!this.effect || this.playState == 'idle')
        return;

      var offset = this.effect._timing.delay;
      this._childAnimations.forEach(function(childAnimation) {
        this._arrangeChildren(childAnimation, offset);
        if (this.effect instanceof window.SequenceEffect)
          offset += scope.groupChildDuration(childAnimation.effect);
      }.bind(this));
    },
    _setExternalAnimation: function(animation) {
      if (!this.effect || !this._isGroup)
        return;
      for (var i = 0; i < this.effect.children.length; i++) {
        this.effect.children[i].animation = animation;
        this._childAnimations[i]._setExternalAnimation(animation);
      }
    },
    _constructChildren: function() {
      if (!this.effect || !this._isGroup)
        return;
      var offset = this.effect._timing.delay;
      this.effect.children.forEach(function(child) {
        var childAnimation = window.document.timeline.play(child);
        this._childAnimations.push(childAnimation);
        childAnimation.playbackRate = this.playbackRate;
        if (this.paused)
          childAnimation.pause();
        child.animation = this.effect.animation;

        this._arrangeChildren(childAnimation, offset);

        if (this.effect instanceof window.SequenceEffect)
          offset += scope.groupChildDuration(child);
      }.bind(this));
    },
    _arrangeChildren: function(childAnimation, offset) {
      if (this.startTime === null) {
        childAnimation.currentTime = this.currentTime - offset / this.playbackRate;
        childAnimation._startTime = null;
      } else if (childAnimation.startTime !== this.startTime + offset / this.playbackRate) {
        childAnimation.startTime = this.startTime + offset / this.playbackRate;
      }
    },
    get paused() {
      return this._animation.paused;
    },
    get playState() {
      return this._animation.playState;
    },
    get onfinish() {
      return this._onfinish;
    },
    set onfinish(v) {
      if (typeof v == 'function') {
        this._onfinish = v;
        this._animation.onfinish = (function(e) {
          e.target = this;
          v.call(this, e);
        }).bind(this);
      } else {
        this._animation.onfinish = v;
        this.onfinish = this._animation.onfinish;
      }
    },
    get currentTime() {
      return this._animation.currentTime;
    },
    set currentTime(v) {
      this._animation.currentTime = v;
      this._register();
      this._forEachChild(function(child, offset) {
        child.currentTime = v - offset;
      });
    },
    get startTime() {
      return this._animation.startTime;
    },
    set startTime(v) {
      this._animation.startTime = v;
      this._register();
      this._forEachChild(function(child, offset) {
        child.startTime = v + offset;
      });
    },
    get playbackRate() {
      return this._animation.playbackRate;
    },
    set playbackRate(value) {
      var oldCurrentTime = this.currentTime;
      this._animation.playbackRate = value;
      this._forEachChild(function(childAnimation) {
        childAnimation.playbackRate = value;
      });
      if (this.playState != 'paused' && this.playState != 'idle') {
        this.play();
      }
      if (oldCurrentTime !== null) {
        this.currentTime = oldCurrentTime;
      }
    },
    get finished() {
      return this._animation.finished;
    },
    get source() {
      shared.deprecated('Animation.source', '2015-03-23', 'Use Animation.effect instead.');
      return this.effect;
    },
    play: function() {
      this._animation.play();
      this._register();
      scope.awaitStartTime(this);
      this._forEachChild(function(child) {
        var time = child.currentTime;
        child.play();
        child.currentTime = time;
      });
    },
    pause: function() {
      this._animation.pause();
      this._register();
      this._forEachChild(function(child) {
        child.pause();
      });
    },
    finish: function() {
      this._animation.finish();
      this._register();
      // TODO: child animations??
    },
    cancel: function() {
      this._animation.cancel();
      this._register();
      this._removeChildren();
    },
    reverse: function() {
      var oldCurrentTime = this.currentTime;
      this._animation.reverse();
      this._forEachChild(function(childAnimation) {
        childAnimation.reverse();
      });
      if (oldCurrentTime !== null) {
        this.currentTime = oldCurrentTime;
      }
    },
    addEventListener: function(type, handler) {
      var wrapped = handler;
      if (typeof handler == 'function') {
        wrapped = (function(e) {
          e.target = this;
          handler.call(this, e);
        }).bind(this);
        handler._wrapper = wrapped;
      }
      this._animation.addEventListener(type, wrapped);
    },
    removeEventListener: function(type, handler) {
      this._animation.removeEventListener(type, (handler && handler._wrapper) || handler);
    },
    _removeChildren: function() {
      while (this._childAnimations.length)
        this._childAnimations.pop().cancel();
    },
    _forEachChild: function(f) {
      var offset = 0;
      if (this.effect.children && this._childAnimations.length < this.effect.children.length)
        this._constructChildren();
      this._childAnimations.forEach(function(child) {
        f.call(this, child, offset);
        if (this.effect instanceof window.SequenceEffect)
          offset += child.effect.activeDuration;
      }.bind(this));

      if (this._animation.playState == 'pending')
        return;
      var timing = this.effect._timing;
      var t = this._animation.currentTime;
      if (t !== null)
        t = shared.calculateTimeFraction(shared.calculateActiveDuration(timing), t, timing);
      if (t == null || isNaN(t))
        this._removeChildren();
    },
  };

})(webAnimationsShared, webAnimationsNext, webAnimationsTesting);
