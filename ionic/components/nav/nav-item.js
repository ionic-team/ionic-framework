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
  }

  setup() {
    let resolve;
    let promise = new Promise((res) => { resolve = res; });

    let injector = this.nav.injector.resolveAndCreateChild([
      bind(NavController).toValue(this.nav.navCtrl)
    ]);

    this.nav.loader.loadNextToExistingLocation(this.Class, this.nav.itemContent.elementRef, injector)
                   .then((componentRef) => {

      this.component = componentRef;
      this.domElement = componentRef.location.domElement;
      this.domElement.classList.add('nav-item');

      resolve();
    });


    //     let vc = new ViewContainerRef(this.nav.viewManager, this.nav.elementRef);

    // debugger
    //     let view = vc.create(this.Class, -1, this.nav.itemContent.elementRef, injector);


    return promise;
  }

}
