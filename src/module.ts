import { ANALYZE_FOR_ENTRY_COMPONENTS, APP_INITIALIZER, ModuleWithProviders, NgModule, NgZone } from '@angular/core';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

/**
 * Import Providers
 */
import { ActionSheetController } from './components/action-sheet/action-sheet';
import { AlertController } from './components/alert/alert';
import { App } from './components/app/app';
import { Config, UserConfig, setupConfig } from './config/config';
import { DeepLinker, setupDeepLinker, UserDeepLinkConfig } from './navigation/deep-linker';
import { setupProvideEvents } from './util/events';
import { FeatureDetect } from './util/feature-detect';
import { Form } from './util/form';
import { GestureController } from './gestures/gesture-controller';
import { IonicGestureConfig } from './gestures/gesture-config';
import { Keyboard } from './util/keyboard';
import { LoadingController } from './components/loading/loading';
import { MenuController } from './components/menu/menu-controller';
import { ModalController } from './components/modal/modal';
import { PickerController } from './components/picker/picker';
import { Platform, setupPlatform, UserAgent, UserNavigatorPlatform, UserDir, UserLang } from './platform/platform';
import { PopoverController } from './components/popover/popover';
import { QueryParams, setupQueryParams, UserUrl } from './platform/query-params';
import { TapClick, setupTapClick } from './components/tap-click/tap-click';
import { ToastController } from './components/toast/toast';
import { Translate } from './translation/translate';
import { TransitionController } from './transitions/transition-controller';
import { UserRoot } from './components/app/app-root';
import { UrlSerializer } from './navigation/url-serializer';

/**
 * Import Overlay Entry Components
 */
import { ActionSheetCmp } from './components/action-sheet/action-sheet-component';
import { AlertCmp } from './components/alert/alert-component';
import { IONIC_DIRECTIVES } from './directives';
import { IonicApp } from './components/app/app-root';
import { LoadingCmp } from './components/loading/loading-component';
import { ModalCmp } from './components/modal/modal-component';
import { PickerCmp } from './components/picker/picker-component';
import { PopoverCmp } from './components/popover/popover-component';
import { ToastCmp } from './components/toast/toast-component';

/**
 * Export Providers
 */
export { DeepLinker, UserDeepLinkConfig } from './navigation/deep-linker';
export { NavController } from './navigation/nav-controller';
export { NavParams } from './navigation/nav-params';
export { NavLink, NavOptions, DeepLink, DeepLinkConfig } from './navigation/nav-util';
export { UrlSerializer } from './navigation/url-serializer';
export { ViewController } from './navigation/view-controller';


@NgModule({
  imports: [BrowserModule, HttpModule, FormsModule, ReactiveFormsModule],
  exports: [BrowserModule, HttpModule, FormsModule, ReactiveFormsModule, IONIC_DIRECTIVES],
  declarations: [
    ActionSheetCmp,
    AlertCmp,
    IONIC_DIRECTIVES,
    LoadingCmp,
    ModalCmp,
    PickerCmp,
    PopoverCmp,
    ToastCmp
  ],
  entryComponents: [
    ActionSheetCmp,
    AlertCmp,
    IonicApp,
    LoadingCmp,
    ModalCmp,
    PickerCmp,
    PopoverCmp,
    ToastCmp
  ]
})
export class IonicModule {

  static forRoot(userAppRoot: any, userConfig?: any, userDeepLinkConfig?: any): ModuleWithProviders {
    return {
      ngModule: IonicModule,
      providers: [
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: userAppRoot, multi: true },
        { provide: APP_INITIALIZER, useFactory: setupTapClick,
          deps: [
            Config,
            App,
            NgZone
          ],
          multi: true
        },
        { provide: APP_INITIALIZER, useFactory: setupProvideEvents, deps: [ Platform ], multi: true },
        { provide: Config, useFactory: setupConfig,
          deps: [
            UserConfig,
            QueryParams,
            Platform
          ]
        },
        { provide: DeepLinker, useFactory: setupDeepLinker,
          deps: [
            App,
            UrlSerializer,
            Location
          ]
        },
        { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: Platform, useFactory: setupPlatform,
          deps: [
            QueryParams,
            UserAgent,
            UserNavigatorPlatform,
            UserDir,
            UserLang,
            NgZone
          ]
        },
        { provide: QueryParams, useFactory: setupQueryParams,
          deps: [
            UserUrl
          ]
        },
        { provide: UserAgent, useFactory: getWindowUserAgent },
        { provide: UserDir, useFactory: getDocumentDir },
        { provide: UserLang, useFactory: getDocumentLang },
        { provide: UserNavigatorPlatform, useFactory: getWindowPlatform },
        { provide: UserRoot, useValue: userAppRoot },
        { provide: UserUrl, useFactory: getWindowLocation },
        { provide: UserConfig, useValue: userConfig },
        { provide: UserDeepLinkConfig, useValue: userDeepLinkConfig },

        ActionSheetController,
        AlertController,
        App,
        Form,
        FeatureDetect,
        GestureController,
        Keyboard,
        LoadingController,
        Location,
        MenuController,
        ModalController,
        PickerController,
        PopoverController,
        TapClick,
        ToastController,
        Translate,
        TransitionController,
        UrlSerializer
      ]
    };
  }

}

/**
 * @private
 */
export function getWindowUserAgent() {
  return window && window.navigator.userAgent;
}

/**
 * @private
 */
export function getWindowPlatform() {
  return window && window.navigator.platform;
}

/**
 * @private
 */
export function getWindowLocation() {
  return window && window.location.href;
}

/**
 * @private
 */
export function getDocumentDir() {
  return document && document.documentElement.dir;
}

/**
 * @private
 */
export function getDocumentLang() {
  return document && document.documentElement.lang;
}
