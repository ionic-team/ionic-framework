import {
  AfterContentChecked,
  AfterContentInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  ViewChild,
  AfterViewInit,
  QueryList,
} from '@angular/core';
import type { Params } from '@angular/router';

import { NavController } from '../../providers/nav-controller';

import { StackDidChangeEvent, StackWillChangeEvent } from './stack-utils';

/**
 * Extracts `queryParams` and `fragment` from a tab button's href for use
 * as Angular `NavigationExtras`. Returns `undefined` when neither is present.
 */
const parseHrefExtras = (href: string | undefined): { queryParams?: Params; fragment?: string } | undefined => {
  if (!href) {
    return undefined;
  }

  const hashIndex = href.indexOf('#');
  // Treat a bare `#` (no fragment text) as no fragment.
  const fragment = hashIndex >= 0 && hashIndex < href.length - 1 ? href.slice(hashIndex + 1) : undefined;
  const beforeHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;

  const queryIndex = beforeHash.indexOf('?');
  const search = queryIndex >= 0 ? beforeHash.slice(queryIndex + 1) : '';

  let queryParams: Params | undefined;
  if (search) {
    const params = new URLSearchParams(search);
    queryParams = {};
    for (const key of new Set(params.keys())) {
      const all = params.getAll(key);
      queryParams[key] = all.length > 1 ? all : all[0];
    }
  }

  if (!queryParams && fragment === undefined) {
    return undefined;
  }

  /**
   * Build the result with only the populated keys so that a spread of the
   * returned object does not overwrite saved `queryParams`/`fragment` with
   * `undefined` (which `Object.assign`/spread would copy as a real key).
   */
  const extras: { queryParams?: Params; fragment?: string } = {};
  if (queryParams) extras.queryParams = queryParams;
  if (fragment !== undefined) extras.fragment = fragment;
  return extras;
};

