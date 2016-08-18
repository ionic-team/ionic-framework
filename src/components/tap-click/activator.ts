import { App } from '../app/app';
import { Config } from '../../config/config';
import { PointerCoordinates, nativeTimeout, rafFrames } from '../../util/dom';


export class Activator {
  protected _css: string;
  protected _queue: HTMLElement[] = [];
  protected _active: HTMLElement[] = [];

  constructor(protected app: App, config: Config) {
    this._css = config.get('activatedClass') || 'activated';
  }

  downAction(ev: UIEvent, activatableEle: HTMLElement, startCoord: PointerCoordinates) {
    // the user just pressed down
    let self = this;
    if (self.disableActivated(ev)) {
      return;
    }

    // queue to have this element activated
    self._queue.push(activatableEle);

    rafFrames(2, function() {
      let activatableEle: HTMLElement;
      for (let i = 0; i < self._queue.length; i++) {
        activatableEle = self._queue[i];
        if (activatableEle && activatableEle.parentNode) {
          self._active.push(activatableEle);
          activatableEle.classList.add(self._css);
        }
      }
      self._queue = [];
    });
  }

  upAction(ev: UIEvent, activatableEle: HTMLElement, startCoord: PointerCoordinates) {
    // the user was pressing down, then just let up
    rafFrames(CLEAR_STATE_DEFERS, () => {
      this.clearState();
    });
  }

  clearState() {
    // all states should return to normal
    if (!this.app.isEnabled()) {
      // the app is actively disabled, so don't bother deactivating anything.
      // this makes it easier on the GPU so it doesn't have to redraw any
      // buttons during a transition. This will retry in XX milliseconds.
      nativeTimeout(() => {
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

  disableActivated(ev: any) {
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
