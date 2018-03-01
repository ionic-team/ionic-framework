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
  Events: {
    subscribe: (topic: string, ...handlers: Function[]) => void;
    unsubscribe: (topic: string, handler: Function) => void;
    publish: (topic: string, ...args: any[]) => any[];
  };
}

export interface IonicWindow extends Window {
  Ionic: IonicGlobal;
}
