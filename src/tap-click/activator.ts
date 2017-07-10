import { ActivatorBase, isActivatedDisabled } from './activator-base';
import { App } from '../components/app/app';
import { Config } from '../config/config';
import { DomController } from '../platform/dom-controller';
import { PointerCoordinates } from '../util/dom';


export class Activator implements ActivatorBase {

  protected _queue: HTMLElement[] = [];
  protected _active: HTMLElement[] = [];
  protected _activeDefer: Function;
  protected _clearDefer: Function;

  _css: string;
  activatedDelay = ADD_ACTIVATED_DEFERS;
  clearDelay = CLEAR_STATE_DEFERS;

  constructor(protected app: App, config: Config, private dom: DomController) {
    this._css = config.get('activatedClass', 'activated');
  }

  clickAction(ev: UIEvent, activatableEle: HTMLElement, _startCoord: PointerCoordinates) {
    if (isActivatedDisabled(ev, activatableEle)) {
      return;
    }
    // a click happened, so immediately deactive all activated elements
    this._scheduleClear();

    this._queue.length = 0;

    for (var i = 0; i < this._active.length; i++) {
      this._active[i].classList.remove(this._css);
    }
    this._active.length = 0;

    // then immediately activate this element
    if (activatableEle && activatableEle.parentNode) {
      this._active.push(activatableEle);
      activatableEle.classList.add(this._css);
    }
  }

  downAction(ev: UIEvent, activatableEle: HTMLElement, _startCoord: PointerCoordinates) {
    // the user just pressed down
    if (isActivatedDisabled(ev, activatableEle)) {
      return;
    }

    this.unscheduleClear();
    this.deactivate(true);

    // queue to have this element activated
    this._queue.push(activatableEle);

    this._activeDefer = this.dom.write(() => {
      this._activeDefer = null;
      let activatableEle: HTMLElement;
      for (let i = 0; i < this._queue.length; i++) {
        activatableEle = this._queue[i];
        this._active.push(activatableEle);
        activatableEle.classList.add(this._css);
      }
      this._queue.length = 0;
    }, this.activatedDelay);
  }

  // the user was pressing down, then just let up
  upAction(_ev: UIEvent, _activatableEle: HTMLElement, _startCoord: PointerCoordinates) {
    this._scheduleClear();
  }

  _scheduleClear() {
    if (this._clearDefer) {
      return;
    }
    this._clearDefer = this.dom.write(() => {
      this.clearState(true);
      this._clearDefer = null;
    }, this.clearDelay);
  }

  unscheduleClear() {
    if (this._clearDefer) {
      this._clearDefer();
      this._clearDefer = null;
    }
  }

  // all states should return to normal
  clearState(animated: boolean) {
    if (!this.app.isEnabled()) {
      // the app is actively disabled, so don't bother deactivating anything.
      // this makes it easier on the GPU so it doesn't have to redraw any
      // buttons during a transition. This will retry in XX milliseconds.
      this.dom.write(() => {
        this.clearState(animated);
      }, 600);

    } else {
      // not actively transitioning, good to deactivate any elements
      this.deactivate(animated);
    }
  }

  // remove the active class from all active elements
  deactivate(animated: boolean) {
    this._clearDeferred();

    this._queue.length = 0;

    let ele: HTMLElement;
    for (var i = 0; i < this._active.length; i++) {
      ele = this._active[i];
      (<any>ele.style)[this.dom.plt.Css.transition] = animated ? '' : 'none';
      ele.classList.remove(this._css);
    }
    this._active.length = 0;
  }

  _clearDeferred() {
    // Clear any active deferral
    if (this._activeDefer) {
      this._activeDefer();
      this._activeDefer = null;
    }
  }
}

const ADD_ACTIVATED_DEFERS = 80;
const CLEAR_STATE_DEFERS = 80;
