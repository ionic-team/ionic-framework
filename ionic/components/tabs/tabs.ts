import {Component, Directive, ElementRef, Optional, Host, forwardRef, ViewContainerRef, ViewChild, ViewChildren, EventEmitter, Output, Input, Renderer, ViewEncapsulation} from 'angular2/core';

import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {Tab} from './tab';
import {TabButton} from './tab-button';
import {TabHighlight} from './tab-highlight';
import {Ion} from '../ion';
import {Platform} from '../../platform/platform';
import {NavController} from '../nav/nav-controller';
import {ViewController} from '../nav/view-controller';
import {isBlank, isTrueProperty} from '../../util/util';


/**
 * @name Tabs
 * @description
 * Tabs make it easy to navigate between different pages or functional
 * aspects of an app. The Tabs component, written as `<ion-tabs>`, is
 * a container of individual [Tab](../Tab/) components.
 *
 * ### Placement
 *
 * The position of the tabs relative to the content varies based on
 * the mode. By default, the tabs are placed at the bottom of the screen
 * for `ios` mode, and at the top for the `md` and `wp` modes. You can
 * configure the position using the `tabbarPlacement` property on the
 * `<ion-tabs>` element, or in your app's [config](../../config/Config/).
 * See the [Input Properties](#input-properties) below for the available
 * values of `tabbarPlacement`.
 *
 * ### Layout
 *
 * The layout for all of the tabs can be defined using the `tabbarLayout`
 * property. If the individual tab has a title and icon, the icons will
 * show on top of the title by default. All tabs can be changed by setting
 * the value of `tabbarLayout` on the `<ion-tabs>` element, or in your
 * app's [config](../../config/Config/). For example, this is useful if
 * you want to show tabs with a title only on Android, but show icons
 * and a title for iOS. See the [Input Properties](#input-properties)
 * below for the available values of `tabbarLayout`.
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
 * You can add a basic tabs template to a `@Page` using the following
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
 * @Page({
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
 * @ViewChild('myTabs) tabRef: Tabs
 *
 * onPageDidEnter() {
 *   this.tabRef.select(2);
 *  }
 *
 * }
 *```
 *
 * @demo /docs/v2/demos/tabs/
 *
 * @see {@link /docs/v2/components#tabs Tabs Component Docs}
 * @see {@link ../Tab Tab API Docs}
 * @see {@link ../../config/Config Config API Docs}
 *
 */
@Component({
  selector: 'ion-tabs',
  template:
    '<ion-navbar-section [class.statusbar-padding]="_sbPadding">' +
      '<template navbar-anchor></template>' +
    '</ion-navbar-section>' +
    '<ion-tabbar-section>' +
      '<tabbar role="tablist">' +
        '<a *ngFor="#t of _tabs" [tab]="t" class="tab-button" [class.tab-disabled]="!t.enabled" [class.tab-hidden]="!t.show" role="tab">' +
          '<ion-icon *ngIf="t.tabIcon" [name]="t.tabIcon" [isActive]="t.isSelected" class="tab-button-icon"></ion-icon>' +
          '<span *ngIf="t.tabTitle" class="tab-button-text">{{t.tabTitle}}</span>' +
          '<ion-badge *ngIf="t.tabBadge" class="tab-badge" [ngClass]="\'badge-\' + t.tabBadgeStyle">{{t.tabBadge}}</ion-badge>' +
          '<ion-button-effect></ion-button-effect>' +
        '</a>' +
        '<tab-highlight></tab-highlight>' +
      '</tabbar>' +
    '</ion-tabbar-section>' +
    '<ion-content-section>' +
      '<ng-content></ng-content>' +
    '</ion-content-section>',
  directives: [
    TabButton,
    TabHighlight,
    forwardRef(() => TabNavBarAnchor)
  ],
  encapsulation: ViewEncapsulation.None,
})
export class Tabs extends Ion {
  private _ids: number = -1;
  private _preloadTabs: boolean = null;
  private _tabs: Array<Tab> = [];
  private _onReady = null;
  private _sbPadding: boolean;
  private _useHighlight: boolean;

