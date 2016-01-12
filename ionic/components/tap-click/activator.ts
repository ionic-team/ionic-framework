import {raf, rafFrames} from '../../util/dom';


export class Activator {
  public activatedClass: any;
  public queue: Array<any> = [];
  public active: Array<any> = [];
  public x: number = 0;
  public y: number = 0;

  constructor(public app, config, public zone) {
    this.activatedClass = config.get('activatedClass') || 'activated';
  }

  downAction(ev, activatableEle, pointerX, pointerY) {
    // the user just pressed down

    let self = this;
    if (self.disableActivated(ev)) {
      return false;
    }

    // remember where they pressed
    self.x = pointerX;
    self.y = pointerY;

    // queue to have this element activated
    self.queue.push(activatableEle);

    function activateCss() {
      let activatableEle;
      for (let i = 0; i < self.queue.length; i++) {
        activatableEle = self.queue[i];
        if (activatableEle && activatableEle.parentNode) {
          self.active.push(activatableEle);
          activatableEle.classList.add(self.activatedClass);
        }
      }
      self.queue = [];
    }

    this.zone.runOutsideAngular(() => {
      rafFrames(2, activateCss);
    });

    return true;
  }

  upAction() {
    // the user was pressing down, then just let up
    let self = this;
    function activateUp() {
      self.clearState();
    }
    this.zone.runOutsideAngular(() => {
      rafFrames(CLEAR_STATE_DEFERS, activateUp);
    });
  }

  clearState() {
    // all states should return to normal

    if (!this.app.isEnabled()) {
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
    let self = this;
    self.queue = [];

    function deactivate() {
      for (let i = 0; i < self.active.length; i++) {
        self.active[i].classList.remove(self.activatedClass);
      }
      self.active = [];
    }

    rafFrames(2, deactivate);
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

const CLEAR_STATE_DEFERS = 5;
