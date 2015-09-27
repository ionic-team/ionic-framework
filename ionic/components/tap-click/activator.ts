import {raf} from '../../util/dom';


export class Activator {

  constructor(app, config) {
    this.app = app;
    this.queue = [];
    this.active = [];
    this.clearStateTimeout = 180;
    this.clearAttempt = 0;
    this.activatedClass = config.setting('activatedClass') || 'activated';
    this.x = 0;
    this.y = 0;
  }

  downAction(ev, activatableEle, pointerX, pointerY, callback) {
    // the user just pressed down

    if (this.disableActivated(ev)) return;

    // remember where they pressed
    this.x = pointerX;
    this.y = pointerY;

    // queue to have this element activated
    this.queue.push(activatableEle);

    raf(() => {
      let activatableEle;
      for (let i = 0; i < this.queue.length; i++) {
        activatableEle = this.queue[i];
        if (activatableEle && activatableEle.parentNode) {
          this.active.push(activatableEle);
          activatableEle.classList.add(this.activatedClass);
        }
      }
      this.queue = [];
    });
  }

  upAction() {
    // the user was pressing down, then just let up
    setTimeout(() => {
      this.clearState();
    }, this.clearStateTimeout);
  }

  clearState() {
    // all states should return to normal

    if ((!this.app.isEnabled() || this.app.isTransitioning()) && this.clearAttempt < 30) {
      // the app is actively disabled, so don't bother deactivating anything.
      // this makes it easier on the GPU so it doesn't have to redraw any
      // buttons during a transition. This will retry in XX milliseconds.
      ++this.clearAttempt;
      this.upAction();

    } else {
      // not actively transitioning, good to deactivate any elements
      this.deactivate();
      this.clearAttempt = 0;
    }
  }

  deactivate() {
    // remove the active class from all active elements
    for (let i = 0; i < this.active.length; i++) {
      this.active[i].classList.remove(this.activatedClass);
    }
    this.queue = [];
    this.active = [];
  }

  disableActivated(ev) {
    let targetEle = ev.target;
    for (let x = 0; x < 4; x++) {
      if (!targetEle) break;
      if (targetEle.hasAttribute('disable-activated')) return true;
      targetEle = targetEle.parentElement;
    }
    return false;
  }

}
