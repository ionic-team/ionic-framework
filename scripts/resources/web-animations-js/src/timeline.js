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
  var originalRequestAnimationFrame = window.requestAnimationFrame;
  window.requestAnimationFrame = function(f) {
    return originalRequestAnimationFrame(function(x) {
      window.document.timeline._updateAnimationsPromises();
      f(x);
      window.document.timeline._updateAnimationsPromises();
    });
  };

  scope.AnimationTimeline = function() {
    this._animations = [];
    this.currentTime = undefined;
  };

  scope.AnimationTimeline.prototype = {
    getAnimations: function() {
      this._discardAnimations();
      return this._animations.slice();
    },
    _updateAnimationsPromises: function() {
      scope.animationsWithPromises = scope.animationsWithPromises.filter(function(animation) {
        return animation._updatePromises();
      });
    },
    _discardAnimations: function() {
      this._updateAnimationsPromises();
      this._animations = this._animations.filter(function(animation) {
        return animation.playState != 'finished' && animation.playState != 'idle';
      });
    },
    _play: function(effect) {
      var animation = new scope.Animation(effect, this);
      this._animations.push(animation);
      scope.restartWebAnimationsNextTick();
      // Use animation._animation.play() here, NOT animation.play().
      //
      // Timeline.play calls new scope.Animation(effect) which (indirectly) calls Timeline.play on
      // effect's children, and Animation.play is also recursive. We only need to call play on each
      // animation in the tree once.
      animation._updatePromises();
      animation._animation.play();
      animation._updatePromises();
      return animation;
    },
    play: function(effect) {
      if (effect) {
        effect.remove();
      }
      return this._play(effect);
    }
  };

  var ticking = false;

  scope.restartWebAnimationsNextTick = function() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(webAnimationsNextTick);
    }
  };

  function webAnimationsNextTick(t) {
    var timeline = window.document.timeline;
    timeline.currentTime = t;
    timeline._discardAnimations();
    if (timeline._animations.length == 0)
      ticking = false;
    else
      requestAnimationFrame(webAnimationsNextTick);
  }

  var timeline = new scope.AnimationTimeline();
  scope.timeline = timeline;

  try {
    Object.defineProperty(window.document, 'timeline', {
      configurable: true,
      get: function() { return timeline; }
    });
  } catch (e) { }
  try {
    window.document.timeline = timeline;
  } catch (e) { }

})(webAnimationsShared, webAnimationsNext, webAnimationsTesting);
