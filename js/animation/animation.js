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
    anims: [],
    add: function(animation) {
      this.anims.push(animation);
    },
    create: function(opts) {
      return new ionic.Animation.Animation(opts);
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

    /**
     * Stops the given animation.
     *
     * @param id {Integer} Unique animation ID
     * @return {Boolean} Whether the animation was stopped (aka, was running before)
     */
    stop: function(id) {
      var cleared = running[id] != null;
      if (cleared) {
        running[id] = null;
      }

      return cleared;
    },


    /**
     * Whether the given animation is still running.
     *
     * @param id {Integer} Unique animation ID
     * @return {Boolean} Whether the animation is still running
     */
    isRunning: function(id) {
      return running[id] != null;
    },

  };

  /**
   * Animation instance
   */
  ionic.Animation.Animation = function(opts) {
    ionic.extend(this, opts);
  };

  ionic.Animation.Animation.prototype = {
    el: null,
    curve: 'linear',
    duration: 500,
    delay: 0,
    repeat: -1,

    step: function(percent) {},

    stop: function() {
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

      return this._run(function(percent, now, render) {
        if(render) {
          self.step(percent);
        }
      }, function() {
        return true;
      }, function(droppedFrames, finishedAnimation) {
        console.log('Finished anim:', droppedFrames, finishedAnimation);
      }, this.duration, tf, this.delay);
    },

    /**
     * Start the animation.
     *
     * @param stepCallback {Function} Pointer to function which is executed on every step.
    *   Signature of the method should be `function(percent, now, virtual) { return continueWithAnimation; }`
     * @param verifyCallback {Function} Executed before every animation step.
     *   Signature of the method should be `function() { return continueWithAnimation; }`
     * @param completedCallback {Function}
     *   Signature of the method should be `function(droppedFrames, finishedAnimation) {}`
     * @param duration {Integer} Milliseconds to run the animation
     * @param easingMethod {Function} Pointer to easing function
     *   Signature of the method should be `function(percent) { return modifiedValue; }`
     * @return {Integer} Identifier of animation. Can be used to stop it any time.
     */
    _run: function(stepCallback, verifyCallback, completedCallback, duration, easingMethod, delay) {

      var start = time();
      var lastFrame = start;
      var startTime = start + delay;
      var percent = 0;
      var dropCounter = 0;
      var id = counter++;

      // Compacting running db automatically every few new animations
      if (id % 20 === 0) {
        var newRunning = {};
        for (var usedId in running) {
          newRunning[usedId] = true;
        }
        running = newRunning;
      }

      // This is the internal step method which is called every few milliseconds
      var step = function(virtual) {

        // Normalize virtual value
        var render = virtual !== true;

        // Get current time
        var now = time();
        var diff = now - start;

        // Verification is executed before next animation step
        if (!running[id] || (verifyCallback && !verifyCallback(id))) {

          running[id] = null;
          completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, false);
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
          if (percent > 1) {
            percent = 1;
          }
        }

        // Execute step callback, then...
        var value = easingMethod ? easingMethod(percent) : percent;
        if ((stepCallback(value, now, render) === false || percent === 1) && render) {
          running[id] = null;
          completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, percent === 1 || duration == null);
        } else if (render) {
          lastFrame = now;
          ionic.requestAnimationFrame(step);
        }
      };

      // Mark as running
      running[id] = true;

      // Init first step
      ionic.requestAnimationFrame(step);

      // Return unique animation ID
      return id;
    }
  };


})(window);
