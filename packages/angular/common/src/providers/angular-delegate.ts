import {
  ApplicationRef,
  NgZone,
  Injectable,
  Injector,
  EnvironmentInjector,
  inject,
  createComponent,
  InjectionToken,
  ComponentRef,
} from '@angular/core';
import {
  FrameworkDelegate,
  LIFECYCLE_DID_ENTER,
  LIFECYCLE_DID_LEAVE,
  LIFECYCLE_WILL_ENTER,
  LIFECYCLE_WILL_LEAVE,
  LIFECYCLE_WILL_UNLOAD,
} from '@ionic/core/components';

import { NavParams } from '../directives/navigation/nav-params';

// TODO(FW-2827): types

@Injectable()
export class AngularDelegate {
  private zone = inject(NgZone);
  private applicationRef = inject(ApplicationRef);

  create(
    environmentInjector: EnvironmentInjector,
    injector: Injector,
    elementReferenceKey?: string
  ): AngularFrameworkDelegate {
    return new AngularFrameworkDelegate(
      environmentInjector,
      injector,
      this.applicationRef,
      this.zone,
      elementReferenceKey
    );
  }
}

export class AngularFrameworkDelegate implements FrameworkDelegate {
  private elRefMap = new WeakMap<HTMLElement, ComponentRef<any>>();
  private elEventsMap = new WeakMap<HTMLElement, () => void>();

  constructor(
    private environmentInjector: EnvironmentInjector,
    private injector: Injector,
    private applicationRef: ApplicationRef,
    private zone: NgZone,
    private elementReferenceKey?: string
  ) {}

  attachViewToDom(container: any, component: any, params?: any, cssClasses?: string[]): Promise<any> {
    return this.zone.run(() => {
      return new Promise((resolve) => {
        const componentProps = {
          ...params,
        };

        /**
         * Ionic Angular passes a reference to a modal
         * or popover that can be accessed using a
         * variable in the overlay component. If
         * elementReferenceKey is defined, then we should
         * pass a reference to the component using
         * elementReferenceKey as the key.
         */
        if (this.elementReferenceKey !== undefined) {
          componentProps[this.elementReferenceKey] = container;
        }

        const el = attachView(
          this.zone,
          this.environmentInjector,
          this.injector,
          this.applicationRef,
          this.elRefMap,
          this.elEventsMap,
          container,
          component,
          componentProps,
          cssClasses,
          this.elementReferenceKey
        );
        resolve(el);
      });
    });
  }

  removeViewFromDom(_container: any, component: any): Promise<void> {
    return this.zone.run(() => {
      return new Promise((resolve) => {
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
  environmentInjector: EnvironmentInjector,
  injector: Injector,
  applicationRef: ApplicationRef,
  elRefMap: WeakMap<HTMLElement, ComponentRef<any>>,
  elEventsMap: WeakMap<HTMLElement, () => void>,
  container: any,
  component: any,
  params: any,
  cssClasses: string[] | undefined,
  elementReferenceKey: string | undefined
): any => {
  /**
   * Wraps the injector with a custom injector that
   * provides NavParams to the component.
   *
   * NavParams is a legacy feature from Ionic v3 that allows
   * Angular developers to provide data to a component
   * and access it by providing NavParams as a dependency
   * in the constructor.
   *
   * The modern approach is to access the data directly
   * from the component's class instance.
   */
  const childInjector = Injector.create({
    providers: getProviders(params),
    parent: injector,
  });

  const componentRef = createComponent<any>(component, {
    environmentInjector,
    elementInjector: childInjector,
  });

  const instance = componentRef.instance;
  const hostElement = componentRef.location.nativeElement;

  if (params) {
    /**
     * For modals and popovers, a reference to the component is
     * added to `params` during the call to attachViewToDom. If
     * a reference using this name is already set, this means
     * the app is trying to use the name as a component prop,
     * which will cause collisions.
     */
    if (elementReferenceKey && instance[elementReferenceKey] !== undefined) {
      console.error(
        `[Ionic Error]: ${elementReferenceKey} is a reserved property when using ${container.tagName.toLowerCase()}. Rename or remove the "${elementReferenceKey}" property from ${
          component.name
        }.`
      );
    }

    /**
     * Angular 14.1 added support for setInput
     * so we need to fall back to Object.assign
     * for Angular 14.0.
     */
    if (componentRef.setInput !== undefined) {
      const { modal, popover, otherParams } = params;
      /**
       * Any key/value pairs set in componentProps
       * must be set as inputs on the component instance.
       */
      for (const key in otherParams) {
        componentRef.setInput(key, otherParams[key]);
      }

      /**
       * Using setInput will cause an error when
       * setting modal/popover on a component that
       * does not define them as an input. For backwards
       * compatibility purposes we fall back to using
       * Object.assign for these properties.
       */
      if (modal !== undefined) {
        Object.assign(instance, { modal });
      }

      if (popover !== undefined) {
        Object.assign(instance, { popover });
      }
    } else {
      Object.assign(instance, params);
    }
  }
  if (cssClasses) {
    for (const cssClass of cssClasses) {
      hostElement.classList.add(cssClass);
    }
  }
  const unbindEvents = bindLifecycleEvents(zone, instance, hostElement);
  container.appendChild(hostElement);

  applicationRef.attachView(componentRef.hostView);

  elRefMap.set(hostElement, componentRef);
  elEventsMap.set(hostElement, unbindEvents);
  return hostElement;
};

const LIFECYCLES = [
  LIFECYCLE_WILL_ENTER,
  LIFECYCLE_DID_ENTER,
  LIFECYCLE_WILL_LEAVE,
  LIFECYCLE_DID_LEAVE,
  LIFECYCLE_WILL_UNLOAD,
];

export const bindLifecycleEvents = (zone: NgZone, instance: any, element: HTMLElement): (() => void) => {
  return zone.run(() => {
    const unregisters = LIFECYCLES.filter((eventName) => typeof instance[eventName] === 'function').map((eventName) => {
      const handler = (ev: any) => instance[eventName](ev.detail);
      element.addEventListener(eventName, handler);
      return () => element.removeEventListener(eventName, handler);
    });
    return () => unregisters.forEach((fn) => fn());
  });
};

const NavParamsToken = new InjectionToken<any>('NavParamsToken');

const getProviders = (params: { [key: string]: any }) => {
  return [
    {
      provide: NavParamsToken,
      useValue: params,
    },
    {
      provide: NavParams,
      useFactory: provideNavParamsInjectable,
      deps: [NavParamsToken],
    },
  ];
};

const provideNavParamsInjectable = (params: { [key: string]: any }) => {
  return new NavParams(params);
};
