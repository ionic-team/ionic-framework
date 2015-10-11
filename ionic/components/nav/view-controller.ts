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
    this.disposals = [];
  }

  setContent(content) {
    this._content = content;
  }

  getContent() {
    return this._content;
  }

  /**
   * @private
   */
  stage(done) {
    let navCtrl = this.navCtrl;

    if (this.instance || !navCtrl || this.shouldDestroy) {
      // already compiled this view
      return done();
    }

    // compile the component and create a ProtoViewRef
    navCtrl.compileView(this.componentType).then(hostProtoViewRef => {

      if (this.shouldDestroy) return done();

      // get the pane the NavController wants to use
      // the pane is where all this content will be placed into
      navCtrl.loadContainer(this.componentType, hostProtoViewRef, this, () => {

        // this ViewController instance has finished loading
        try {
          this.loaded();
        } catch (e) {
          console.error(e);
        }

        done();
      });

    });
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

  /**
   * TODO
   * @param {TODO} instance  TODO
   */
  setInstance(instance) {
    this.instance = instance;
  }

  get index() {
    return (this.navCtrl ? this.navCtrl.indexOf(this) : -1);
  }

  isRoot() {
    return this.index === 0;
  }

  /**
   * TODO
   */
  destroy() {
    for (let i = 0; i < this.disposals.length; i++) {
      this.disposals[i]();
    }

    this.didUnload();
  }

  /**
   * @private
   */
  setNavbarTemplateRef(templateRef) {
    this._nbTmpRef = templateRef;
  }

  /**
   * @private
   */
  getNavbarTemplateRef() {
    return this._nbTmpRef;
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  setContentRef(contentElementRef) {
    this._cntRef = contentElementRef;
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  contentRef() {
    return this._cntRef;
  }

  setNavbar(navbarView) {
    this._nbVw = navbarView;
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  getNavbar() {
    return this._nbVw;
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  navbarRef() {
    let navbar = this.getNavbar();
    return navbar && navbar.getElementRef();
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  titleRef() {
    let navbar = this.getNavbar();
    return navbar && navbar.getTitleRef();
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  navbarItemRefs() {
    let navbar = this.getNavbar();
    return navbar && navbar.getItemRefs();
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  backBtnRef() {
    let navbar = this.getNavbar();
    return navbar && navbar.getBackButtonRef();
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  backBtnTextRef() {
    let navbar = this.getNavbar();
    return navbar && navbar.getBackButtonTextRef();
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  navbarBgRef() {
    let navbar = this.getNavbar();
    return navbar && navbar.getNativeElement().querySelector('.toolbar-background');
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

}
