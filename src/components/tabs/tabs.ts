import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Optional, Output, Renderer, ViewChild, ViewContainerRef, ViewEncapsulation, forwardRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/merge';
import { filter } from 'rxjs/operators/filter';
import { finalize } from 'rxjs/operators/finalize';
import { map } from 'rxjs/operators/map';
import { take } from 'rxjs/operators/take';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { tap } from 'rxjs/operators/tap';
import { throttleTime } from 'rxjs/operators/throttleTime';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { Ion } from '../ion';
import { assert, isBlank, isPresent, isTrueProperty } from '../../util/util';
import { Keyboard } from '../../platform/keyboard';
import { Tabs as ITabs } from '../../navigation/nav-interfaces';
import { NavController } from '../../navigation/nav-controller';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { NavigationContainer } from '../../navigation/navigation-container';
import { DIRECTION_SWITCH, NavOptions, getComponent } from '../../navigation/nav-util';
import { formatUrlPart } from '../../navigation/url-serializer';
import { RootNode } from '../split-pane/split-pane';
import { Platform } from '../../platform/platform';
import { Tab } from './tab';
import { TabHighlight } from './tab-highlight';
import { ViewController } from '../../navigation/view-controller';

import { PointerCoordinates, closestExcludeSelf, isSameOrDescendantOf, pointerCoord } from '../../util/dom';


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
 * ### Let Tabs swipeable
 *
 * Set the input property of `tabsSwipeEnable` to `true`, enable the swipe funtional.
 *
 * Features:
 *
 * - A slide animation will be played after selecting a different Tab.
 * The animation will jump to the destination Tab directly, skip the Tab(s) between.
 * For example: current Tab is tab1, then select tab3, the animation will slide from tab1 to tab3 directly.
 * - When user dragging the Tabs horizontally, the Tab(s) would be moving synchronously if possible,
 * according to the direction of dragging and the existent or status of the sibling Tab.
 * - After user releasing, if the distance of moving reaches the `tabsSwipeThreshold`,
 * the selection of Tab(s) will be changed with animation,
 * otherwise the Tab(s) will rebound to their orinigal positions.
 * - Select the Tab(s) that are disabled or without root, will not trigger the animation.
 * - The effects of dragging will ignore and skip the Tab(s) without root.
 * - When dragging, if the destination Tab is valid but has not inited yet, the Tab(s) would not be moved.
 * After releasing, if the distance of moving reaches the threshold, the destination Tab will be selected,
 * and full slide animation will be played.
 * - The dragging will not be captured at starting, but after the distance having reached the `dragStartThreshold`,
 * and the angle of dragging is considered as horizontal. After then, the drag(touch) events will stop propagating
 * to the descendant elements(use event capturing).
 * - If the target of touchstart event is a vertical <ion-slides> or <ion-scroll>(or their descendant element),
 * or inside the tabbar of this Tabs, the dragging will not be captured as Tabs swipe.
 * - If the <ion-nav> component that this Tabs belongs to has enabled menu(s), and the menu(s) have opened,
 * the tabs swipe dragging will not be captured, also for that the menu(s) have not opened but `swipeEnabled` set to `true`.
 * - If current selected Tab has navigated to its sub page(s), the tabs swipe dragging will not be captured.
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
@Component({
  selector: 'ion-tabs',
  template:
    '<div class="tabbar" role="tablist" #tabbar>' +
      '<a *ngFor="let t of _tabs" [tab]="t" class="tab-button" role="tab" href="#" (ionSelect)="select(t)"></a>' +
      '<div class="tab-highlight"></div>' +
    '</div>' +
    '<ng-content></ng-content>' +
    '<div #portal tab-portal></div>',
  encapsulation: ViewEncapsulation.None,
  providers: [{provide: RootNode, useExisting: forwardRef(() => Tabs) }]
})
export class Tabs extends Ion implements AfterViewInit, RootNode, ITabs, NavigationContainer {
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
  _onDestroy = new Subject<void>();

