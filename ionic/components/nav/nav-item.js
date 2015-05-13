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

    this.nav.loader.loadNextToExistingLocation(this.Class, this.nav.contentElementRef, injector).then((componentRef) => {

      // content
      this.component = componentRef;
      this.domElement = componentRef.location.domElement;
      this.domElement.classList.add('nav-item');
      this.domElement.setAttribute('data-nav-item-id', this.id);

      let context = this.nav.contentElementRef

      for (let i = 0; i < this.headers.length; i++) {
        this.createHeader(this.headers[i], context, injector);
      }

      resolve();
    });

    return promise;
  }

  createHeader(toolbarProtoView, context, injector) {
    let vc = this.nav.headerContainerRef;

    let atIndex = -1;

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
