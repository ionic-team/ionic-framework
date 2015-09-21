import {raf} from '../../util/dom';


export class Activator {

  constructor(app, config) {
    this.app = app;
    this.id = 0;
    this.queue = {};
    this.active = {};
    this.clearStateTimeout = 180;
    this.clearAttempt = 0;
    this.activatedClass = config.setting('activatedClass') || 'activated';
    this.x = 0;
    this.y = 0;
    this.lastActivate = 0;
  }

  downAction(targetEle, pointerX, pointerY, callback) {
    // the user just pressed down

    // throttle how many activates fire off in XXms
    let now = Date.now();
    if (this.lastActivate + 50 > now) return;
    this.lastActivate = now;

    // remember where they pressed
    this.x = pointerX;
    this.y = pointerY;

    // remember this is the active element
    let id = ++this.id;
    this.queue[id] = targetEle;
    if (this.id > 9) this.id = 0;

    // activate targetEle
    raf(() => {
      for (let eleId in this.queue) {
        this.queue[eleId].classList.add(this.activatedClass);
        this.active[eleId] = this.queue[eleId];
      }
      callback && callback(targetEle);
      this.queue = {};
    });
  }

  upAction(ev) {
    // the user was pressing down, then just let up
    setTimeout(() => {
      this.clearState();
    }, this.clearStateTimeout);
  }

  clearState(ev) {
    // all states should return to normal

    if (!this.app.isEnabled() && this.clearAttempt < 30) {
      // the app is actively disabled, so don't bother deactivating anything.
      // this makes it easier on the GPU so it doesn't have to redraw any
      // buttons during a transition. This will retry in XX milliseconds.
      ++this.clearAttempt;
      this.upAction();

    } else {
      // not actively transitioning, good to deactivate any elements
      this.queue = {};

      // remove the active class from all active elements
      for (var key in this.active) {
        if (this.active[key]) {
          this.active[key].classList.remove(this.activatedClass);
          delete this.active[key];
        }
      }

      this.clearAttempt = 0;
    }
  }

}
