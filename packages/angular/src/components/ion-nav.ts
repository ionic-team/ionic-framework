import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Type,
  ViewContainerRef,
  ViewChild
} from '@angular/core';

import { FrameworkDelegate } from '@ionic/core';

import { AngularComponentMounter } from '../providers/angular-component-mounter';
import { AngularMountingData } from '../types/interfaces';

@Component({
  selector: 'ion-nav',
  template: `
    <div #viewport class="ng-nav-viewport"></div>
  `
})
export class IonNavDelegate implements FrameworkDelegate {

  @ViewChild('viewport', { read: ViewContainerRef}) viewport: ViewContainerRef;

  constructor(private elementRef: ElementRef, private angularComponentMounter: AngularComponentMounter, private componentResolveFactory: ComponentFactoryResolver) {
    this.elementRef.nativeElement.delegate = this;

  }

  attachViewToDom(elementOrContainerToMountTo: HTMLIonNavElement, elementOrComponentToMount: Type<any>, _propsOrDataObj?: any, classesToAdd?: string[]): Promise<AngularMountingData> {

    return this.angularComponentMounter.attachViewToDom(elementOrContainerToMountTo, elementOrComponentToMount, this.componentResolveFactory, null, this.viewport, classesToAdd);
  }

  removeViewFromDom(_parentElement: HTMLElement, childElement: HTMLElement) {
    return this.angularComponentMounter.removeViewFromDom(childElement);
  }
}


