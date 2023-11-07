import { CommonModule, DOCUMENT } from '@angular/common';
import { ModuleWithProviders, APP_INITIALIZER, NgModule, NgZone } from '@angular/core';
import {
  PopoverController,
  ConfigToken,
  AngularDelegate,
  provideComponentInputBinding,
} from '@ionic/angular/common';
import { IonicConfig } from '@ionic/core';

import { appInitialize } from './app-initialize';
import {
  BooleanValueAccessorDirective,
  NumericValueAccessorDirective,
  RadioValueAccessorDirective,
  SelectValueAccessorDirective,
  TextValueAccessorDirective,
} from './directives/control-value-accessors';
import { IonBackButton } from './directives/navigation/ion-back-button';
import { IonNav } from './directives/navigation/ion-nav';
import { IonRouterOutlet } from './directives/navigation/ion-router-outlet';
import { IonTabs } from './directives/navigation/ion-tabs';
import {
  RouterLinkDelegateDirective,
  RouterLinkWithHrefDelegateDirective,
} from './directives/navigation/router-link-delegate';
import { IonModal } from './directives/overlays/modal';
import { IonPopover } from './directives/overlays/popover';
import { DIRECTIVES } from './directives/proxies-list';
import { IonMaxValidator, IonMinValidator } from './directives/validators';
import { ModalController } from './providers/modal-controller';

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
  IonBackButton,
  IonNav,
  RouterLinkDelegateDirective,
  RouterLinkWithHrefDelegateDirective,

  // validators
  IonMinValidator,
  IonMaxValidator,
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
        provideComponentInputBinding(),
      ],
    };
  }
}
