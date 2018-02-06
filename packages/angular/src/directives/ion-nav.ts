import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  Injector,
  Type,
} from '@angular/core';


import { FrameworkDelegate } from '@ionic/core';

import { AngularComponentMounter, AngularEscapeHatch } from '..';

let id = 0;

@Directive({
  selector: 'ion-nav',
})
export class IonNav implements FrameworkDelegate {

  constructor(
    public elementRef: ElementRef,
    protected angularComponentMounter: AngularComponentMounter,
    protected cfr: ComponentFactoryResolver,
    protected injector: Injector) {

    this.elementRef.nativeElement.delegate = this;

  }

  attachViewToDom(elementOrContainerToMountTo: HTMLIonNavElement,
    elementOrComponentToMount: Type<any>,
    data?: any,
    classesToAdd?: string[],
    escapeHatch: AngularEscapeHatch = {}): Promise<any> {

    // wrap whatever the user provides in an ion-page
    const cfr = escapeHatch.cfr || this.cfr;
    const injector = escapeHatch.injector || this.injector;
    return this.angularComponentMounter.attachViewToDom(elementOrContainerToMountTo,
      null, elementOrComponentToMount, cfr, injector, data, classesToAdd);
  }

  removeViewFromDom(parentElement: HTMLElement, childElement: HTMLElement) {
    return this.angularComponentMounter.removeViewFromDom(parentElement, childElement);
  }

}