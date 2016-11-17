import { ANALYZE_FOR_ENTRY_COMPONENTS, APP_INITIALIZER, Inject, ModuleWithProviders, NgModule, NgZone, Optional } from '@angular/core';
import { APP_BASE_HREF, Location, LocationStrategy, HashLocationStrategy, PathLocationStrategy, PlatformLocation } from '@angular/common';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

/**
 * Import Providers
 */
import { ActionSheetController } from './components/action-sheet/action-sheet';
import { AlertController } from './components/alert/alert';
import { App } from './components/app/app';
import { Config, ConfigToken, setupConfig } from './config/config';
import { DeepLinker, setupDeepLinker } from './navigation/deep-linker';
import { Events, setupProvideEvents } from './util/events';
import { Form } from './util/form';
import { GestureController } from './gestures/gesture-controller';
import { Haptic } from './util/haptic';
import { IonicGestureConfig } from './gestures/gesture-config';
import { Keyboard } from './util/keyboard';
import { LoadingController } from './components/loading/loading';
import { MenuController } from './components/menu/menu-controller';
import { ModalController } from './components/modal/modal';
import { PickerController } from './components/picker/picker';
import { Platform, setupPlatform, UserAgentToken, NavigatorPlatformToken, DocumentDirToken, DocLangToken } from './platform/platform';
import { PlatformConfigToken, providePlatformConfigs } from './platform/platform-registry';
import { PopoverController } from './components/popover/popover';
import { QueryParams, setupQueryParams, UrlToken } from './platform/query-params';
import { TapClick, setupTapClick } from './components/tap-click/tap-click';
import { ToastController } from './components/toast/toast';
import { registerModeConfigs } from './config/mode-registry';
import { registerTransitions } from './transitions/transition-registry';
import { TransitionController } from './transitions/transition-controller';
import { AppRootToken } from './components/app/app-root';
import { UrlSerializer, setupUrlSerializer, DeepLinkConfigToken } from './navigation/url-serializer';
import { ClickBlock } from './util/click-block';
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
export { Config, setupConfig, ConfigToken } from './config/config';
export { Platform, setupPlatform, UserAgentToken, DocumentDirToken, DocLangToken, NavigatorPlatformToken } from './platform/platform';
export { Haptic } from './util/haptic';
export { QueryParams, setupQueryParams, UrlToken } from './platform/query-params';
export { DeepLinker } from './navigation/deep-linker';
export { NavController } from './navigation/nav-controller';
export { NavParams } from './navigation/nav-params';
export { NavLink, NavOptions, DeepLink, DeepLinkConfig, DeepLinkMetadata, DeepLinkMetadataType } from './navigation/nav-util';
export { UrlSerializer, DeepLinkConfigToken } from './navigation/url-serializer';
export { ViewController } from './navigation/view-controller';


