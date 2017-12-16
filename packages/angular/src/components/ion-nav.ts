import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  Injector,
  Type,
} from '@angular/core';

import { FrameworkDelegate } from '@ionic/core';

import { AngularComponentMounter } from '../providers/angular-component-mounter';
import { AngularMountingData } from '../types/interfaces';

@Directive({
  selector: 'ion-nav',
})
export class IonNavDelegate implements FrameworkDelegate {

  constructor(private elementRef: ElementRef, private angularComponentMounter: AngularComponentMounter, private componentResolveFactory: ComponentFactoryResolver, private injector: Injector) {
    this.elementRef.nativeElement.delegate = this;
  }

  attachViewToDom(elementOrContainerToMountTo: HTMLIonNavElement, elementOrComponentToMount: Type<any>, _propsOrDataObj?: any, classesToAdd?: string[]): Promise<AngularMountingData> {

    const hostElement = document.createElement('div');
    return this.angularComponentMounter.attachViewToDom(elementOrContainerToMountTo, hostElement, elementOrComponentToMount, this.componentResolveFactory, this.injector, classesToAdd);
  }

  removeViewFromDom(_parentElement: HTMLElement, childElement: HTMLElement) {
    return this.angularComponentMounter.removeViewFromDom(childElement);
  }
}


