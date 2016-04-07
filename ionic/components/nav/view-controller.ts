import {Output, EventEmitter, Type, TemplateRef, ViewContainerRef, ElementRef, Renderer} from 'angular2/core';

import {Navbar} from '../navbar/navbar';
import {NavController, NavOptions} from './nav-controller';
import {NavParams} from './nav-params';
import {isPresent} from '../../util/util';


/**
 * @name ViewController
 * @description
 * Access various features and information about the current view
 * @usage
 *  ```ts
 *  import {Page, ViewController} from 'ionic-angular';
 *  @Page....
 *  export class MyPage{
 *   constructor(viewCtrl: ViewController){
 *     this.viewCtrl = viewCtrl;
 *   }
 *  }
 *  ```
 */
export class ViewController {
  private _cntDir: any;
  private _cntRef: ElementRef;
  private _destroys: Array<Function> = [];
  private _hdAttr: string = null;
  private _leavingOpts: NavOptions = null;
  private _loaded: boolean = false;
  private _nbDir: Navbar;
  private _nbTmpRef: TemplateRef;
  private _nbVwRef: ViewContainerRef;
  private _onDismiss: Function = null;
  private _pgRef: ElementRef;
  protected _nav: NavController;

  /**
   * @private
   */
  data: any;

  /**
   * @private
   */
  id: string;

  /**
   * @private
   */
  instance: any = {};

  /**
   * @private
   */
  state: string = '';

  /**
   * @private
   */
  viewType: string = '';

  /**
   * @private
   */
  onReady: Function;

  /**
   * @private
   * If this is currently the active view, then set to false
   * if it does not want the other views to fire their own lifecycles.
   */
  fireOtherLifecycles: boolean = true;

  /**
   * @private
   */
  isOverlay: boolean = false;

  /**
   * @private
   */
  usePortal: boolean = false;

  /**
   * @private
   */
  zIndex: number;

  /**
   * @private
   */
  @Output() private _emitter: EventEmitter<any> = new EventEmitter();

  constructor(public componentType?: Type, data?: any) {
    // passed in data could be NavParams, but all we care about is its data object
    this.data = (data instanceof NavParams ? data.data : (isPresent(data) ? data : {}));
  }

  subscribe(generatorOrNext?: any): any {
    return this._emitter.subscribe(generatorOrNext);
  }

  /**
   * @private
   */
  emit(data?: any) {
    this._emitter.emit(data);
  }

  onDismiss(callback: Function) {
    this._onDismiss = callback;
  }

  dismiss(data?: any, role?: any) {
    return this._nav.remove(this._nav.indexOf(this), 1, this._leavingOpts).then(() => {
      this._onDismiss && this._onDismiss(data, role);
      return data;
    });
  }

  /**
   * @private
   */
  setNav(navCtrl: NavController) {
    this._nav = navCtrl;
  }

  /**
   * @private
   */
  getTransitionName(direction: string): string {
    return this._nav && this._nav.config.get('pageTransition');
  }

  /**
   * @private
   */
  getNavParams(): NavParams {
    return new NavParams(this.data);
  }

  /**
   * @private
   */
  setLeavingOpts(opts: NavOptions) {
    this._leavingOpts = opts;
  }

  /**
   * Check to see if you can go back in the navigation stack
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
   * @private
   */
  setInstance(instance: any) {
    this.instance = instance;
  }

  /**
   * @private
   */
  get name(): string {
    return this.componentType ? this.componentType['name'] : '';
  }

  /**
   * You can find out the index of the current view is in the current navigation stack
   *
   * ```typescript
   *  export class Page1 {
   *    constructor(view: ViewController){
   *      this.view = view;
   *      // Just log out the index
   *      console.log(this.view.index);
   *    }
   *  }
   * ```
   *
   * @returns {number} Returns the index of this page within its NavController.
   */
  get index(): number {
    return (this._nav ? this._nav.indexOf(this) : -1);
  }

