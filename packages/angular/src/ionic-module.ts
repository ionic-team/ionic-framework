import { CommonModule, DOCUMENT } from '@angular/common';
import { ModuleWithProviders, APP_INITIALIZER, NgModule, NgZone } from '@angular/core';
import { ExtraOptions, ROUTER_CONFIGURATION } from '@angular/router';
import { IonicConfig } from '@ionic/core';

import { appInitialize } from './app-initialize';
import {
  BooleanValueAccessorDirective,
  NumericValueAccessorDirective,
  RadioValueAccessorDirective,
  SelectValueAccessorDirective,
  TextValueAccessorDirective,
} from './directives/control-value-accessors';
import { IonBackButtonDelegateDirective } from './directives/navigation/ion-back-button';
import { INPUT_BINDER, IonRouterOutlet, RoutedComponentInputBinder } from './directives/navigation/ion-router-outlet';
import { IonTabs } from './directives/navigation/ion-tabs';
import { NavDelegate } from './directives/navigation/nav-delegate';
import {
  RouterLinkDelegateDirective,
  RouterLinkWithHrefDelegateDirective,
} from './directives/navigation/router-link-delegate';
import { IonModal } from './directives/overlays/modal';
import { IonPopover } from './directives/overlays/popover';
import { DIRECTIVES } from './directives/proxies-list';
import { AngularDelegate } from './providers/angular-delegate';
import { ConfigToken } from './providers/config';
import { ModalController } from './providers/modal-controller';
import { PopoverController } from './providers/popover-controller';

const DECLARATIONS = [
  // generated proxies
  ...DIRECTIVES,

  // manual proxies
  IonModal,
  IonPopover,

  // ngModel accessors
  BooleanValueAccessorDirective,
  NumericValueAccessorDirective,
  RadioValueAccessorDirective,
  SelectValueAccessorDirective,
  TextValueAccessorDirective,

  // navigation
  IonTabs,
  IonRouterOutlet,
  IonBackButtonDelegateDirective,
  NavDelegate,
  RouterLinkDelegateDirective,
  RouterLinkWithHrefDelegateDirective,
];

@NgModule({
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
  providers: [AngularDelegate, ModalController, PopoverController],
  imports: [CommonModule],
})
export class IonicModule {
  static forRoot(config?: IonicConfig): ModuleWithProviders<IonicModule> {
    return {
      ngModule: IonicModule,
      providers: [
        {
          provide: ConfigToken,
          useValue: config,
        },
        {
          provide: APP_INITIALIZER,
          useFactory: appInitialize,
          multi: true,
          deps: [ConfigToken, DOCUMENT, NgZone],
        },
        {
          provide: INPUT_BINDER,
          useFactory: componentInputBindingFactory,
          deps: [ROUTER_CONFIGURATION],
        },
      ],
    };
  }
}

function componentInputBindingFactory(routerConfig?: ExtraOptions) {
  if ((routerConfig as any).bindToComponentInputs) {
    return new RoutedComponentInputBinder();
  }
  return null;
}
