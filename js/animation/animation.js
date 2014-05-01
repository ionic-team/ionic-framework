(function(window) {
  var time = Date.now || function() {
    return +new Date();
  };
  var desiredFrames = 60;
  var millisecondsPerSecond = 1000;
  var running = {};
  var counter = 1;

  // Namespace
  ionic.Animation = {};

  /**
   * The main animation system manager. Treated as a singleton.
   */
  ionic.Animation = {
    create: function(opts) {
      return new ionic.Animation.Animation(opts);
    },

    animationStarted: function(instance) {
      var id = counter++;

      // Compacting running db automatically every few new animations
      if (id % 20 === 0) {
        var newRunning = {};
        for (var usedId in running) {
          newRunning[usedId] = true;
        }
        running = newRunning;
      }

      // Mark as running
      running[id] = true;

      instance.isRunning = true;
      instance._animationId = id;

      // Return unique animation ID
      return id;
    },

    animationStopped: function(instance) {
      instance.isRunning = false;
    }

    /* TODO: Move animation set management here instead of instance
    anims: [],
    add: function(animation) {
      this.anims.push(animation);
    },
    remove: function(animation) {
      var i, j;
      for(i = 0, j = this.anims.length; i < j; i++) {
        if(this.anims[i] === animation) {
          return this.anims.splice(i, 1);
        }
      }
    },
    clear: function(shouldStop) {
      while(this.anims.length) {
        var anim = this.anims.pop();
        if(shouldStop === true) {
          anim.stop();
        }
      }
    },
    */

    /**
     * Stops the given animation.
     *
     * @param id {Integer} Unique animation ID
     * @return {Boolean} Whether the animation was stopped (aka, was running before)
     * TODO: Requires above fix
    stop: function(id) {
      var cleared = running[id] != null;
      if (cleared) {
        running[id] = null;
      }

      return cleared;
    },
     */


    /**
     * Whether the given animation is still running.
     *
     * @param id {Integer} Unique animation ID
     * @return {Boolean} Whether the animation is still running
    isRunning: function(id) {
      return running[id] != null;
    },
     */

  };

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
    el: null,
    curve: 'linear',
    duration: 500,
    delay: 0,
    repeat: -1,
    reverse: false,
    autoReverse: false,

    step: function(percent) {},

    stop: function() {
      this.isRunning = false;
      this.shouldEnd = true;
    },
    play: function() {
      this.isPaused = false;
      this.start();
    },
    pause: function() {
      this.isPaused = true;
    },
    _saveState: function(percent, iteration, reverse) {
      this._pauseState = {
        percent: percent,
        iteration: iteration,
        reverse: reverse
      }
    },
    restart: function() {
    },

    start: function() {
      var self = this;

      var tf;

      console.log('Starting animation', this);


      // Grab the timing function
      if(typeof this.curve === 'string') {
        tf = ionic.Animation.TimingFn[this.curve] || ionic.Animation.TimingFn['linear'];
      } else {
        tf = this.curve;
      }

      // Get back a timing function for the given duration (used for precision)
      tf = tf(this.duration);

      // Set up the initial animation state
      var animState = {
        startPercent: this.reverse === true ? 1 : 0,
        endPercent: this.reverse === true ? 0 : 1,
        duration: this.duration,
        easingMethod: tf,
        delay: this.delay,
        reverse: this.reverse,
        repeat: this.repeat,
        autoReverse: this.autoReverse
      }


      if(this._pauseState) {
        // We were paused, so update the fields
        ionic.extend(animState, this._pauseState);
        this._pauseState = null;
      }

      ionic.Animation.animationStarted(this);

      return this._run(function(percent, now, render) {
        if(render) {
          self.step(percent);
        }
      }, function(droppedFrames, finishedAnimation) {
        ionic.Animation.animationStopped(self);
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
      }


      // This is the internal step method which is called every few milliseconds
      var step = function(virtual) {

        // Normalize virtual value
        var render = virtual !== true;

        // Get current time
        var now = time();
        var diff = now - start;

        // Verification is executed before next animation step
        if(self.isPaused) {
          self._saveState(percent, iteration, reverse);
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
          for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
            step(true);
            dropCounter++;
          }

        }

        // Compute percent value
        if (diff > delay && duration) {
          percent = (diff - delay) / duration;
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

        // Execute step callback, then...
        var value = easingMethod ? easingMethod(percent) : percent;
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
            completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), self._animationId, percent === endPercent || duration == null);
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
