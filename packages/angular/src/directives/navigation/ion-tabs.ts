import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';

import { NavController } from '../../providers/nav-controller';
import { IonTabBar } from '../proxies';

import { IonRouterOutlet } from './ion-router-outlet';
import { StackEvent } from './stack-utils';

@Component({
  selector: 'ion-tabs',
  template: `
    <ng-content select="[slot=top]"></ng-content>
    <div class="tabs-inner" #tabsInner>
      <ion-router-outlet #outlet tabs="true" (stackEvents)="onPageSelected($event)"></ion-router-outlet>
    </div>
    <ng-content></ng-content>
  `,
  styles: [
    `
      :host {
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        flex-direction: column;

        width: 100%;
        height: 100%;

        contain: layout size style;
      }
      .tabs-inner {
        position: relative;

        flex: 1;

        contain: layout size style;
      }
    `,
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class IonTabs implements AfterContentInit, AfterContentChecked {
  @ViewChild('outlet', { read: IonRouterOutlet, static: false }) outlet: IonRouterOutlet;
  @ViewChild('tabsInner', { read: ElementRef, static: true }) tabsInner: ElementRef<HTMLDivElement>;

  @ContentChild(IonTabBar, { static: false }) tabBar: IonTabBar | undefined;
  @ContentChildren(IonTabBar) tabBars: QueryList<IonTabBar>;

  @Output() ionTabsWillChange = new EventEmitter<{ tab: string }>();
  @Output() ionTabsDidChange = new EventEmitter<{ tab: string }>();

  private tabBarSlot = 'bottom';

  constructor(private navCtrl: NavController) {}

  ngAfterContentInit(): void {
    this.detectSlotChanges();
  }

  ngAfterContentChecked(): void {
    this.detectSlotChanges();
  }

  /**
   * @internal
   */
  onPageSelected(detail: StackEvent): void {
    const stackId = detail.enteringView.stackId;
    if (detail.tabSwitch && stackId !== undefined) {
      this.ionTabsWillChange.emit({ tab: stackId });
      if (this.tabBar) {
        this.tabBar.selectedTab = stackId;
      }
      this.ionTabsDidChange.emit({ tab: stackId });
    }
  }

  /**
   * When a tab button is clicked, there are several scenarios:
   * 1. If the selected tab is currently active (the tab button has been clicked
   *    again), then it should go to the root view for that tab.
   *
   *   a. Get the saved root view from the router outlet. If the saved root view
   *      matches the tabRootUrl, set the route view to this view including the
   *      navigation extras.
   *   b. If the saved root view from the router outlet does
   *      not match, navigate to the tabRootUrl. No navigation extras are
   *      included.
   *
   * 2. If the current tab tab is not currently selected, get the last route
   *    view from the router outlet.
   *
   *   a. If the last route view exists, navigate to that view including any
   *      navigation extras
   *   b. If the last route view doesn't exist, then navigate
   *      to the default tabRootUrl
   */
  @HostListener('ionTabButtonClick', ['$event'])
  select(tabOrEvent: string | CustomEvent): Promise<boolean> | undefined {
    const isTabString = typeof tabOrEvent === 'string';
    const tab = isTabString ? tabOrEvent : (tabOrEvent as CustomEvent).detail.tab;
    const alreadySelected = this.outlet.getActiveStackId() === tab;
    const tabRootUrl = `${this.outlet.tabsPrefix}/${tab}`;

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
        animated: true,
        animationDirection: 'back',
      });
    } else {
      const lastRoute = this.outlet.getLastRouteView(tab);
      /**
       * If there is a lastRoute, goto that, otherwise goto the fallback url of the
       * selected tab
       */
      const url = lastRoute?.url || tabRootUrl;
      const navigationExtras = lastRoute?.savedExtras;

      return this.navCtrl.navigateRoot(url, {
        ...navigationExtras,
        animated: true,
        animationDirection: 'back',
      });
    }
  }

  getSelected(): string | undefined {
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
