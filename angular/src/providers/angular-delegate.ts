import { ApplicationRef, ComponentFactoryResolver, Injectable, InjectionToken, Injector, NgZone, ViewContainerRef } from '@angular/core';
import { FrameworkDelegate, LIFECYCLE_DID_ENTER, LIFECYCLE_DID_LEAVE, LIFECYCLE_WILL_ENTER, LIFECYCLE_WILL_LEAVE, LIFECYCLE_WILL_UNLOAD } from '@ionic/core';

import { NavParams } from '../directives/navigation/nav-params';

@Injectable()
export class AngularDelegate {

  constructor(
    private zone: NgZone,
    private appRef: ApplicationRef
  ) {}

  create(
    resolver: ComponentFactoryResolver,
    injector: Injector,
    location?: ViewContainerRef,
  ) {
    return new AngularFrameworkDelegate(resolver, injector, location, this.appRef, this.zone);
  }
}

export class AngularFrameworkDelegate implements FrameworkDelegate {

  private elRefMap = new WeakMap<HTMLElement, any>();
  private elEventsMap = new WeakMap<HTMLElement, () => void>();

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private location: ViewContainerRef | undefined,
    private appRef: ApplicationRef,
    private zone: NgZone,
  ) {}

  attachViewToDom(container: any, component: any, params?: any, cssClasses?: string[]): Promise<any> {
    return this.zone.run(() => {
      return new Promise(resolve => {
        const el = attachView(
          this.zone, this.resolver, this.injector, this.location, this.appRef,
          this.elRefMap, this.elEventsMap,
          container, component, params, cssClasses
        );
        resolve(el);
      });
    });
  }

  removeViewFromDom(_container: any, component: any): Promise<void> {
    return this.zone.run(() => {
      return new Promise(resolve => {
        const componentRef = this.elRefMap.get(component);
        if (componentRef) {
          componentRef.destroy();
          this.elRefMap.delete(component);
          const unbindEvents = this.elEventsMap.get(component);
          if (unbindEvents) {
            unbindEvents();
            this.elEventsMap.delete(component);
          }
        }
        resolve();
      });
    });
  }
}

export const attachView = (
  zone: NgZone,
  resolver: ComponentFactoryResolver,
  injector: Injector,
  location: ViewContainerRef | undefined,
  appRef: ApplicationRef,
  elRefMap: WeakMap<HTMLElement, any>,
  elEventsMap: WeakMap<HTMLElement, () => void>,
  container: any, component: any, params: any, cssClasses: string[] | undefined
) => {
  const factory = resolver.resolveComponentFactory(component);
  const childInjector = Injector.create({
    providers: getProviders(params),
    parent: injector
  });
  const componentRef = (location)
    ? location.createComponent(factory, location.length, childInjector)
    : factory.create(childInjector);

  const instance = componentRef.instance;
  const hostElement = componentRef.location.nativeElement;
  if (params) {
    Object.assign(instance, params);
  }
  if (cssClasses) {
    for (const clazz of cssClasses) {
      hostElement.classList.add(clazz);
    }
  }
  const unbindEvents = bindLifecycleEvents(zone, instance, hostElement);
  container.appendChild(hostElement);

  if (!location) {
    appRef.attachView(componentRef.hostView);
  }
  componentRef.changeDetectorRef.reattach();
  elRefMap.set(hostElement, componentRef);
  elEventsMap.set(hostElement, unbindEvents);
  return hostElement;
};

const LIFECYCLES = [
  LIFECYCLE_WILL_ENTER,
  LIFECYCLE_DID_ENTER,
  LIFECYCLE_WILL_LEAVE,
  LIFECYCLE_DID_LEAVE,
  LIFECYCLE_WILL_UNLOAD
];

export const bindLifecycleEvents = (zone: NgZone, instance: any, element: HTMLElement) => {
  return zone.run(() => {
    const unregisters = LIFECYCLES
      .filter(eventName => typeof instance[eventName] === 'function')
      .map(eventName => {
        const handler = (ev: any) => instance[eventName](ev.detail);
        element.addEventListener(eventName, handler);
        return () => element.removeEventListener(eventName, handler);
      });
    return () => unregisters.forEach(fn => fn());
  });
};

const NavParamsToken = new InjectionToken<any>('NavParamsToken');

const getProviders = (params: {[key: string]: any}) => {
  return [
    {
      provide: NavParamsToken, useValue: params
    },
    {
      provide: NavParams, useFactory: provideNavParamsInjectable, deps: [NavParamsToken]
    }
  ];
};

const provideNavParamsInjectable = (params: {[key: string]: any}) => {
  return new NavParams(params);
};
