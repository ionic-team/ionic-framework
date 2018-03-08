
import { NavOptions, STATE_ATTACHED, STATE_DESTROYED, STATE_INITIALIZED, STATE_NEW } from './nav-util';
import { NavControllerBase } from './nav';
import { assert } from '../../utils/helpers';

/**
 * @name ViewController
 * @description
 * Access various features and information about the current view.
 * @usage
 *  ```ts
 * import { Component } from '@angular/core';
 * import { ViewController } from 'ionic-angular';
 *
 * @Component({...})
 * export class MyPage{
 *
 *   constructor(public viewCtrl: ViewController) {}
 *
 * }
 * ```
 */
export class ViewController {

  private _cntDir: any;
  private _isHidden = false;
  private _leavingOpts: NavOptions;
  private _detached: boolean;

  _nav: NavControllerBase;
  _zIndex: number;
  _state: number = STATE_NEW;

  /** @hidden */
  id: string;

  /** @hidden */
  isOverlay = false;

  element: HTMLElement;
  /** @hidden */
  // @Output() private _emitter: EventEmitter<any> = new EventEmitter();

  constructor(
    public component: any,
    public data?: any
  ) {}

  /**
   * @hidden
   */
  init() {
    if (this.element) {
      return;
    }
    const component = this.component;
    this.element = (typeof component === 'string')
      ? document.createElement(component)
      : component;

    this.element.classList.add('ion-page');
    if (this.data) {
      Object.assign(this.element, this.data);
    }
  }

  _setNav(navCtrl: NavControllerBase) {
    this._nav = navCtrl;
  }

  /**
   * @hidden
   */
  getNav(): NavControllerBase {
    return this._nav;
  }

  /**
   * @hidden
   */
  getTransitionName(_direction: string): string {
    return this._nav && this._nav.config && this._nav.config.get('pageTransition') || 'md';
  }

  /**
   * @hidden
   */
  setLeavingOpts(opts: NavOptions) {
    this._leavingOpts = opts;
  }

  /**
   * Check to see if you can go back in the navigation stack.
   * @returns {boolean} Returns if it's possible to go back from this Page.
   */
  enableBack(): boolean {
    // update if it's possible to go back from this nav item
    if (!this._nav) {
      return false;
    }
    // the previous view may exist, but if it's about to be destroyed
    // it shouldn't be able to go back to
    const previousItem = this._nav.getPrevious(this);
    return !!(previousItem);
  }

  /**
   * @hidden
   */
  get name(): string {
    const component = this.component;
    if (typeof component === 'string') {
      return component;
    }
    if (component.tagName) {
      return component.tagName;
    }
    return this.element ? this.element.tagName : 'unknown';
  }

  /**
   * @hidden
   * DOM WRITE
   */
  _domShow(shouldShow: boolean) {
    // using hidden element attribute to display:none and not render views
    // doing checks to make sure we only update the DOM when actually needed
    // if it should render, then the hidden attribute should not be on the element
    if (this.element && shouldShow === this._isHidden) {
      this._isHidden = !shouldShow;

      // ******** DOM WRITE ****************
      if (shouldShow) {
        this.element.removeAttribute('hidden');
      } else {
        this.element.setAttribute('hidden', '');
      }

    }
  }

  /**
   * @hidden
   */
  getZIndex(): number {
    return this._zIndex;
  }

  /**
   * @hidden
   * DOM WRITE
   */
  _setZIndex(zIndex: number) {
    if (zIndex !== this._zIndex) {
      this._zIndex = zIndex;
      const pageEl = this.element;
      if (pageEl) {
        const el = pageEl as HTMLElement;
        // ******** DOM WRITE ****************
        el.style.zIndex = zIndex + '';
      }
    }
  }

  _preLoad() {
    assert(this._state === STATE_INITIALIZED, 'view state must be INITIALIZED');
    this._lifecycle('PreLoad');
  }

