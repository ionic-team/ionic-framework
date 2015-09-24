import {Component, EventEmitter, ElementRef, bind, Injector, ComponentRef} from 'angular2/angular2';
import {DirectiveBinding} from 'angular2/src/core/compiler/element_injector';

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

    this.protos = {};
    this._nbItms = [];
    this._promises = [];

    this.templateRefs = {};
  }

  /**
   * TODO
   * @param {TODO} name  TODO
   * @param {TODO} protoViewRef  TODO
   */
  addProtoViewRef(name, protoViewRef) {
    this.protos[name] = protoViewRef;
  }

  /**
   * TODO
   * @param {TODO} name  TODO
   * @param {TODO} templateRef  TODO
   */
  addTemplateRef(name, templateRef) {
    this.templateRefs[name] = templateRef;
  }

  /**
   * TODO
   * @param {Function} callback  TODO
   * @returns {TODO} TODO
   */
  stage(callback) {
    let navCtrl = this.navCtrl;

    if (this.instance || !navCtrl) {
      // already compiled this view
      return callback();
    }

    let annotation = new Component({
      selector: 'ion-view',
      host: {
        'class': 'nav-item'
      }
    });

    let ionViewComponentType = DirectiveBinding.createFromType(this.componentType, annotation);

    // create a unique token that works as a cache key
    ionViewComponentType.token = 'ionView' + this.componentType.name;

    // compile the Component
    navCtrl.compiler.compileInHost(ionViewComponentType).then(hostProtoViewRef => {

      // figure out the sturcture of this Component
      // does it have a navbar? Is it tabs? Should it not have a navbar or any toolbars?
      let itemStructure = this.sturcture = this.inspectStructure(hostProtoViewRef);

      // get the appropriate Pane which this ViewController will fit into
      navCtrl.panes.get(itemStructure, pane => {
        this.pane = pane;

        let bindings = navCtrl.bindings.concat(Injector.resolve([
          bind(NavParams).toValue(this.params),
          bind(ViewController).toValue(this)
        ]));

        // add the content of the view to the content area
        // it will already have the correct context
        let contentContainer = pane.contentContainerRef;

        // the same guts as DynamicComponentLoader.loadNextToLocation
        var hostViewRef =
            contentContainer.createHostView(hostProtoViewRef, -1, bindings);
        var newLocation = navCtrl.viewMngr.getHostElement(hostViewRef);
        var newComponent = navCtrl.viewMngr.getComponent(newLocation);
        pane.totalItems++;

        var dispose = () => {
          var index = contentContainer.indexOf(hostViewRef);
          if (index !== -1) {
            contentContainer.remove(index);

            // remove the pane if there are no view items left
            pane.totalItems--;
            if (pane.totalItems === 0) {
              pane.dispose();
            }
          }
        };
        this.disposals.push(dispose);
        var viewComponetRef = new ComponentRef(newLocation, newComponent, dispose);

        // get the component's instance, and set it to the this ViewController
        this.setInstance(viewComponetRef.instance);
        this.viewElementRef(viewComponetRef.location);

        // // get the item container's nav bar
        let navbarViewContainer = navCtrl.navbarViewContainer();

        // // get the item's navbar protoview
        let navbarTemplateRef = this.templateRefs.navbar;

        // add a navbar view if the pane has a navbar container, and the
        // item's instance has a navbar protoview to go to inside of it
        if (navbarViewContainer && navbarTemplateRef) {
          let navbarView = navbarViewContainer.createEmbeddedView(navbarTemplateRef, -1);

          this.disposals.push(() => {
            let index = navbarViewContainer.indexOf(navbarView);
            if (index > -1) {
              navbarViewContainer.remove(index);
            }
          });
        }

        // this item has finished loading
        try {
          this.loaded();
        } catch (e) {
          console.error(e);
        }

        // fire callback when all child promises have been resolved
        Promise.all(this._promises).then(() => {
          callback();
          this._promises = [];
        });

      }, panesErr => {
        console.error(panesErr);
      });

    }, compileInHostErr => {
      console.error(compileInHostErr);
    });
  }

  /**
   * TODO
   * @param {TODO} childPromise  TODO
   */
  addPromise(childPromise) {
    this._promises.push(childPromise);
  }

  /**
   * TODO
   * @param {TODO} componentProtoViewRef  TODO
   */
  inspectStructure(componentProtoViewRef) {
    let navbar = false;
    let key = '_';

    componentProtoViewRef._protoView.elementBinders.forEach(rootElementBinder => {
      if (!rootElementBinder.componentDirective || !rootElementBinder.nestedProtoView) return;

      rootElementBinder.nestedProtoView.elementBinders.forEach(nestedElementBinder => {
        if ( isComponent(nestedElementBinder, 'Tabs') ) {
          navbar = true;
        }
        if (!nestedElementBinder.componentDirective && nestedElementBinder.nestedProtoView) {
          nestedElementBinder.nestedProtoView.elementBinders.forEach(templatedElementBinder => {
            if ( isComponent(templatedElementBinder, 'Navbar') ) {
              navbar = true;
            }
          });
        }
      });
    });

    if (this.navCtrl.childNavbar()) {
      navbar = false;
    }

    if (navbar) key += 'n'

    return {
      navbar,
      key
    };
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
  navbarBackgroundRef() {
    let navbarView = this.navbarView();
    if (navbarView) {
      return navbarView.getNativeElement().querySelector('.toolbar-background');
    }
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  postRender() {
    // the elements are in the DOM and the browser
    // has rendered them in their correct locations
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

function isComponent(elementBinder, id) {
  return (elementBinder && elementBinder.componentDirective && elementBinder.componentDirective.metadata.id == id);
}
