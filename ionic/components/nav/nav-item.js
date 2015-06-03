import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {bind} from 'angular2/di';

import * as util from 'ionic/util';
import {NavController} from './nav-controller';
import {Nav} from './nav';
import {TabPane, NavPane, NavPaneSection} from './nav';


export class NavItem {

  constructor(nav, Component, params = {}) {
    this.nav = nav;
    this.Component = Component;
    this.params = params;
    this.id = util.nextUid();
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

  stage() {
    // update if it's possible to go back from this nav item
    //this.enableBack = !!this.nav.getPrevious(this);

    return this.render();;
  }

  render() {
    if (this.instance) {
      // already compiled this view
      return Promise.resolve();
    }

    let resolve;
    let promise = new Promise((res) => { resolve = res; });

    // compile the Component
    this.nav.compiler.compileInHost(this.Component).then(componentProtoViewRef => {

      // figure out the sturcture of this Component
      // does it have a navbar? Is it tabs? Should it not have a navbar or any toolbars?
      let itemStructure = getProtoViewStructure(componentProtoViewRef);

      // get the appropriate NavPane which this NavItem will fit into
      this.nav.getPane(itemStructure).then(navPane => {

        // create a new injector just for this NavItem
        let injector = this.nav.injector.resolveAndCreateChild([
          bind(NavController).toValue(this.nav.navCtrl),
          bind(NavParams).toValue(new NavParams(this.params)),
          bind(NavItem).toValue(this)
        ]);

        // add the content of the view to the content area
        let viewContainer = navPane.contentContainerRef;
        let hostViewRef = viewContainer.create(componentProtoViewRef, -1, null, injector);

        let newLocation = new ElementRef(hostViewRef, 0);
        this.instance = this.nav.loader._viewManager.getComponent(newLocation);

        this.disposals.push(() => {
          viewContainer.remove( viewContainer.indexOf(hostViewRef) );
        });

        this.viewEle = hostViewRef._view.render._view.rootNodes[0];
        this.viewEle.classList.add('nav-item');

        let context = {
          boundElementIndex: 0,
          parentView: {
            _view: hostViewRef._view.componentChildViews[0]
          }
        };

        // add only the sections it needs
        let navbarViewContainer = navPane.sections.navbar.viewContainerRef;
        if (navbarViewContainer && itemStructure.navbar && this.protos.navbar) {
          this.navbarView = navbarViewContainer.create(this.protos.navbar, -1, context, injector);

          this.disposals.push(() => {
            navbarViewContainer.remove( navbarViewContainer.indexOf(this.navbarView) );
          });
        }

        this.loaded();

        resolve();
      });

    });

    return promise;
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
    if (this.navbarView && this.navbarView._view) {
      return this.navbarView._view.render._view.rootNodes[0];
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
