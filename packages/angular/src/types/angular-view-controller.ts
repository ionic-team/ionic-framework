import {
  ComponentFactory,
  ComponentRef,
  Injector
} from '@angular/core';

import { PublicViewController } from '@ionic/core';

export interface AngularViewController extends PublicViewController {
  componentFactory?: ComponentFactory<any>;
  injector?: Injector;
  componentRef?: ComponentRef<any>;
  instance?: any;
  angularHostElement?: HTMLElement;

}