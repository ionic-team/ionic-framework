import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
  NgZone,
  ReflectiveInjector,
  Type,
  ViewContainerRef,
} from '@angular/core';

import { ComponentFactory } from '@angular/core/src/linker/component_factory';

@Injectable()
export class AngularFrameworkDelegate {

  constructor(private crf: ComponentFactoryResolver, private zone: NgZone) {
  }

  attachViewToDom(componentToMount: Type<any>, viewport: ViewContainerRef, providers: any, changeDetection: ChangeDetectorRef): Promise<AngularMountingData> {

    return new Promise((resolve) => {
      this.zone.run(() => {
        const mountingData = attachViewToDom(this.crf, componentToMount, viewport, providers, changeDetection);
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

export function attachViewToDom(crf: ComponentFactoryResolver, componentToMount: Type<any>, viewport: ViewContainerRef, providers: any, changeDetection: ChangeDetectorRef): AngularMountingData{
  const componentFactory = crf.resolveComponentFactory(componentToMount);
  const componentProviders = ReflectiveInjector.resolve(providers);
  const childInjector = ReflectiveInjector.fromResolvedProviders(componentProviders, viewport.parentInjector);
  const componentRef = componentFactory.create(childInjector, []);
  viewport.insert(componentRef.hostView, viewport.length);
  changeDetection.detectChanges();

  return {
    componentFactory,
    childInjector: childInjector,
    componentRef: componentRef
  }
}

export interface AngularMountingData {
  componentFactory: ComponentFactory<any>;
  childInjector: Injector;
  componentRef: ComponentRef<any>;
}
