import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injector
} from '@angular/core';

import { FrameworkMountingData } from '@ionic/core';

export interface AngularMountingData extends FrameworkMountingData {
  componentFactory?: ComponentFactory<any>;
  childInjector?: Injector;
  componentRef?: ComponentRef<any>;
  instance?: any;
  angularHostElement?: HTMLElement;
}

export interface AngularEscapeHatch {
  cfr: ComponentFactoryResolver;
  injector: Injector;
}