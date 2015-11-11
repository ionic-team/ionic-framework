import {NavParams} from './nav-controller';


/**
 * TODO
 */
export class ViewController {

  constructor(navCtrl, componentType, params = {}) {
    this.navCtrl = navCtrl;
    this.componentType = componentType;
    this.params = new NavParams(params);
    this.instance = null;
    this.state = 0;
    this._destroys = [];
  }

  /**
   * TODO
   * @returns {boolean} TODO
   */
  enableBack() {
    // update if it's possible to go back from this nav item
    if (this.navCtrl) {
      let previousItem = this.navCtrl.getPrevious(this);
      // the previous view may exist, but if it's about to be destroyed
      // it shouldn't be able to go back to
      return !!(previousItem && !previousItem.shouldDestroy);
    }
    return false;
  }

  setInstance(instance) {
    this.instance = instance;
  }

  get index() {
    return (this.navCtrl ? this.navCtrl.indexOf(this) : -1);
  }

  isRoot() {
    return this.index === 0;
  }

  addDestroy(destroyFn) {
    this._destroys.push(destroyFn);
  }

  destroy() {
    for (let i = 0; i < this._destroys.length; i++) {
      this._destroys[i]();
    }
    this._destroys = [];
  }

  setNavbarTemplateRef(templateRef) {
    this._nbTmpRef = templateRef;
  }

  getNavbarTemplateRef() {
    return this._nbTmpRef;
  }

  getNavbarViewRef() {
    return this._nbVwRef;
  }

  setNavbarViewRef(viewContainerRef) {
    this._nbVwRef = viewContainerRef;
  }

  setPageRef(elementRef) {
    this._pgRef = elementRef;
  }

  pageRef() {
    return this._pgRef;
  }

  setContentRef(elementRef) {
    this._cntRef = elementRef;
  }

  contentRef() {
    return this._cntRef;
  }

  setContent(directive) {
    this._cntDir = directive;
  }

  getContent() {
    return this._cntDir;
  }

  setNavbar(directive) {
    this._nbDir = directive;
  }

  getNavbar() {
    return this._nbDir;
  }

  hasNavbar() {
    return !!this.getNavbar();
  }

  navbarRef() {
    let navbar = this.getNavbar();
    return navbar && navbar.getElementRef();
  }

  titleRef() {
    let navbar = this.getNavbar();
    return navbar && navbar.getTitleRef();
  }

  navbarItemRefs() {
    let navbar = this.getNavbar();
    return navbar && navbar.getItemRefs();
  }

  backBtnRef() {
    let navbar = this.getNavbar();
    return navbar && navbar.getBackButtonRef();
  }

  backBtnTextRef() {
    let navbar = this.getNavbar();
    return navbar && navbar.getBackButtonTextRef();
  }

  navbarBgRef() {
    let navbar = this.getNavbar();
    return navbar && navbar.getBackgroundRef();
  }

  hideBackButton(shouldHide) {
    let navbar = this.getNavbar();
    if (navbar) {
      navbar.hideBackButton = !!shouldHide;
    }
  }

  /**
   * The view has loaded. This event only happens once per view being
   * created. If a view leaves but is cached, then this will not
   * fire again on a subsequent viewing. This method is a good place
   * to put your setup code for the view; however, it is not the
   * recommended method to use when a view becomes active.
   */
  loaded() {
    if (!this.shouldDestroy) {
      this.instance && this.instance.onPageLoaded && this.instance.onPageLoaded();
    }
  }

  /**
   * The view is about to enter and become the active view.
   */
  willEnter() {
    if (!this.shouldDestroy) {
      this.instance && this.instance.onPageWillEnter && this.instance.onPageWillEnter();
    }
  }

  /**
   * The view has fully entered and is now the active view. This
   * will fire, whether it was the first load or loaded from the cache.
   */
  didEnter() {
    let navbar = this.getNavbar();
    navbar && navbar.didEnter();
    this.instance && this.instance.onPageDidEnter && this.instance.onPageDidEnter();
  }

  /**
   * The view has is about to leave and no longer be the active view.
   */
  willLeave() {
    this.instance && this.instance.onPageWillLeave && this.instance.onPageWillLeave();
  }

  /**
   * The view has finished leaving and is no longer the active view. This
   * will fire, whether it is cached or unloaded.
   */
  didLeave() {
    this.instance && this.instance.onPageDidLeave && this.instance.onPageDidLeave();
  }

  /**
   * The view is about to be destroyed and have its elements removed.
   */
  willUnload() {
    this.instance && this.instance.onPageWillUnload && this.instance.onPageWillUnload();
  }

  /**
   * The view has been destroyed and its elements have been removed.
   */
  didUnload() {
    this.instance && this.instance.onPageDidUnload && this.instance.onPageDidUnload();
  }

  domCache(isActiveView, isPreviousView) {
    if (this.instance) {
      this.instance._hidden = (!isActiveView && !isPreviousView);
    }
  }

}
