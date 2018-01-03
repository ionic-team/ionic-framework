import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
  NgZone,
  ReflectiveInjector,
  Type
} from '@angular/core';

import { getProviders } from '../di/di';
import { AngularMountingData } from '../types/interfaces';

const elementToComponentRefMap = new Map<HTMLElement, ComponentRef<any>>();

@Injectable()
export class AngularComponentMounter {

  constructor(private defaultCfr: ComponentFactoryResolver, private zone: NgZone, private appRef: ApplicationRef) {
  }

  attachViewToDom(parentElement: HTMLElement, hostElement: HTMLElement, componentToMount: Type<any>, componentResolveFactory: ComponentFactoryResolver, injector: Injector, data: any, classesToAdd: string[], wrapUserTemplateInIonPage: boolean): Promise<AngularMountingData> {

    return new Promise((resolve) => {
      this.zone.run(() => {

        const crf = componentResolveFactory ? componentResolveFactory : this.defaultCfr;

        const mountingData = attachViewToDom(crf, parentElement, hostElement, componentToMount, injector, this.appRef, data, classesToAdd, wrapUserTemplateInIonPage);
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
  const componentRef = elementToComponentRefMap.get(childElement);
  if (componentRef) {
    componentRef.destroy();
    if (parentElement.contains(childElement)) {
      parentElement.removeChild(childElement);
    }
  }
}

export function attachViewToDom(crf: ComponentFactoryResolver, parentElement: HTMLElement, hostElement: HTMLElement, componentToMount: Type<any>, injector: Injector, appRef: ApplicationRef, data: any, classesToAdd: string[], wrapUserTemplateInIonPage: boolean): AngularMountingData {

  const componentProviders = ReflectiveInjector.resolve(getProviders(parentElement, data));
  const componentFactory = crf.resolveComponentFactory(componentToMount);
  if (!hostElement) {
    hostElement = document.createElement(componentFactory.selector);
  }

  let mountingElement = hostElement;
  if (wrapUserTemplateInIonPage) {
    const ionPageElement = document.createElement('ion-page');
    hostElement.appendChild(ionPageElement);
    mountingElement = ionPageElement;
  }

  const childInjector = ReflectiveInjector.fromResolvedProviders(componentProviders, injector);
  const componentRef = componentFactory.create(childInjector, [], mountingElement);
  for (const clazz of classesToAdd) {
    hostElement.classList.add(clazz);
  }

  parentElement.appendChild(hostElement);

  appRef.attachView(componentRef.hostView);

  elementToComponentRefMap.set(hostElement, componentRef);

  return {
    componentFactory,
    childInjector,
    componentRef,
    instance: componentRef.instance,
    angularHostElement: componentRef.location.nativeElement,
    element: hostElement,
  };
}