  /**
   * @private
   */
  id: number;

  /**
   * @private
   */
  navbarContainerRef: ViewContainerRef;

  /**
   * @private
   */
  subPages: boolean;

  /**
   * @input {number} The default selected tab index when first loaded. If a selected index isn't provided then it will use `0`, the first tab.
   */
  @Input() selectedIndex: any;

  /**
   * @input {boolean} Set whether to preload all the tabs: `true`, `false`.
   */
  @Input() preloadTabs: any;

  /**
   * @input {string} Set the tabbar layout: `icon-top`, `icon-left`, `icon-right`, `icon-bottom`, `icon-hide`, `title-hide`.
   */
  @Input() tabbarLayout: string;

  /**
   * @input {string} Set position of the tabbar: `top`, `bottom`.
   */
  @Input() tabbarPlacement: string;

  /**
   * @input {any} Expression to evaluate when the tab changes.
   */
  @Output() change: EventEmitter<Tab> = new EventEmitter();

  /**
   * @private
   */
  @ViewChild(TabHighlight) private _highlight: TabHighlight;

  /**
   * @private
   */
  @ViewChildren(TabButton) private _btns;

  /**
   * @private
   */
  parent: any;

  constructor(
    @Optional() parent: NavController,
    @Optional() viewCtrl: ViewController,
    private _app: IonicApp,
    private _config: Config,
    private _elementRef: ElementRef,
    private _platform: Platform,
    private _renderer: Renderer
  ) {
    super(_elementRef);
    this.parent = parent;
    this.id = ++tabIds;
    this.subPages = _config.getBoolean('tabSubPages');
    this._useHighlight = _config.getBoolean('tabbarHighlight');
    this._sbPadding = _config.getBoolean('statusbarPadding', false);

    if (parent) {
      // this Tabs has a parent Nav
      parent.registerChildNav(this);

    } else if (this._app) {
      // this is the root navcontroller for the entire app
      this._app.setRootNav(this);
    }

    // Tabs may also be an actual ViewController which was navigated to
    // if Tabs is static and not navigated to within a NavController
    // then skip this and don't treat it as it's own ViewController
    if (viewCtrl) {
      viewCtrl.setContent(this);
      viewCtrl.setContentRef(_elementRef);

      viewCtrl.onReady = (done) => {
        this._onReady = done;
      };
    }
  }

  /**
   * @private
   */
  ngAfterViewInit() {
    this._setConfig('tabbarPlacement', 'bottom');
    this._setConfig('tabbarLayout', 'icon-top');

    if (this._useHighlight) {
      this._platform.onResize(() => {
        this._highlight.select(this.getSelected());
      });
    }

    this._btns.toArray().forEach((tabButton: TabButton) => {
      tabButton.select.subscribe((tab: Tab) => {
        this.select(tab);
      });
    });

    let preloadTabs = (isBlank(this.preloadTabs) ? this._config.getBoolean('preloadTabs') : isTrueProperty(this.preloadTabs));

    // get the selected index
    let selectedIndex = this.selectedIndex ? parseInt(this.selectedIndex, 10) : 0;

    // ensure the selectedIndex isn't a hidden or disabled tab
    // also find the first available index incase we need it later
    let availableIndex = -1;
    this._tabs.forEach((tab, index) => {
      if (tab.enabled && tab.show && availableIndex < 0) {
        // we know this tab index is safe to show
        availableIndex = index;
      }

      if (index === selectedIndex && (!tab.enabled || !tab.show)) {
        // the selectedIndex is not safe to show
        selectedIndex = -1;
      }
    });

    if (selectedIndex < 0) {
      // the selected index wasn't safe to show
      // instead use an available index found to be safe to show
      selectedIndex = availableIndex;
    }

    this._tabs.forEach((tab, index) => {
      if (index === selectedIndex) {
        this.select(tab);

      } else if (preloadTabs) {
        tab.preload(1000 * index);
      }
    });
  }

