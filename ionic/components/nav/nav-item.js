import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';
import {bind} from 'angular2/di';

import * as util from 'ionic/util';
import {NavController} from './nav-controller';


export class NavItem {

  constructor(nav, Component, params = {}) {
    this.nav = nav;
    this.Component = Component;
    this.params = params;
    this.id = util.nextUid();
    this.headerProtos = [];
    this.toolbarViews = [];
    this._titleEle = undefined;
    this.disposals = [];

    // if it's possible to go back from this nav item
    this.enableBack = false;
  }

  stage() {
    // update if it's possible to go back from this nav item
    this.enableBack = !!this.nav.getPrevious(this);

    if (!this.created) {
      return this.create();
    }
    return Promise.resolve();
  }

  create() {
    this.created = true;

    let resolve;
    let promise = new Promise((res) => { resolve = res; });

    let injector = this.nav.injector.resolveAndCreateChild([
      bind(NavController).toValue(this.nav.navCtrl),
      bind(NavParams).toValue(new NavParams(this.params)),
      bind(NavItem).toValue(this)
    ]);

    this.nav.loader.loadNextToExistingLocation(this.Component, this.nav.contentElementRef, injector).then((componentRef) => {

      // content
      this.component = componentRef;

      this.contentEle = componentRef.location.domElement;
      this.contentEle.classList.add('nav-item');
      this.contentEle.setAttribute('id', 'nav-item-' + this.id);

      if (componentRef && componentRef._dispose) {
        this.disposals.push(componentRef._dispose);
      }


      // TODO: talk to misko about correct way to set context
      let context = {
        boundElementIndex: 0,
        parentView: {
          _view: componentRef.location.parentView._view.componentChildViews[0]
        }
      };

      for (let i = 0; i < this.headerProtos.length; i++) {
        this.createHeader(this.headerProtos[i], context, injector);
      }

      resolve();
    });

    return promise;
  }

  createHeader(toolbarProtoView, context, injector) {
    let headerContainer = this.nav.headerContainerRef;

    if (!headerContainer) return;

    let atIndex = -1;

    let headerView = headerContainer.create(toolbarProtoView, atIndex, context, injector);

    if (headerView) {
      this.toolbarViews.push(headerView);

      this.disposals.push(() => {
        headerContainer.remove( headerContainer.indexOf(headerView) );
      });
    }
  }

  addHeader(toolbarProtoView) {
    this.headerProtos.push(toolbarProtoView);
  }

  getContent() {
    return this.contentEle;
  }

  getToolbars() {
    let elements = [];
    for (let i = 0; i < this.toolbarViews.length; i++) {
      var toolbarView = this.toolbarViews[i];
      elements.push(toolbarView._view.render._view.rootNodes[0]);
    }
    return elements;
  }

  getTitle() {
    if (this._titleEle === undefined) {
      let toolbarElements = this.getToolbars();
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

  destroy() {
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

}

export class NavParams {
  constructor(params) {
    util.extend(this, params);
  }
}
