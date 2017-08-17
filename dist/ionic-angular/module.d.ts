/**
 * Import Angular
 */
import { ModuleWithProviders } from '@angular/core';
import { HashLocationStrategy, PathLocationStrategy, PlatformLocation } from '@angular/common';
/**
 * Import Other
 */
import { DeepLinkConfig } from './navigation/nav-util';
import { Config } from './config/config';
/**
 * @name IonicModule
 * @description
 * IonicModule is an [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html) that bootstraps
 * an Ionic App. By passing a root component, IonicModule will make sure that all of the components,
 * directives, and providers from the framework are imported.
 *
 * Any configuration for the app can be passed as the second argument to `forRoot`. This can be any
 * valid property from the [Config](/docs/api/config/Config/).
 *
 * @usage
 * ```ts
 * import { NgModule } from '@angular/core';
 *
 * import { IonicApp, IonicModule } from 'ionic-angular';
 *
 * import { MyApp } from './app.component';
 * import { HomePage } from '../pages/home/home';
 *
 * @NgModule({
 *   declarations: [
 *     MyApp,
 *     HomePage
 *   ],
 *   imports: [
 *     BrowserModule,
 *     IonicModule.forRoot(MyApp, {
 *
 *     })
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
export declare class IonicModule {
    /**
     * Set the root app component for you IonicModule
     * @param {any} appRoot The root AppComponent for this app.
     * @param {any} config Config Options for the app. Accepts any config property.
     * @param {any} deepLinkConfig Any configuration needed for the Ionic Deeplinker.
     */
    static forRoot(appRoot: any, config?: any, deepLinkConfig?: DeepLinkConfig): ModuleWithProviders;
}
/**
 * @name IonicPageModule
 * @description
 * IonicPageModule is an [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html) that
 * bootstraps a child [IonicPage](../navigation/IonicPage/) in order to set up routing.
 *
 * @usage
 * ```ts
 * import { NgModule } from '@angular/core';
 *
 * import { IonicPageModule } from 'ionic-angular';
 *
 * import { HomePage } from './home';
 *
 * @NgModule({
 * 	declarations: [
 * 		HomePage
 * 	],
 * 	imports: [
 * 		IonicPageModule.forChild(HomePage)
 * 	],
 * 	entryComponents: [
 * 		HomePage
 * 	]
 * })
 * export class HomePageModule { }
 * ```
 */
export declare class IonicPageModule {
    static forChild(page: any): ModuleWithProviders;
}
/**
 * @hidden
 */
export declare function provideLocationStrategy(platformLocationStrategy: PlatformLocation, baseHref: string, config: Config): HashLocationStrategy | PathLocationStrategy;