  /**
   * @private
   */
  private _setConfig(attrKey, fallback) {
    var val = this[attrKey];
    if (isBlank(val)) {
      val = this._config.get(attrKey, fallback);
    }
    this._renderer.setElementAttribute(this._elementRef.nativeElement, attrKey, val);
  }

  /**
   * @private
   */
  add(tab: Tab) {
    tab.id = this.id + '-' + (++this._ids);
    this._tabs.push(tab);
  }

  /**
   * @param {number} index Index of the tab you want to select
   */
  select(tabOrIndex) {
    let selectedTab = (typeof tabOrIndex === 'number' ? this.getByIndex(tabOrIndex) : tabOrIndex);
    if (!selectedTab) {
      return;
    }

    let deselectedTab = this.getSelected();

    if (selectedTab === deselectedTab) {
      // no change
      return this._touchActive(selectedTab);
    }

    console.debug('Tabs, select', selectedTab.id);

    let opts = {
      animate: false
    };

    let deselectedPage;
    if (deselectedTab) {
      deselectedPage = deselectedTab.getActive();
      deselectedPage && deselectedPage.willLeave();
    }

    let selectedPage = selectedTab.getActive();
    selectedPage && selectedPage.willEnter();

    selectedTab.load(opts, () => {

      selectedTab.select.emit(selectedTab);
      this.change.emit(selectedTab);

      if (selectedTab.root) {
        // only show the selectedTab if it has a root
        // it's possible the tab is only for opening modal's or signing out
        // and doesn't actually have content. In the case there's no content
        // for a tab then do nothing and leave the current view as is
        this._tabs.forEach(tab => {
          tab.setSelected(tab === selectedTab);
        });

        if (this._useHighlight) {
          this._highlight.select(selectedTab);
        }
      }

      selectedPage && selectedPage.didEnter();
      deselectedPage && deselectedPage.didLeave();

      if (this._onReady) {
        this._onReady();
        this._onReady = null;
      }

    });
  }

  /**
   * @param {number} index Index of the tab you want to get
   * @returns {Tab} Returns the tab who's index matches the one passed
   */
  getByIndex(index: number): Tab {
    if (index < this._tabs.length && index > -1) {
      return this._tabs[index];
    }
    return null;
  }

  /**
   * @return {Tab} Returns the currently selected tab
   */
  getSelected(): Tab {
    for (let i = 0; i < this._tabs.length; i++) {
      if (this._tabs[i].isSelected) {
        return this._tabs[i];
      }
    }
    return null;
  }

  /**
   * @private
   */
  getActiveChildNav() {
    return this.getSelected();
  }

  /**
   * @private
   */
  getIndex(tab: Tab): number {
    return this._tabs.indexOf(tab);
  }

  /**
   * @private
   * "Touch" the active tab, going back to the root view of the tab
   * or optionally letting the tab handle the event
   */
  private _touchActive(tab: Tab) {
    let active = tab.getActive();

    if (!active) {
      return Promise.resolve();
    }

    let instance = active.instance;

    // If they have a custom tab selected handler, call it
    if (instance.tabSelected) {
      return instance.tabSelected();
    }

    // If we're a few pages deep, pop to root
    if (tab.length() > 1) {
      // Pop to the root view
      return tab.popToRoot();
    }

    // Otherwise, if the page we're on is not our real root, reset it to our
    // default root type
    if (tab.root !== active.componentType) {
      return tab.setRoot(tab.root);
    }

    // And failing all of that, we do something safe and secure
    return Promise.resolve();
  }

  /**
   * @private
   * Returns the root NavController. Returns `null` if Tabs is not
   * within a NavController.
   * @returns {NavController}
   */
  get rootNav(): NavController {
    let nav = this.parent;
    while (nav.parent) {
      nav = nav.parent;
    }
    return nav;
  }

}

let tabIds = -1;


/**
 * @private
 */
@Directive({selector: 'template[navbar-anchor]'})
class TabNavBarAnchor {
  constructor(@Host() tabs: Tabs, viewContainerRef: ViewContainerRef) {
    tabs.navbarContainerRef = viewContainerRef;
  }
}
