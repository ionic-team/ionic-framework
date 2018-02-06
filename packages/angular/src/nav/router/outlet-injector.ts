import { Injector } from '@angular/core';
import {
  ActivatedRoute,
  ChildrenOutletContexts
} from '@angular/router';

export class OutletInjector implements Injector {

  constructor(private route: ActivatedRoute, private childContexts: ChildrenOutletContexts, private parent: Injector) {
  }

  get(token: any, notFoundValue?: any): any {
    if (token === ActivatedRoute) {
      return this.route;
    }

    if (token === ChildrenOutletContexts) {
      return this.childContexts;
    }

    return this.parent.get(token, notFoundValue);
  }
}