  /**
   * @private
   */
  private isRoot(): boolean {
    // deprecated warning
    console.warn('ViewController isRoot() has been renamed to isFirst()');
    return this.isFirst();
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
   * @private
   */
  domShow(shouldShow: boolean, renderer: Renderer) {
    // using hidden element attribute to display:none and not render views
    // renderAttr of '' means the hidden attribute will be added
    // renderAttr of null means the hidden attribute will be removed
    // doing checks to make sure we only make an update to the element when needed
    if (this._pgRef &&
        (shouldShow && this._hdAttr === '' ||
        !shouldShow && this._hdAttr !== '')) {

      this._hdAttr = (shouldShow ? null : '');

      renderer.setElementAttribute(this._pgRef.nativeElement, 'hidden', this._hdAttr);

      let navbarRef = this.navbarRef();
      if (navbarRef) {
        renderer.setElementAttribute(navbarRef.nativeElement, 'hidden', this._hdAttr);
      }
    }
  }

  /**
   * @private
   */
  setZIndex(zIndex: number, renderer: Renderer) {
    if (this._pgRef && zIndex !== this.zIndex) {
      this.zIndex = zIndex;
      renderer.setElementStyle(this._pgRef.nativeElement, 'z-index', zIndex.toString());
    }
  }

  /**
   * @private
   */
  setNavbarTemplateRef(templateRef: TemplateRef) {
    this._nbTmpRef = templateRef;
  }

  /**
   * @private
   */
  getNavbarTemplateRef(): TemplateRef {
    return this._nbTmpRef;
  }

  /**
   * @private
   */
  getNavbarViewRef() {
    return this._nbVwRef;
  }

  /**
   * @private
   */
  setNavbarViewRef(viewContainerRef: ViewContainerRef) {
    this._nbVwRef = viewContainerRef;
  }

  /**
   * @private
   */
  setPageRef(elementRef: ElementRef) {
    this._pgRef = elementRef;
  }

  /**
   * @private
   * @returns {elementRef} Returns the Page's ElementRef
   */
  pageRef(): ElementRef {
    return this._pgRef;
  }

  /**
   * @private
   */
  setContentRef(elementRef: ElementRef) {
    this._cntRef = elementRef;
  }

  /**
   * @private
   * @returns {elementRef} Returns the Page's Content ElementRef
   */
  contentRef(): ElementRef {
    return this._cntRef;
  }

  /**
   * @private
   */
  setContent(directive) {
    this._cntDir = directive;
  }

  /**
   * @private
   * @returns {component} Returns the Page's Content component reference.
   */
  getContent() {
    return this._cntDir;
  }

  /**
   * @private
   */
  setNavbar(directive: Navbar) {
    this._nbDir = directive;
  }

  /**
   * @private
   */
  getNavbar() {
    return this._nbDir;
  }

  /**
   * You can find out of the current view has a Navbar or not. Be sure to wrap this in an `onPageWillEnter` method in order to make sure the view has rendered fully.
   *
   * ```typescript
   * export class Page1 {
   *  constructor(view: ViewController) {
   *    this.view = view
   *  }
   *  onPageWillEnter(){
   *    console.log('Do we have a Navbar?', this.view.hasNavbar());
   *  }
   *}
   * ```
   *
   * @returns {boolean} Returns a boolean if this Page has a navbar or not.
   */
  hasNavbar(): boolean {
    return !!this.getNavbar();
  }

  /**
   * @private
   */
  navbarRef(): ElementRef {
    let navbar = this.getNavbar();
    return navbar && navbar.getElementRef();
  }

  /**
   * @private
   */
  titleRef(): ElementRef {
    let navbar = this.getNavbar();
    return navbar && navbar.getTitleRef();
  }

  /**
   * @private
   */
  navbarItemRefs(): Array<ElementRef> {
    let navbar = this.getNavbar();
    return navbar && navbar.getItemRefs();
  }

  /**
   * @private
   */
  backBtnRef(): ElementRef {
    let navbar = this.getNavbar();
    return navbar && navbar.getBackButtonRef();
  }

  /**
   * @private
   */
  backBtnTextRef(): ElementRef {
    let navbar = this.getNavbar();
    return navbar && navbar.getBackButtonTextRef();
  }

  /**
   * @private
   */
  navbarBgRef(): ElementRef {
    let navbar = this.getNavbar();
    return navbar && navbar.getBackgroundRef();
  }

  /**
   * You can change the text of the back button on a view-by-view basis.
   *
   * ```ts
   * export class MyClass{
   *  constructor(viewCtrl: ViewController){
   *    this.viewCtrl = viewCtrl
   *  }
   *  onPageWillEnter() {
   *    this.viewCtrl.setBackButtonText('Previous');
   *  }
   * }
   * ```
   * Make sure you use the view events when calling this method, otherwise the back-button will not have been created
   *
   * @param {string} backButtonText Set the back button text.
   */
  setBackButtonText(val: string) {
    let navbar = this.getNavbar();
    if (navbar) {
      navbar.setBackButtonText(val);
    }
  }

  /**
   * Set if the back button for the current view is visible or not. Be sure to wrap this in `onPageWillEnter` to make sure the has been compleltly rendered.
   * @param {boolean} Set if this Page's back button should show or not.
   */
  showBackButton(shouldShow: boolean) {
    let navbar = this.getNavbar();
    if (navbar) {
      navbar.hideBackButton = !shouldShow;
    }
  }

  /**
   * @private
   */
  isLoaded(): boolean {
    return this._loaded;
  }

  /**
   * @private
   * The view has loaded. This event only happens once per view being
   * created. If a view leaves but is cached, then this will not
   * fire again on a subsequent viewing. This method is a good place
   * to put your setup code for the view; however, it is not the
   * recommended method to use when a view becomes active.
   */
  loaded() {
    this._loaded = true;
    ctrlFn(this, 'onPageLoaded');
  }

  /**
   * @private
   * The view is about to enter and become the active view.
   */
  willEnter() {
    ctrlFn(this, 'onPageWillEnter');
  }

  /**
   * @private
   * The view has fully entered and is now the active view. This
   * will fire, whether it was the first load or loaded from the cache.
   */
  didEnter() {
    let navbar = this.getNavbar();
    navbar && navbar.didEnter();
    ctrlFn(this, 'onPageDidEnter');
  }

  /**
   * @private
   * The view has is about to leave and no longer be the active view.
   */
  willLeave() {
    ctrlFn(this, 'onPageWillLeave');
  }

  /**
   * @private
   * The view has finished leaving and is no longer the active view. This
   * will fire, whether it is cached or unloaded.
   */
  didLeave() {
    ctrlFn(this, 'onPageDidLeave');
  }

  /**
   * @private
   * The view is about to be destroyed and have its elements removed.
   */
  willUnload() {
    ctrlFn(this, 'onPageWillUnload');
  }

  /**
   * @private
   */
  addDestroy(destroyFn: Function) {
    this._destroys.push(destroyFn);
  }

  /**
   * @private
   */
  destroy() {
    ctrlFn(this, 'onPageDidUnload');

    for (var i = 0; i < this._destroys.length; i++) {
      this._destroys[i]();
    }
    this._destroys = [];
  }

}

function ctrlFn(viewCtrl: ViewController, fnName: string) {
  if (viewCtrl.instance && viewCtrl.instance[fnName]) {
    try {
      viewCtrl.instance[fnName]();
    } catch (e) {
      console.error(viewCtrl.name + ' ' + fnName + ': ' + e.message);
    }
  }
}
