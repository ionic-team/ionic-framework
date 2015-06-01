import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';
import {bind} from 'angular2/di';

import * as util from 'ionic/util';
import {NavController} from './nav-controller';
import {Lifecycle} from 'ionic/components/view/lifecycle';


export class NavItem {

  constructor(nav, Component, params = {}) {
    this.nav = nav;
    this.Component = Component;
    this.params = params;
    this.id = util.nextUid();
    this._navbarProto = null;
    this._navbarView = null;
    this._titleEle = undefined;
    this._backBtn = undefined;
    this.disposals = [];

    // if it's possible to go back from this nav item
    this.enableBack = false;
  }

  stage() {
    // update if it's possible to go back from this nav item
    this.enableBack = !!this.nav.getPrevious(this);

    return this.render();;
  }

  render() {
    console.log('nav-item render')
    if (this.created) {
      console.log('showed existing view', this.id);
      return Promise.resolve();
    }

    this.created = true;

    let resolve;
    let promise = new Promise((res) => { resolve = res; });

    let injector = this.nav.injector.resolveAndCreateChild([
      bind(NavController).toValue(this.nav.navCtrl),
      bind(NavParams).toValue(new NavParams(this.params)),
      bind(NavItem).toValue(this)
    ]);

    this.nav.loader.loadNextToExistingLocation(this.Component, this.nav.contentElementRef, injector).then((componentRef) => {

      Lifecycle.viewLoaded(componentRef.instance);

      console.log('nav-item loadNextToExistingLocation', this.nav.contentElementRef);
      let navbarContainer = this.nav.navbarContainerRef;

      if (componentRef && componentRef.dispose && navbarContainer) {
        this.disposals.push(componentRef.dispose);

        this.viewEle = componentRef.location.domElement;
        this.viewEle.classList.add('ion-view');

        if (this._navbarProto) {
          let context = {
            boundElementIndex: 0,
            parentView: {
              _view: componentRef.location.parentView._view.componentChildViews[0]
            }
          };

          let atIndex = -1;

          console.log('nav-item navbarContainer.create', this._navbarProto)
          this._navbarView = navbarContainer.create(this._navbarProto, atIndex, context, injector);

          if (this._navbarView) {
            this.disposals.push(() => {
              navbarContainer.remove( navbarContainer.indexOf(this._navbarView) );
            });
          }
        }
      }

      console.log('created view', this.id);
      resolve();
    });

    return promise;
  }

  cache() {
    console.log('cached view', this.id);
  }

  destroy() {
    console.log('destroyed view', this.id);

    for (let i = 0; i < this.disposals.length; i++) {
      this.disposals[i]();
    }

    // just to help prevent any possible memory leaks
    for (let name in this) {
      if (this.hasOwnProperty(name)) {
        this[name] = null;
      }
    }
  }

  navbarProto(navbarProtoView) {
    console.log('nav-item navbarProto')
    this._navbarProto = navbarProtoView;
  }

  viewElement() {
    return this.viewEle;
  }

  navbarElement() {
    if (this._navbarView && this._navbarView._view) {
      return this._navbarView._view.render._view.rootNodes[0];
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

}

export class NavParams {
  constructor(params) {
    util.extend(this, params);
  }
}
