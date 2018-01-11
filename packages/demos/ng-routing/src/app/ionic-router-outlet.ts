import {
  Attribute,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  Directive,
  ViewContainerRef,
} from '@angular/core';

import {
  PRIMARY_OUTLET,
  ChildrenOutletContexts,
  RouterOutlet
} from '@angular/router';

@Directive({
  selector: 'ion-outlet'
})
export class IonicRouterOutlet extends RouterOutlet {

  constructor(
    parentContexts: ChildrenOutletContexts,
    location: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    @Attribute('name') name: string,
    changeDetector: ChangeDetectorRef
  ) {
    super(parentContexts, location, componentFactoryResolver, name, changeDetector);
  }

  deactivate() {
    console.log('deactivate method');
  }
}
