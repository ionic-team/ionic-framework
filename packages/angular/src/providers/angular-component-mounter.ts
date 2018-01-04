import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable,
  Injector,
  NgZone,
  ReflectiveInjector,
  Type
} from '@angular/core';

import { getProviders } from '../di/di';
import { AngularMountingData } from '../types/interfaces';

const elementToComponentRefMap = new Map<HTMLElement, AngularMountingData>();

@Injectable()
export class AngularComponentMounter {

  constructor(private defaultCfr: ComponentFactoryResolver, private zone: NgZone, private appRef: ApplicationRef) {
  }

  attachViewToDom(parentElement: HTMLElement, hostElement: HTMLElement, componentToMount: Type<any>, componentResolveFactory: ComponentFactoryResolver, injector: Injector, data: any, classesToAdd: string[], wrapUserComponentInIonPage: boolean): Promise<AngularMountingData> {

    return new Promise((resolve) => {
      this.zone.run(() => {

        const crf = componentResolveFactory ? componentResolveFactory : this.defaultCfr;

        const mountingData = attachViewToDom(crf, parentElement, hostElement, componentToMount, injector, this.appRef, data, classesToAdd, wrapUserComponentInIonPage);
        resolve(mountingData);
      });
    });
  }

  removeViewFromDom(parentElement: HTMLElement, childElement: HTMLElement): Promise<any> {
    return new Promise((resolve) => {
      this.zone.run(() => {
        removeViewFromDom(parentElement, childElement);
        resolve();
      });
    });
  }

}

export function removeViewFromDom(parentElement: HTMLElement, childElement: HTMLElement) {
  const mountingData = elementToComponentRefMap.get(childElement);
  if (mountingData) {
    const componentParent = mountingData.element.parentNode;
    mountingData.componentRef.destroy();
    if (mountingData.wrapUserComponentInIonPage && parentElement.contains(componentParent) ) {
      parentElement.removeChild(componentParent)
    }
  }
}

export function attachViewToDom(crf: ComponentFactoryResolver, parentElement: HTMLElement, hostElement: HTMLElement, componentToMount: Type<any>, injector: Injector, appRef: ApplicationRef, data: any, classesToAdd: string[], wrapUserComponentInIonPage: boolean): AngularMountingData {

  const componentProviders = ReflectiveInjector.resolve(getProviders(parentElement, data));
  const componentFactory = crf.resolveComponentFactory(componentToMount);
  if (!hostElement) {
    hostElement = document.createElement(componentFactory.selector);
  }

  const childInjector = ReflectiveInjector.fromResolvedProviders(componentProviders, injector);
  const componentRef = componentFactory.create(childInjector, [], hostElement);
  for (const clazz of classesToAdd) {
    hostElement.classList.add(clazz);
  }

  const elementToAppend = wrapUserComponentInIonPage ? getIonPageElement(hostElement) : hostElement;
  parentElement.appendChild(elementToAppend);

  appRef.attachView(componentRef.hostView);

  const mountingData = {
    componentFactory,
    childInjector,
    componentRef,
    instance: componentRef.instance,
    angularHostElement: componentRef.location.nativeElement,
    element: hostElement,
    wrapUserComponentInIonPage
  };

  elementToComponentRefMap.set(hostElement, mountingData);

  return mountingData;
}

export function getIonPageElement(hostElement: HTMLElement) {
  const page = document.createElement('ion-page');
  page.appendChild(hostElement);
  return page;
}