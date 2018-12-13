import { ComponentFactoryResolver, Directive, ElementRef, Injector, ViewContainerRef } from '@angular/core';

import { AngularDelegate } from '../../providers/angular-delegate';

@Directive({
  selector: 'ion-nav',
})
export class NavDelegate {
  constructor(
    ref: ElementRef,
    resolver: ComponentFactoryResolver,
    injector: Injector,
    angularDelegate: AngularDelegate,
    location: ViewContainerRef
  ) {
    ref.nativeElement.delegate = angularDelegate.create(resolver, injector, location);
  }
}
