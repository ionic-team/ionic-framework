import { ComponentRef, ElementRef, EventEmitter, Output, Renderer } from '@angular/core';

import { Footer, Header } from '../components/toolbar/toolbar';
import { isPresent, merge } from '../util/util';
import { Navbar } from '../components/navbar/navbar';
import { NavControllerBase } from './nav-controller-base';
import { NavOptions, ViewState } from './nav-util';
import { NavParams } from './nav-params';


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
  private _cntRef: ElementRef;
  private _tbRefs: ElementRef[] = [];
  private _hdrDir: Header;
  private _ftrDir: Footer;
  private _hidden: string = null;
  private _leavingOpts: NavOptions = null;
  private _nb: Navbar;
  private _onDidDismiss: Function = null;
  private _onWillDismiss: Function = null;
  private _detached: boolean = false;

  /**
   * Observable to be subscribed to when the current component will become active
   * @returns {Observable} Returns an observable
   */
  willEnter: EventEmitter<any>;

  /**
   * Observable to be subscribed to when the current component has become active
   * @returns {Observable} Returns an observable
   */
  didEnter: EventEmitter<any>;

  /**
   * Observable to be subscribed to when the current component will no longer be active
   * @returns {Observable} Returns an observable
   */
  willLeave: EventEmitter<any>;

  /**
   * Observable to be subscribed to when the current component is no long active
   * @returns {Observable} Returns an observable
   */
  didLeave: EventEmitter<any>;

  /**
   * Observable to be subscribed to when the current component has been destroyed
   * @returns {Observable} Returns an observable
   */
  willUnload: EventEmitter<any>;

  /**
   * @internal
   */
  data: any;

  /**
   * @internal
   */
  id: string;

  /**
   * @internal
   */
  isOverlay: boolean = false;

  /**
   * @internal
   */
  _cmp: ComponentRef<any>;

  /**
   * @internal
   */
  _nav: NavControllerBase;

  /**
   * @internal
   */
  _zIndex: number;

  /**
   * @internal
   */
  _state: ViewState;

  /**
   * @internal
   */
  @Output() private _emitter: EventEmitter<any> = new EventEmitter();

  constructor(public componentType?: any, data?: any) {
    // passed in data could be NavParams, but all we care about is its data object
    this.data = (data instanceof NavParams ? data.data : (isPresent(data) ? data : {}));

    this.willEnter = new EventEmitter();
    this.didEnter = new EventEmitter();
    this.willLeave = new EventEmitter();
    this.didLeave = new EventEmitter();
    this.willUnload = new EventEmitter();
  }

  /**
   * @internal
   * DOM WRITE
   */
  init(componentRef: ComponentRef<any>) {
    this._cmp = componentRef;
    this._detached = false;
  }

  /**
   * @internal
   */
  _setInstance(instance: any) {
    if (this._cmp) {
      this._cmp.instance = instance;
    }
  }

  /**
   * @internal
   */
  subscribe(generatorOrNext?: any): any {
    return this._emitter.subscribe(generatorOrNext);
  }

  /**
   * @internal
   */
  emit(data?: any) {
    this._emitter.emit(data);
  }

  /**
   * @private
   * onDismiss(..) has been deprecated. Please use onDidDismiss(..) instead
   */
  onDismiss(callback: Function) {
    // deprecated warning: added beta.11 2016-06-30
    console.warn('onDismiss(..) has been deprecated. Please use onDidDismiss(..) instead');
    this.onDidDismiss(callback);
  }

  /**
   * onDidDismiss
   */
  onDidDismiss(callback: Function) {
    this._onDidDismiss = callback;
  }

  /**
   * onWillDismiss
   */
  onWillDismiss(callback: Function) {
    this._onWillDismiss = callback;
  }

  /**
   * dismiss
   */
  dismiss(data?: any, role?: any, navOptions: NavOptions = {}) {
    let options = merge({}, this._leavingOpts, navOptions);
    this._onWillDismiss && this._onWillDismiss(data, role);
    return this._nav.remove(this._nav.indexOf(this), 1, options).then(() => {
      this._onDidDismiss && this._onDidDismiss(data, role);
      return data;
    });
  }

  /**
   * @internal
   */
  _setNav(navCtrl: NavControllerBase) {
    this._nav = navCtrl;
  }

  /**
   * @private
   */
  getNav() {
    return this._nav;
  }

  /**
   * @internal
   */
  getTransitionName(direction: string): string {
    return this._nav && this._nav.config.get('pageTransition');
  }

  /**
   * @internal
   */
  getNavParams(): NavParams {
    return new NavParams(this.data);
  }

  /**
   * @internal
   */
  setLeavingOpts(opts: NavOptions) {
    this._leavingOpts = opts;
  }

  /**
   * Check to see if you can go back in the navigation stack.
   * @param {boolean} Check whether or not you can go back from this page
   * @returns {boolean} Returns if it's possible to go back from this Page.
   */
  enableBack(): boolean {
    // update if it's possible to go back from this nav item
    if (this._nav) {
      let previousItem = this._nav.getPrevious(this);
      // the previous view may exist, but if it's about to be destroyed
      // it shouldn't be able to go back to
      return !!(previousItem);
    }
    return false;
  }

  /**
   * @internal
   */
  get name(): string {
    return this.componentType ? this.componentType.name : '';
  }

  /**
   * Get the index of the current component in the current navigation stack.
   * @returns {number} Returns the index of this page within its `NavController`.
   */
  get index(): number {
    return (this._nav ? this._nav.indexOf(this) : -1);
  }

  /**
   * @returns {boolean} Returns if this Page is the first in the stack of pages within its NavController.
   */
  isFirst(): boolean {
    return (this._nav ? this._nav.first() === this : false);
  }

  /**
   * @returns {boolean} Returns if this Page is the last in the stack of pages within its NavController.
   */
  isLast(): boolean {
    return (this._nav ? this._nav.last() === this : false);
  }

  /**
   * @internal
   * DOM WRITE
   */
  _domShow(shouldShow: boolean, renderer: Renderer) {
    // using hidden element attribute to display:none and not render views
    // _hidden value of '' means the hidden attribute will be added
    // _hidden value of null means the hidden attribute will be removed
    // doing checks to make sure we only update the DOM when actually needed
    if (this._cmp) {
      // if it should render, then the hidden attribute should not be on the element
      if (shouldShow && this._hidden === '' || !shouldShow && this._hidden !== '') {
        this._hidden = (shouldShow ? null : '');
        // ******** DOM WRITE ****************
        renderer.setElementAttribute(this.pageRef().nativeElement, 'hidden', this._hidden);
      }
    }
  }

  /**
   * @internal
   * DOM WRITE
   */
  _setZIndex(zIndex: number, renderer: Renderer) {
    if (this._cmp && zIndex !== this._zIndex) {
      this._zIndex = zIndex;
      // ******** DOM WRITE ****************
      renderer.setElementStyle(this.pageRef().nativeElement, 'z-index', (<any>zIndex));
    }
  }

  /**
   * @returns {ElementRef} Returns the Page's ElementRef.
   */
  pageRef(): ElementRef {
    return this._cmp && this._cmp.location;
  }

  /**
   * @internal
   */
  _setContent(directive: any) {
    this._cntDir = directive;
  }

  /**
   * @returns {component} Returns the Page's Content component reference.
   */
  getContent() {
    return this._cntDir;
  }

  /**
   * @internal
   */
  _setContentRef(elementRef: ElementRef) {
    this._cntRef = elementRef;
  }

  /**
   * @returns {ElementRef} Returns the Content's ElementRef.
   */
  contentRef(): ElementRef {
    return this._cntRef;
  }

  /**
   * @internal
   */
  _setHeader(directive: Header) {
    this._hdrDir = directive;
  }

  /**
   * @private
   */
  getHeader() {
    return this._hdrDir;
  }

  /**
   * @internal
   */
  _setFooter(directive: Footer) {
    this._ftrDir = directive;
  }

  /**
   * @private
   */
  getFooter() {
    return this._ftrDir;
  }

  /**
   * @internal
   */
  _setNavbar(directive: Navbar) {
    this._nb = directive;
  }

  /**
   * @private
   */
  getNavbar(): Navbar {
    return this._nb;
  }

  /**
   * Find out if the current component has a NavBar or not. Be sure
   * to wrap this in an `ionViewWillEnter` method in order to make sure
   * the view has rendered fully.
   * @returns {boolean} Returns a boolean if this Page has a navbar or not.
   */
  hasNavbar(): boolean {
    return !!this._nb;
  }

  /**
   * Change the title of the back-button. Be sure to call this
   * after `ionViewWillEnter` to make sure the  DOM has been rendered.
   * @param {string} backButtonText Set the back button text.
   */
  setBackButtonText(val: string) {
    this._nb && this._nb.setBackButtonText(val);
  }

  /**
   * Set if the back button for the current view is visible or not. Be sure to call this
   * after `ionViewWillEnter` to make sure the  DOM has been rendered.
   * @param {boolean} Set if this Page's back button should show or not.
   */
  showBackButton(shouldShow: boolean) {
    if (this._nb) {
      this._nb.hideBackButton = !shouldShow;
    }
  }

  /**
   * @internal
   * The view has loaded. This event only happens once per view being
   * created. If a view leaves but is cached, then this will not
   * fire again on a subsequent viewing. This method is a good place
   * to put your setup code for the view; however, it is not the
   * recommended method to use when a view becomes active.
   */
  _didLoad() {
    // deprecated warning: added 2016-08-14, beta.12
    if (this._cmp && this._cmp.instance.ionViewLoaded) {
      try {
        console.warn('ionViewLoaded() has been deprecated. Please rename to ionViewDidLoad()');
        this._cmp.instance.ionViewLoaded();
      } catch (e) {
        console.error(this.name + ' iionViewLoaded: ' + e.message);
      }
    }

    ctrlFn(this, 'DidLoad');
  }

  /**
   * @internal
   * The view is about to enter and become the active view.
   */
  _willEnter() {
    if (this._detached && this._cmp) {
      // ensure this has been re-attached to the change detector
      this._cmp.changeDetectorRef.reattach();
      this._detached = false;
    }

    this.willEnter.emit();
    ctrlFn(this, 'WillEnter');
  }

  /**
   * @internal
   * The view has fully entered and is now the active view. This
   * will fire, whether it was the first load or loaded from the cache.
   */
  _didEnter() {
    this._nb && this._nb.didEnter();
    this.didEnter.emit();
    ctrlFn(this, 'DidEnter');
  }

  /**
   * @internal
   * The view has is about to leave and no longer be the active view.
   */
  _willLeave() {
    this.willLeave.emit();
    ctrlFn(this, 'WillLeave');
  }

  /**
   * @internal
   * The view has finished leaving and is no longer the active view. This
   * will fire, whether it is cached or unloaded.
   */
  _didLeave() {
    // when this is not the active page
    // we no longer need to detect changes
    if (!this._detached && this._cmp) {
      this._cmp.changeDetectorRef.detach();
      this._detached = true;
    }

    this.didLeave.emit();
    ctrlFn(this, 'DidLeave');
  }

  /**
   * @internal
   */
  _willUnload() {
    this.willUnload.emit();

    ctrlFn(this, 'WillUnload');

    // deprecated warning: added 2016-08-14, beta.12
    if (this._cmp && this._cmp.instance.ionViewDidUnload) {
      console.warn('ionViewDidUnload() has been deprecated. Please use ionViewWillUnload() instead');
      try {
        this._cmp.instance.ionViewDidUnload();
      } catch (e) {
        console.error(this.name + ' ionViewDidUnload: ' + e.message);
      }
    }
  }

  /**
   * @internal
   * DOM WRITE
   */
  _destroy(renderer: Renderer) {
    if (this._cmp) {
      // ensure the element is cleaned up for when the view pool reuses this element
      // ******** DOM WRITE ****************
      renderer.setElementAttribute(this._cmp.location.nativeElement, 'class', null);
      renderer.setElementAttribute(this._cmp.location.nativeElement, 'style', null);

      // completely destroy this component. boom.
      this._cmp.destroy();
    }

    if (this._nav) {
      // remove it from the nav
      const index = this._nav.indexOf(this);
      if (index > -1) {
        this._nav._views.splice(index, 1);
      }
    }

    this._nav = this._cmp = this._cntDir = this._cntRef = this._tbRefs = this._hdrDir = this._ftrDir = this._nb = this._onDidDismiss = this._onWillDismiss = null;
  }

  /**
   * @internal
   */
  _lifecycleTest(lifecycle: string): boolean | string | Promise<any> {
    let result: any = true;

    if (this._cmp && this._cmp.instance && this._cmp.instance['ionViewCan' + lifecycle]) {
      try {
        result = this._cmp.instance['ionViewCan' + lifecycle]();

      } catch (e) {
        console.error(`${this.name} ionViewCan${lifecycle} error: ${e}`);
        result = false;
      }
    }
    return result;
  }

}


function ctrlFn(viewCtrl: ViewController, fnName: string) {
  if (viewCtrl._cmp) {
    // fire off ionView lifecycle instance method
    if (viewCtrl._cmp.instance['ionView' + fnName]) {
      try {
        viewCtrl._cmp.instance['ionView' + fnName]();
      } catch (e) {
        console.error(viewCtrl.name + ' ionView' + fnName + ': ' + e.message);
      }
    }
  }
}


export function isViewController(viewCtrl: any) {
  return !!(viewCtrl && (<ViewController>viewCtrl).componentType && (<ViewController>viewCtrl)._nav);
}
