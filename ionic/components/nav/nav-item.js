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
    this.created = false;
  }

  setup() {
    if (!this.created) {
      return this.create();
    }

    return Promise.resolve();
  }

  create() {
    let resolve;
    let promise = new Promise((res) => { resolve = res; });

    let injector = this.nav.injector.resolveAndCreateChild([
      bind(NavController).toValue(this.nav.navCtrl),
      bind(NavParams).toValue(new NavParams(this.params))
    ]);

    this.nav.loader.loadNextToExistingLocation(this.Class, this.nav.itemContent.elementRef, injector).then((componentRef) => {

      // content
      this.component = componentRef;
      this.domElement = componentRef.location.domElement;
      this.domElement.classList.add('nav-item');
      this.domElement.setAttribute('data-nav-item-id', this.id);

      this.created = true;
      resolve();
    });

    //     let vc = new ViewContainerRef(this.nav.viewManager, this.nav.elementRef);

    // debugger
    //     let view = vc.create(this.Class, -1, this.nav.itemContent.elementRef, injector);


    return promise;
  }

  addToolbar(position, toolbar) {
    headers.push(toolbar);
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
