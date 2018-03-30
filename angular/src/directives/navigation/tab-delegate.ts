import { ComponentFactoryResolver, Directive, ElementRef, Injector } from '@angular/core';
import { AngularDelegate } from '../../providers/angular-delegate';


@Directive({
  selector: 'ion-tab'
})
export class TabDelegate {

  constructor(
    ref: ElementRef,
    cfr: ComponentFactoryResolver,
    injector: Injector,
    angularDelegate: AngularDelegate,
  ) {
    ref.nativeElement.delegate = angularDelegate.create(cfr, injector);
  }

}