  /**
   * @hidden
   * The view has loaded. This event only happens once per view will be created.
   * This event is fired before the component and his children have been initialized.
   */
  _willLoad() {
    assert(this._state === STATE_INITIALIZED, 'view state must be INITIALIZED');
    this._lifecycle('WillLoad');
  }

  /**
   * @hidden
   * The view has loaded. This event only happens once per view being
   * created. If a view leaves but is cached, then this will not
   * fire again on a subsequent viewing. This method is a good place
   * to put your setup code for the view; however, it is not the
   * recommended method to use when a view becomes active.
   */
  _didLoad() {
    assert(this._state === STATE_ATTACHED, 'view state must be ATTACHED');
    this._lifecycle('DidLoad');
  }

  /**
   * @hidden
   * The view is about to enter and become the active view.
   */
  _willEnter() {
    assert(this._state === STATE_ATTACHED, 'view state must be ATTACHED');

    if (this._detached) {
      // ensure this has been re-attached to the change detector
      // TODO
      // this._cmp.changeDetectorRef.reattach();
      this._detached = false;
    }

    // this.willEnter.emit(null);
    this._lifecycle('WillEnter');
  }

  /**
   * @hidden
   * The view has fully entered and is now the active view. This
   * will fire, whether it was the first load or loaded from the cache.
   */
  _didEnter() {
    assert(this._state === STATE_ATTACHED, 'view state must be ATTACHED');

    // this._nb && this._nb.didEnter();
    // this.didEnter.emit(null);
    this._lifecycle('DidEnter');
  }

  /**
   * @hidden
   * The view is about to leave and no longer be the active view.
   */
  _willLeave(_willUnload: boolean) {
    // this.willLeave.emit(null);
    this._lifecycle('WillLeave');
  }

  /**
   * @hidden
   * The view has finished leaving and is no longer the active view. This
   * will fire, whether it is cached or unloaded.
   */
  _didLeave() {
    // this.didLeave.emit(null);
    this._lifecycle('DidLeave');

    // when this is not the active page
    // we no longer need to detect changes
    if (!this._detached) {
      // TODO
      // this._cmp.changeDetectorRef.detach();
      this._detached = true;
    }
  }

  /**
   * @hidden
   */
  _willUnload() {
    // this.willUnload.emit(null);
    this._lifecycle('WillUnload');
  }

  /**
   * @hidden
   * DOM WRITE
   */
  _destroy() {
    assert(this._state !== STATE_DESTROYED, 'view state must be ATTACHED');

    const element = this.element;
    if (element) {
      // completely destroy this component. boom.
      // TODO
      // this._cmp.destroy();
      element.remove();
    }

    this._nav = this._cntDir = this._leavingOpts = null;
    this._state = STATE_DESTROYED;
  }

  /**
   * Get the index of the current component in the current navigation stack.
   * @returns {number} Returns the index of this page within its `NavController`.
   */
  get index(): number {
    return (this._nav ? this._nav.indexOf(this) : -1);
  }

  /**
   * @hidden
   */
  _lifecycleTest(_lifecycle: string): Promise<any> {
    // const instance = this.instance;
    // const methodName = 'ionViewCan' + lifecycle;
    // if (instance && instance[methodName]) {
    //   try {
    //     const result = instance[methodName]();
    //     if (result instanceof Promise) {
    //       return result;
    //     } else {
    //       // Any value but explitic false, should be true
    //       return Promise.resolve(result !== false);
    //     }

    //   } catch (e) {
    //     return Promise.reject(`${this.name} ${methodName} error: ${e.message}`);
    //   }
    // }
    return Promise.resolve(true);
  }

  _lifecycle(lifecycle: string) {
    const event = new CustomEvent(`ionView${lifecycle}`, {
      bubbles: false,
      cancelable: false
    });
    this.element.dispatchEvent(event);
  }

}

export function isViewController(viewCtrl: any): viewCtrl is ViewController {
  return !!(viewCtrl && (<ViewController>viewCtrl)._didLoad && (<ViewController>viewCtrl)._willUnload);
}
