import {
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
  NgZone,
  ReflectiveInjector,
  Type,
  ViewContainerRef,
} from '@angular/core';

import { getProviders } from '../di/di';
import { AngularMountingData } from '../types/interfaces';

const elementToComponentRefMap = new Map<HTMLElement, ComponentRef<any>>();

@Injectable()
export class AngularComponentMounter {

  constructor(private defaultCfr: ComponentFactoryResolver, private zone: NgZone) {
  }

  attachViewToDom(parentElement: HTMLElement, componentToMount: Type<any>, componentResolveFactory: ComponentFactoryResolver, injector: Injector, viewport: ViewContainerRef, classesToAdd: string[]): Promise<AngularMountingData> {

    return new Promise((resolve) => {
      this.zone.run(() => {

        const crf = componentResolveFactory ? componentResolveFactory : this.defaultCfr;

        const mountingData = attachViewToDom(crf, parentElement, componentToMount, injector, viewport, classesToAdd);
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

export function attachViewToDom(crf: ComponentFactoryResolver, parentElement: HTMLElement, componentToMount: Type<any>, injector: Injector, viewport: ViewContainerRef, classesToAdd: string[]): AngularMountingData {

  const componentProviders = ReflectiveInjector.resolve(getProviders(parentElement));
  const componentFactory = crf.resolveComponentFactory(componentToMount);
  const injectorToUse = injector ? injector : viewport.parentInjector;
  const childInjector = ReflectiveInjector.fromResolvedProviders(componentProviders, injectorToUse);
  const componentRef = componentFactory.create(childInjector, []);
  for (const clazz of classesToAdd) {
    (componentRef.location.nativeElement as HTMLElement).classList.add(clazz);
  }

  componentRef.changeDetectorRef.detectChanges();

  viewport.insert(componentRef.hostView, viewport.length);

  elementToComponentRefMap.set(componentRef.location.nativeElement, componentRef);

  return {
    componentFactory,
    childInjector: childInjector,
    componentRef: componentRef,
    instance: componentRef.instance,
    angularHostElement: componentRef.location.nativeElement,
    element: componentRef.location.nativeElement,
  };
}

