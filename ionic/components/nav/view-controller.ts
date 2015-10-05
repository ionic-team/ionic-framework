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

    this.navbarTemplateRef = null;
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

    if (this.instance || !navCtrl) {
      // already compiled this view
      return done();
    }

    // compile the componenet and create a ProtoViewRef
    navCtrl.compileView(this.componentType).then(hostProtoViewRef => {

      // get the pane the NavController wants to use
      // the pane is where all this content will be placed into
      navCtrl.loadContainer(hostProtoViewRef, this.componentType, this, () => {

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

    // just to help prevent any possible memory leaks
    for (let name in this) {
      if (this.hasOwnProperty(name)) {
        this[name] = null;
      }
    }
  }

  /**
   * @private
   */
  setNavbarTemplateRef(templateRef) {
    this.navbarTemplateRef = templateRef;
  }

  /**
   * @private
   */
  getNavbarTemplateRef() {
    return this.navbarTemplateRef;
  }

  /**
   * TODO
   * @param {TODO} val  TODO
   * @returns {TODO} TODO
   */
  viewElementRef(val) {
    if (arguments.length) {
      this._vwEle = val;
    }
    return this._vwEle;
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  navbarView() {
    if (arguments.length) {
      this._nbView = arguments[0];
    }
    return this._nbView;
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  navbarRef() {
    let navbarView = this.navbarView();
    if (navbarView) {
      return navbarView.getElementRef();
    }
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  titleRef() {
    let navbarView = this.navbarView();
    if (navbarView) {
      return navbarView.getTitleRef();
    }
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  navbarItemRefs() {
    let navbarView = this.navbarView();
    if (navbarView) {
      return navbarView.getItemRefs();
    }
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  backBtnRef() {
    let navbarView = this.navbarView();
    if (navbarView) {
      return navbarView.getBackButtonRef();
    }
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  backBtnTextRef() {
    let navbarView = this.navbarView();
    if (navbarView) {
      return navbarView.getBackButtonTextRef();
    }
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  navbarBgRef() {
    let navbarView = this.navbarView();
    if (navbarView) {
      return navbarView.getNativeElement().querySelector('.toolbar-background');
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
    this.instance && this.instance.onViewLoaded && this.instance.onViewLoaded();
  }

  /**
   * The view is about to enter and become the active view.
   */
  willEnter() {
    this.instance && this.instance.onViewWillEnter && this.instance.onViewWillEnter();
  }

  /**
   * The view has fully entered and is now the active view. This
   * will fire, whether it was the first load or loaded from the cache.
   */
  didEnter() {
    let navbarView = this.navbarView();
    if (navbarView) {
      navbarView.didEnter();
    }
    this.instance && this.instance.onViewDidEnter && this.instance.onViewDidEnter();
  }

  /**
   * The view has is about to leave and no longer be the active view.
   */
  willLeave() {
    this.instance && this.instance.onViewWillLeave && this.instance.onViewWillLeave();
  }

  /**
   * The view has finished leaving and is no longer the active view. This
   * will fire, whether it is cached or unloaded.
   */
  didLeave() {
    this.instance && this.instance.onViewDidLeave && this.instance.onViewDidLeave();
  }

  /**
   * The view is about to be destroyed and have its elements removed.
   */
  willUnload() {
    this.instance && this.instance.onViewWillUnload && this.instance.onViewWillUnload();
  }

  /**
   * The view has been destroyed and its elements have been removed.
   */
  didUnload() {
    this.instance && this.instance.onViewDidUnload && this.instance.onViewDidUnload();
  }

}
