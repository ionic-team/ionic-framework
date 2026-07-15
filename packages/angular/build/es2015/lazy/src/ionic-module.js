var IonicModule_1;
import { __decorate } from "tslib";
import { CommonModule, DOCUMENT } from '@angular/common';
import { APP_INITIALIZER, NgModule, NgZone } from '@angular/core';
import { ConfigToken, AngularDelegate, provideComponentInputBinding } from '@ionic/angular/common';
import { appInitialize } from './app-initialize';
import { BooleanValueAccessorDirective, NumericValueAccessorDirective, SelectValueAccessorDirective, TextValueAccessorDirective, } from './directives/control-value-accessors';
import { IonBackButton } from './directives/navigation/ion-back-button';
import { IonNav } from './directives/navigation/ion-nav';
import { IonRouterOutlet } from './directives/navigation/ion-router-outlet';
import { IonTabs } from './directives/navigation/ion-tabs';
import { RouterLinkDelegateDirective, RouterLinkWithHrefDelegateDirective, } from './directives/navigation/router-link-delegate';
import { IonModal } from './directives/overlays/modal';
import { IonPopover } from './directives/overlays/popover';
import { DIRECTIVES } from './directives/proxies-list';
import { IonMaxValidator, IonMinValidator } from './directives/validators';
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
/**
 * @deprecated `IonicModule` is deprecated and will be removed in a future major version.
 * Use `provideIonicAngular()` instead, which works in both standalone and NgModule-based
 * applications. Refer to https://ionicframework.com/docs/angular/build-options for migration steps.
 */
let IonicModule = IonicModule_1 = class IonicModule {
    /**
     * @deprecated `IonicModule.forRoot()` is deprecated and will be removed in a future major version.
     * Use `provideIonicAngular()` instead. Any config passed here can be passed as an object to that
     * function. Refer to https://ionicframework.com/docs/angular/build-options for migration steps.
     */
    static forRoot(config = {}) {
        console.warn(`[Ionic Warning]: IonicModule has been deprecated in favor of provideIonicAngular() and will be removed in a future major version. Refer to https://ionicframework.com/docs/angular/build-options for migration steps.`);
        return {
            ngModule: IonicModule_1,
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
                AngularDelegate,
                provideComponentInputBinding(),
            ],
        };
    }
};
IonicModule = IonicModule_1 = __decorate([
    NgModule({
        declarations: DECLARATIONS,
        exports: DECLARATIONS,
        providers: [ModalController, PopoverController],
        imports: [CommonModule],
    })
], IonicModule);
export { IonicModule };