  /** @internal */
  private _tabsSwipeEnable: boolean = false;
  /** @internal */
  private _tabsSwipeThreshold: number = 0.33;
  /** @internal */
  private _dragStartThreshold: number = 20;
  /** @internal */
  private _selfWidth: number;
  /** @internal */
  private _swipeInitialCoords: PointerCoordinates;
  /** @internal */
  private _shouldCaptureSwipe: boolean = false;
  /** @internal */
  private _isSwipeDragging: boolean;
  /** @internal */
  private _dragDelta: number = 0;
  /** @internal */
  private _swipeAnimating = false;

  /**
   * @input {string} A unique name for the tabs
   */
  @Input() name: string;

  /**
   * @input {number} The default selected tab index when first loaded. If a selected index isn't provided then it will use `0`, the first tab.
   */
  @Input() selectedIndex: number;

  /**
   * @input {string} Set the tabbar layout: `icon-top`, `icon-start`, `icon-end`, `icon-bottom`, `icon-hide`, `title-hide`.
   */
  @Input() tabsLayout: string;

  /**
   * @input {string} Set position of the tabbar: `top`, `bottom`.
   */
  @Input() tabsPlacement: string;

  /**
   * @input {boolean} If true, show the tab highlight bar under the selected tab.
   */
  @Input() tabsHighlight: boolean;

  /**
   * @input {boolean} If true, show swipe animation when selecting a different tab, or move tab(s) when user drags this tabs component horizontally.
   * Default: `false`.
   */
  @Input() get tabsSwipeEnable(): boolean {
    return this._tabsSwipeEnable;
  }

  set tabsSwipeEnable(val: boolean) {
    this._tabsSwipeEnable = isTrueProperty(val);
    this._setConfig('tabsSwipeEnable', this._tabsSwipeEnable);
  }

  /**
   * @input {number} After user dragging this tabs component and then releases, compute the ratio of drag delta X to the width of this component.
   * If the ratio is greater or equal than tabsSwipeThreshold, change the selection of tab(s), otherwise rebound the tab(s) to original position.
   * This value should be between `0.1` and `0.75`, if the value is out of range, it will be fixed. Default: `0.33`.
   */
  @Input() get tabsSwipeThreshold() {
    return this._tabsSwipeThreshold;
  }

  set tabsSwipeThreshold(val: number) {
    this._tabsSwipeThreshold = Math.min(0.75, Math.max(0.1, val)) || 0.33;
  }

  /**
   * @input {number} The threshold pixels that the dragging should be captured.
   * This value should be greater or equal than `5`, if the value is too small, it will be fixed. Default: `20`.
   */
  @Input() get dragStartThreshold() {
    return this._dragStartThreshold;
  }

  set dragStartThreshold(val: number) {
    this._dragStartThreshold = Math.max(5, val) || 20;
  }

  /**
   * @output {any} Emitted when the tab changes.
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
   * @hidden
   */
  parent: NavControllerBase;

  constructor(
    @Optional() parent: NavController,
    @Optional() public viewCtrl: ViewController,
    private _app: App,
    config: Config,
    elementRef: ElementRef,
    private _plt: Platform,
    renderer: Renderer,
    private _linker: DeepLinker,
    keyboard?: Keyboard
  ) {
    super(config, elementRef, renderer, 'tabs');

    this.parent = <NavControllerBase>parent;
    this.id = 't' + (++tabIds);
    this._sbPadding = config.getBoolean('statusbarPadding');
    this.tabsHighlight = config.getBoolean('tabsHighlight');

    if (this.parent) {
      // this Tabs has a parent Nav
      this.parent.registerChildNav(this);

    } else if (viewCtrl && viewCtrl.getNav()) {
      // this Nav was opened from a modal
      this.parent = <any>viewCtrl.getNav();
      this.parent.registerChildNav(this);

    } else if (this._app) {
      // this is the root navcontroller for the entire app
      this._app.registerRootNav(this);
    }

    // Tabs may also be an actual ViewController which was navigated to
    // if Tabs is static and not navigated to within a NavController
    // then skip this and don't treat it as it's own ViewController
    if (viewCtrl) {
      viewCtrl._setContent(this);
      viewCtrl._setContentRef(elementRef);
    }

    const keyboardResizes = config.getBoolean('keyboardResizes', false);
    if (keyboard && keyboardResizes) {
      keyboard.willHide
        .takeUntil(this._onDestroy)
        .subscribe(() => {
          this._plt.timeout(() => this.setTabbarHidden(false), 50);
        });
      keyboard.willShow
        .takeUntil(this._onDestroy)
        .subscribe(() => this.setTabbarHidden(true));
    }
  }

