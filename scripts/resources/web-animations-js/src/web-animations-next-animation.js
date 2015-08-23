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
  scope.animationsWithPromises = [];

  scope.Animation = function(effect, timeline) {
    this.effect = effect;
    if (effect) {
      effect._animation = this;
    }
    if (!timeline) {
      throw new Error('Animation with null timeline is not supported');
    }
    this._timeline = timeline;
    this._sequenceNumber = shared.sequenceNumber++;
    this._holdTime = 0;
    this._paused = false;
    this._isGroup = false;
    this._animation = null;
    this._childAnimations = [];
    this._callback = null;
    this._oldPlayState = 'idle';
    this._rebuildUnderlyingAnimation();
    // Animations are constructed in the idle state.
    this._animation.cancel();
    this._updatePromises();
  };

  scope.Animation.prototype = {
    _updatePromises: function() {
      var oldPlayState = this._oldPlayState;
      var newPlayState = this.playState;
      if (this._readyPromise && newPlayState !== oldPlayState) {
        if (newPlayState == 'idle') {
          this._rejectReadyPromise();
          this._readyPromise = undefined;
        } else if (oldPlayState == 'pending') {
          this._resolveReadyPromise();
        } else if (newPlayState == 'pending') {
          this._readyPromise = undefined;
        }
      }
      if (this._finishedPromise && newPlayState !== oldPlayState) {
        if (newPlayState == 'idle') {
          this._rejectFinishedPromise();
          this._finishedPromise = undefined;
        } else if (newPlayState == 'finished') {
          this._resolveFinishedPromise();
        } else if (oldPlayState == 'finished') {
          this._finishedPromise = undefined;
        }
      }
      this._oldPlayState = this.playState;
      return (this._readyPromise || this._finishedPromise);
    },
    _rebuildUnderlyingAnimation: function() {
      this._updatePromises();
      var oldPlaybackRate;
      var oldPaused;
      var oldStartTime;
      var oldCurrentTime;
      var hadUnderlying = this._animation ? true : false;
      if (hadUnderlying) {
        oldPlaybackRate = this.playbackRate;
        oldPaused = this._paused;
        oldStartTime = this.startTime;
        oldCurrentTime = this.currentTime;
        this._animation.cancel();
        this._animation._wrapper = null;
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
      if (this.effect && this.effect._onsample) {
        scope.bindAnimationForCustomEffect(this);
      }
      if (hadUnderlying) {
        if (oldPlaybackRate != 1) {
          this.playbackRate = oldPlaybackRate;
        }
        if (oldStartTime !== null) {
          this.startTime = oldStartTime;
        } else if (oldCurrentTime !== null) {
          this.currentTime = oldCurrentTime;
        } else if (this._holdTime !== null) {
          this.currentTime = this._holdTime;
        }
        if (oldPaused) {
          this.pause();
        }
      }
      this._updatePromises();
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
        this.effect.children[i]._animation = animation;
        this._childAnimations[i]._setExternalAnimation(animation);
      }
    },
    _constructChildAnimations: function() {
      if (!this.effect || !this._isGroup)
        return;
      var offset = this.effect._timing.delay;
      this._removeChildAnimations();
      this.effect.children.forEach(function(child) {
        var childAnimation = window.document.timeline._play(child);
        this._childAnimations.push(childAnimation);
        childAnimation.playbackRate = this.playbackRate;
        if (this._paused)
          childAnimation.pause();
        child._animation = this.effect._animation;

        this._arrangeChildren(childAnimation, offset);

        if (this.effect instanceof window.SequenceEffect)
          offset += scope.groupChildDuration(child);
      }.bind(this));
    },
    _arrangeChildren: function(childAnimation, offset) {
      if (this.startTime === null) {
        childAnimation.currentTime = this.currentTime - offset / this.playbackRate;
      } else if (childAnimation.startTime !== this.startTime + offset / this.playbackRate) {
        childAnimation.startTime = this.startTime + offset / this.playbackRate;
      }
    },
    get timeline() {
      return this._timeline;
    },
    get playState() {
      return this._animation ? this._animation.playState : 'idle';
    },
    get finished() {
      if (!window.Promise) {
        console.warn('Animation Promises require JavaScript Promise constructor');
        return null;
      }
      if (!this._finishedPromise) {
        if (scope.animationsWithPromises.indexOf(this) == -1) {
          scope.animationsWithPromises.push(this);
        }
        this._finishedPromise = new Promise(
            function(resolve, reject) {
              this._resolveFinishedPromise = function() {
                resolve(this);
              };
              this._rejectFinishedPromise = function() {
                reject({type: DOMException.ABORT_ERR, name: 'AbortError'});
              };
            }.bind(this));
        if (this.playState == 'finished') {
          this._resolveFinishedPromise();
        }
      }
      return this._finishedPromise;
    },
    get ready() {
      if (!window.Promise) {
        console.warn('Animation Promises require JavaScript Promise constructor');
        return null;
      }
      if (!this._readyPromise) {
        if (scope.animationsWithPromises.indexOf(this) == -1) {
          scope.animationsWithPromises.push(this);
        }
        this._readyPromise = new Promise(
            function(resolve, reject) {
              this._resolveReadyPromise = function() {
                resolve(this);
              };
              this._rejectReadyPromise = function() {
                reject({type: DOMException.ABORT_ERR, name: 'AbortError'});
              };
            }.bind(this));
        if (this.playState !== 'pending') {
          this._resolveReadyPromise();
        }
      }
      return this._readyPromise;
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
      this._updatePromises();
      var currentTime = this._animation.currentTime;
      this._updatePromises();
      return currentTime;
    },
    set currentTime(v) {
      this._updatePromises();
      this._animation.currentTime = isFinite(v) ? v : Math.sign(v) * Number.MAX_VALUE;
      this._register();
      this._forEachChild(function(child, offset) {
        child.currentTime = v - offset;
      });
      this._updatePromises();
    },
    get startTime() {
      return this._animation.startTime;
    },
    set startTime(v) {
      this._updatePromises();
      this._animation.startTime = isFinite(v) ? v : Math.sign(v) * Number.MAX_VALUE;
      this._register();
      this._forEachChild(function(child, offset) {
        child.startTime = v + offset;
      });
      this._updatePromises();
    },
    get playbackRate() {
      return this._animation.playbackRate;
    },
    set playbackRate(value) {
      this._updatePromises();
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
      this._updatePromises();
    },
    play: function() {
      this._updatePromises();
      this._paused = false;
      this._animation.play();
      if (this._timeline._animations.indexOf(this) == -1) {
        this._timeline._animations.push(this);
      }
      this._register();
      scope.awaitStartTime(this);
      this._forEachChild(function(child) {
        var time = child.currentTime;
        child.play();
        child.currentTime = time;
      });
      this._updatePromises();
    },
    pause: function() {
      this._updatePromises();
      if (this.currentTime) {
        this._holdTime = this.currentTime;
      }
      this._animation.pause();
      this._register();
      this._forEachChild(function(child) {
        child.pause();
      });
      this._paused = true;
      this._updatePromises();
    },
    finish: function() {
      this._updatePromises();
      this._animation.finish();
      this._register();
      this._updatePromises();
    },
    cancel: function() {
      this._updatePromises();
      this._animation.cancel();
      this._register();
      this._removeChildAnimations();
      this._updatePromises();
    },
    reverse: function() {
      this._updatePromises();
      var oldCurrentTime = this.currentTime;
      this._animation.reverse();
      this._forEachChild(function(childAnimation) {
        childAnimation.reverse();
      });
      if (oldCurrentTime !== null) {
        this.currentTime = oldCurrentTime;
      }
      this._updatePromises();
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
    _removeChildAnimations: function() {
      while (this._childAnimations.length)
        this._childAnimations.pop().cancel();
    },
    _forEachChild: function(f) {
      var offset = 0;
      if (this.effect.children && this._childAnimations.length < this.effect.children.length)
        this._constructChildAnimations();
      this._childAnimations.forEach(function(child) {
        f.call(this, child, offset);
        if (this.effect instanceof window.SequenceEffect)
          offset += child.effect.activeDuration;
      }.bind(this));

      if (this.playState == 'pending')
        return;
      var timing = this.effect._timing;
      var t = this.currentTime;
      if (t !== null)
        t = shared.calculateTimeFraction(shared.calculateActiveDuration(timing), t, timing);
      if (t == null || isNaN(t))
        this._removeChildAnimations();
    },
  };

  window.Animation = scope.Animation;

  if (WEB_ANIMATIONS_TESTING) {
    testing.webAnimationsNextAnimation = scope.Animation;
  }

})(webAnimationsShared, webAnimationsNext, webAnimationsTesting);
