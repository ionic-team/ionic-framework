import {raf, rafFrames} from '../../util/dom';


export class Activator {
  protected _css: string;
  protected _queue: Array<HTMLElement> = [];
  protected _active: Array<HTMLElement> = [];

  constructor(protected app, config, protected _zone) {
    this._css = config.get('activatedClass') || 'activated';
  }

  downAction(ev, activatableEle, pointerX, pointerY) {
    // the user just pressed down
    let self = this;
    if (self.disableActivated(ev)) {
      return;
    }

    // queue to have this element activated
    self._queue.push(activatableEle);

    this._zone.runOutsideAngular(() => {
      rafFrames(2, function() {
        let activatableEle;
        for (let i = 0; i < self._queue.length; i++) {
          activatableEle = self._queue[i];
          if (activatableEle && activatableEle.parentNode) {
            self._active.push(activatableEle);
            activatableEle.classList.add(self._css);
          }
        }
        self._queue = [];
      });
    });
  }

  upAction(ev: UIEvent, activatableEle: HTMLElement, pointerX: number, pointerY: number) {
    // the user was pressing down, then just let up
    let self = this;
    function activateUp() {
      self.clearState();
    }
    this._zone.runOutsideAngular(() => {
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
    self._queue = [];

    rafFrames(2, function() {
      for (var i = 0; i < self._active.length; i++) {
        self._active[i].classList.remove(self._css);
      }
      self._active = [];
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

const CLEAR_STATE_DEFERS = 5;
