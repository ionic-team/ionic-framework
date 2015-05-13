import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';
import {bind} from 'angular2/di';

import * as util from 'ionic/util';
import {NavController} from './nav-controller';


export class NavItem {

  constructor(nav, ComponentClass, params = {}) {
    this.nav = nav;
    this.Class = ComponentClass;
    this.params = params;
    this.id = util.nextUid();
    this.headers = [];
  }

  setup() {
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

    this.nav.loader.loadNextToExistingLocation(this.Class, this.nav.contentAnchor.elementRef, injector).then((componentRef) => {

      // content
      this.component = componentRef;
      this.domElement = componentRef.location.domElement;
      this.domElement.classList.add('nav-item');
      this.domElement.setAttribute('data-nav-item-id', this.id);

      for (let i = 0; i < this.headers.length; i++) {
        this.createHeader(this.headers[i], injector);
      }

      resolve();
    });

    return promise;
  }

  createHeader(toolbarProtoView, injector) {
    let vc = this.nav.headerAnchor.viewContainerRef;

    let atIndex = -1;
    let context = this.nav.headerAnchor.elementRef;

    let view = vc.create(toolbarProtoView, atIndex, context, injector);
  }

  addHeader(toolbarProtoView) {
    this.headers.push(toolbarProtoView);
  }

  destroy() {
    this.component && this.component._dispose && this.component._dispose();

    // just to help prevent possible large memory leaks
    for (let prop in this) {
      this[prop] = null;
    }
  }

}

export class NavParams {
  constructor(params) {
    util.extend(this, params);
  }
}
