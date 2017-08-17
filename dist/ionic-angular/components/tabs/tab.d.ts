import { ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, ElementRef, ErrorHandler, EventEmitter, NgZone, Renderer, ViewContainerRef } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { DomController } from '../../platform/dom-controller';
import { GestureController } from '../../gestures/gesture-controller';
import { Tab as ITab } from '../../navigation/nav-interfaces';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { NavOptions } from '../../navigation/nav-util';
import { Platform } from '../../platform/platform';
import { TabButton } from './tab-button';
import { Tabs } from './tabs';
import { TransitionController } from '../../transitions/transition-controller';
import { ViewController } from '../../navigation/view-controller';
/**
 * @name Tab
 * @description
 * The Tab component, written `<ion-tab>`, is styled based on the mode and should
 * be used in conjunction with the [Tabs](../Tabs/) component.
 *
 * Each `ion-tab` is a declarative component for a [NavController](../../../navigation/NavController/).
 * Basically, each tab is a `NavController`. For more information on using
 * navigation controllers take a look at the [NavController API Docs](../../../navigation/NavController/).
 *
 * See the [Tabs API Docs](../Tabs/) for more details on configuring Tabs.
 *
 * @usage
 *
 * To add a basic tab, you can use the following markup where the `root` property
 * is the page you want to load for that tab, `tabTitle` is the optional text to
 * display on the tab, and `tabIcon` is the optional [icon](../../icon/Icon/).
 *
 * ```html
 * <ion-tabs>
 *  <ion-tab [root]="chatRoot" tabTitle="Chat" tabIcon="chat"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * Then, in your class you can set `chatRoot` to an imported class:
 *
 * ```ts
 * import { ChatPage } from '../chat/chat';
 *
 * export class Tabs {
 *   // here we'll set the property of chatRoot to
 *   // the imported class of ChatPage
 *   chatRoot = ChatPage;
 *
 *   constructor() {
 *
 *   }
 * }
 * ```
 *
 * You can also pass some parameters to the root page of the tab through
 * `rootParams`. Below we pass `chatParams` to the Chat tab:
 *
 * ```html
 * <ion-tabs>
 *  <ion-tab [root]="chatRoot" [rootParams]="chatParams" tabTitle="Chat" tabIcon="chat"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * ```ts
 * export class Tabs {
 *   chatRoot = ChatPage;
 *
 *   // set some user information on chatParams
 *   chatParams = {
 *     user1: 'admin',
 *     user2: 'ionic'
 *   };
 *
 *   constructor() {
 *
 *   }
 * }
 * ```
 *
 * And in `ChatPage` you can get the data from `NavParams`:
 *
 * ```ts
 * export class ChatPage {
 *   constructor(navParams: NavParams) {
 *     console.log('Passed params', navParams.data);
 *   }
 * }
 * ```
 *
 * Sometimes you may want to call a method instead of navigating to a new
 * page. You can use the `(ionSelect)` event to call a method on your class when
 * the tab is selected. Below is an example of presenting a modal from one of
 * the tabs.
 *
 * ```html
 * <ion-tabs>
 *   <ion-tab (ionSelect)="chat()" tabTitle="Show Modal"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * ```ts
 * export class Tabs {
 *   constructor(public modalCtrl: ModalController) {
 *
 *   }
 *
 *   chat() {
 *     let modal = this.modalCtrl.create(ChatPage);
 *     modal.present();
 *   }
 * }
 * ```
 *
 *
 * @demo /docs/demos/src/tabs/
 * @see {@link /docs/components#tabs Tabs Component Docs}
 * @see {@link ../../tabs/Tabs Tabs API Docs}
 * @see {@link ../../nav/Nav Nav API Docs}
 * @see {@link ../../nav/NavController NavController API Docs}
 */
export declare class Tab extends NavControllerBase implements ITab {
    private _cd;
    private linker;
    private _dom;
    /**
     * @hidden
     */
    _isInitial: boolean;
    /**
     * @hidden
     */
    _isEnabled: boolean;
    /**
     * @hidden
     */
    _isShown: boolean;
    /**
     * @hidden
     */
    _tabId: string;
    /**
     * @hidden
     */
    _btnId: string;
    /**
     * @hidden
     */
    _loaded: boolean;
    /**
     * @hidden
     */
    isSelected: boolean;
    /**
     * @hidden
     */
    btn: TabButton;
    /**
     * @hidden
     */
    _tabsHideOnSubPages: boolean;
    /**
     * @hidden
     */
    _lazyRootFromUrl: any;
    /**
     * @hidden
     */
    _lazyRootFromUrlData: any;
    /**
     * @input {Page} Set the root page for this tab.
     */
    root: any;
    /**
     * @input {object} Any nav-params to pass to the root page of this tab.
     */
    rootParams: any;
    /**
     * @input {string} The URL path name to represent this tab within the URL.
     */
    tabUrlPath: string;
    /**
     * @input {string} The title of the tab button.
     */
    tabTitle: string;
    /**
     * @input {string} The icon for the tab button.
     */
    tabIcon: string;
    /**
     * @input {string} The badge for the tab button.
     */
    tabBadge: string;
    /**
     * @input {string} The badge color for the tab button.
     */
    tabBadgeStyle: string;
    /**
     * @input {boolean} If true, enable the tab. If false,
     * the user cannot interact with this element.
     * Default: `true`.
     */
    enabled: boolean;
    /**
     * @input {boolean} If true, the tab button is visible within the
     * tabbar. Default: `true`.
     */
    show: boolean;
    /**
     * @input {boolean} If true, hide the tabs on child pages.
     */
    tabsHideOnSubPages: boolean;
    /**
     * @output {Tab} Emitted when the current tab is selected.
     */
    ionSelect: EventEmitter<Tab>;
    constructor(parent: Tabs, app: App, config: Config, plt: Platform, elementRef: ElementRef, zone: NgZone, renderer: Renderer, cfr: ComponentFactoryResolver, _cd: ChangeDetectorRef, gestureCtrl: GestureController, transCtrl: TransitionController, linker: DeepLinker, _dom: DomController, errHandler: ErrorHandler);
    /**
     * @hidden
     */
    _vp: ViewContainerRef;
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    load(opts: NavOptions, done?: () => void): void | Promise<any>;
    /**
     * @hidden
     */
    resize(): void;
    /**
     * @hidden
     */
    _viewAttachToDOM(viewCtrl: ViewController, componentRef: ComponentRef<any>, viewport: ViewContainerRef): void;
    /**
     * @hidden
     */
    setSelected(isSelected: boolean): void;
    /**
     * @hidden
     */
    readonly index: number;
    /**
     * @hidden
     */
    updateHref(component: any, data: any): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    getType(): string;
    goToRoot(opts: NavOptions): Promise<any>;
}