  /**
   * @internal
   */
  setTabbarHidden(tabbarHidden: boolean) {
    this.setElementClass('tabbar-hidden', tabbarHidden);
    this.resize();
  }

  /**
   * @internal
   */
  ngOnDestroy() {
    this._onDestroy.next();
    if (this.parent) {
      this.parent.unregisterChildNav(this);
    } else {
      this._app.unregisterRootNav(this);
    }
  }

  /**
   * @internal
   */
  ngAfterViewInit() {
    this._setConfig('tabsPlacement', 'bottom');
    this._setConfig('tabsLayout', 'icon-top');
    this._setConfig('tabsHighlight', this.tabsHighlight);

    if (this.tabsHighlight) {
      this._plt.resize
        .takeUntil(this._onDestroy)
        .subscribe(() => this._highlight.select(this.getSelected()));
    }

    this.initTabs();

    this._bindTabsSwipeListener();
  }

  /**
   * @internal
   */
  initTabs(): Promise<any> {
    // get the selected index from the input
    // otherwise default it to use the first index
    let selectedIndex = (isBlank(this.selectedIndex) ? 0 : parseInt(<any>this.selectedIndex, 10));

    // now see if the deep linker can find a tab index
    const tabsSegment = this._linker.getSegmentByNavIdOrName(this.id, this.name);
    if (tabsSegment) {
      // we found a segment which probably represents which tab to select
      selectedIndex = this._getSelectedTabIndex(tabsSegment.secondaryId, selectedIndex);
    }

    // get the selectedIndex and ensure it isn't hidden or disabled
    let selectedTab = this._tabs.find((t, i) => i === selectedIndex && t.enabled && t.show);
    if (!selectedTab) {
      // wasn't able to select the tab they wanted
      // try to find the first tab that's available
      selectedTab = this._tabs.find(t => t.enabled && t.show);
    }

    let promise = Promise.resolve();
    if (selectedTab) {
      selectedTab._segment = tabsSegment;
      promise = this.select(selectedTab);
    }

    return promise.then(() => {
      // set the initial href attribute values for each tab
      this._tabs.forEach(t => {
        t.updateHref(t.root, t.rootParams);
      });
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
   * @hidden
   */
  add(tab: Tab): string {
    this._tabs.push(tab);
    return this.id + '-' + (++this._ids);
  }

  /**
   * @param {number|Tab} tabOrIndex Index, or the Tab instance, of the tab to select.
   */
  select(tabOrIndex: number | Tab, opts: NavOptions = {}, fromUrl: boolean = false): Promise<any> {
    const selectedTab: Tab = (typeof tabOrIndex === 'number' ? this.getByIndex(tabOrIndex) : tabOrIndex);
    if (isBlank(selectedTab)) {
      return Promise.resolve();
    }

    // If the selected tab is the current selected tab, we do not switch
    const currentTab = this.getSelected();
    if (selectedTab === currentTab && currentTab.getActive()) {
      return this._updateCurrentTab(selectedTab, fromUrl);
    }

    // If the selected tab does not have a root, we do not switch (#9392)
    // it's possible the tab is only for opening modal's or signing out
    // and doesn't actually have content. In the case there's no content
    // for a tab then do nothing and leave the current view as is
    if (selectedTab.root) {
      // At this point we are going to perform a page switch
      // Let's fire willLeave in the current tab page
      var currentPage: ViewController;
      if (currentTab) {
        currentPage = currentTab.getActive();
        currentPage && currentPage._willLeave(false);
      }

      // Fire willEnter in the new selected tab
      const selectedPage = selectedTab.getActive();
      selectedPage && selectedPage._willEnter();

      // Let's start the transition
      opts.animate = false;
      return selectedTab.load(opts).then(() => {
        this._tabSwitchEnd(selectedTab, selectedPage, currentPage);
        if (opts.updateUrl !== false) {
          this._linker.navChange(DIRECTION_SWITCH);
        }
        assert(this.getSelected() === selectedTab, 'selected tab does not match');
        this._fireChangeEvent(selectedTab);
        // recompute width before animation, because the selection of tab(s) may be changed without gesturing.
        if (this._tabsSwipeEnable && this.computeSelfWidth() > 0) {
          this._animateTabsSwipe(currentTab, selectedTab);
        } else {
          // reset the classes and styles of all tab(s)
          this._dragDelta === 0;
          this._resetTabStyles(NaN, NaN, 0);
        }
      });
    } else {
      this._fireChangeEvent(selectedTab);
      return Promise.resolve();
    }
  }

  _fireChangeEvent(selectedTab: Tab) {
    selectedTab.ionSelect.emit(selectedTab);
    this.ionChange.emit(selectedTab);
  }

  _tabSwitchEnd(selectedTab: Tab, selectedPage: ViewController, currentPage: ViewController) {
    assert(selectedTab, 'selectedTab must be valid');
    assert(this._tabs.indexOf(selectedTab) >= 0, 'selectedTab must be one of the tabs');

    // Update tabs selection state
    const tabs = this._tabs;
    let tab: Tab;
    for (var i = 0; i < tabs.length; i++) {
      tab = tabs[i];
      tab.setSelected(tab === selectedTab);
    }

    if (this.tabsHighlight) {
      this._highlight.select(selectedTab);
    }

    // Fire didEnter/didLeave lifecycle events
    if (selectedPage) {
      selectedPage._didEnter();
      this._app.viewDidEnter.emit(selectedPage);
    }

    if (currentPage) {
      currentPage && currentPage._didLeave();
      this._app.viewDidLeave.emit(currentPage);
    }

    // track the order of which tabs have been selected, by their index
    // do not track if the tab index is the same as the previous
    if (this._selectHistory[this._selectHistory.length - 1] !== selectedTab.id) {
      this._selectHistory.push(selectedTab.id);
    }
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
    const tabs = this._tabs;
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].isSelected) {
        return tabs[i];
      }
    }
    return null;
  }

