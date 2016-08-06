import { HTTP_PROVIDERS } from '@angular/http';

import { ActionSheetController } from './components/action-sheet/action-sheet';
import { AlertController } from './components/alert/alert';
import { App } from './components/app/app';
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
import { Platform, providePlatform, UserAgent, UserNavigatorPlatform, UserDir, UserLang } from './platform/platform';
import { PopoverController } from './components/popover/popover';
import { QueryParams, provideQueryParams, UserUrl } from './platform/query-params';
import { TapClick, provideTapClick } from './components/tap-click/tap-click';
import { ToastController } from './components/toast/toast';
import { Translate } from './translation/translate';
import { TransitionController } from './transitions/transition-controller';


export function getWindowUserAgent() {
  return window && window.navigator.userAgent;
}

export function getWindowPlatform() {
  return window && window.navigator.platform;
}

export function getWindowLocation() {
  return window && window.location.href;
}

export function getDocumentDir() {
  return document && document.documentElement.dir;
}

export function getDocumentLang() {
  return document && document.documentElement.lang;
}

/**
 * @private
 */
export function ionicProviders(userConfig?: any, deepLinks?: any[]): any[] {
  return [
    { provide: UserAgent, useFactory: getWindowUserAgent },
    { provide: UserConfig, useValue: userConfig },
    { provide: UserDir, useFactory: getDocumentDir },
    { provide: UserLang, useFactory: getDocumentLang },
    { provide: UserNavigatorPlatform, useFactory: getWindowPlatform },
    { provide: UserUrl, useFactory: getWindowLocation },

    provideConfig(),
    provideEvents(),
    providePlatform(),
    provideQueryParams(),
    provideTapClick(),

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
    TransitionController
  ];
}
