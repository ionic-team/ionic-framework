import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  Injector,
  Optional,
  Type,
} from '@angular/core';

import { Router } from '@angular/router';
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
    protected injector: Injector,
    @Optional() protected router: Router
  ) {

    this.elementRef.nativeElement.delegate = this;

  }

  updateUrlState(urlSegment: string): Promise<any> {
    if (this.router) {
      return this.router.navigateByUrl(urlSegment);
    }
    return Promise.reject(new Error('Angular Router is unavailable'));
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