@Directive({
  selector: 'ion-tabs',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class IonTabs implements AfterViewInit, AfterContentInit, AfterContentChecked {
  /**
   * Note: These must be redeclared on each child class since it needs
   * access to generated components such as IonRouterOutlet and IonTabBar.
   */
  abstract outlet: any;
  abstract tabBar: any;
  abstract tabBars: QueryList<any>;
  abstract tabs: QueryList<any>;

  @ViewChild('tabsInner', { read: ElementRef, static: true }) tabsInner: ElementRef<HTMLDivElement>;

  /**
   * Emitted before the tab view is changed.
   */
  @Output() ionTabsWillChange = new EventEmitter<{ tab: string }>();
  /**
   * Emitted after the tab view is changed.
   */
  @Output() ionTabsDidChange = new EventEmitter<{ tab: string }>();

  private tabBarSlot = 'bottom';

  private hasTab = false;
  private selectedTab?: { tab: string };
  private leavingTab?: any;

  constructor(private navCtrl: NavController) {}

  ngAfterViewInit(): void {
    /**
     * Developers must pass at least one ion-tab
     * inside of ion-tabs if they want to use a
     * basic tab-based navigation without the
     * history stack or URL updates associated
     * with the router.
     */
    const firstTab = this.tabs.length > 0 ? this.tabs.first : undefined;

    if (firstTab) {
      this.hasTab = true;
      this.setActiveTab(firstTab.tab);
      this.tabSwitch();
    }
  }

  ngAfterContentInit(): void {
    this.detectSlotChanges();
  }

  ngAfterContentChecked(): void {
    this.detectSlotChanges();
  }

  /**
   * @internal
   */
  onStackWillChange({ enteringView, tabSwitch }: StackWillChangeEvent): void {
    const stackId = enteringView.stackId;
    if (tabSwitch && stackId !== undefined) {
      this.ionTabsWillChange.emit({ tab: stackId });
    }
  }

  /**
   * @internal
   */
  onStackDidChange({ enteringView, tabSwitch }: StackDidChangeEvent): void {
    const stackId = enteringView.stackId;
    if (tabSwitch && stackId !== undefined) {
      if (this.tabBar) {
        this.tabBar.selectedTab = stackId;
      }
      this.ionTabsDidChange.emit({ tab: stackId });
    }
  }

  /**
   * Host listener for the `ionTabButtonClick` event. Angular 22 enabled stricter
   * host-binding type checking, which types `$event` as the DOM `Event`. That is
   * not assignable to `select`'s public `string | CustomEvent` parameter, so this
   * thin wrapper narrows the event before forwarding to keep `select`'s public
   * signature intact.
   */
  @HostListener('ionTabButtonClick', ['$event'])
  onTabButtonClick(ev: Event): Promise<boolean> | undefined {
    return this.select(ev as CustomEvent);
  }

  /**
   * When a tab button is clicked, there are several scenarios:
   * 1. If the selected tab is currently active (the tab button has been clicked
   *    again), then it should go to the root view for that tab.
   *
   *   a. Get the saved root view from the router outlet. If the saved root view
   *      matches the tabRootUrl, set the route view to this view including the
   *      navigation extras. Any `queryParams` or `fragment` declared on the tab
   *      button's `href` are also forwarded.
   *   b. If the saved root view from the router outlet does not match, navigate
   *      to the tabRootUrl, forwarding any `queryParams`/`fragment` declared on
   *      the tab button's `href`.
   *
   * 2. If the current tab tab is not currently selected, get the last route
   *    view from the router outlet.
   *
   *   a. If the last route view exists, navigate to that view including any
   *      navigation extras.
   *   b. If the last route view doesn't exist, then navigate to the default
   *      tabRootUrl, forwarding any `queryParams`/`fragment` declared on the
   *      tab button's `href`.
   */
  select(tabOrEvent: string | CustomEvent): Promise<boolean> | undefined {
    const isTabString = typeof tabOrEvent === 'string';
    const tab = isTabString ? tabOrEvent : (tabOrEvent as CustomEvent).detail.tab;
    const href: string | undefined = isTabString ? undefined : (tabOrEvent as CustomEvent).detail.href;

    /**
     * If the tabs are not using the router, then
     * the tab switch logic is handled by the tabs
     * component itself.
     */
    if (this.hasTab) {
      this.setActiveTab(tab);
      this.tabSwitch();

      return;
    }

    const alreadySelected = this.outlet.getActiveStackId() === tab;
    const tabRootUrl = `${this.outlet.tabsPrefix}/${tab}`;

    /**
     * The href pathname is ignored here; tab routing is driven by `tabsPrefix/tab`.
     * Only the query and fragment are forwarded as navigation extras.
     */
    const hrefExtras = parseHrefExtras(href);

    /**
     * If this is a nested tab, prevent the event
     * from bubbling otherwise the outer tabs
     * will respond to this event too, causing
     * the app to get directed to the wrong place.
     */
    if (!isTabString) {
      (tabOrEvent as CustomEvent).stopPropagation();
    }

    if (alreadySelected) {
      const activeStackId = this.outlet.getActiveStackId();
      const activeView = this.outlet.getLastRouteView(activeStackId);

      // If on root tab, do not navigate to root tab again
      if (activeView?.url === tabRootUrl) {
        return;
      }

      const rootView = this.outlet.getRootView(tab);
      const navigationExtras = rootView && tabRootUrl === rootView.url && rootView.savedExtras;
      return this.navCtrl.navigateRoot(tabRootUrl, {
        ...navigationExtras,
        ...hrefExtras,
        animated: true,
        animationDirection: 'back',
      });
    } else {
      const lastRoute = this.outlet.getLastRouteView(tab);
      /**
       * If there is a lastRoute, goto that, otherwise goto the fallback url of the
       * selected tab. When falling back to the tab root, honor query params and
       * fragment declared on the tab button's href.
       */
      const url = lastRoute?.url || tabRootUrl;
      const navigationExtras = lastRoute?.savedExtras ?? (url === tabRootUrl ? hrefExtras : undefined);

      return this.navCtrl.navigateRoot(url, {
        ...navigationExtras,
        animated: true,
        animationDirection: 'back',
      });
    }
  }

  private setActiveTab(tab: string): void {
    const tabs = this.tabs;
    const selectedTab = tabs.find((t: any) => t.tab === tab);

    if (!selectedTab) {
      console.error(`[Ionic Error]: Tab with id: "${tab}" does not exist`);
      return;
    }

    this.leavingTab = this.selectedTab;
    this.selectedTab = selectedTab;

    this.ionTabsWillChange.emit({ tab });

    selectedTab.el.active = true;
  }

  private tabSwitch(): void {
    const { selectedTab, leavingTab } = this;

    if (this.tabBar && selectedTab) {
      this.tabBar.selectedTab = selectedTab.tab;
    }

    if (leavingTab?.tab !== selectedTab?.tab) {
      if (leavingTab?.el) {
        leavingTab.el.active = false;
      }
    }

    if (selectedTab) {
      this.ionTabsDidChange.emit({ tab: selectedTab.tab });
    }
  }

  getSelected(): string | undefined {
    if (this.hasTab) {
      return this.selectedTab?.tab;
    }

    return this.outlet.getActiveStackId();
  }

  /**
   * Detects changes to the slot attribute of the tab bar.
   *
   * If the slot attribute has changed, then the tab bar
   * should be relocated to the new slot position.
   */
  private detectSlotChanges(): void {
    this.tabBars.forEach((tabBar: any) => {
      // el is a protected attribute from the generated component wrapper
      const currentSlot = tabBar.el.getAttribute('slot');

      if (currentSlot !== this.tabBarSlot) {
        this.tabBarSlot = currentSlot;
        this.relocateTabBar();
      }
    });
  }

  /**
   * Relocates the tab bar to the new slot position.
   */
  private relocateTabBar(): void {
    /**
     * `el` is a protected attribute from the generated component wrapper.
     * To avoid having to manually create the wrapper for tab bar, we
     * cast the tab bar to any and access the protected attribute.
     */
    const tabBar = (this.tabBar as any).el as HTMLElement;

    if (this.tabBarSlot === 'top') {
      /**
       * A tab bar with a slot of "top" should be inserted
       * at the top of the container.
       */
      this.tabsInner.nativeElement.before(tabBar);
    } else {
      /**
       * A tab bar with a slot of "bottom" or without a slot
       * should be inserted at the end of the container.
       */
      this.tabsInner.nativeElement.after(tabBar);
    }
  }
}