  /**
   * @internal
   */
  getActiveChildNavs(): Tab[] {
    const selected = this.getSelected();
    return selected ? [selected] : [];
  }

  /**
   * @internal
   */
  getAllChildNavs(): any[] {
    return this._tabs;
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
  private _updateCurrentTab(tab: Tab, fromUrl: boolean): Promise<any> {
    const active = tab.getActive();

    if (active) {
      if (fromUrl && tab._segment) {
        // see if the view controller exists
        const vc = tab.getViewById(tab._segment.name);
        if (vc) {
          // the view is already in the stack
          return tab.popTo(vc, {
            animate: false,
            updateUrl: false,
          });
        } else if (tab._views.length === 0 && tab._segment.defaultHistory && tab._segment.defaultHistory.length) {
          return this._linker.initViews(tab._segment).then((views: ViewController[]) => {
            return tab.setPages(views,  {
              animate: false, updateUrl: false
            });
          }).then(() => {
            tab._segment = null;
          });
        } else {
          return tab.setRoot(tab._segment.name, tab._segment.data, {
            animate: false, updateUrl: false
          }).then(() => {
            tab._segment = null;
          });
        }

      } else if (active._cmp && active._cmp.instance.ionSelected) {
        // if they have a custom tab selected handler, call it
        active._cmp.instance.ionSelected();
        return Promise.resolve();
      } else if (tab.length() > 1) {
        // if we're a few pages deep, pop to root
        return tab.popToRoot();
      } else {
        return getComponent(this._linker, tab.root).then(viewController => {
          if (viewController.component !== active.component) {
            // Otherwise, if the page we're on is not our real root
            // reset it to our default root type
            return tab.setRoot(tab.root);
          }
        }).catch(() => {
          console.debug('Tabs: reset root was cancelled');
        });
      }
    }
  }

  /**
   * @internal
   * DOM WRITE
   */
  setTabbarPosition(top: number, bottom: number) {
    if (this._top !== top || this._bottom !== bottom) {
      var tabbarEle = <HTMLElement>this._tabbar.nativeElement;
      tabbarEle.style.top = (top > -1 ? top + 'px' : '');
      tabbarEle.style.bottom = (bottom > -1 ? bottom + 'px' : '');
      tabbarEle.classList.add('show-tabbar');

      this._top = top;
      this._bottom = bottom;
    }
  }

  /**
   * @internal
   */
  resize() {
    const tab = this.getSelected();
    tab && tab.resize();
  }

  /**
   * @internal
   */
  initPane(): boolean {
    const isMain = this._elementRef.nativeElement.hasAttribute('main');
    return isMain;
  }

  /**
   * @internal
   */
  paneChanged(isPane: boolean) {
    if (isPane) {
      this.resize();
    }
  }

  goToRoot(opts: NavOptions) {
    if (this._tabs.length) {
      return this.select(this._tabs[0], opts);
    }
  }

  /*
   * @private
   */
  getType() {
    return 'tabs';
  }

  /*
   * @private
   */
  getSecondaryIdentifier(): string {
    const tabs = this.getActiveChildNavs();
    if (tabs && tabs.length) {
      return this._linker._getTabSelector(tabs[0]);
    }
    return '';
  }

  /**
   * @private
   */
  _getSelectedTabIndex(secondaryId: string = '', fallbackIndex: number = 0): number {
    // we found a segment which probably represents which tab to select
    const indexMatch = secondaryId.match(/tab-(\d+)/);
    if (indexMatch) {
      // awesome, the segment name was something "tab-0", and
      // the numbe represents which tab to select
      return parseInt(indexMatch[1], 10);
    }

    // wasn't in the "tab-0" format so maybe it's using a word
    const tab = this._tabs.find(t => {
      return (isPresent(t.tabUrlPath) && t.tabUrlPath === secondaryId) ||
             (isPresent(t.tabTitle) && formatUrlPart(t.tabTitle) === secondaryId);
    });

    return isPresent(tab) ? tab.index : fallbackIndex;
  }

  /**
   * Compute the width of this tabs component, set the value to `_selfWidth` property, then return it.
   */
  computeSelfWidth(): number {
    const containerStyles = this._plt.getElementComputedStyle(this.getNativeElement());
    this._selfWidth = parseFloat(containerStyles.width);
    return this._selfWidth;
  }

  /**
   * @private
   */
  private _bindTabsSwipeListener() {
    // get event names, digest from initEvents() method of swiper-events.ts.
    const win: any = this._plt.win();
    const doc: any = this._plt.doc();

    const supportTouch = !!(('ontouchstart' in win) || win.DocumentTouch && doc instanceof win.DocumentTouch);

    // Define Touch Events
    let touchEventsDesktop = { start: 'mousedown', move: 'mousemove', end: 'mouseup' };

    if (win.navigator.pointerEnabled) {
      touchEventsDesktop = { start: 'pointerdown', move: 'pointermove', end: 'pointerup' };
    } else if (win.navigator.msPointerEnabled) {
      touchEventsDesktop = { start: 'MSPointerDown', move: 'MSPointerMove', end: 'MSPointerUp' };
    }

    const touchEvents = supportTouch ? {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
    } : touchEventsDesktop;

    Observable.merge(
      this._listenTouchStart(touchEvents.start),
      this._listenTouchMove(touchEvents.move),
      this._listenTouchEnd(touchEvents.end),
    ).pipe(
      takeUntil(this._onDestroy),
    ).subscribe();
  }

  /**
   * @private
   */
  private _getSiblingTab(direction: number, indexOfList?: number): Tab {
    if (direction) {
      if (typeof indexOfList !== 'number') {
        // Get the index of currently selected tab within tabs array, instead of tab.index
        indexOfList = this.getIndex(this.getSelected());
      }

      const toLeft = direction < 0;
      if (indexOfList > 0 || indexOfList === 0 && !toLeft) {
        const tabs = this._tabs;
        const { length } = tabs;

        // reference: the baseFindIndex() method of lodash.
        while (toLeft ? indexOfList-- : ++indexOfList < length) {
          if (tabs[indexOfList].root && tabs[indexOfList].enabled) {
            return tabs[indexOfList];
          }
        }
      }
    }

    return null;
  }

  /**
   * @private
   */
  private _setTranslateX(element: HTMLElement, translateX: number) {
    this._renderer.setElementStyle(element, 'transform', translateX ? `translateX(${translateX}px)` : '');
  }

  /**
   * @private
   */
  private _resetTabStyles(toIndex: number, fromIndex: number, direction: number) {
    const { _renderer } = this;
    this._tabs.forEach(tab => {
      if (tab.root) {
        const element: HTMLElement = tab.getNativeElement();
        if (tab.index === fromIndex) {
          _renderer.setElementClass(element, 'minor-show-tab', true);
        } else {
          _renderer.setElementClass(element, 'minor-show-tab', false);
        }

        if (tab.index === toIndex) {
          if (this._dragDelta === 0) {
            this._setTranslateX(element, direction * this._selfWidth);
          }
        } else if (this._dragDelta === 0 || tab.index !== fromIndex) {
          this._setTranslateX(element, 0);
        }
      }
    });
  }

  /**
   * @private
   */
  private _animateTabsSwipe(fromTab: Tab, toTab: Tab, isRebound: boolean = false) {
    if (!fromTab) {
      this._swipeAnimating = false;
      return;
    }

    let direction = fromTab.index < toTab.index ? 1 : -1;
    if (!isRebound) {
      this._resetTabStyles(toTab.index, fromTab.index, direction);
    }

    const toTabElem = toTab.getNativeElement() as HTMLElement;
    const fromTabElem = fromTab.getNativeElement() as HTMLElement;
    const baseSteps = 16;
    let steps = baseSteps;
    if (this._dragDelta !== 0) {
      const delta = Math.min(this._selfWidth, Math.abs(this._dragDelta));
      const span = isRebound ? delta : this._selfWidth - delta;
      // Trigger at least once, in order to fix the tab(s) to their original position when the end value of dragging delta is too small.
      steps = Math.max(1, Math.round(span * baseSteps / this._selfWidth));
    }

    this._swipeAnimating = true;
    Observable.interval(16.7).pipe(
      takeUntil(this._onDestroy),
      take(steps),
      map(tick => Math.round((tick + baseSteps + 1 - steps) * this._selfWidth / baseSteps)),
      finalize(() => {
        this._swipeAnimating = false;
        this._dragDelta = 0;
      }),
    ).subscribe(delta => {
      this._setTranslateX(toTabElem, (this._selfWidth - delta) * direction);
      this._setTranslateX(fromTabElem, -delta * direction);
    });
  }

  /**
   * @private
   */
  private _thisInsideSwipeEnabledMenu() {
    let nav: Element = this._elementRef.nativeElement;
    while ((nav = closestExcludeSelf(nav, 'ion-nav.menu-content')) && nav.parentNode) {
      const siblings = Array.from(nav.parentNode.childNodes)
        .filter(node => node !== nav && node.nodeType === 1) as HTMLElement[];

      // The attribute of 'ng-reflect-swipe-enabled' is not existed within ios App,
      // so use the custom attribute of 'swipe-enabled' instead. Also see: the swipeEnable() method of menu.ts
      if (siblings.find(elem => elem.tagName === 'ION-MENU' && elem.classList.contains('menu-enabled') &&
        elem.getAttribute('swipe-enabled') === 'true'
      )) {
        console.warn('This tabs component is inside a swipeEnabled menu, the functional of swipe this tabs manually is disabled!');
        return true;
      }
    }

    return false;
  }

  /**
   * @private
   */
  private _isValidSwipeStartElement(element: HTMLElement) {
    // Make sure the menu(s) of this nav is not opened, and related menu(s) do not enable swipe.
    // Also make sure that the touch start event target is not:
    // 1. the tabbar of this tabs component, or its descendant element,
    // 2. a vertical <ion-slides> or <ion-scroll>(or their descendant element) within this tabs.
    const tabsElement = this._elementRef.nativeElement as HTMLElement;
    return !tabsElement.closest('ion-nav.menu-content-open') && !this._thisInsideSwipeEnabledMenu() &&
      !isSameOrDescendantOf(element, this._tabbar.nativeElement) &&
      !isSameOrDescendantOf(element.closest('ion-slides:not([direction="vertical"])'), tabsElement) &&
      !isSameOrDescendantOf(element.closest('ion-scroll[scrollx="true"]'), tabsElement);
  }

  /**
   * @private
   */
  private _listenTouchStart(startEventName: string) {
    // Use the useCapture parameter of addEventListener, capturing the touch events other than bubbling,
    // in order to stop the propagation of events to the descendant elements when dragging this tabs component horizontally,
    // or the swipe animation is playing.
    return Observable.fromEvent<TouchEvent>(this._elementRef.nativeElement, startEventName, true).pipe(
      tap(ev => {
        if (this._swipeAnimating) {
          ev.stopPropagation();
          ev.preventDefault();
        }
      }),
      filter(({ target }) => {
        const activeTab = this.getSelected();
        // Do compute and check the width of this tabs component at touching start,
        // because the width is variable, due to such as changes of orientation.
        return this._tabsSwipeEnable && !!this._tabs.length && !this._swipeAnimating && this.computeSelfWidth() > 0 &&
          activeTab && activeTab._views.length === 1 && this._isValidSwipeStartElement(target as HTMLElement);
      }),
      tap(ev => {
        this._swipeInitialCoords = pointerCoord(ev);
        // Set _shouldCaptureSwipe to undefined, in order to let checkCaptureWithGesture() to make decision if should capture this drag action.
        this._shouldCaptureSwipe = undefined;
      }),
    );
  }

  /**
   * @private
   */
  private _listenTouchMove(moveEventName: string) {
    return Observable.fromEvent<TouchEvent>(this._elementRef.nativeElement, moveEventName, true).pipe(
      map(ev => ({ ev, coords: pointerCoord(ev) })),
      tap(({ coords }) => {
        if (!this._swipeAnimating && !this._isSwipeDragging && this._checkCaptureWithGesture(coords)) {
          // gesture is good, let's capture all next onTouchMove events
          this._isSwipeDragging = true;
        }
      }),
      filter(() => this._tabsSwipeEnable && this._tabs.length && (this._swipeAnimating || this._isSwipeDragging)),
      tap(({ ev }) => {
        ev.stopPropagation();
        ev.preventDefault();
      }),
      filter(() => !this._swipeAnimating),
      tap(({ coords }) => this._dragDelta = this._swipeInitialCoords.x - coords.x),
      // This throttleTime() must place after the calculation of _dragDelta,
      // otherwise the effects would be incorrect when dragging rapidly.
      throttleTime(16.7),
      tap(() => this._plt.raf(() => this._moveTabs())),
    );
  }

  /**
   * @private
   */
  private _listenTouchEnd(endEventName: string) {
    return Observable.fromEvent<TouchEvent>(this._elementRef.nativeElement, endEventName, true).pipe(
      tap(() => this._shouldCaptureSwipe = false),
      filter(() => this._isSwipeDragging),
      tap(() => this._isSwipeDragging = false),
      map(() => this._getSiblingTab(Math.sign(this._dragDelta))),
      filter(toTab => this._tabsSwipeEnable && !!toTab),
      tap(toTab => {
        if (Math.abs(this._dragDelta) >= this._selfWidth * this._tabsSwipeThreshold) {
          // If the target tab has not inited yet, in actually the tab(s) have not been moved,
          // so the _dragDelta must be reset, in order to play the full animation of swpie.
          if (!toTab._init) {
            this._dragDelta = 0;
          }
          // Using select() to play the animation of swpie is an async operation，
          // there will be a time gap between the dragEnd and tabsChanged animateTabsSwipe().
          // The _swipeAnimating should be set to true immediately, in order to keep the animation correct.
          this._swipeAnimating = true;
          this.select(toTab.index);
        } else if (toTab._init && toTab.enabled) {
          // If the distance of dragging is less than the threshold of swipe, rebound the tab(s) to their original position.
          this._animateTabsSwipe(toTab, this.getSelected(), true);
        }
      }),
    );
  }

  /**
   * @private
   */
  private _checkCaptureWithGesture(newCoords: PointerCoordinates): boolean {
    if (this._shouldCaptureSwipe === undefined) {
      // The following code comes from ionic2-super-tabs.
      // https://github.com/zyra/ionic2-super-tabs
      const radians = 40 * Math.PI / 180;
      const maxCosine = Math.cos(radians);
      const deltaX = newCoords.x - this._swipeInitialCoords.x;
      const deltaY = newCoords.y - this._swipeInitialCoords.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance >= this._dragStartThreshold) {
        // swipe is long enough so far
        // lets check the angle
        const angle = Math.atan2(deltaY, deltaX);
        const cosine = Math.cos(angle);

        this._shouldCaptureSwipe = Math.abs(cosine) > maxCosine;
      }
    }

    return this._shouldCaptureSwipe;
  }

