import { Component, Element, Event, EventEmitter, Listen, Method, Prop, State } from '@stencil/core';

import { Config, NavOutlet, RouteID, RouteWrite, TabbarClickDetail } from '../../interface';

@Component({
  tag: 'ion-tab-group',
  styleUrl: 'tab-group.scss',
  shadow: true
})
export class TabGroup implements NavOutlet {

  private ids = -1;
  private transitioning = false;
  private tabsId = (++tabIds);
  private leavingTab?: HTMLIonTabViewElement;

  @Element() el!: HTMLStencilElement;

  @State() tabs: HTMLIonTabViewElement[] = [];
  @State() selectedTab?: HTMLIonTabViewElement;

  @Prop({ context: 'config' }) config!: Config;
  @Prop({ context: 'document' }) doc!: Document;

  /**
   * A unique name for the tabs.
   */
  @Prop() name?: string;

  /**
   * If `true`, the tabs will use the router and `selectedTab` will not do anything.
   */
  @Prop({ mutable: true }) useRouter = false;

  /**
   * Emitted when the tab changes.
   */
  @Event() ionChange!: EventEmitter<{tab: HTMLIonTabViewElement}>;

  /**
   * Emitted when the navigation will load a component.
   */
  @Event() ionNavWillLoad!: EventEmitter<void>;

  /**
   * Emitted when the navigation is about to transition to a new component.
   */
  @Event() ionNavWillChange!: EventEmitter<void>;

  /**
   * Emitted when the navigation has finished transitioning to a new component.
   */
  @Event() ionNavDidChange!: EventEmitter<void>;

  async componentWillLoad() {
    if (!this.useRouter) {
      this.useRouter = !!this.doc.querySelector('ion-router') && !this.el.closest('[no-router]');
    }
    this.initTabs();

    this.ionNavWillLoad.emit();
    this.componentWillUpdate();
  }

  componentDidLoad() {
    this.initSelect();
  }

  componentDidUnload() {
    this.tabs.length = 0;
    this.selectedTab = this.leavingTab = undefined;
  }

  componentWillUpdate() {
    const tabbar = this.el.querySelector('ion-tab-bar');
    if (tabbar) {
      const viewId = this.selectedTab ? this.selectedTab.id : undefined;
      tabbar.selectedViewId = viewId;
    }
  }

  @Listen('ionTabbarClick')
  protected onTabClicked(ev: CustomEvent<TabbarClickDetail>) {
    const { href, viewId } = ev.detail;
    const tab = this.tabs.find(t => t.id === viewId);
    if (this.useRouter && href !== undefined) {
      const router = this.doc.querySelector('ion-router');
      if (router) {
        router.push(href);
      }
    } else if (tab) {
      this.select(tab);
    }
  }

  /**
   * Index or the Tab instance, of the tab to select.
   */
  @Method()
  async select(tabOrIndex: number | HTMLIonTabViewElement): Promise<boolean> {
    const selectedTab = await this.getTab(tabOrIndex);
    if (!this.shouldSwitch(selectedTab)) {
      return false;
    }
    await this.setActive(selectedTab);
    await this.notifyRouter();
    this.tabSwitch();

    return true;
  }

  /** @internal */
  @Method()
  async setRouteId(id: string): Promise<RouteWrite> {
    const selectedTab = await this.getTab(id);
    if (!this.shouldSwitch(selectedTab)) {
      return { changed: false, element: this.selectedTab };
    }

    await this.setActive(selectedTab);
    return {
      changed: true,
      element: this.selectedTab,
      markVisible: () => this.tabSwitch(),
    };
  }

  /** @internal */
  @Method()
  async getRouteId(): Promise<RouteID | undefined> {
    const id = this.selectedTab && this.selectedTab.name;
    return id !== undefined ? { id, element: this.selectedTab } : undefined;
  }

  /** Get the tab at the given index */
  @Method()
  async getTab(tabOrIndex: string | number | HTMLIonTabViewElement): Promise<HTMLIonTabViewElement | undefined> {
    if (typeof tabOrIndex === 'string') {
      return this.tabs.find(tab => tab.name === tabOrIndex);
    }
    if (typeof tabOrIndex === 'number') {
      return this.tabs[tabOrIndex];
    }
    return tabOrIndex;
  }

  /**
   * Get the currently selected tab
   */
  @Method()
  getSelected(): Promise<HTMLIonTabViewElement | undefined> {
    return Promise.resolve(this.selectedTab);
  }

  private initTabs() {
    const tabs = this.tabs = Array.from(this.el.querySelectorAll('ion-tab-view'));
    tabs.forEach(tab => {
      const id = `t-${this.tabsId}-${++this.ids}`;
      tab.btnId = `tab-${id}`;
      // tab.id = 'tabpanel-' + id;
    });
  }

  private async initSelect(): Promise<void> {
    const tabs = this.tabs;
    // wait for all tabs to be ready
    await Promise.all(tabs.map(tab => tab.componentOnReady()));
    if (this.useRouter) {
      return;
    }

    // TODO
    // // find pre-selected tabs
    // const selectedTab = tabs.;
    // if (selectedTab) {
    //   await selectedTab.setActive();
    // }
    // this.selectedTab = selectedTab;
    // if (selectedTab) {
    //   selectedTab.active = true;
    // }
  }

  private setActive(selectedTab: HTMLIonTabViewElement): Promise<void> {
    if (this.transitioning) {
      return Promise.reject('transitioning already happening');
    }

    this.transitioning = true;
    this.leavingTab = this.selectedTab;
    this.selectedTab = selectedTab;
    this.ionNavWillChange.emit();
    return selectedTab.setActive();
  }

  private tabSwitch() {
    const selectedTab = this.selectedTab;
    const leavingTab = this.leavingTab;

    this.leavingTab = undefined;
    this.transitioning = false;
    if (!selectedTab) {
      return;
    }

    if (leavingTab !== selectedTab) {
      if (leavingTab) {
        leavingTab.active = false;
      }
      this.ionChange.emit({ tab: selectedTab });
      this.ionNavDidChange.emit();
    }
  }

  private notifyRouter() {
    if (this.useRouter) {
      const router = this.doc.querySelector('ion-router');
      if (router) {
        return router.navChanged(1);
      }
    }
    return Promise.resolve(false);
  }

  private shouldSwitch(selectedTab: HTMLIonTabViewElement | undefined): selectedTab is HTMLIonTabViewElement {
    const leavingTab = this.selectedTab;
    return selectedTab !== undefined && selectedTab !== leavingTab && !this.transitioning;
  }

  render() {
    return [
      <div class="tabs-inner">
        <slot></slot>
      </div>,
      <slot name="tabbar"></slot>
    ];
  }
}

let tabIds = -1;
