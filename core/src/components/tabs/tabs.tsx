import { Build, Component, Element, Event, EventEmitter, Listen, Method, Prop, State } from '@stencil/core';

import { Config, NavOutlet, RouteID, RouteWrite } from '../../interface';

@Component({
  tag: 'ion-tabs',
  styleUrl: 'tabs.scss',
  shadow: true
})
export class Tabs implements NavOutlet {

  private ids = -1;
  private transitioning = false;
  private tabsId = (++tabIds);
  private leavingTab?: HTMLIonTabElement;
  private userTabbarEl?: HTMLIonTabbarElement;

  @Element() el!: HTMLStencilElement;

  @State() tabs: HTMLIonTabElement[] = [];
  @State() selectedTab?: HTMLIonTabElement;

  @Prop({ context: 'config' }) config!: Config;
  @Prop({ context: 'document' }) doc!: Document;

  /**
   * A unique name for the tabs.
   */
  @Prop() name?: string;

  /**
   * If `true`, the tabbar will be hidden. Defaults to `false`.
   */
  @Prop() tabbarHidden = false;

  /**
   * If `true`, the tabs will use the router and `selectedTab` will not do anything.
   */
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
    this.userTabbarEl = this.el.querySelector('ion-tabbar') || undefined;

    await this.initTabs();

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
    const tabbarEl = this.userTabbarEl;
    if (tabbarEl) {
      tabbarEl.tabs = this.tabs.slice();
      tabbarEl.selectedTab = this.selectedTab;
    }
  }

  @Listen('ionTabMutated')
  protected onTabMutated() {
    this.el.forceUpdate();
  }

  @Listen('ionTabbarClick')
  protected onTabClicked(ev: CustomEvent<HTMLIonTabElement>) {
    const selectedTab = ev.detail;
    const href = selectedTab.href as string | undefined;
    if (this.useRouter && href !== undefined) {
      const router = this.doc.querySelector('ion-router');
      if (router) {
        router.push(href);
      }
    } else {
      this.select(selectedTab);
    }
  }

  /**
   * Index or the Tab instance, of the tab to select.
   */
  @Method()
  async select(tabOrIndex: number | HTMLIonTabElement): Promise<boolean> {
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
  async getTab(tabOrIndex: string | number | HTMLIonTabElement): Promise<HTMLIonTabElement | undefined> {
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
  getSelected(): Promise<HTMLIonTabElement | undefined> {
    return Promise.resolve(this.selectedTab);
  }

  private initTabs() {
    const tabs = this.tabs = Array.from(this.el.querySelectorAll('ion-tab'));
    tabs.forEach(tab => {
      const id = `t-${this.tabsId}-${++this.ids}`;
      tab.btnId = 'tab-' + id;
      tab.id = 'tabpanel-' + id;
    });
    return Promise.all(tabs.map(tab => tab.componentOnReady()));
  }

  private async initSelect(): Promise<void> {
    const tabs = this.tabs;
    if (this.useRouter) {
      if (Build.isDev) {
        const tab = tabs.find(t => t.selected);
        if (tab) {
          console.warn('When using a router (ion-router) <ion-tab selected="true"> makes no difference' +
          'Define routes properly the define which tab is selected');
        }
      }
      return;
    }
    // find pre-selected tabs
    const selectedTab = tabs.find(t => t.selected) ||
      tabs.find(t => t.show && !t.disabled);

    // reset all tabs none is selected
    for (const tab of tabs) {
      if (tab !== selectedTab) {
        tab.selected = false;
      }
    }
    if (selectedTab) {
      await selectedTab.setActive();
    }
    this.selectedTab = selectedTab;
    if (selectedTab) {
      selectedTab.selected = true;
      selectedTab.active = true;
    }
  }

  private setActive(selectedTab: HTMLIonTabElement): Promise<void> {
    if (this.transitioning) {
      return Promise.reject('transitioning already happening');
    }

    // Reset rest of tabs
    for (const tab of this.tabs) {
      if (selectedTab !== tab) {
        tab.selected = false;
      }
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

    selectedTab.selected = true;
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

  private shouldSwitch(selectedTab: HTMLIonTabElement | undefined): selectedTab is HTMLIonTabElement {
    const leavingTab = this.selectedTab;
    return selectedTab !== undefined && selectedTab !== leavingTab && !this.transitioning;
  }

  hostData() {
    return {
      class: {
        'tabbar-hidden': this.tabbarHidden
      }
    };
  }

  render() {
    return [
      <div class="tabs-inner">
        <slot></slot>
      </div>,
      <slot name="tabbar">
        <ion-tabbar
          tabs={this.tabs.slice()}
          selectedTab={this.selectedTab}
        >
        </ion-tabbar>
      </slot>
    ];
  }
}

let tabIds = -1;
