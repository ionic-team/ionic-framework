import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable,
  Injector,
} from '@angular/core';

import { FrameworkDelegate } from '@ionic/core';


@Injectable()
export class AngularDelegate {

  constructor(
    private appRef: ApplicationRef
  ) {}

  create(cfr: ComponentFactoryResolver, injector: Injector) {
    return new AngularFrameworkDelegate(cfr, injector, this.appRef);
  }
}


export class AngularFrameworkDelegate implements FrameworkDelegate {

  private elRefMap = new WeakMap<HTMLElement, any>();

  constructor(
    private cfr: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {}

  attachViewToDom(container: any, component: any, data?: any, cssClasses?: string[]): Promise<any> {

    const componentFactory = this.cfr.resolveComponentFactory(component);
    const hostElement = document.createElement(componentFactory.selector);
    if (data) {
      Object.assign(hostElement, data);
    }

    const childInjector = Injector.create([], this.injector);
    const componentRef = componentFactory.create(childInjector, [], hostElement);
    for (const clazz of cssClasses) {
      hostElement.classList.add(clazz);
    }

    container.appendChild(hostElement);

    this.appRef.attachView(componentRef.hostView);
    this.elRefMap.set(hostElement, componentRef);
    return Promise.resolve(hostElement);
  }

  removeViewFromDom(_container: any, component: any): Promise<void> {
    const mountingData = this.elRefMap.get(component);
    if (mountingData) {
      mountingData.componentRef.destroy();
      this.elRefMap.delete(component);
    }
    return Promise.resolve();
  }
}

