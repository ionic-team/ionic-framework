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
    if (this.disableActivated(ev)) {
      return;
    }

    // queue to have this element activated
    this._queue.push(activatableEle);

    rafFrames(6, () => {
      let activatableEle: HTMLElement;
      for (let i = 0; i < this._queue.length; i++) {
        activatableEle = this._queue[i];
        if (activatableEle && activatableEle.parentNode) {
          this._active.push(activatableEle);
          activatableEle.classList.add(this._css);
        }
      }
      this._queue.length = 0;
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
    this._queue.length = 0;

    rafFrames(2, () => {
      for (var i = 0; i < this._active.length; i++) {
        this._active[i].classList.remove(this._css);
      }
      this._active = [];
    });
  }

  disableActivated(ev: any) {
    if (ev.defaultPrevented) {
      return true;
    }

    let targetEle = ev.target;
    for (let i = 0; i < 4; i++) {
      if (!targetEle) {
        break;
      }
      if (targetEle.hasAttribute('disable-activated')) {
        return true;
      }
      targetEle = targetEle.parentElement;
    }
    return false;
  }

}

const CLEAR_STATE_DEFERS = 5;
