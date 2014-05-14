(function(window) {
  var time = Date.now || function() {
    return +new Date();
  };
  var desiredFrames = 60;
  var millisecondsPerSecond = 1000;

  // Namespace
  ionic.Animation = ionic.Animation || {};
/**
   * Animation instance
   */
  ionic.Animation.Animation = function(opts) {
    ionic.extend(this, opts);

    if(opts.useSlowAnimations) {
      console.warn('Running animation', opts.name, 'with SLOW animations (duration and delay increased by 3x)');
      this.delay *= 3;
      this.duration *= 3;
    }
  };

  ionic.Animation.Animation.prototype = {
    clone: function() {
      return new ionic.Animation.Animation({
        curve: this.curve,
        curveFn: this.curveFn,
        duration: this.duration,
        delay: this.delay,
        repeat: this.repeat,
        reverse: this.reverse,
        autoReverse: this.autoReverse,
        onComplete: this.onComplete,
        step: this.step
      });
    },
    curve: 'linear',
    curveFn: ionic.Animation.TimingFn.linear,
    duration: 500,
    delay: 0,
    repeat: -1,
    reverse: false,
    autoReverse: false,

    onComplete: function(didComplete, droppedFrames) {},

    // Overridable
    step: function(percent) {},

    setPercent: function(percent, doesSetState) {
      this.pause();

      var v = this.curveFn(percent);

      // Check if we should change any internal saved state (to resume
      // from this value later on, for example. Defaults to true)
      if(doesSetState !== false && this._pauseState) {
        // Not sure yet on this
      }

      this.step(v);
      //var value = easingMethod ? easingMethod(percent) : percent;
    },
    stop: function() {
      this.isRunning = false;
      this.shouldEnd = true;
    },
    play: function() {
      this.isPaused = false;
      if(this._lastStepFn) {
        this._unpausedAnimation = true;
        ionic.cancelAnimationFrame(this._lastStepFn);
        ionic.requestAnimationFrame(this._lastStepFn);
      }
    },
    pause: function() {
      this.isPaused = true;
    },
    _saveState: function(now, closure) {
      this._pauseState = {
        pausedAt: now,
      };
      this._lastStepFn = closure;
      window.cancelAnimationFrame(closure);
    },
    restart: function() {
      var self = this;

      this.isRunning = false;

      // TODO: Verify this isn't totally stupid
      ionic.requestAnimationFrame(function() {
        self.start();
      });
    },

    start: function() {
      var self = this;

      // Set up the initial animation state
      var animState = {
        startPercent: this.reverse === true ? 1 : 0,
        endPercent: this.reverse === true ? 0 : 1,
        duration: this.duration,
        easingMethod: this.curveFn,
        delay: this.delay,
        reverse: this.reverse,
        repeat: this.repeat,
        autoReverse: this.autoReverse,
        dynamic: this.dynamic
      };

      ionic.Animation.animationStarted(this);

      return this._run(function(percent, now, render) {
        if(render) {
          self.step(percent);
        }
      }, function(droppedFrames, finishedAnimation) {
        ionic.Animation.animationStopped(self);
        self.onComplete && self.onComplete(finishedAnimation, droppedFrames);
        console.log('Finished anim:', droppedFrames, finishedAnimation);
      }, animState);
    },

    /**
     * Start the animation.
     *
     * @param stepCallback {Function} Pointer to function which is executed on every step.
    *   Signature of the method should be `function(percent, now, virtual) { return continueWithAnimation; }`
     * @param completedCallback {Function}
     *   Signature of the method should be `function(droppedFrames, finishedAnimation) {}`
     * @param duration {Integer} Milliseconds to run the animation
     * @param easingMethod {Function} Pointer to easing function
     *   Signature of the method should be `function(percent) { return modifiedValue; }`
     * @return {Integer} Identifier of animation. Can be used to stop it any time.
     */
    _run: function(stepCallback, completedCallback, state) {
      var self = this;
      var start = time();
      var lastFrame = start;
      var startTime = start + state.delay;
      var percent = state.startPercent;
      var startPercent = state.startPercent;
      var endPercent = state.endPercent;
      var autoReverse = state.autoReverse;
      var delay = state.delay;
      var duration = state.duration;
      var easingMethod = state.easingMethod;
      var repeat = state.repeat;
      var reverse = state.reverse;

      var dropCounter = 0;
      var iteration = 0;

      var perhapsAutoreverse = function() {
        // Check if we hit the end and should auto reverse
        if(percent === endPercent && autoReverse) {
          // Flip the start and end values
          var sp = endPercent;
          reverse = !reverse;
          endPercent = startPercent;
          startPercent = sp;

          if(repeat === 0) {
            autoReverse = false;
          }
        } else {
          // Otherwise, just start over
          percent = startPercent;
        }
        // Start fresh either way
        start = time();
        ionic.requestAnimationFrame(step);
      };


      // This is the internal step method which is called every few milliseconds
      var step = function(virtual) {
        var now = time();

        if(self._unpausedAnimation) {
          // We unpaused. Increase the start time to account
          // for the gap in playback (to keep timing the same)
          var t = self._pauseState.pausedAt;
          start = start + (now - t);
          lastFrame = now;
        }

        // Normalize virtual value
        var render = virtual !== true;

        // Get current time
        var diff = now - start;

        // Verification is executed before next animation step
        if(self.isPaused) {
          self._saveState(now, step);//percent, iteration, reverse);
          return;
        }

        if (!self.isRunning) {// || (verifyCallback && !verifyCallback(id))) {

          completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), self._animationId, false);
          return;

        }


        // For the current rendering to apply let's update omitted steps in memory.
        // This is important to bring internal state variables up-to-date with progress in time.
        if (render) {

          var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
          if(self._unpausedAnimation) {
            console.log('After pausing', droppedFrames, 'Dropped frames');
          }
          for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
            console.log('drop step');
            step(true);
            dropCounter++;
          }

        }

        // Compute percent value
        if (diff > delay && duration) {
          percent = (diff - delay) / duration;

          // If we are animating in the opposite direction,
          // the percentage is 1 minus this perc val
          if(reverse === true) {
            percent = 1 - percent;
            if (percent < 0) {
              percent = 0;
            }
          } else {
            if (percent > 1) {
              percent = 1;
            }
          }
        }

        self._unpausedAnimation = false;

        // Execute step callback, then...
        var value;
        if(state.dynamic) {
          value = state.dynamic.at(percent);
        } else {
          value = easingMethod ? easingMethod(percent) : percent;
        }
        if ((stepCallback(value, now, render) === false || percent === endPercent) && render) {
          if(repeat === -1) {
            perhapsAutoreverse();
          } else if(iteration < repeat) {
            // Track iterations
            iteration++;
            perhapsAutoreverse();
          } else if(repeat === 0 && autoReverse) {
            perhapsAutoreverse();
          } else {
            completedCallback && completedCallback(
              desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)),
              self._animationId,
              percent === endPercent || duration === null
            );
          }
        } else if (render) {
          lastFrame = now;
          ionic.requestAnimationFrame(step);
        }
      };


      // Init first step
      ionic.requestAnimationFrame(step);

    }
  };
})(window);
