import { Component, ElementRef, EventEmitter, Input, Output, Optional, Renderer, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';

import { App } from '../app/app';
import { Badge } from '../badge/badge';
import { Config } from '../../config/config';
import { Content } from '../content/content';
import { Icon } from '../icon/icon';
import { Ion } from '../ion';
import { isBlank, isPresent, isTrueProperty } from '../../util/util';
import { nativeRaf } from '../../util/dom';
import { NavController } from '../nav/nav-controller';
import { NavControllerBase } from '../nav/nav-controller-base';
import { NavOptions, DIRECTION_FORWARD } from '../nav/nav-interfaces';
import { Platform } from '../../platform/platform';
import { Tab } from './tab';
import { TabButton } from './tab-button';
import { TabHighlight } from './tab-highlight';
import { ViewController } from '../nav/view-controller';


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
 * configure the position using the `tabsPlacement` property on the
 * `<ion-tabs>` element, or in your app's [config](../../config/Config/).
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
 * @demo /docs/v2/demos/tabs/
 *
 * @see {@link /docs/v2/components#tabs Tabs Component Docs}
 * @see {@link ../Tab Tab API Docs}
 * @see {@link ../../config/Config Config API Docs}
 *
 */
@Component({
  selector: 'ion-tabs',
  template: `
    <ion-tabbar role="tablist" #tabbar>
      <a *ngFor="let t of _tabs" [tab]="t" class="tab-button" [class.tab-disabled]="!t.enabled" [class.tab-hidden]="!t.show" role="tab" href="#" (ionSelect)="select($event)">
        <ion-icon *ngIf="t.tabIcon" [name]="t.tabIcon" [isActive]="t.isSelected" class="tab-button-icon"></ion-icon>
        <span *ngIf="t.tabTitle" class="tab-button-text">{{t.tabTitle}}</span>
        <ion-badge *ngIf="t.tabBadge" class="tab-badge" [ngClass]="\'badge-\' + t.tabBadgeStyle">{{t.tabBadge}}</ion-badge>
        <ion-button-effect></ion-button-effect>
      </a>
      <tab-highlight></tab-highlight>
    </ion-tabbar>
    <ng-content></ng-content>
  `,
  directives: [Badge, Icon, NgClass, NgFor, NgIf, TabButton, TabHighlight],
  encapsulation: ViewEncapsulation.None,
})
export class Tabs extends Ion {
  private _ids: number = -1;
  private _tabs: Tab[] = [];
  private _onReady: any = null;
  private _sbPadding: boolean;
  private _useHighlight: boolean;
  private _top: number;
  private _bottom: number;

  /**
   * @private
   */
  id: string;

  /**
   * @private
   */
  selectHistory: string[] = [];

  /**
   * @input {number} The default selected tab index when first loaded. If a selected index isn't provided then it will use `0`, the first tab.
   */
  @Input() selectedIndex: any;

  /**
   * @input {boolean} Set whether to preload all the tabs: `true`, `false`.
   */
  @Input() preloadTabs: any;

  /**
   * @private DEPRECATED. Please use `tabsLayout` instead.
   */
  @Input() private tabbarLayout: string;

  /**
   * @input {string} Set the tabbar layout: `icon-top`, `icon-left`, `icon-right`, `icon-bottom`, `icon-hide`, `title-hide`.
   */
  @Input() tabsLayout: string;

  /**
   * @private DEPRECATED. Please use `tabsPlacement` instead.
   */
  @Input() private tabbarPlacement: string;

  /**
   * @input {string} Set position of the tabbar: `top`, `bottom`.
   */
  @Input() tabsPlacement: string;

  /**
   * @input {any} Expression to evaluate when the tab changes.
   */
  @Output() ionChange: EventEmitter<Tab> = new EventEmitter<Tab>();

  /**
   * @private
   */
  @ViewChild(TabHighlight) private _highlight: TabHighlight;

  /**
   * @private
   */
  @ViewChild('tabbar') private _tabbar: ElementRef;

  /**
   * @private
   */
  parent: NavControllerBase;

  constructor(
    @Optional() parent: NavController,
    @Optional() public viewCtrl: ViewController,
    private _app: App,
    private _config: Config,
    private _elementRef: ElementRef,
    private _platform: Platform,
    private _renderer: Renderer
  ) {
    super(_elementRef);

    this.parent = <NavControllerBase>parent;
    this.id = 't' + (++tabIds);
    this._sbPadding = _config.getBoolean('statusbarPadding');
    this._useHighlight = _config.getBoolean('tabsHighlight');

    // TODO deprecated 07-07-2016 beta.11
    if (_config.get('tabSubPages') !== null) {
      console.warn('Config option "tabSubPages" has been deprecated. The Material Design spec now supports Bottom Navigation: https://material.google.com/components/bottom-navigation.html');
    }

    // TODO deprecated 07-07-2016 beta.11
    if (_config.get('tabbarHighlight') !== null) {
      console.warn('Config option "tabbarHighlight" has been deprecated. Please use "tabsHighlight" instead.');
      this._useHighlight = _config.getBoolean('tabbarHighlight');
    }

    if (this.parent) {
      // this Tabs has a parent Nav
      this.parent.registerChildNav(this);

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

      viewCtrl.loaded = (done) => {
        this._onReady = done;
      };
    }
  }

  /**
   * @private
   */
  ngAfterViewInit() {
    this._setConfig('tabsPlacement', 'bottom');
    this._setConfig('tabsLayout', 'icon-top');

    // TODO deprecated 07-07-2016 beta.11
    this._setConfig('tabbarPlacement', 'bottom');
    this._setConfig('tabbarLayout', 'icon-top');

    // TODO deprecated 07-07-2016 beta.11
    if (this.tabbarPlacement !== undefined) {
      console.warn('Input "tabbarPlacement" has been deprecated. Please use "tabsPlacement" instead.');
      this._renderer.setElementAttribute(this._elementRef.nativeElement, 'tabsPlacement', this.tabbarPlacement);
      this.tabsPlacement = this.tabbarPlacement;
    }

    // TODO deprecated 07-07-2016 beta.11
    if (this._config.get('tabbarPlacement') !== null) {
      console.warn('Config option "tabbarPlacement" has been deprecated. Please use "tabsPlacement" instead.');
      this._renderer.setElementAttribute(this._elementRef.nativeElement, 'tabsPlacement', this._config.get('tabbarPlacement'));
    }

    // TODO deprecated 07-07-2016 beta.11
    if (this.tabbarLayout !== undefined) {
      console.warn('Input "tabbarLayout" has been deprecated. Please use "tabsLayout" instead.');
      this._renderer.setElementAttribute(this._elementRef.nativeElement, 'tabsLayout', this.tabbarLayout);
      this.tabsLayout = this.tabbarLayout;
    }

    // TODO deprecated 07-07-2016 beta.11
    if (this._config.get('tabbarLayout') !== null) {
      console.warn('Config option "tabbarLayout" has been deprecated. Please use "tabsLayout" instead.');
      this._renderer.setElementAttribute(this._elementRef.nativeElement, 'tabsLayout', this._config.get('tabsLayout'));
    }

    if (this._useHighlight) {
      this._platform.onResize(() => {
        this._highlight.select(this.getSelected());
      });
    }

    this.initTabs();
  }

  /**
   * @private
   */
  initTabs() {
    // get the selected index from the input
    // otherwise default it to use the first index
    let selectedIndex = (isBlank(this.selectedIndex) ? 0 : parseInt(this.selectedIndex, 10));

    // get the selectedIndex and ensure it isn't hidden or disabled
    let selectedTab = this._tabs.find((t, i) => i === selectedIndex && t.enabled && t.show);
    if (!selectedTab) {
      // wasn't able to select the tab they wanted
      // try to find the first tab that's available
      selectedTab = this._tabs.find(t => t.enabled && t.show);
    }

    if (selectedTab) {
      // we found a tab to select
      this.select(selectedTab);
    }

    // check if preloadTab is set as an input @Input
    // otherwise check the preloadTabs config
    let shouldPreloadTabs = (isBlank(this.preloadTabs) ? this._config.getBoolean('preloadTabs') : isTrueProperty(this.preloadTabs));
    if (shouldPreloadTabs) {
      // preload all the tabs which isn't the selected tab
      this._tabs.filter((t) => t !== selectedTab).forEach((tab, index) => {
        tab.preload(this._config.getNumber('tabsPreloadDelay', 1000) * index);
      });
    }
  }

  /**
   * @private
   */
  private _setConfig(attrKey: string, fallback: any) {
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
   * @param {number|Tab} tabOrIndex Index, or the Tab instance, of the tab to select.
   */
  select(tabOrIndex: number | Tab, opts: NavOptions = {}, done?: Function): Promise<any> {
    let promise: Promise<any>;
    if (!done) {
      promise = new Promise(res => { done = res; });
    }

    let selectedTab: Tab = (typeof tabOrIndex === 'number' ? this.getByIndex(tabOrIndex) : tabOrIndex);
    if (isBlank(selectedTab)) {
      return Promise.resolve();
    }

    let deselectedTab = this.getSelected();
    if (selectedTab === deselectedTab) {
      // no change
      this._touchActive(selectedTab);
      return Promise.resolve();
    }
    console.debug(`Tabs, select: ${selectedTab.id}`);

    let deselectedPage: ViewController;
    if (deselectedTab) {
      deselectedPage = deselectedTab.getActive();
      deselectedPage && deselectedPage.fireWillLeave();
    }

    opts.animate = false;

    let selectedPage = selectedTab.getActive();
    selectedPage && selectedPage.fireWillEnter();

    selectedTab.load(opts, (initialLoad: boolean) => {
      selectedTab.ionSelect.emit(selectedTab);
      this.ionChange.emit(selectedTab);

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

      selectedPage && selectedPage.fireDidEnter();
      deselectedPage && deselectedPage.fireDidLeave();

      if (this._onReady) {
        this._onReady();
        this._onReady = null;
      }

      // track the order of which tabs have been selected, by their index
      // do not track if the tab index is the same as the previous
      if (this.selectHistory[this.selectHistory.length - 1] !== selectedTab.id) {
        this.selectHistory.push(selectedTab.id);
      }

      // if this is not the Tab's initial load then we need
      // to refresh the tabbar and content dimensions to be sure
      // they're lined up correctly
      if (!initialLoad && selectedPage) {
        var content = <Content>selectedPage.getContent();
        if (content && content instanceof Content) {
          nativeRaf(() => {
            content.readDimensions();
            content.writeDimensions();
          });
        }
      }

      done();
    });

    return promise;
  }

  /**
   * Get the previously selected Tab which is currently not disabled or hidden.
   * @param {boolean} trimHistory If the selection history should be trimmed up to the previous tab selection or not.
   * @returns {Tab}
   */
  previousTab(trimHistory: boolean = true): Tab {
    // walk backwards through the tab selection history
    // and find the first previous tab that is enabled and shown
    console.debug('run previousTab', this.selectHistory);
    for (var i = this.selectHistory.length - 2; i >= 0; i--) {
      var tab = this._tabs.find(t => t.id === this.selectHistory[i]);
      if (tab && tab.enabled && tab.show) {
        if (trimHistory) {
          this.selectHistory.splice(i + 1);
        }
        return tab;
      }
    }

    return null;
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
   */
  length(): number {
    return this._tabs.length;
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
    if (instance.ionSelected) {
      return instance.ionSelected();
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
   * DOM WRITE
   */
  setTabbarPosition(top: number, bottom: number) {
    if (this._top !== top || this._bottom !== bottom) {
      let tabbarEle = <HTMLElement>this._tabbar.nativeElement;
      tabbarEle.style.top = (top > -1 ? top + 'px' : '');
      tabbarEle.style.bottom = (bottom > -1 ? bottom + 'px' : '');
      tabbarEle.classList.add('show-tabbar');

      this._top = top;
      this._bottom = bottom;
    }
  }

}

let tabIds = -1;
