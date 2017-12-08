import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Injector,
  ReflectiveInjector,
  Type,
  ViewContainerRef,
  ViewChild
} from '@angular/core';

import { FrameworkDelegate } from '@ionic/core';

import { getProviders } from '../di/di';
import { AngularComponentMounter } from '../providers/angular-component-mounter';
import { AngularMountingData } from '../types/interfaces';

const elementToComponentRefMap = new Map<HTMLElement, ComponentRef<any>>();

@Component({
  selector: 'ion-nav',
  template: `
    <div #viewport class="ng-nav-viewport"></div>
  `
})
export class IonNavDelegate implements FrameworkDelegate {

  @ViewChild('viewport', { read: ViewContainerRef}) viewport: ViewContainerRef;

  constructor(private elementRef: ElementRef, private changeDetection: ChangeDetectorRef, private angularComponentMounter: AngularComponentMounter, private injector: Injector, private componentResolveFactory: ComponentFactoryResolver) {
    this.elementRef.nativeElement.delegate = this;

  }

  async attachViewToDom(elementOrContainerToMountTo: HTMLIonNavElement, elementOrComponentToMount: Type<any>,
                    _propsOrDataObj?: any, _classesToAdd?: string[]): Promise<AngularMountingData> {

    const componentProviders = ReflectiveInjector.resolve(getProviders(elementOrContainerToMountTo));
    console.log('componentProviders: ', componentProviders);

    const element = document.createElement('ion-page');
    for (const clazz of _classesToAdd) {
      element.classList.add(clazz);
    }

    elementOrContainerToMountTo.appendChild(element);
    const mountingData = await this.angularComponentMounter.attachViewToDom(element, elementOrComponentToMount, [], this.changeDetection, this.componentResolveFactory, this.injector);
    mountingData.element = element;

    elementToComponentRefMap.set(mountingData.angularHostElement, mountingData.componentRef);

    return mountingData;
  }

  async removeViewFromDom(_parentElement: HTMLElement, childElement: HTMLElement) {
    const componentRef = elementToComponentRefMap.get(childElement);
    if (componentRef) {
      return this.angularComponentMounter.removeViewFromDom(componentRef);
    }
    return Promise.resolve();
  }
}


