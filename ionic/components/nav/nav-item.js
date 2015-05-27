import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';
import {bind} from 'angular2/di';

import * as util from 'ionic/util';
import {NavController} from './nav-controller';
import {NavView} from './nav-view';

const SHOW_VIEW_CSS = 'show-view';


export class NavItem {

  constructor(nav, Component, params = {}) {
    this.nav = nav;
    this.Component = Component;
    this.params = params;
    this.id = util.nextUid();
    this.headerProtos = [];
    this.toolbarViews = [];
    this._titleEle = undefined;

    // if it's possible to go back from this nav item
    this.enableBack = false;
  }

  stage() {
    // update if it's possible to go back from this nav item
    this.enableBack = !!this.nav.getPrevious(this);

    return this.create().then(() => {
      return new Promise(resolve => {
        this.viewEle && this.viewEle.classList.add(SHOW_VIEW_CSS);
        resolve();
      });
    });
  }

  create() {
    if (this.created) {
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

    this.nav.loader.loadNextToExistingLocation(this.Component, this.nav.viewElementRef, injector).then((componentRef) => {

      // content
      this.component = componentRef;

      this.viewEle = componentRef.location.domElement;
      this.viewEle.setAttribute('id', 'view-' + this.id);

      if (componentRef && componentRef.dispose) {
        this._dispose = componentRef.dispose;
      }

      resolve();
    });

    return promise;
  }

  viewElement() {
    return this.viewEle;
  }

  contentElement() {
    return this.viewEle.querySelector('ion-content');
  }

  toolbarElements() {
    return this.viewEle.querySelectorAll('ion-toolbar');
  }

  titleElement() {
    if (this._titleEle === undefined) {
      let toolbarElements = this.toolbarElements();
      for (let i = 0; i < toolbarElements.length; i++) {
        var titleEle = toolbarElements[i].querySelector('ion-title');
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
      let toolbarElements = this.toolbarElements();
      for (let i = 0; i < toolbarElements.length; i++) {
        var backBtn = toolbarElements[i].querySelector('back-button');
        if (backBtn) {
          this._backBtn = backBtn;
          return this._backBtn;
        }
      }
      this._backBtn = null;
    }
    return this._backBtn;
  }

  cache() {
    this.viewEle.classList.remove(SHOW_VIEW_CSS);
  }

  destroy() {
    this._dispose && this._dispose();

    // just to help prevent any possible memory leaks
    for (let name in this) {
      if (this.hasOwnProperty(name)) {
        this[name] = null;
      }
    }
  }

}

export class NavParams {
  constructor(params) {
    util.extend(this, params);
  }
}
