import { ComponentFactoryResolver, Injectable, InjectionToken, Injector, NgZone, ViewContainerRef } from '@angular/core';
import { FrameworkDelegate, ViewLifecycle } from '@ionic/core';
import { NavParams } from '../directives/navigation/nav-params';


@Injectable()
export class AngularDelegate {

  constructor(
    private zone: NgZone
  ) {}

  create(
    resolver: ComponentFactoryResolver,
    injector: Injector,
    location: ViewContainerRef,
  ) {
    return new AngularFrameworkDelegate(resolver, injector, location, this.zone);
  }
}


export class AngularFrameworkDelegate implements FrameworkDelegate {

  private elRefMap = new WeakMap<HTMLElement, any>();

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private location: ViewContainerRef,
    private zone: NgZone,
  ) {}

  attachViewToDom(container: any, component: any, params?: any, cssClasses?: string[]): Promise<any> {
    return new Promise(resolve => {
      this.zone.run(() => {
        const el = attachView(
          this.resolver, this.injector, this.location, this.elRefMap,
          container, component, params, cssClasses
        );
        resolve(el);
      });
    });
  }

  removeViewFromDom(_container: any, component: any): Promise<void> {
    return new Promise(resolve => {
      this.zone.run(() => {
        const componentRef = this.elRefMap.get(component);
        if (componentRef) {
          componentRef.destroy();
          this.elRefMap.delete(component);
        }
        resolve();
      });
    });
  }
}

export function attachView(
  resolver: ComponentFactoryResolver,
  injector: Injector,
  location: ViewContainerRef,
  elRefMap: WeakMap<HTMLElement, any>,
  container: any, component: any, params?: any, cssClasses?: string[]) {
  const factory = resolver.resolveComponentFactory(component);
  const childInjector = Injector.create(getProviders(params), injector);
  const componentRef = location.createComponent(factory, location.length, childInjector);
  const hostElement = componentRef.location.nativeElement;
  if (params) {
    Object.assign(hostElement, params);
  }
  for (const clazz of cssClasses) {
    hostElement.classList.add(clazz);
  }
  bindLifecycleEvents(componentRef.instance, hostElement);
  container.appendChild(hostElement);

  componentRef.changeDetectorRef.reattach();
  elRefMap.set(hostElement, componentRef);
  return hostElement;
}

const LIFECYCLES = [
  ViewLifecycle.WillEnter,
  ViewLifecycle.DidEnter,
  ViewLifecycle.WillLeave,
  ViewLifecycle.DidLeave,
  ViewLifecycle.WillUnload
];

export function bindLifecycleEvents(instance: any, element: HTMLElement) {
  LIFECYCLES.forEach(eventName => {
    element.addEventListener(eventName, (ev: CustomEvent) => {
      if (typeof instance[eventName] === 'function') {
        instance[eventName](ev.detail);
      }
    });
  });
}

const NavParamsToken = new InjectionToken<any>('NavParamsToken');


function getProviders(params: {[key: string]: any}) {
  return [
    {
      provide: NavParamsToken, useValue: params
    },
    {
      provide: NavParams, useFactory: provideNavParamsInjectable, deps: [NavParamsToken]
    }
  ];
}

function provideNavParamsInjectable(params: {[key: string]: any}) {
  return new NavParams(params);
}
