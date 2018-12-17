import { Component, Element, Event, EventEmitter, Listen, Method, Prop, State } from '@stencil/core';

import { Config, NavOutlet, RouteID, RouteWrite, TabButtonClickDetail } from '../../interface';

@Component({
  tag: 'ion-tabs',
  styleUrl: 'tabs.scss',
  shadow: true
})
export class Tabs implements NavOutlet {

  private transitioning = false;
  private leavingTab?: HTMLIonTabElement;

  @Element() el!: HTMLStencilElement;

  @State() tabs: HTMLIonTabElement[] = [];
  @State() selectedTab?: HTMLIonTabElement;

  @Prop({ context: 'config' }) config!: Config;
  @Prop({ context: 'document' }) doc!: Document;

  /** @internal */
  @Prop({ mutable: true }) useRouter = false;

  /**
   * Emitted when the tab changes.
   */
  @Event() ionChange!: EventEmitter<{tab: HTMLIonTabElement}>;

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
    this.tabs = Array.from(this.el.querySelectorAll('ion-tab'));
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
    const tabBar = this.el.querySelector('ion-tab-bar');
    if (tabBar) {
      const tab = this.selectedTab ? this.selectedTab.tab : undefined;
      tabBar.selectedTab = tab;
    }
  }

  @Listen('ionTabButtonClick')
  protected onTabClicked(ev: CustomEvent<TabButtonClickDetail>) {
    const { href, tab } = ev.detail;
    const selectedTab = this.tabs.find(t => t.tab === tab);
    if (this.useRouter && href !== undefined) {
      const router = this.doc.querySelector('ion-router');
      if (router) {
        router.push(href);
      }
    } else if (selectedTab) {
      this.select(selectedTab);
    }
  }

  /**
   * Index or the Tab instance, of the tab to select.
   */
  @Method()
  async select(tab: string | HTMLIonTabElement): Promise<boolean> {
    const selectedTab = await this.getTab(tab);
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
    const tabId = this.selectedTab && this.selectedTab.tab;
    return tabId !== undefined ? { id: tabId, element: this.selectedTab } : undefined;
  }

  /** Get the tab at the given index */
  @Method()
  async getTab(tab: string | HTMLIonTabElement): Promise<HTMLIonTabElement | undefined> {
    const tabEl = (typeof tab === 'string')
      ? this.tabs.find(t => t.tab === tab)
      : tab;

    if (!tabEl) {
      console.error(`tab with id: "${tabEl}" does not exist`);
    }
    return tabEl;
  }

  /**
   * Get the currently selected tab
   */
  @Method()
  getSelected(): Promise<HTMLIonTabElement | undefined> {
    return Promise.resolve(this.selectedTab);
  }

  private async initSelect(): Promise<void> {
    if (this.useRouter) {
      return;
    }
    // wait for all tabs to be ready
    await Promise.all(this.tabs.map(tab => tab.componentOnReady()));
    await this.select(this.tabs[0]);
  }

  private setActive(selectedTab: HTMLIonTabElement): Promise<void> {
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
        return router.navChanged('forward');
      }
    }
    return Promise.resolve(false);
  }

  private shouldSwitch(selectedTab: HTMLIonTabElement | undefined): selectedTab is HTMLIonTabElement {
    const leavingTab = this.selectedTab;
    return selectedTab !== undefined && selectedTab !== leavingTab && !this.transitioning;
  }

  render() {
    return [
      <slot name="top"></slot>,
      <div class="tabs-inner">
        <slot></slot>
      </div>,
      <slot name="bottom"></slot>
    ];
  }
}
