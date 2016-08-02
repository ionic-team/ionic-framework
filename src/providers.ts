import { ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';

import { ActionSheetController } from './components/action-sheet/action-sheet';
import { AlertController } from './components/alert/alert';
import { App } from './components/app/app';
import { AppRoot, UserRoot } from './components/app/app-root';
import { Config, provideConfig, UserConfig } from './config/config';
import { Events, provideEvents } from './util/events';
import { FeatureDetect } from './util/feature-detect';
import { Form } from './util/form';
import { GestureController } from './gestures/gesture-controller';
import { Keyboard } from './util/keyboard';
import { LoadingController } from './components/loading/loading';
import { MenuController } from './components/menu/menu-controller';
import { ModalController } from './components/modal/modal';
import { PickerController } from './components/picker/picker';
import { Platform, providePlatform, UserAgent, UserNavigatorPlatform } from './platform/platform';
import { PopoverController } from './components/popover/popover';
import { QueryParams, provideQueryParams, UserUrl } from './platform/query-params';
import { TapClick, provideTapClick } from './components/tap-click/tap-click';
import { ToastController } from './components/toast/toast';
import { Translate } from './translation/translate';

export { setupProvideEvents } from './util/events';


export function getWindowUserAgent() {
  return window.navigator.userAgent;
}

export function getWindowPlatform() {
  return window.navigator.platform;
}

export function getWindowLocation() {
  return window.location.href;
}
/**
 * @private
 */
export function ionicProviders(userRoot: any, userConfig?: any, deepLinks?: any[]): any[] {
  return [
    { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: userRoot, multi: true },
    { provide: UserAgent, useFactory: getWindowUserAgent },
    { provide: UserConfig, useValue: userConfig },
    { provide: UserNavigatorPlatform, useFactory: getWindowPlatform },
    { provide: UserRoot, useValue: userRoot },
    { provide: UserUrl, useFactory: getWindowLocation },

    provideConfig(),
    provideEvents(),
    provideForms(),
    providePlatform(),
    provideQueryParams(),
    provideTapClick(),
    disableDeprecatedForms(),

    ActionSheetController,
    AlertController,
    App,
    Form,
    FeatureDetect,
    GestureController,
    HTTP_PROVIDERS,
    Keyboard,
    LoadingController,
    MenuController,
    ModalController,
    PickerController,
    PopoverController,
    TapClick,
    ToastController,
    Translate,
  ];
}
