import { AfterViewInit, ElementRef, EventEmitter, Renderer, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { Ion } from '../ion';
import { Keyboard } from '../../platform/keyboard';
import { Tabs as ITabs } from '../../navigation/nav-interfaces';
import { NavController } from '../../navigation/nav-controller';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { NavigationContainer } from '../../navigation/navigation-container';
import { NavOptions } from '../../navigation/nav-util';
import { RootNode } from '../split-pane/split-pane';
import { Platform } from '../../platform/platform';
import { Tab } from './tab';
import { TabHighlight } from './tab-highlight';
import { ViewController } from '../../navigation/view-controller';
/**
 * @name Tabs
 * @description
 * Tabs make it easy to navigate between different pages or functional
 * aspects of an app. The Tabs component, written as `<ion-tabs>`, is
 * a container of individual [Tab](../Tab/) components. Each individual `ion-tab`
 * is a declarative component for a [NavController](../../../navigation/NavController/)
 *
 * For more information on using nav controllers like Tab or [Nav](../../nav/Nav/),
 * take a look at the [NavController API Docs](../../../navigation/NavController/).
 *
 * ### Placement
 *
 * The position of the tabs relative to the content varies based on
 * the mode. The tabs are placed at the bottom of the screen
 * for iOS and Android, and at the top for Windows by default. The position can
 * be configured using the `tabsPlacement` attribute on the `<ion-tabs>` component,
 * or in an app's [config](../../config/Config/).
 * See the [Input Properties](#input-properties) below for the available
 * values of `tabsPlacement`.
 *
 * ### Layout
 *
 * The layout for all of the tabs can be defined using the `tabsLayout`
 * property. If the individual tab has a title and icon, the icons will
 * show on top of the title by default. All tabs can be changed by setting
 * the value of `tabsLayout` on the `<ion-tabs>` element, or in your
 * app's [config](../../config/Config/). For example, this is useful if
 * you want to show tabs with a title only on Android, but show icons
 * and a title for iOS. See the [Input Properties](#input-properties)
 * below for the available values of `tabsLayout`.
 *
 * ### Selecting a Tab
 *
 * There are different ways you can select a specific tab from the tabs
 * component. You can use the `selectedIndex` property to set the index
 * on the `<ion-tabs>` element, or you can call `select()` from the `Tabs`
 * instance after creation. See [usage](#usage) below for more information.
 *
 * @usage
 *
 * You can add a basic tabs template to a `@Component` using the following
 * template:
 *
 * ```html
 * <ion-tabs>
 *   <ion-tab [root]="tab1Root"></ion-tab>
 *   <ion-tab [root]="tab2Root"></ion-tab>
 *   <ion-tab [root]="tab3Root"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * Where `tab1Root`, `tab2Root`, and `tab3Root` are each a page:
 *
 *```ts
 * @Component({
 *   templateUrl: 'build/pages/tabs/tabs.html'
 * })
 * export class TabsPage {
 *   // this tells the tabs component which Pages
 *   // should be each tab's root Page
 *   tab1Root = Page1;
 *   tab2Root = Page2;
 *   tab3Root = Page3;
 *
 *   constructor() {
 *
 *   }
 * }
 *```
 *
 * By default, the first tab will be selected upon navigation to the
 * Tabs page. We can change the selected tab by using `selectedIndex`
 * on the `<ion-tabs>` element:
 *
 * ```html
 * <ion-tabs selectedIndex="2">
 *   <ion-tab [root]="tab1Root"></ion-tab>
 *   <ion-tab [root]="tab2Root"></ion-tab>
 *   <ion-tab [root]="tab3Root"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * Since the index starts at `0`, this will select the 3rd tab which has
 * root set to `tab3Root`. If you wanted to change it dynamically from
 * your class, you could use [property binding](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#property-binding).
 *
 * Alternatively, you can grab the `Tabs` instance and call the `select()`
 * method. This requires the `<ion-tabs>` element to have an `id`. For
 * example, set the value of `id` to `myTabs`:
 *
 * ```html
 * <ion-tabs #myTabs>
 *   <ion-tab [root]="tab1Root"></ion-tab>
 *   <ion-tab [root]="tab2Root"></ion-tab>
 *   <ion-tab [root]="tab3Root"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * Then in your class you can grab the `Tabs` instance and call `select()`,
 * passing the index of the tab as the argument. Here we're grabbing the tabs
 * by using ViewChild.
 *
 *```ts
 * export class TabsPage {
 *
 * @ViewChild('myTabs') tabRef: Tabs;
 *
 * ionViewDidEnter() {
 *   this.tabRef.select(2);
 *  }
 *
 * }
 *```
 *
 * You can also switch tabs from a child component by calling `select()` on the
 * parent view using the `NavController` instance. For example, assuming you have
 * a `TabsPage` component, you could call the following from any of the child
 * components to switch to `TabsRoot3`:
 *
 *```ts
 * switchTabs() {
 *   this.navCtrl.parent.select(2);
 * }
 *```
 * @demo /docs/demos/src/tabs/
 *
 * @see {@link /docs/components#tabs Tabs Component Docs}
 * @see {@link ../Tab Tab API Docs}
 * @see {@link ../../config/Config Config API Docs}
 *
 */
export declare class Tabs extends Ion implements AfterViewInit, RootNode, ITabs, NavigationContainer {
    viewCtrl: ViewController;
    private _app;
    private _plt;
    private _linker;
    /** @internal */
    _ids: number;
    /** @internal */
    _tabs: Tab[];
    /** @internal */
    _sbPadding: boolean;
    /** @internal */
    _top: number;
    /** @internal */
    _bottom: number;
    /** @internal */
    id: string;
    /** @internal */
    _selectHistory: string[];
    /** @internal */
    _onDestroy: Subject<void>;
    /**
     * @input {string} A unique name for the tabs
     */
    name: string;
    /**
     * @input {number} The default selected tab index when first loaded. If a selected index isn't provided then it will use `0`, the first tab.
     */
    selectedIndex: number;
    /**
     * @input {string} Set the tabbar layout: `icon-top`, `icon-start`, `icon-end`, `icon-bottom`, `icon-hide`, `title-hide`.
     */
    tabsLayout: string;
    /**
     * @input {string} Set position of the tabbar: `top`, `bottom`.
     */
    tabsPlacement: string;
    /**
     * @input {boolean} If true, show the tab highlight bar under the selected tab.
     */
    tabsHighlight: boolean;
    /**
     * @output {any} Emitted when the tab changes.
     */
    ionChange: EventEmitter<Tab>;
    /**
     * @internal
     */
    _highlight: TabHighlight;
    /**
     * @internal
     */
    _tabbar: ElementRef;
    /**
     * @internal
     */
    portal: ViewContainerRef;
    /**
     * @hidden
     */
    parent: NavControllerBase;
    constructor(parent: NavController, viewCtrl: ViewController, _app: App, config: Config, elementRef: ElementRef, _plt: Platform, renderer: Renderer, _linker: DeepLinker, keyboard?: Keyboard);
    /**
     * @internal
     */
    setTabbarHidden(tabbarHidden: boolean): void;
    /**
     * @internal
     */
    ngOnDestroy(): void;
    /**
     * @internal
     */
    ngAfterViewInit(): void;
    /**
     * @internal
     */
    initTabs(): void;
    /**
     * @internal
     */
    _setConfig(attrKey: string, fallback: any): void;
    /**
     * @hidden
     */
    add(tab: Tab): string;
    /**
     * @param {number|Tab} tabOrIndex Index, or the Tab instance, of the tab to select.
     */
    select(tabOrIndex: number | Tab, opts?: NavOptions, fromUrl?: boolean): void;
    _fireChangeEvent(selectedTab: Tab): void;
    _tabSwitchEnd(selectedTab: Tab, selectedPage: ViewController, currentPage: ViewController): void;
    /**
     * Get the previously selected Tab which is currently not disabled or hidden.
     * @param {boolean} trimHistory If the selection history should be trimmed up to the previous tab selection or not.
     * @returns {Tab}
     */
    previousTab(trimHistory?: boolean): Tab;
    /**
     * @param {number} index Index of the tab you want to get
     * @returns {Tab} Returns the tab who's index matches the one passed
     */
    getByIndex(index: number): Tab;
    /**
     * @return {Tab} Returns the currently selected tab
     */
    getSelected(): Tab;
    /**
     * @internal
     */
    getActiveChildNavs(): Tab[];
    /**
     * @internal
     */
    getAllChildNavs(): any[];
    /**
     * @internal
     */
    getIndex(tab: Tab): number;
    /**
     * @internal
     */
    length(): number;
    /**
     * "Touch" the active tab, going back to the root view of the tab
     * or optionally letting the tab handle the event
     */
    private _updateCurrentTab(tab, fromUrl);
    /**
     * @internal
     * DOM WRITE
     */
    setTabbarPosition(top: number, bottom: number): void;
    /**
     * @internal
     */
    resize(): void;
    /**
     * @internal
     */
    initPane(): boolean;
    /**
     * @internal
     */
    paneChanged(isPane: boolean): void;
    goToRoot(opts: NavOptions): void;
    getType(): string;
    getSecondaryIdentifier(): string;
    /**
     * @private
     */
    _getSelectedTabIndex(secondaryId: string, fallbackIndex?: number): number;
}
