import {raf, rafFrames} from '../../util/dom';


export class Activator {

  constructor(app, config) {
    this.app = app;
    this.queue = [];
    this.active = [];
    this.clearStateDefers = 5;
    this.clearAttempt = 0;
    this.activatedClass = config.get('activatedClass') || 'activated';
    this.x = 0;
    this.y = 0;
  }

  downAction(ev, activatableEle, pointerX, pointerY, callback) {
    // the user just pressed down

    if (this.disableActivated(ev)) return false;

    // remember where they pressed
    this.x = pointerX;
    this.y = pointerY;

    // queue to have this element activated
    this.queue.push(activatableEle);

    rafFrames(2, () => {
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

    return true;
  }

  upAction() {
    // the user was pressing down, then just let up
    rafFrames(this.clearStateDefers, () => {
      this.clearState();
    });
  }

  clearState() {
    // all states should return to normal

    if ((!this.app.isEnabled() || this.app.isTransitioning())) {
      // the app is actively disabled, so don't bother deactivating anything.
      // this makes it easier on the GPU so it doesn't have to redraw any
      // buttons during a transition. This will retry in XX milliseconds.
      setTimeout(() => {
        this.clearState();
      }, 600);

    } else {
      // not actively transitioning, good to deactivate any elements
      this.deactivate();
    }
  }

  deactivate() {
    // remove the active class from all active elements
    this.queue = [];

    rafFrames(2, () => {
      for (let i = 0; i < this.active.length; i++) {
        this.active[i].classList.remove(this.activatedClass);
      }
      this.active = [];
    });
  }

  disableActivated(ev) {
    if (ev.defaultPrevented) return true;

    let targetEle = ev.target;
    for (let x = 0; x < 4; x++) {
      if (!targetEle) break;
      if (targetEle.hasAttribute('disable-activated')) return true;
      targetEle = targetEle.parentElement;
    }
    return false;
  }

}
