/**
  * Simple gesture controllers with some common gestures that emit
  * gesture events.
  *
  * Much adapted from github.com/EightMedia/Hammer.js - thanks!
  */
(function(window, document, framework) {
  // Gesture support
  framework.Gesture = {}

  // Simple touch gesture that triggers an event when an element is touched
  framework.Gesture.Touch = {
    handle: function(e) {
      if(e.type == 'touchstart') {
        framework.EventController.trigger('touch', {
          cancelable: true,
          bubbles: true
        });
      }
    }
  };

  // Simple tap gesture
  framework.Gesture.Tap = {
    handle: function(e) {
      switch(e.type) {
        case 'touchstart':
          this._touchStartX = e.touches[0].clientX;
          this._touchStartY = e.touches[0].clientY;

          // We are now touching
          this._isTouching = true;
          // Reset the movement indicator
          this._hasMoved = false;
          break;
        case 'touchmove':
          var x = e.touches[0].clientX;
              y = e.touches[0].clientY;

          // Check if the finger moved more than 10px, and then indicate we should cancel the tap
          if (Math.abs(x - this._touchStartX) > 10 || Math.abs(y - this._touchStartY) > 10) {
            console.log('HAS MOVED');
            this._hasMoved = true;
          }
          break;
        case 'touchend':
          if(this._hasMoved == false) {
            framework.EventController.trigger('tap', {
              cancelable: true,
              bubbles: true
            });
          }
          break;
      }
    }
  };

  // The gesture is over, trigger a release event
  framework.Gesture.Release = {
    handle: function(e) {
      if(e.type === 'touchend') {
        framework.EventController.trigger('release', {
          cancelable: true,
          bubbles: true
        });
      }
    }
  };

  // A swipe gesture that emits the 'swipe' event when a left swipe happens
  framework.Gesture.Swipe = {
    swipe_velocity: 0.7,
    handle: function(e) {
      if(e.type == 'touchend') {

        if(e.velocityX > this.swipe_velocity ||
            e.velocityY > this.swipe_velocity) {

          // trigger swipe events, both a general swipe,
          // and a directional swipe
          framework.EventController.trigger('swipe', {
            gesture: e,
            cancelable: true,
            bubbles: true
          });
          framework.EventController.trigger('swipe' + e.direction, {
            gesture: e,
            cancelable: true,
            bubbles: true
          });
        }
      }
    }
  };


  framework.GestureController  = {
    gestures: [
      framework.Gesture.Touch,
      framework.Gesture.Tap,
      framework.Gesture.Swipe
    ],

    _annotateGestureEvent: function(e) {
      // If this doesn't have touches, we need to grab the last set that did
      var touches = e.touches;
      if((!touches || !touches.length) && this._lastMoveEvent) {
        touches = this._lastMoveEvent.touches;
      }

      e.center = this.getCenter(touches);
      var startEv = this.currentGesture.startEvent;
      var delta_time = e.timeStamp - startEv.timeStamp;
      var delta_x = e.center.pageX - startEv.center.pageX;
      var delta_y = e.center.pageY - startEv.center.pageY;
      var velocity = this.getVelocity(delta_time, delta_x, delta_y);

      framework.Utils.extend(e, {
        touches         : touches,
        deltaTime       : delta_time,

        deltaX          : delta_x,
        deltaY          : delta_y,

        velocityX       : velocity.x,
        velocityY       : velocity.y,

        distance        : this.getDistance(startEv.center, e.center),
        angle           : this.getAngle(startEv.center, e.center),
        //interimAngle    : this.current.lastEvent && Hammer.utils.getAngle(this.current.lastEvent.center, e.center),
        direction       : this.getDirection(startEv.center, e.center),
        //interimDirection: this.current.lastEvent && Hammer.utils.getDirection(this.current.lastEvent.center, e.center),

        scale           : this.getScale(startEv.touches, touches),
        rotation        : this.getRotation(startEv.touches, touches),

        startEvent      : startEv
      });


      return e;
    },

    _getFakeEvent: function(e) {
      return {
        center      : this.getCenter(e.touches),
        timeStamp   : new Date().getTime(),
        target      : e.target,
        touches     : e.touches,
        eventType   : e.type,
        srcEvent    : e,

        /*
        // prevent the browser default actions
        // mostly used to disable scrolling of the browser
        preventDefault: function() {
          if(this.srcEvent.preventManipulation) {
            this.srcEvent.preventManipulation();
          }

          if(this.srcEvent.preventDefault) {
            this.srcEvent.preventDefault();
          }
        },
        */

        /**
         * stop bubbling the event up to its parents
         */
        stopPropagation: function() {
          this.srcEvent.stopPropagation();
        },

        //immediately stop gesture detection
        //might be useful after a swipe was detected
        //@return {*}
        stopDetect: function() {
          return Hammer.detection.stopDetect();
        }
      };
    },

    startGesture: function(e) {
      console.log('START GESTURE');
      // We only want to process one gesture at a time
      if(this.currentGesture) {
        return;
      }

      e = this._getFakeEvent(e);

      this.currentGesture = e;
      this.currentGesture.startEvent = framework.Utils.extend({}, e);
      
      if((e.touches && e.touches.length) || !this._lastMoveEvent) {
        this._lastMoveEvent = e;
      }

      this.detectGesture(e);
    },
    detectGesture: function(e) {
      var i;

      if(e.touches && e.touches.length) {
        this._lastMoveEvent = e;
      }
      
      var eventData = this._annotateGestureEvent(e);
      console.log("Event velocity:", eventData.velocityX, eventData.velocityY);

      for(i = 0; i < this.gestures.length; i++) {
        if(this.gestures[i].handle(eventData) == false) {
          console.log('GESTURECONTROLLER: Gesture handled and stopped.');
          this.endGesture(eventData);
          return;
        }
      }

      if(this.currentGesture) {
        // Store this event so we can access it again later
        this.currentGesture.lastEvent = eventData;
      }

      // It's over!
      if(e.type === 'touchend' || e.type === 'touchcancel') {
        this.endGesture(eventData);
      }
    },
    endGesture: function(e) {
      this.currentGesture = null;
      this._lastMoveEvent = null;
    },

    /**
     * find if a node is in the given parent
     * used for event delegation tricks
     * @param   {HTMLElement}   node
     * @param   {HTMLElement}   parent
     * @returns {boolean}       has_parent
     */
    hasParent: function(node, parent) {
        while(node){
            if(node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    },


    /**
     * get the center of all the touches
     * @param   {Array}     touches
     * @returns {Object}    center
     */
    getCenter: function getCenter(touches) {
        var valuesX = [], valuesY = [];

        for(var t= 0,len=touches.length; t<len; t++) {
            valuesX.push(touches[t].pageX);
            valuesY.push(touches[t].pageY);
        }

        return {
            pageX: ((Math.min.apply(Math, valuesX) + Math.max.apply(Math, valuesX)) / 2),
            pageY: ((Math.min.apply(Math, valuesY) + Math.max.apply(Math, valuesY)) / 2)
        };
    },


    /**
     * calculate the velocity between two points
     * @param   {Number}    delta_time
     * @param   {Number}    delta_x
     * @param   {Number}    delta_y
     * @returns {Object}    velocity
     */
    getVelocity: function getVelocity(delta_time, delta_x, delta_y) {
        return {
            x: Math.abs(delta_x / delta_time) || 0,
            y: Math.abs(delta_y / delta_time) || 0
        };
    },


    /**
     * calculate the angle between two coordinates
     * @param   {Touch}     touch1
     * @param   {Touch}     touch2
     * @returns {Number}    angle
     */
    getAngle: function getAngle(touch1, touch2) {
        var y = touch2.pageY - touch1.pageY,
            x = touch2.pageX - touch1.pageX;
        return Math.atan2(y, x) * 180 / Math.PI;
    },


    /**
     * angle to direction define
     * @param   {Touch}     touch1
     * @param   {Touch}     touch2
     * @returns {String}    direction constant, like Hammer.DIRECTION_LEFT
     */
    getDirection: function getDirection(touch1, touch2) {
        var x = Math.abs(touch1.pageX - touch2.pageX),
            y = Math.abs(touch1.pageY - touch2.pageY);

        if(x >= y) {
            return touch1.pageX - touch2.pageX > 0 ? 'left' : 'right';
        }
        else {
            return touch1.pageY - touch2.pageY > 0 ? 'up': 'down';
        }
    },


    /**
     * calculate the distance between two touches
     * @param   {Touch}     touch1
     * @param   {Touch}     touch2
     * @returns {Number}    distance
     */
    getDistance: function getDistance(touch1, touch2) {
        var x = touch2.pageX - touch1.pageX,
            y = touch2.pageY - touch1.pageY;
        return Math.sqrt((x*x) + (y*y));
    },


    /**
     * calculate the scale factor between two touchLists (fingers)
     * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
     * @param   {Array}     start
     * @param   {Array}     end
     * @returns {Number}    scale
     */
    getScale: function getScale(start, end) {
        // need two fingers...
        if(start.length >= 2 && end.length >= 2) {
            return this.getDistance(end[0], end[1]) /
                this.getDistance(start[0], start[1]);
        }
        return 1;
    },


    /**
     * calculate the rotation degrees between two touchLists (fingers)
     * @param   {Array}     start
     * @param   {Array}     end
     * @returns {Number}    rotation
     */
    getRotation: function getRotation(start, end) {
        // need two fingers
        if(start.length >= 2 && end.length >= 2) {
            return this.getAngle(end[1], end[0]) -
                this.getAngle(start[1], start[0]);
        }
        return 0;
    },


    /**
     * boolean if the direction is vertical
     * @param    {String}    direction
     * @returns  {Boolean}   is_vertical
     */
    isVertical: function isVertical(direction) {
        return (direction == Hammer.DIRECTION_UP || direction == Hammer.DIRECTION_DOWN);
    },


    /**
     * stop browser default behavior with css props
     * @param   {HtmlElement}   element
     * @param   {Object}        css_props
     */
    stopDefaultBrowserBehavior: function stopDefaultBrowserBehavior(element, css_props) {
        var prop,
            vendors = ['webkit','khtml','moz','Moz','ms','o',''];

        if(!css_props || !element.style) {
            return;
        }

        // with css properties for modern browsers
        for(var i = 0; i < vendors.length; i++) {
            for(var p in css_props) {
                if(css_props.hasOwnProperty(p)) {
                    prop = p;

                    // vender prefix at the property
                    if(vendors[i]) {
                        prop = vendors[i] + prop.substring(0, 1).toUpperCase() + prop.substring(1);
                    }

                    // set the style
                    element.style[prop] = css_props[p];
                }
            }
        }

        // also the disable onselectstart
        if(css_props.userSelect == 'none') {
            element.onselectstart = function() {
                return false;
            };
        }
        
        // and disable ondragstart
        if(css_props.userDrag == 'none') {
            element.ondragstart = function() {
                return false;
            };
        }
    }

  }


})(this, document, FM = this.FM || {});
