import { OpaqueToken } from '@angular/core';
/**
* @ngdoc service
* @name Config
* @module ionic
* @description
* Config allows you to set the modes of your components
*/
import { Platform } from '../platform/platform';
/**
 * @name Config
 * @demo /docs/demos/src/config/
 * @description
 * The Config lets you configure your entire app or specific platforms.
 * You can set the tab placement, icon mode, animations, and more here.
 *
 * ```ts
 * import { IonicApp, IonicModule } from 'ionic-angular';
 *
 * @NgModule({
 *   declarations: [ MyApp ],
 *   imports: [
 *     BrowserModule,
 *     IonicModule.forRoot(MyApp, {
 *       backButtonText: 'Go Back',
 *       iconMode: 'ios',
 *       modalEnter: 'modal-slide-in',
 *       modalLeave: 'modal-slide-out',
 *       tabsPlacement: 'bottom',
 *       pageTransition: 'ios-transition'
 *     }, {}
 *   )],
 *   bootstrap: [IonicApp],
 *   entryComponents: [ MyApp ],
 *   providers: []
 * })
 * ```
 *
 *
 * Config can be overwritten at multiple levels allowing for more granular configuration.
 * Below is an example where an app can override any setting we want based on a platform.
 *
 * ```ts
 * import { IonicModule } from 'ionic-angular';
 *
 * @NgModule({
 *   ...
 *   imports: [
 *     BrowserModule,
 *     IonicModule.forRoot(MyApp, {
 *       tabsPlacement: 'bottom',
 *       platforms: {
 *         ios: {
 *           tabsPlacement: 'top',
 *         }
 *       }
 *     }, {}
 *   )],
 *   ...
 * })
 * ```
 *
 * We could also configure these values at a component level. Take `tabsPlacement`,
 * we can configure this as a property on our `ion-tabs`.
 *
 * ```html
 * <ion-tabs tabsPlacement="top">
 *   <ion-tab tabTitle="Dash" tabIcon="pulse" [root]="tabRoot"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * The last way we could configure is through URL query strings. This is useful for testing
 * while in the browser. Simply add `?ionic<PROPERTYNAME>=<value>` to the url.
 *
 * ```bash
 * http://localhost:8100/?ionicTabsPlacement=bottom
 * ```
 *
 * Any value can be added to config, and looked up at a later in any component.
 *
 * ```js
 * config.set('ios', 'favoriteColor', 'green');
 *
 * // from any page in your app:
 * config.get('favoriteColor'); // 'green' when iOS
 * ```
 *
 *
 * A config value can come from anywhere and be anything, but there are default
 * values for each mode. The [theming](../../../theming/platform-specific-styles/)
 * documentation has a chart of the default mode configuration. The following
 * chart displays each property with a description of what it controls.
 *
 *
 * | Config Property          | Type                | Details                                                                                                                                          |
 * |--------------------------|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
 * | `activator`              | `string`            | Used for buttons, changes the effect of pressing on a button. Available options: `"ripple"`, `"highlight"`.                                      |
 * | `actionSheetEnter`       | `string`            | The name of the transition to use while an action sheet is presented.                                                                            |
 * | `actionSheetLeave`       | `string`            | The name of the transition to use while an action sheet is dismissed.                                                                            |
 * | `alertEnter`             | `string`            | The name of the transition to use while an alert is presented.                                                                                   |
 * | `alertLeave`             | `string`            | The name of the transition to use while an alert is dismissed.                                                                                   |
 * | `backButtonText`         | `string`            | The text to display by the back button icon in the navbar.                                                                                       |
 * | `backButtonIcon`         | `string`            | The icon to use as the back button icon.                                                                                                         |
 * | `iconMode`               | `string`            | The mode to use for all icons throughout the application. Available options: `"ios"`, `"md"`                                                     |
 * | `locationStrategy`       | `string`            | Set to 'path' to remove hashbangs when using Deeplinking.                                                                                        |
 * | `loadingEnter`           | `string`            | The name of the transition to use while a loading indicator is presented.                                                                        |
 * | `loadingLeave`           | `string`            | The name of the transition to use while a loading indicator is dismissed.                                                                        |
 * | `menuType`               | `string`            | Type of menu to display. Available options: `"overlay"`, `"reveal"`, `"push"`.                                                                   |
 * | `modalEnter`             | `string`            | The name of the transition to use while a modal is presented.                                                                                    |
 * | `modalLeave`             | `string`            | The name of the transition to use while a modal is dismiss.                                                                                      |
 * | `mode`                   | `string`            | The mode to use throughout the application.                                                                                                      |
 * | `pageTransition`         | `string`            | The name of the transition to use while changing pages. Available options: `"ios-transition"`, `"md-transition"`, `"wp-transition"`.             |
 * | `pickerEnter`            | `string`            | The name of the transition to use while a picker is presented.                                                                                   |
 * | `pickerLeave`            | `string`            | The name of the transition to use while a picker is dismissed.                                                                                   |
 * | `popoverEnter`           | `string`            | The name of the transition to use while a popover is presented.                                                                                  |
 * | `popoverLeave`           | `string`            | The name of the transition to use while a popover is dismissed.                                                                                  |
 * | `spinner`                | `string`            | The default spinner to use when a name is not defined.                                                                                           |
 * | `swipeBackEnabled`       | `boolean`           | Whether native iOS swipe to go back functionality is enabled.                                                                                    |
 * | `tabsHighlight`          | `boolean`           | Whether to show a highlight line under the tab when it is selected.                                                                              |
 * | `tabsLayout`             | `string`            | The layout to use for all tabs. Available options: `"icon-top"`, `"icon-start"`, `"icon-end"`, `"icon-bottom"`, `"icon-hide"`, `"title-hide"`.   |
 * | `tabsPlacement`          | `string`            | The position of the tabs relative to the content. Available options: `"top"`, `"bottom"`                                                         |
 * | `tabsHideOnSubPages`     | `boolean`           | Whether to hide the tabs on child pages or not. If `true` it will not show the tabs on child pages.                                              |
 * | `toastEnter`             | `string`            | The name of the transition to use while a toast is presented.                                                                                    |
 * | `toastLeave`             | `string`            | The name of the transition to use while a toast is dismissed.                                                                                    |
 *
**/
export declare class Config {
    private _c;
    private _s;
    private _modes;
    private _trns;
    /**
     * @hidden
     */
    plt: Platform;
    /**
     * @hidden
     */
    init(config: any, plt: Platform): void;
    /**
     * @name get
     * @description
     * Returns a single config value, given a key.
     *
     * @param {string} [key] - the key for the config value
     * @param {any} [fallbackValue] - a fallback value to use when the config
     * value was not found, or is config value is `null`. Fallback value
     *  defaults to `null`.
     */
    get(key: string, fallbackValue?: any): any;
    /**
     * @name getBoolean
     * @description
     * Same as `get()`, however always returns a boolean value. If the
     * value from `get()` is `null`, then it'll return the `fallbackValue`
     * which defaults to `false`. Otherwise, `getBoolean()` will return
     * if the config value is truthy or not. It also returns `true` if
     * the config value was the string value `"true"`.
     * @param {string} [key] - the key for the config value
     * @param {boolean} [fallbackValue] - a fallback value to use when the config
     * value was `null`. Fallback value defaults to `false`.
     */
    getBoolean(key: string, fallbackValue?: boolean): boolean;
    /**
     * @name getNumber
     * @description
     * Same as `get()`, however always returns a number value. Uses `parseFloat()`
     * on the value received from `get()`. If the result from the parse is `NaN`,
     * then it will return the value passed to `fallbackValue`. If no fallback
     * value was provided then it'll default to returning `NaN` when the result
     * is not a valid number.
     * @param {string} [key] - the key for the config value
     * @param {number} [fallbackValue] - a fallback value to use when the config
     * value turned out to be `NaN`. Fallback value defaults to `NaN`.
     */
    getNumber(key: string, fallbackValue?: number): number;
    /**
     * @name set
     * @description
     * Sets a single config value.
     *
     * @param {string} [platform] - The platform (either 'ios' or 'android') that the config value should apply to. Leaving this blank will apply the config value to all platforms.
     * @param {string} [key] - The key used to look up the value at a later point in time.
     * @param {string} [value] - The config value being stored.
     */
    set(...args: any[]): this;
    /**
     * @hidden
     * @name settings()
     * @description
     */
    settings(arg0?: any, arg1?: any): any;
    /**
     * @hidden
     */
    setModeConfig(modeName: string, modeConfig: any): void;
    /**
     * @hidden
     */
    getModeConfig(modeName: string): any;
    /**
     * @hidden
     */
    setTransition(trnsName: string, trnsClass: any): void;
    /**
     * @hidden
     */
    getTransition(trnsName: string): any;
}
/**
 * @hidden
 */
export declare function setupConfig(userConfig: any, plt: Platform): Config;
/**
 * @hidden
 */
export declare const ConfigToken: OpaqueToken;
