import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {bind} from 'angular2/di';

import {ViewController} from '../view/view-controller';
import {NavController} from '../nav/nav-controller';
import {NavParams} from '../nav/nav-params';


export class ViewItem {

  constructor(viewCtrl, ComponentClass, params = {}) {
    this.viewCtrl = viewCtrl;
    this.ComponentClass = ComponentClass;
    this.params = new NavParams(params);
    this.instance = null;
    this.state = 0;
    this.disposals = [];

    this.protos = {};
    this._nbItms = [];
    this._promises = [];
  }

  addProtoViewRef(name, protoViewRef) {
    this.protos[name] = protoViewRef;
  }

  stage(callback) {
    let viewCtrl = this.viewCtrl;

    if (this.instance || !viewCtrl) {
      // already compiled this view
      return callback();
    }

    // compile the Component
    viewCtrl.compiler.compileInHost(this.ComponentClass).then(componentProtoViewRef => {

      // figure out the sturcture of this Component
      // does it have a navbar? Is it tabs? Should it not have a navbar or any toolbars?
      let itemStructure = this.sturcture = this.inspectStructure(componentProtoViewRef);

      // get the appropriate Pane which this ViewItem will fit into
      viewCtrl.panes.get(itemStructure, pane => {
        this.pane = pane;

        // create a new injector just for this ViewItem
        let injector = viewCtrl.injector.resolveAndCreateChild([
          bind(ViewController).toValue(viewCtrl),
          bind(NavController).toValue(viewCtrl.navCtrl),
          bind(NavParams).toValue(this.params),
          bind(ViewItem).toValue(this)
        ]);

        // add the content of the view to the content area
        // it will already have the correct context
        let contentContainer = pane.contentContainerRef;
        let hostViewRef = contentContainer.create(componentProtoViewRef, -1, null, injector);

        // get the component's instance, and set it to the this ViewItem
        this.setInstance( viewCtrl.loader._viewManager.getComponent(new ElementRef(hostViewRef, 0)) );
        this.setViewElement( hostViewRef._view.render._view.rootNodes[0] );

        // remember how to dispose of this reference
        this.disposals.push(() => {
          contentContainer.remove( contentContainer.indexOf(hostViewRef) );
        });

        // get the view's context so when creating the navbar
        // it uses the same context as the content
        let context = {
          boundElementIndex: 0,
          parentView: {
            _view: hostViewRef._view.componentChildViews[0]
          }
        };

        // get the item container's nav bar
        let navbarViewContainer = viewCtrl.navbarViewContainer();

        // get the item's navbar protoview
        let navbarProtoView = this.protos.navbar;

        // add a navbar view if the pane has a navbar container, and the
        // item's instance has a navbar protoview to go to inside of it
        if (navbarViewContainer && navbarProtoView) {
          let navbarView = navbarViewContainer.create(navbarProtoView, -1, context, injector);

          this.disposals.push(() => {
            navbarViewContainer.remove( navbarViewContainer.indexOf(navbarView) );
          });
        }

        // this item has finished loading
        this.loaded();

        // fire callback when all child promises have been resolved
        Promise.all(this._promises).then(() => {
          callback();
          this._promises = [];
        });

      });

    });
  }

  addPromise(childPromise) {
    this._promises.push(childPromise);
  }

  inspectStructure(componentProtoViewRef) {
    let navbar = false;
    let tabs = false;
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

    if (this.viewCtrl.childNavbar()) {
      navbar = false;
    }

    if (navbar) key += 'n'
    if (tabs) key += 't'

    return {
      navbar,
      tabs,
      key
    };
  }

  enableBack() {
    // update if it's possible to go back from this nav item
    if (this.viewCtrl) {
      return !!this.viewCtrl.getPrevious(this);
    }
    return false;
  }

  setInstance(instance) {
    this.instance = instance;
  }

  setViewElement(viewEle) {
    this.viewEle = viewEle;
    viewEle && viewEle.classList.add('nav-item');
  }

  cache() {
    this.didCache();
  }

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

  viewElement() {
    return this.viewEle;
  }

  navbarView() {
    if (arguments.length) {
      this._nbView = arguments[0];

    } else if (this._nbView) {
      return this._nbView;
    }

    return {};
  }

  navbarElement() {
    return this.navbarView().element;
  }

  titleElement() {
    return this.navbarView().titleElement;
  }

  backButtonElement() {
    return this.navbarView().backButtonElement;
  }

  navbarItemElements() {
    return this.navbarView().itemElements;
  }


  /*
    The view has loaded. This event only happens once per view being
    created. If a view leaves but is cached, then this will not
    fire again on a subsequent viewing. This method is a good place
    to put your setup code for the view; however, it is not the
    recommended method to use when a view becomes active.
  */
  loaded() {
    this.instance && this.instance.viewLoaded && this.instance.viewLoaded();
  }

  /*
    The view is about to enter and become the active view.
  */
  willEnter() {
    this.instance && this.instance.viewWillEnter && this.instance.viewWillEnter();
  }

  /*
    The view has fully entered and is now the active view. This
    will fire, whether it was the first load or loaded from the cache.
  */
  didEnter() {
    this.pane && this.pane.showPane(true);
    this.instance && this.instance.viewDidEnter && this.instance.viewDidEnter();
  }

  /*
    The view has is about to leave and no longer be the active view.
  */
  willLeave() {
    this.instance && this.instance.viewWillLeave && this.instance.viewWillLeave();
  }

  /*
    The view has finished leaving and is no longer the active view. This
    will fire, whether it is cached or unloaded.
  */
  didLeave() {
    this.instance && this.instance.viewDidLeave && this.instance.viewDidLeave();
  }

  /*
    The view is about to become cached.
  */
  willCache() {
    this.instance && this.instance.viewWillCache && this.instance.viewWillCache();
  }

  /*
    The view is now cached.
  */
  didCache() {
    this.instance && this.instance.viewDidCache && this.instance.viewDidCache();
  }

  /*
    The view is about to be destroyed and have its elements removed.
  */
  willUnload() {
    this.instance && this.instance.viewWillUnload && this.instance.viewWillUnload();
  }

  /*
    The view has been destroyed and its elements have been removed.
  */
  didUnload() {
    this.instance && this.instance.viewDidUnload && this.instance.viewDidUnload();
  }

}

function isComponent(elementBinder, id) {
  return (elementBinder && elementBinder.componentDirective && elementBinder.componentDirective.metadata.id == id);
}
