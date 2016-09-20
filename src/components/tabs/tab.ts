import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, ElementRef, EventEmitter, Input, NgZone, Optional, Output, Renderer, ViewChild, ViewEncapsulation, ViewContainerRef } from '@angular/core';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { GestureController } from '../../gestures/gesture-controller';
import { isTrueProperty } from '../../util/util';
import { Keyboard } from '../../util/keyboard';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { NavOptions } from '../../navigation/nav-util';
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
 * Each `ion-tab` is a declarative component for a [NavController](../NavController/).
 * Basically, each tab is a `NavController`. For more information on using
 * navigation controllers take a look at the [NavController API Docs](../../nav/NavController/).
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
 *  <ion-tab [root]="chatRoot" tabTitle="Chat" tabIcon="chat"><ion-tab>
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
 *  <ion-tab [root]="chatRoot" [rootParams]="chatParams" tabTitle="Chat" tabIcon="chat"><ion-tab>
 * </ion-tabs>
 * ```
 *
 * ```ts
 * export class Tabs {
 *   chatRoot = ChatPage;
 *
 *   // set some user information on chatParams
 *   chatParams = {
 *     user1: "admin",
 *     user2: "ionic"
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
 *     console.log("Passed params", navParams.data);
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
 *   <ion-tab (ionSelect)="chat()"></ion-tab>
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
 * @demo /docs/v2/demos/src/tabs/
 * @see {@link /docs/v2/components#tabs Tabs Component Docs}
 * @see {@link ../../tabs/Tabs Tabs API Docs}
 * @see {@link ../../nav/Nav Nav API Docs}
 * @see {@link ../../nav/NavController NavController API Docs}
 */
@Component({
  selector: 'ion-tab',
  template:
    '<div #viewport></div><div class="nav-decor"></div>',
  host: {
    '[attr.id]': '_tabId',
    '[attr.aria-labelledby]': '_btnId',
    'role': 'tabpanel'
  },
  encapsulation: ViewEncapsulation.None,
})
export class Tab extends NavControllerBase {
  /**
   * @private
   */
  _isInitial: boolean;
  /**
   * @private
   */
  _isEnabled: boolean = true;
  /**
   * @private
   */
  _isShown: boolean = true;
  /**
   * @private
   */
  _tabId: string;
  /**
   * @private
   */
  _btnId: string;
  /**
   * @private
   */
  _loaded: boolean;

  /**
   * @private
   */
  isSelected: boolean;

  /**
   * @private
   */
  btn: TabButton;

  /**
   * @input {Page} Set the root page for this tab.
   */
  @Input() root: any;

  /**
   * @input {object} Any nav-params to pass to the root page of this tab.
   */
  @Input() rootParams: any;

  /**
   * @input {string} The URL path name to represent this tab within the URL.
   */
  @Input() tabUrlPath: string;

  /**
   * @input {string} The title of the tab button.
   */
  @Input() tabTitle: string;

  /**
   * @input {string} The icon for the tab button.
   */
  @Input() tabIcon: string;

  /**
   * @input {string} The badge for the tab button.
   */
  @Input() tabBadge: string;

  /**
   * @input {string} The badge color for the tab button.
   */
  @Input() tabBadgeStyle: string;

  /**
   * @input {boolean} If the tab is enabled or not. If the tab
   * is not enabled then the tab button will still show, however,
   * the button will appear grayed out and will not be clickable.
   * Defaults to `true`.
   */
  @Input()
  get enabled(): boolean {
    return this._isEnabled;
  }
  set enabled(val: boolean) {
    this._isEnabled = isTrueProperty(val);
  }

  /**
   * @input {boolean} If the tab button is visible within the
   * tabbar or not. Defaults to `true`.
   */
  @Input()
  get show(): boolean {
    return this._isShown;
  }
  set show(val: boolean) {
    this._isShown = isTrueProperty(val);
  }

  /**
   * @input {boolean} Whether it's possible to swipe-to-go-back on this tab or not.
   */
  @Input()
  get swipeBackEnabled(): boolean {
    return this._sbEnabled;
  }
  set swipeBackEnabled(val: boolean) {
    this._sbEnabled = isTrueProperty(val);
  }

  /**
   * @output {Tab} Method to call when the current tab is selected
   */
  @Output() ionSelect: EventEmitter<Tab> = new EventEmitter<Tab>();

  constructor(
    parent: Tabs,
    app: App,
    config: Config,
    keyboard: Keyboard,
    elementRef: ElementRef,
    zone: NgZone,
    renderer: Renderer,
    cfr: ComponentFactoryResolver,
    private _cd: ChangeDetectorRef,
    gestureCtrl: GestureController,
    transCtrl: TransitionController,
    @Optional() private linker: DeepLinker
  ) {
    // A Tab is a NavController for its child pages
    super(parent, app, config, keyboard, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker);

    this.id = parent.add(this);

    this._tabId = 'tabpanel-' + this.id;
    this._btnId = 'tab-' + this.id;
  }

  /**
   * @private
   */
  @ViewChild('viewport', {read: ViewContainerRef})
  set _vp(val: ViewContainerRef) {
    this.setViewport(val);
  }

  /**
   * @private
   */
  ngOnInit() {
    this.tabBadgeStyle = this.tabBadgeStyle ? this.tabBadgeStyle : 'default';
  }

  /**
   * @private
   */
  load(opts: NavOptions, done?: Function) {
    if (!this._loaded && this.root) {
      this.push(this.root, this.rootParams, opts, done);
      this._loaded = true;

    } else {
      done(true);
    }
  }

  /**
   * @private
   */
  _viewInsert(viewCtrl: ViewController, componentRef: ComponentRef<any>, viewport: ViewContainerRef) {
    const isTabSubPage = (this.parent._subPages && viewCtrl.index > 0);

    if (isTabSubPage) {
      viewport = this.parent.portal;
    }

    super._viewInsert(viewCtrl, componentRef, viewport);

    if (isTabSubPage) {
      // add the .tab-subpage css class to tabs pages that should act like subpages
      const pageEleRef = viewCtrl.pageRef();
      if (pageEleRef) {
        this._renderer.setElementClass(pageEleRef.nativeElement, 'tab-subpage', true);
      }
    }
  }

  /**
   * @private
   */
  setSelected(isSelected: boolean) {
    this.isSelected = isSelected;

    this.setElementClass('show-tab', isSelected);
    this.setElementAttribute('aria-hidden', (!isSelected).toString());

    if (isSelected) {
      // this is the selected tab, detect changes
      this._cd.reattach();

    } else {
      // this tab is not selected, do not detect changes
      this._cd.detach();
    }
  }

  /**
   * @private
   */
  get index(): number {
    return this.parent.getIndex(this);
  }

  /**
   * @private
   */
  updateHref(component: any, data: any) {
    if (this.btn && this.linker) {
      let href = this.linker.createUrl(this, component, data) || '#';
      this.btn.updateHref(href);
    }
  }

  /**
   * @private
   */
  destroy() {
    this.destroy();
  }

}
