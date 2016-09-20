import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Optional, Renderer, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { Content } from '../content/content';
import { DeepLinker } from '../../navigation/deep-linker';
import { Ion } from '../ion';
import { isBlank } from '../../util/util';
import { nativeRaf } from '../../util/dom';
import { NavController } from '../../navigation/nav-controller';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { NavOptions, DIRECTION_SWITCH } from '../../navigation/nav-util';
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
 * is a declarative component for a [NavController](../../nav/NavController/)
 *
 * For more information on using nav controllers like Tab or [Nav](../../nav/Nav/),
 * take a look at the [NavController API Docs](../../nav/NavController/).
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
 * @demo /docs/v2/demos/src/tabs/
 *
 * @see {@link /docs/v2/components#tabs Tabs Component Docs}
 * @see {@link ../Tab Tab API Docs}
 * @see {@link ../../config/Config Config API Docs}
 *
 */
@Component({
  selector: 'ion-tabs',
  template:
    '<div class="tabbar" role="tablist" #tabbar>' +
      '<a *ngFor="let t of _tabs" [tab]="t" class="tab-button" [class.tab-disabled]="!t.enabled" [class.tab-hidden]="!t.show" role="tab" href="#" (ionSelect)="select($event)">' +
        '<ion-icon *ngIf="t.tabIcon" [name]="t.tabIcon" [isActive]="t.isSelected" class="tab-button-icon"></ion-icon>' +
        '<span *ngIf="t.tabTitle" class="tab-button-text">{{t.tabTitle}}</span>' +
        '<ion-badge *ngIf="t.tabBadge" class="tab-badge" [ngClass]="\'badge-\' + t.tabBadgeStyle">{{t.tabBadge}}</ion-badge>' +
        '<div class="button-effect"></div>' +
      '</a>' +
      '<div class="tab-highlight"></div>' +
    '</div>' +
    '<ng-content></ng-content>' +
    '<div #portal tab-portal></div>',
  encapsulation: ViewEncapsulation.None,
})
export class Tabs extends Ion implements AfterViewInit {
  /** @internal */
  _ids: number = -1;
  /** @internal */
  _tabs: Tab[] = [];
  /** @internal */
  _sbPadding: boolean;
  /** @internal */
  _top: number;
  /** @internal */
  _bottom: number;
  /** @internal */
  id: string;
  /** @internal */
  _selectHistory: string[] = [];
  /** @internal */
  _subPages: boolean;

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(value: string) {
    this._setColor('tabs', value);
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode('tabs', val);
  }

  /**
   * @input {number} The default selected tab index when first loaded. If a selected index isn't provided then it will use `0`, the first tab.
   */
  @Input() selectedIndex: number;

  /**
   * @internal DEPRECATED. Please use `tabsLayout` instead.
   */
  @Input() private tabbarLayout: string;

  /**
   * @input {string} Set the tabbar layout: `icon-top`, `icon-left`, `icon-right`, `icon-bottom`, `icon-hide`, `title-hide`.
   */
  @Input() tabsLayout: string;

  /**
   * @internal DEPRECATED. Please use `tabsPlacement` instead.
   */
  @Input() private tabbarPlacement: string;

  /**
   * @input {string} Set position of the tabbar: `top`, `bottom`.
   */
  @Input() tabsPlacement: string;

  /**
   * @input {boolean} Whether to show the tab highlight bar under the selected tab. Default: `false`.
   */
  @Input() tabsHighlight: boolean;

  /**
   * @input {any} Expression to evaluate when the tab changes.
   */
  @Output() ionChange: EventEmitter<Tab> = new EventEmitter<Tab>();

  /**
   * @internal
   */
  @ViewChild(TabHighlight) _highlight: TabHighlight;

  /**
   * @internal
   */
  @ViewChild('tabbar') _tabbar: ElementRef;

  /**
   * @internal
   */
  @ViewChild('portal', {read: ViewContainerRef}) portal: ViewContainerRef;

  /**
   * @private
   */
  parent: NavControllerBase;

  constructor(
    @Optional() parent: NavController,
    @Optional() public viewCtrl: ViewController,
    private _app: App,
    config: Config,
    elementRef: ElementRef,
    private _platform: Platform,
    renderer: Renderer,
    private _linker: DeepLinker
  ) {
    super(config, elementRef, renderer);

    this.mode = config.get('mode');
    this.parent = <NavControllerBase>parent;
    this.id = 't' + (++tabIds);
    this._sbPadding = config.getBoolean('statusbarPadding');
    this._subPages = config.getBoolean('tabsHideOnSubPages');
    this.tabsHighlight = config.getBoolean('tabsHighlight');

    // TODO deprecated 07-07-2016 beta.11
    if (config.get('tabSubPages') !== null) {
      console.warn('Config option "tabSubPages" has been deprecated. Please use "tabsHideOnSubPages" instead.');
      this._subPages = config.getBoolean('tabSubPages');
    }

    // TODO deprecated 07-07-2016 beta.11
    if (config.get('tabbarHighlight') !== null) {
      console.warn('Config option "tabbarHighlight" has been deprecated. Please use "tabsHighlight" instead.');
      this.tabsHighlight = config.getBoolean('tabbarHighlight');
    }

    if (this.parent) {
      // this Tabs has a parent Nav
      this.parent.registerChildNav(this);

    } else if (viewCtrl && viewCtrl.getNav()) {
      // this Nav was opened from a modal
      this.parent = <any>viewCtrl.getNav();
      this.parent.registerChildNav(this);

    } else if (this._app) {
      // this is the root navcontroller for the entire app
      this._app._setRootNav(this);
    }

    // Tabs may also be an actual ViewController which was navigated to
    // if Tabs is static and not navigated to within a NavController
    // then skip this and don't treat it as it's own ViewController
    if (viewCtrl) {
      viewCtrl._setContent(this);
      viewCtrl._setContentRef(elementRef);
    }
  }

  /**
   * @internal
   */
  ngAfterViewInit() {
    this._setConfig('tabsPlacement', 'bottom');
    this._setConfig('tabsLayout', 'icon-top');
    this._setConfig('tabsHighlight', this.tabsHighlight);

    // TODO deprecated 07-07-2016 beta.11
    this._setConfig('tabbarPlacement', 'bottom');
    this._setConfig('tabbarLayout', 'icon-top');

    // TODO deprecated 07-07-2016 beta.11
    if (this.tabbarPlacement !== undefined) {
      console.warn('Input "tabbarPlacement" has been deprecated. Please use "tabsPlacement" instead.');
      this.setElementAttribute('tabsPlacement', this.tabbarPlacement);
      this.tabsPlacement = this.tabbarPlacement;
    }

    // TODO deprecated 07-07-2016 beta.11
    if (this._config.get('tabbarPlacement') !== null) {
      console.warn('Config option "tabbarPlacement" has been deprecated. Please use "tabsPlacement" instead.');
      this.setElementAttribute('tabsPlacement', this._config.get('tabbarPlacement'));
    }

    // TODO deprecated 07-07-2016 beta.11
    if (this.tabbarLayout !== undefined) {
      console.warn('Input "tabbarLayout" has been deprecated. Please use "tabsLayout" instead.');
      this.setElementAttribute('tabsLayout', this.tabbarLayout);
      this.tabsLayout = this.tabbarLayout;
    }

    // TODO deprecated 07-07-2016 beta.11
    if (this._config.get('tabbarLayout') !== null) {
      console.warn('Config option "tabbarLayout" has been deprecated. Please use "tabsLayout" instead.');
      this.setElementAttribute('tabsLayout', this._config.get('tabsLayout'));
    }

    if (this.tabsHighlight) {
      this._platform.onResize(() => {
        this._highlight.select(this.getSelected());
      });
    }

    this.initTabs();
  }

  /**
   * @internal
   */
  initTabs() {
    // get the selected index from the input
    // otherwise default it to use the first index
    let selectedIndex = (isBlank(this.selectedIndex) ? 0 : parseInt(<any>this.selectedIndex, 10));

    // now see if the deep linker can find a tab index
    const tabsSegment = this._linker.initNav(this);
    if (tabsSegment && isBlank(tabsSegment.component)) {
      // we found a segment which probably represents which tab to select
      selectedIndex = this._linker.getSelectedTabIndex(this, tabsSegment.name, selectedIndex);
    }

    // get the selectedIndex and ensure it isn't hidden or disabled
    let selectedTab = this._tabs.find((t, i) => i === selectedIndex && t.enabled && t.show);
    if (!selectedTab) {
      // wasn't able to select the tab they wanted
      // try to find the first tab that's available
      selectedTab = this._tabs.find(t => t.enabled && t.show);
    }

    if (selectedTab) {
      // we found a tab to select
      // get the segment the deep linker says this tab should load with
      let pageId: string = null;
      if (tabsSegment) {
        let selectedTabSegment = this._linker.initNav(selectedTab);
        if (selectedTabSegment && selectedTabSegment.component) {
          selectedTab.root = selectedTabSegment.component;
          selectedTab.rootParams = selectedTabSegment.data;
          pageId = selectedTabSegment.id;
        }
      }
      this.select(selectedTab, {
        id: pageId
      });
    }

    // set the initial href attribute values for each tab
    this._tabs.forEach(t => {
      t.updateHref(t.root, t.rootParams);
    });
  }

  /**
   * @internal
   */
  _setConfig(attrKey: string, fallback: any) {
    let val = (<any>this)[attrKey];
    if (isBlank(val)) {
      val = this._config.get(attrKey, fallback);
    }
    this.setElementAttribute(attrKey, val);
  }

  /**
   * @private
   */
  add(tab: Tab) {
    this._tabs.push(tab);
    return this.id + '-' + (++this._ids);
  }

  /**
   * @param {number|Tab} tabOrIndex Index, or the Tab instance, of the tab to select.
   */
  select(tabOrIndex: number | Tab, opts: NavOptions = {}) {
    const selectedTab: Tab = (typeof tabOrIndex === 'number' ? this.getByIndex(tabOrIndex) : tabOrIndex);
    if (isBlank(selectedTab)) {
      return;
    }

    const deselectedTab = this.getSelected();
    if (selectedTab === deselectedTab) {
      // no change
      return this._touchActive(selectedTab);
    }

    let deselectedPage: ViewController;
    if (deselectedTab) {
      deselectedPage = deselectedTab.getActive();
      deselectedPage && deselectedPage._willLeave();
    }

    opts.animate = false;

    const selectedPage = selectedTab.getActive();
    selectedPage && selectedPage._willEnter();

    selectedTab.load(opts, (alreadyLoaded: boolean) => {
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

        if (this.tabsHighlight) {
          this._highlight.select(selectedTab);
        }

        if (opts.updateUrl !== false) {
          this._linker.navChange(DIRECTION_SWITCH);
        }
      }

      selectedPage && selectedPage._didEnter();
      deselectedPage && deselectedPage._didLeave();

      // track the order of which tabs have been selected, by their index
      // do not track if the tab index is the same as the previous
      if (this._selectHistory[this._selectHistory.length - 1] !== selectedTab.id) {
        this._selectHistory.push(selectedTab.id);
      }

      // if this is not the Tab's initial load then we need
      // to refresh the tabbar and content dimensions to be sure
      // they're lined up correctly
      if (alreadyLoaded && selectedPage) {
        let content = <Content>selectedPage.getContent();
        if (content && content instanceof Content) {
          nativeRaf(() => {
            content.readDimensions();
            content.writeDimensions();
          });
        }
      }
    });
  }

  /**
   * Get the previously selected Tab which is currently not disabled or hidden.
   * @param {boolean} trimHistory If the selection history should be trimmed up to the previous tab selection or not.
   * @returns {Tab}
   */
  previousTab(trimHistory: boolean = true): Tab {
    // walk backwards through the tab selection history
    // and find the first previous tab that is enabled and shown
    console.debug('run previousTab', this._selectHistory);
    for (var i = this._selectHistory.length - 2; i >= 0; i--) {
      var tab = this._tabs.find(t => t.id === this._selectHistory[i]);
      if (tab && tab.enabled && tab.show) {
        if (trimHistory) {
          this._selectHistory.splice(i + 1);
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
    return this._tabs[index];
  }

  /**
   * @return {Tab} Returns the currently selected tab
   */
  getSelected(): Tab {
    for (var i = 0; i < this._tabs.length; i++) {
      if (this._tabs[i].isSelected) {
        return this._tabs[i];
      }
    }
    return null;
  }

  /**
   * @internal
   */
  getActiveChildNav() {
    return this.getSelected();
  }

  /**
   * @internal
   */
  getIndex(tab: Tab): number {
    return this._tabs.indexOf(tab);
  }

  /**
   * @internal
   */
  length(): number {
    return this._tabs.length;
  }

  /**
   * "Touch" the active tab, going back to the root view of the tab
   * or optionally letting the tab handle the event
   */
  private _touchActive(tab: Tab) {
    const active = tab.getActive();

    if (active) {
      if (active._cmp && active._cmp.instance.ionSelected) {
        // if they have a custom tab selected handler, call it
        active._cmp.instance.ionSelected();

      } else if (tab.length() > 1) {
        // if we're a few pages deep, pop to root
        tab.popToRoot(null, null);

      } else if (tab.root !== active.component) {
        // Otherwise, if the page we're on is not our real root, reset it to our
        // default root type
        tab.setRoot(tab.root);
      }
    }
  }

  /**
   * @internal
   * DOM WRITE
   */
  setTabbarPosition(top: number, bottom: number) {
    if (this._top !== top || this._bottom !== bottom) {
      const tabbarEle = <HTMLElement>this._tabbar.nativeElement;
      tabbarEle.style.top = (top > -1 ? top + 'px' : '');
      tabbarEle.style.bottom = (bottom > -1 ? bottom + 'px' : '');
      tabbarEle.classList.add('show-tabbar');

      this._top = top;
      this._bottom = bottom;
    }
  }

}

let tabIds = -1;
