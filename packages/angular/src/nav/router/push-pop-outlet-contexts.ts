import {
  ComponentFactoryResolver,
  ComponentRef
} from '@angular/core';

import {
  ActivatedRoute,
  ChildrenOutletContexts,
  OutletContext,
  RouterOutlet
} from '@angular/router';

export class PushPopOutletContexts extends ChildrenOutletContexts {

  // this method is a public api, but the members in the ChildrenOutletContexts are private
  // so we're gonna cheat, 'cause we play to win
  onOutletDeactivated(): Map<string, OutletContext> {
    return (this as any).contexts;
  }

  getOrCreateContext(childName: string): OutletContext {
    let context = this.getContext(childName) as any;

    if (!context) {
      context = {
        children: new PushPopOutletContexts()
      };
      (this as any).contexts.set(childName, context);
    }

    return context;
  }
}

export interface PushPopOutletContext {
  outlet?: RouterOutlet;
  route?: ActivatedRoute;
  resolver?: ComponentFactoryResolver;
  children?: PushPopOutletContexts;
  attachRef: ComponentRef<any>;
}