/**
 * @name IonicModule
 * @description
 * IonicModule is a NgModule that helps bootstrap a whole Ionic App. By passing a root component, IonicModule will make sure that all the components and directives from the framework are provided. This includes components such as Tabs, Menus, and Slides, as well as classes like AlertController.
 *
 *
 * We're also able to pass any configuration to our app as a second argument for `.forRoot`. This is any valid config property from [the Config Class](/docs/v2/api/config/Config/).
 *
 * The last functionality that IonicModule allows you to configure is optional routes for DeepLinker. For more information on DeepLinker, please see the [DeepLinker Docs](/docs/v2/api/navigation/DeepLinker/)
 *
 * @usage
 * ```ts
 * import { NgModule } from '@angular/core';
 * import { IonicApp, IonicModule } from 'ionic-angular';
 * import { MyApp } from './app.component';
 * import { HomePage } from '../pages/home/home';
 * @NgModule({
 *   declarations: [
 *     MyApp,
 *     HomePage
 *   ],
 *   imports: [
 *     IonicModule.forRoot(MyApp)
 *   ],
 *   bootstrap: [IonicApp],
 *   entryComponents: [
 *     MyApp,
 *     HomePage
 *   ],
 *   providers: []
 * })
 * export class AppModule {}
 * ```
 */
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
    ToastCmp,
    ClickBlock
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
    /**
     * Set the root app component for you IonicModule
     * @param {any} appRoot The root AppComponent for this app.
     * @param {any} config Config Options for the app. Accepts any config property.
     * @param {any} deepLinkConfig Any configuration needed for the Ionic Deeplinker.
     */
  static forRoot(appRoot: any, config: any = null, deepLinkConfig: any = null): ModuleWithProviders {
    return {
      ngModule: IonicModule,
      providers: [
        // useValue: bootstrap values
        { provide: AppRootToken, useValue: appRoot },
        { provide: ConfigToken, useValue: config },
        { provide: DeepLinkConfigToken, useValue: deepLinkConfig },

        // useFactory: user values
        { provide: UserAgentToken, useFactory: provideUserAgent },
        { provide: DocumentDirToken, useFactory: provideDocumentDirection },
        { provide: DocLangToken, useFactory: provideDocumentLang },
        { provide: NavigatorPlatformToken, useFactory: provideNavigatorPlatform },
        { provide: UrlToken, useFactory: provideLocationHref },
        { provide: PlatformConfigToken, useFactory: providePlatformConfigs },

        // useFactory: ionic core providers
        { provide: QueryParams, useFactory: setupQueryParams, deps: [ UrlToken ] },
        { provide: Platform, useFactory: setupPlatform, deps: [ PlatformConfigToken, QueryParams, UserAgentToken, NavigatorPlatformToken, DocumentDirToken, DocLangToken, NgZone ] },
        { provide: Config, useFactory: setupConfig, deps: [ ConfigToken, QueryParams, Platform ] },

        // useFactory: ionic app initializers
        { provide: APP_INITIALIZER, useFactory: registerModeConfigs, deps: [ Config ], multi: true },
        { provide: APP_INITIALIZER, useFactory: registerTransitions, deps: [ Config ], multi: true },
        { provide: APP_INITIALIZER, useFactory: setupProvideEvents, deps: [ Platform ], multi: true },
        { provide: APP_INITIALIZER, useFactory: setupTapClick, deps: [ Config, App, NgZone ], multi: true },

        // useClass
        { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },

        // useValue
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: appRoot, multi: true },

        // ionic providers
        ActionSheetController,
        AlertController,
        App,
        Events,
        Form,
        Haptic,
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
        TransitionController,

        { provide: LocationStrategy, useFactory: provideLocationStrategy, deps: [ PlatformLocation, [ new Inject(APP_BASE_HREF), new Optional()], Config ] },
        { provide: UrlSerializer, useFactory: setupUrlSerializer, deps: [ DeepLinkConfigToken ] },
        { provide: DeepLinker, useFactory: setupDeepLinker, deps: [ App, UrlSerializer, Location ] },
      ]
    };
  }

}

/**
 * @private
 */
export function provideLocationStrategy(platformLocationStrategy: PlatformLocation,
                                        baseHref: string, config: Config) {
  return config.get('locationStrategy') === 'path' ?
         new PathLocationStrategy(platformLocationStrategy, baseHref) :
         new HashLocationStrategy(platformLocationStrategy, baseHref);
}

/**
 * @private
 */
export function provideUserAgent() {
  return window && window.navigator.userAgent;
}

/**
 * @private
 */
export function provideNavigatorPlatform() {
  return window && window.navigator.platform;
}

/**
 * @private
 */
export function provideLocationHref() {
  return window && window.location.href;
}

/**
 * @private
 */
export function provideDocumentDirection() {
  return document && document.documentElement.dir;
}

/**
 * @private
 */
export function provideDocumentLang() {
  return document && document.documentElement.lang;
}
