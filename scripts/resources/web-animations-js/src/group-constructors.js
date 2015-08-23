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
    this._parent = null;
    this.children = children || [];
    this._reparent(this.children);
    timingInput = shared.numericTimingToObject(timingInput);
    this._timingInput = shared.cloneTimingInput(timingInput);
    this._timing = shared.normalizeTimingInput(timingInput, true);
    this.timing = shared.makeTiming(timingInput, true, this);
    this.timing._effect = this;

    if (this._timing.duration === 'auto') {
      this._timing.duration = this.activeDuration;
    }
  }

  window.SequenceEffect = function() {
    constructor.apply(this, arguments);
  };

  window.GroupEffect = function() {
    constructor.apply(this, arguments);
  };

  constructor.prototype = {
    _isAncestor: function(effect) {
      var a = this;
      while (a !== null) {
        if (a == effect)
          return true;
        a = a._parent;
      }
      return false;
    },
    _rebuild: function() {
      // Re-calculate durations for ancestors with specified duration 'auto'.
      var node = this;
      while (node) {
        if (node.timing.duration === 'auto') {
          node._timing.duration = node.activeDuration;
        }
        node = node._parent;
      }
      if (this._animation) {
        this._animation._rebuildUnderlyingAnimation();
      }
    },
    _reparent: function(newChildren) {
      scope.removeMulti(newChildren);
      for (var i = 0; i < newChildren.length; i++) {
        newChildren[i]._parent = this;
      }
    },
    _putChild: function(args, isAppend) {
      var message = isAppend ? 'Cannot append an ancestor or self' : 'Cannot prepend an ancestor or self';
      for (var i = 0; i < args.length; i++) {
        if (this._isAncestor(args[i])) {
          throw {
            type: DOMException.HIERARCHY_REQUEST_ERR,
            name: 'HierarchyRequestError',
            message: message
          };
        }
      }
      var oldParents = [];
      for (var i = 0; i < args.length; i++) {
        isAppend ? this.children.push(args[i]) : this.children.unshift(args[i]);
      }
      this._reparent(args);
      this._rebuild();
    },
    append: function()  {
      this._putChild(arguments, true);
    },
    prepend: function()  {
      this._putChild(arguments, false);
    },
    get parent() {
      return this._parent;
    },
    get firstChild() {
      return this.children.length ? this.children[0] : null;
    },
    get lastChild() {
      return this.children.length ? this.children[this.children.length - 1] : null;
    },
    clone: function() {
      var clonedTiming = shared.cloneTimingInput(this._timingInput);
      var clonedChildren = [];
      for (var i = 0; i < this.children.length; i++) {
        clonedChildren.push(this.children[i].clone());
      }
      return (this instanceof GroupEffect) ?
          new GroupEffect(clonedChildren, clonedTiming) :
          new SequenceEffect(clonedChildren, clonedTiming);
    },
    remove: function() {
      scope.removeMulti([this]);
    }
  };

  window.SequenceEffect.prototype = Object.create(constructor.prototype);
  Object.defineProperty(
      window.SequenceEffect.prototype,
      'activeDuration',
      {
        get: function() {
          var total = 0;
          this.children.forEach(function(child) {
            total += groupChildDuration(child);
          });
          return Math.max(total, 0);
        }
      });

  window.GroupEffect.prototype = Object.create(constructor.prototype);
  Object.defineProperty(
      window.GroupEffect.prototype,
      'activeDuration',
      {
        get: function() {
          var max = 0;
          this.children.forEach(function(child) {
            max = Math.max(max, groupChildDuration(child));
          });
          return max;
        }
      });

  scope.newUnderlyingAnimationForGroup = function(group) {
    var underlyingAnimation;
    var timing = null;
    var ticker = function(tf) {
      var animation = underlyingAnimation._wrapper;
      if (!animation) {
        return;
      }
      if (animation.playState == 'pending') {
        return;
      }
      if (!animation.effect) {
        return;
      }
      if (tf == null) {
        animation._removeChildAnimations();
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
          animation._removeChildAnimations();
          return;
        }
      }
    };

    var underlyingEffect = new KeyframeEffect(null, [], group._timing);
    underlyingEffect.onsample = ticker;
    underlyingAnimation = scope.timeline._play(underlyingEffect);
    return underlyingAnimation;
  };

  scope.bindAnimationForGroup = function(animation) {
    animation._animation._wrapper = animation;
    animation._isGroup = true;
    scope.awaitStartTime(animation);
    animation._constructChildAnimations();
    animation._setExternalAnimation(animation);
  };

  scope.groupChildDuration = groupChildDuration;

})(webAnimationsShared, webAnimationsNext, webAnimationsTesting);
