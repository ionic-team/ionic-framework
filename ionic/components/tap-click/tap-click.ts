import {pointerCoord, hasPointerMoved, transitionEnd} from '../../util/dom';
import {Activator} from './activator';
import {RippleActivator} from './ripple';


export class TapClick {

  constructor(app: IonicApp, config: IonicConfig, window, document) {
    const self = this;
    self.app = app;
    self.config = config;
    self.win = window;
    self.doc = document;

    self.pointerTolerance = 4;
    self.lastTouch = 0;
    self.lastActivated = 0;
    self.disableClick = 0;
    self.disableClickLimit = 1500;

    self.tapPolyfill = (config.setting('tapPolyfill') !== false);

    if (config.setting('mdRipple')) {
      self.activator = new RippleActivator(app, config);
    } else {
      self.activator = new Activator(app, config);
    }


    function bindDom(type, listener, useCapture) {
      document.addEventListener(type, listener, useCapture);
    }

    bindDom('click', function(ev) {
      self.click(ev);
    }, true);

    bindDom('touchstart', function(ev) {
      self.lastTouch = Date.now();
      self.pointerStart(ev);
    });

    bindDom('touchend', function(ev) {
      self.lastTouch = Date.now();
      self.touchEnd(ev);
    });

    bindDom('touchcancel', function(ev) {
      self.lastTouch = Date.now();
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
        self.pointerCancel(ev);
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

    } else if (this.lastTouch + 999 < Date.now()) {
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

    if (this.lastTouch + 999 < Date.now()) {
      this.pointerEnd(ev);
    }
  }

  /**
   * TODO
   * @param {TODO} ev  TODO
   */
  pointerStart(ev) {
    let activatableEle = this.getActivatableTarget(ev.target);

    if (activatableEle) {
      this.start = pointerCoord(ev);

      let now = Date.now();
      if (this.lastActivated + 100 < now) {
        this.activator.downAction(ev, activatableEle, this.start.x, this.start.y);
        this.lastActivated = now;
      }

      this.moveListeners(true);

    } else {
      this.start = null;
    }
  }

  /**
   * TODO
   */
  pointerEnd(ev) {
    this.activator.upAction();
    this.moveListeners(false);
  }

  /**
   * TODO
   */
  pointerCancel(ev) {
    console.debug('pointerCancel')
    this.activator.clearState();
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
  }

  getActivatableTarget(ele) {
    let targetEle = ele;
    for (let x = 0; x < 4; x++) {
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

}
