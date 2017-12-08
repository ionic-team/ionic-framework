import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
  NgZone,
  ReflectiveInjector,
  Type,
} from '@angular/core';

import { AngularMountingData } from '../types/interfaces';

@Injectable()
export class AngularComponentMounter {

  constructor(private defaultCfr: ComponentFactoryResolver, private zone: NgZone) {
  }

  attachViewToDom(parentElement: HTMLElement, componentToMount: Type<any>, providers: any[], changeDetection: ChangeDetectorRef, componentResolveFactory: ComponentFactoryResolver, injector: Injector): Promise<AngularMountingData> {

    return new Promise((resolve) => {
      this.zone.run(() => {
        console.log('parentElement: ', parentElement);
        const crf = componentResolveFactory ? componentResolveFactory : this.defaultCfr;
        const mountingData = attachViewToDom(crf, componentToMount, parentElement, providers, changeDetection, injector);
        resolve(mountingData);
      });
    });
  }

  removeViewFromDom(componentRef: ComponentRef<any>): Promise<any> {
    return new Promise((resolve) => {
      this.zone.run(() => {
        componentRef.destroy();
        resolve();
      });
    });
  }
}

export function attachViewToDom(crf: ComponentFactoryResolver, componentToMount: Type<any>, element: HTMLElement, providers: any, changeDetection: ChangeDetectorRef, injector: Injector): AngularMountingData {
  const componentFactory = crf.resolveComponentFactory(componentToMount);
  const componentProviders = ReflectiveInjector.resolve(providers);
  const childInjector = ReflectiveInjector.fromResolvedProviders(componentProviders, injector);
  const componentRef = componentFactory.create(childInjector, [], element);

  changeDetection.detectChanges();

  return {
    componentFactory,
    childInjector: childInjector,
    componentRef: componentRef,
    instance: componentRef.instance,
    angularHostElement: componentRef.location.nativeElement,
    element: componentRef.location.nativeElement,
  };
}

