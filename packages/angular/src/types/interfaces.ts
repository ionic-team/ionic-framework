import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injector
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EscapeHatch, FrameworkMountingData} from '@ionic/core';

export interface AngularMountingData extends FrameworkMountingData {
  componentFactory?: ComponentFactory<any>;
  childInjector?: Injector;
  componentRef?: ComponentRef<any>;
  instance?: any;
  angularHostElement?: HTMLElement;
}

export interface AngularEscapeHatch extends EscapeHatch {
  activatedRoute?: ActivatedRoute;
  cfr?: ComponentFactoryResolver;
  injector?: Injector;
}

export interface IonicGlobal {
  config: any;
  ael: (elm: any, eventName: string, cb: Function, opts: any) => void;
  raf: Function;
  rel: (elm: any, eventName: string, cb: Function, opts: any) => void;
}

export interface IonicWindow extends Window {
  Ionic: IonicGlobal;
  __zone_symbol__requestAnimationFrame: Function;
}
