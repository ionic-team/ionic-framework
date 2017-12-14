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

  attachViewToDom(parentElement: HTMLElement, hostElement: HTMLElement, componentToMount: Type<any>, componentResolveFactory: ComponentFactoryResolver, injector: Injector, classesToAdd: string[]): Promise<AngularMountingData> {

    return new Promise((resolve) => {
      this.zone.run(() => {

        const crf = componentResolveFactory ? componentResolveFactory : this.defaultCfr;

        const mountingData = attachViewToDom(crf, parentElement, hostElement, componentToMount, injector, this.appRef, classesToAdd);
        resolve(mountingData);
      });
    });
  }

  removeViewFromDom(childElement: HTMLElement): Promise<any> {
    return new Promise((resolve) => {
      this.zone.run(() => {
        removeViewFromDom(childElement);
        resolve();
      });
    });
  }
}

export function removeViewFromDom(childElement: HTMLElement) {
  const componentRef = elementToComponentRefMap.get(childElement);
  if (componentRef) {
    componentRef.destroy();
  }
}

export function attachViewToDom(crf: ComponentFactoryResolver, parentElement: HTMLElement, hostElement: HTMLElement, componentToMount: Type<any>, injector: Injector, appRef: ApplicationRef, classesToAdd: string[]): AngularMountingData {

  const componentProviders = ReflectiveInjector.resolve(getProviders(parentElement));
  const componentFactory = crf.resolveComponentFactory(componentToMount);
  const childInjector = ReflectiveInjector.fromResolvedProviders(componentProviders, injector);
  const componentRef = componentFactory.create(childInjector, [], hostElement);
  for (const clazz of classesToAdd) {
    hostElement.classList.add(clazz);
  }

  parentElement.appendChild(hostElement);

  appRef.attachView(componentRef.hostView);

  elementToComponentRefMap.set(hostElement, componentRef);

  return {
    componentFactory,
    childInjector: childInjector,
    componentRef: componentRef,
    instance: componentRef.instance,
    angularHostElement: componentRef.location.nativeElement,
    element: hostElement,
  };
}

