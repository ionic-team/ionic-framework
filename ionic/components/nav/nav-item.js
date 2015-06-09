import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {bind} from 'angular2/di';

import {ViewController} from '../view/view-controller';
import {NavController} from './nav-controller';
import * as util from 'ionic/util';


export class NavItem {

  constructor(viewController, ComponentClass, params = {}) {
    this.viewController = viewController;
    this.ComponentClass = ComponentClass;
    this.params = params;
    this.instance = null;
    this.state = 0;

    this._titleEle = undefined;
    this._backBtn = undefined;
    this.disposals = [];

    // if it's possible to go back from this nav item
    this.enableBack = false;

    this.protos = {};
  }

  addProtoViewRef(name, protoViewRef) {
    this.protos[name] = protoViewRef;
  }

  stage(callback) {
    let viewController = this.viewController;

    // update if it's possible to go back from this nav item
    this.enableBack = viewController && !!viewController.getPrevious(this);

    if (this.instance || !viewController) {
      // already compiled this view
      return callback();
    }

    // compile the Component
    viewController.compiler.compileInHost(this.ComponentClass).then(componentProtoViewRef => {

      // figure out the sturcture of this Component
      // does it have a navbar? Is it tabs? Should it not have a navbar or any toolbars?
      let itemStructure = getProtoViewStructure(componentProtoViewRef);

      // get the appropriate Pane which this NavItem will fit into
      viewController.getPane(itemStructure, pane => {

        // create a new injector just for this NavItem
        let injector = viewController.injector.resolveAndCreateChild([
          bind(ViewController).toValue(viewController),
          bind(NavController).toValue(viewController.navCtrl),
          bind(NavParams).toValue(new NavParams(this.params)),
          bind(NavItem).toValue(this)
        ]);

        // add the content of the view to the content area
        let viewContainer = pane.contentContainerRef;
        let hostViewRef = viewContainer.create(componentProtoViewRef, -1, null, injector);

        let newLocation = new ElementRef(hostViewRef, 0);

        this.setInstance( viewController.loader._viewManager.getComponent(newLocation) );
        this.setViewElement( hostViewRef._view.render._view.rootNodes[0] );

        this.disposals.push(() => {
          viewContainer.remove( viewContainer.indexOf(hostViewRef) );
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
        let navbarViewContainer = viewController.navbarViewContainer();

        // get the item's navbar protoview
        let navbarProtoView = this.protos.navbar;

        // add a navbar view if the pane has a navbar container, and the
        // item's instance has a navbar protoview to go to inside of it
        if (navbarViewContainer && navbarProtoView) {
          this.navbarView = navbarViewContainer.create(navbarProtoView, -1, context, injector);

          this.disposals.push(() => {
            navbarViewContainer.remove( navbarViewContainer.indexOf(this.navbarView) );
          });
        }

        // this item has finished loading
        this.loaded();

        // all done, fire the callback
        if (this._wait) {
          this._waitCallback = callback;
        } else {
          callback();
        }

      });

    });
  }

  waitForResolve() {
    this._wait = true;
  }

  resolve() {
    if (this._wait) {
      this._waitCallback && this._waitCallback();
      this._wait = this._waitCallback = null;
    }
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

  navbarElement() {
    let navbarView = this.navbarView;
    if (navbarView && navbarView._view) {
      return navbarView._view.render._view.rootNodes[0];
    }
  }

  contentElement() {
    return this.viewEle.querySelector('ion-content');
  }

  titleElement() {
    if (this._titleEle === undefined) {
      let navbarElement = this.navbarElement();
      if (navbarElement) {
        let titleEle = navbarElement.querySelector('ion-title');
        if (titleEle) {
          this._titleEle = titleEle;
          return this._titleEle;
        }
      }
      this._titleEle = null;
    }
    return this._titleEle;
  }

  backButtonElement() {
    if (this._backBtn === undefined) {
      let navbarElement = this.navbarElement();
      if (navbarElement) {
        let backBtn = navbarElement.querySelector('back-button');
        if (backBtn) {
          this._backBtn = backBtn;
          return this._backBtn;
        }
      }
      this._backBtn = null;
    }
    return this._backBtn;
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

export class NavParams {
  constructor(params) {
    util.extend(this, params);
  }
}

function getProtoViewStructure(componentProtoViewRef) {
  let navbar = true;
  let tabs = false;
  let toolbars = [];
  let key = '_';

  // componentProtoViewRef._protoView.elementBinders.forEach(rootElementBinder => {
  //   if (!rootElementBinder.componentDirective || !rootElementBinder.nestedProtoView) return;

  //   rootElementBinder.nestedProtoView.elementBinders.forEach(nestedElementBinder => {
  //     let componentDirective = nestedElementBinder.componentDirective;
  //     if (componentDirective && componentDirective.metadata.id == 'Tab') {
  //       navbar = tabs = true;
  //     }
  //   });
  // });

  if (navbar) {
    key += 'n'
  }

  if (toolbars.length) {
    key += 'b' + toolbars.length;
  }

  return {
    navbar: navbar,
    tabs: tabs,
    toolbars: toolbars,
    key: key
  };
}