  /**
   * @private
   */
  private _moveTabs() {
    if (this._swipeAnimating) {
      return;
    }

    const direction = Math.sign(this._dragDelta);
    const indexOfList = this.getIndex(this.getSelected());
    const siblingTab = this._getSiblingTab(direction, indexOfList);
    const reverseSiblingTab = this._getSiblingTab(-direction, indexOfList);
    // The previous tab and the next tab must be handled both,
    // in order to deal with the situation that drag in on direction at first and then drag to opposite direction rapidly.
    let delta = 0;
    if (siblingTab && siblingTab._init && siblingTab.enabled) {
      delta = Math.min(this._selfWidth, Math.abs(this._dragDelta)) * direction;
      const siblingTabElem: HTMLElement = siblingTab.getNativeElement();
      this._renderer.setElementClass(siblingTabElem, 'minor-show-tab', true);
      this._setTranslateX(siblingTabElem, direction * this._selfWidth - delta);
    }

    if (reverseSiblingTab && reverseSiblingTab._init && reverseSiblingTab.enabled) {
      const reverseSiblingTabElem: HTMLElement = reverseSiblingTab.getNativeElement();
      this._renderer.setElementClass(reverseSiblingTabElem, 'minor-show-tab', false);
      this._setTranslateX(reverseSiblingTabElem, 0);
    }

    this._setTranslateX(this.getSelected().getNativeElement(), -delta);
  }
}

let tabIds = -1;
