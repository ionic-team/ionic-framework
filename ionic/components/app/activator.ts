import {raf, pointerCoord, hasPointerMoved} from '../../util/dom';


export class Activator {

  constructor(app: IonicApp, config: IonicConfig, window, document) {
    const self = this;
    self.app = app;
    self.config = config;
    self.win = window;
    self.doc = document;

    self.id = 0;
    self.queue = {};
    self.active = {};
    self.activatedClass = 'activated';
    self.deactivateTimeout = 180;
    self.deactivateAttempt = 0;
    self.pointerTolerance = 4;
    self.isTouch = false;
    self.disableClick = 0;
    self.disableClickLimit = 2500;

    self.tapPolyfill = config.setting('tapPolyfill');

    function bindDom(type, listener, useCapture) {
      document.addEventListener(type, listener, useCapture);
    }

    bindDom('click', function(ev) {
      self.click(ev);
    }, true);

    bindDom('touchstart', function(ev) {
      self.isTouch = true;
      self.pointerStart(ev);
    });

    bindDom('touchend', function(ev) {
      self.isTouch = true;
      self.touchEnd(ev);
    });

    bindDom('touchcancel', function(ev) {
      self.isTouch = true;
      self.pointerCancel(ev);
    });

    bindDom('mousedown', function(ev) {
      self.mouseDown(ev);
    }, true);

    bindDom('mouseup', function(ev) {
      self.mouseUp(ev);
    }, true);


    self.pointerMove = function(ev) {
      let moveCoord = pointerCoord(ev);

      if ( hasPointerMoved(10, self.start, moveCoord) ) {
        self.pointerCancel();
      }
    };


    self.moveListeners = function(shouldAdd) {
      document.removeEventListener('touchmove', self.pointerMove);
      document.removeEventListener('mousemove', self.pointerMove);

      if (shouldAdd) {
        bindDom('touchmove', self.pointerMove);
        bindDom('mousemove', self.pointerMove);
      }
    };

  }


  /**
   * TODO
   * @param {TODO} ev  TODO
   */
  touchEnd(ev) {
    let self = this;

    if (self.tapPolyfill && self.start && self.app.isEnabled()) {
      let endCoord = pointerCoord(ev);

      if (!hasPointerMoved(self.pointerTolerance, self.start, endCoord)) {
        console.debug('create click');

        self.disableClick = Date.now();

        let clickEvent = self.doc.createEvent('MouseEvents');
        clickEvent.initMouseEvent('click', true, true, self.win, 1, 0, 0, endCoord.x, endCoord.y, false, false, false, false, 0, null);
        clickEvent.isIonicTap = true;
        ev.target.dispatchEvent(clickEvent);
      }
    }

    self.pointerEnd(ev);
  }

  /**
   * TODO
   * @param {TODO} ev  TODO
   */
  mouseDown(ev) {
    if (this.isDisabledClick()) {
      console.debug('mouseDown prevent');
      ev.preventDefault();
      ev.stopPropagation();

    } else if (!self.isTouch) {
      this.pointerStart(ev);
    }
  }

  /**
   * TODO
   * @param {TODO} ev  TODO
   */
  mouseUp(ev) {
    if (this.isDisabledClick()) {
      console.debug('mouseUp prevent');
      ev.preventDefault();
      ev.stopPropagation();
    }

    if (!self.isTouch) {
      this.pointerEnd(ev);
    }
  }

  /**
   * TODO
   * @param {TODO} ev  TODO
   */
  pointerStart(ev) {
    let targetEle = this.getActivatableTarget(ev.target);

    if (targetEle && this.app.isEnabled()) {
      this.start = pointerCoord(ev);

      this.queueActivate(targetEle);
      this.moveListeners(true);

    } else {
      this.start = null;
    }
  }

  /**
   * TODO
   */
  pointerEnd(ev) {
    this.queueDeactivate();
    this.moveListeners(false);
  }

  /**
   * TODO
   */
  pointerCancel() {
    console.debug('pointerCancel')
    this.deactivate();
    this.moveListeners(false);
    this.disableClick = Date.now();
  }

  isDisabledClick() {
    return this.disableClick + this.disableClickLimit > Date.now();
  }

  /**
   * Whether the supplied click event should be allowed or not.
   * @param {MouseEvent} ev  The click event.
   * @return {boolean} True if click event should be allowed, otherwise false.
   */
  allowClick(ev) {
    if (!this.app.isEnabled()) {
      return false;
    }
    if (!ev.isIonicTap) {
      if (this.isDisabledClick()) {
        return false;
      }
    }
    return true;
  }

  /**
   * TODO
   * @param {MouseEvent} ev  TODO
   */
  click(ev) {
    if (!this.allowClick(ev)) {
      console.debug('click prevent');
      ev.preventDefault();
      ev.stopPropagation();
    }
    this.isTouch = false;
  }

  getActivatableTarget(ele) {
    var targetEle = ele;
    for (var x = 0; x < 4; x++) {
      if (!targetEle) break;
      if (this.isActivatable(targetEle)) return targetEle;
      targetEle = targetEle.parentElement;
    }
    return null;
  }

  isActivatable(ele) {
    if (/^(A|BUTTON)$/.test(ele.tagName)) {
      return true;
    }

    let attributes = ele.attributes;
    for (let i = 0, l = attributes.length; i < l; i++) {
      if (/click|tappable/.test(attributes[i].name)) {
        return true;
      }
    }

    return false;
  }

  queueActivate(ele) {
    const self = this;

    self.queue[++self.id] = ele;
    if (self.id > 19) self.id = 0;

    raf(function(){
      // activate all elements in the queue
      for (var key in self.queue) {
        if (self.queue[key]) {
          self.queue[key].classList.add(self.activatedClass);
          self.active[key] = self.queue[key];
        }
      }
      self.queue = {};
    });
  }

  queueDeactivate() {
    const self = this;

    setTimeout(function() {
      self.deactivate();
    }, self.deactivateTimeout);
  }

  deactivate() {
    const self = this;

    if (!self.app.isEnabled() && self.deactivateAttempt < 30) {
      // the app is actively disabled, so don't bother deactivating anything.
      // this makes it easier on the GPU so it doesn't have to redraw any
      // buttons during a transition. This will retry in XX milliseconds.
      ++self.deactivateAttempt;
      self.queueDeactivate();

    } else {
      // not actively transitioning, good to deactivate any elements
      // clear out any elements that are queued to be set to active
      self.queue = {};

      // in the next frame, remove the active class from all active elements
      raf(function() {
        for (var key in self.active) {
          if (self.active[key]) {
            self.active[key].classList.remove(self.activatedClass);
          }
          delete self.active[key];
        }
      });

      self.deactivateAttempt = 0;
    }

  }

}
