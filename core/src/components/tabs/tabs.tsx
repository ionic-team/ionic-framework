import { Build, Component, Element, Event, EventEmitter, Listen, Method, Prop, State } from '@stencil/core';
import { Color, Config, NavOutlet, RouteID, RouteWrite, TabbarLayout, TabbarPlacement } from '../../interface';


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

  @Element() el!: HTMLStencilElement;

  @State() tabs: HTMLIonTabElement[] = [];
  @State() selectedTab?: HTMLIonTabElement;

  @Prop({ context: 'config' }) config!: Config;

  @Prop({ context: 'document' }) doc!: Document;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   */
  @Prop() color?: Color;

  /**
   * A unique name for the tabs.
   */
  @Prop() name?: string;

  /**
   * If true, the tabbar will be hidden. Defaults to `false`.
   */
  @Prop() tabbarHidden = false;

  /**
   * If true, show the tab highlight bar under the selected tab.
   */
  @Prop({ mutable: true }) tabbarHighlight?: boolean;

  /**
   * Set the layout of the text and icon in the tabbar. Available options: `"icon-top"`, `"icon-start"`, `"icon-end"`, `"icon-bottom"`, `"icon-hide"`, `"label-hide"`.
   */
  @Prop({ mutable: true }) tabbarLayout?: TabbarLayout;

  /**
   * Set the position of the tabbar, relative to the content. Available options: `"top"`, `"bottom"`.
   */
  @Prop({ mutable: true }) tabbarPlacement?: TabbarPlacement;

  /**
   * If true, the tabs will be translucent.
   * Note: In order to scroll content behind the tabs, the `fullscreen`
   * attribute needs to be set on the content.
   * Defaults to `false`.
   */
  @Prop() translucent = false;

  /**
   * If true, the tabs will be scrollable when there are enough tabs to overflow the width of the screen.
   */
  @Prop() scrollable = false;

  /**
   * If true, the tabs will use the router and `selectedTab` will not do anything.
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

  componentWillLoad() {
    if (!this.useRouter) {
      this.useRouter = !!this.doc.querySelector('ion-router') && !this.el.closest('[no-router]');
    }

    this.loadConfig('tabbarLayout', 'bottom');
    this.loadConfig('tabbarLayout', 'icon-top');
    this.loadConfig('tabbarHighlight', false);

    this.initTabs();

    this.ionNavWillLoad.emit();
  }

  async componentDidLoad() {
    await this.initSelect();
  }

  componentDidUnload() {
    this.tabs.length = 0;
    this.selectedTab = this.leavingTab = undefined;
  }

  @Listen('ionTabMutated')
  protected onTabMutated() {
    this.el.forceUpdate();
  }

  @Listen('ionTabbarClick')
  protected onTabClicked(ev: CustomEvent<HTMLIonTabElement>) {
    const selectedTab = ev.detail;
    if (this.useRouter && selectedTab.href != null) {
      const router = this.doc.querySelector('ion-router');
      if (router) {
        router.push(selectedTab.href);
      }
      return;
    }
    this.select(selectedTab);
  }

  /**
   * Index or the Tab instance, of the tab to select.
   */
  @Method()
  async select(tabOrIndex: number | HTMLIonTabElement): Promise<boolean> {
    const selectedTab = this.getTab(tabOrIndex);
    if (!this.shouldSwitch(selectedTab)) {
      return false;
    }
    await this.setActive(selectedTab);
    await this.notifyRouter();
    this.tabSwitch();

    return true;
  }

  /** @hidden */
  @Method()
  async setRouteId(id: string): Promise<RouteWrite> {
    const selectedTab = this.getTab(id);
    if (!this.shouldSwitch(selectedTab)) {
      return {changed: false, element: this.selectedTab};
    }

    await this.setActive(selectedTab);
    return {
      changed: true,
      element: this.selectedTab,
      markVisible: () => this.tabSwitch(),
    };
  }

  /** @hidden */
  @Method()
  getRouteId(): RouteID|undefined {
    const id = this.selectedTab && this.selectedTab.getTabId();
    return id ? {id, element: this.selectedTab} : undefined;
  }

  /** Get the tab at the given index */
  @Method()
  getTab(tabOrIndex: string | number | HTMLIonTabElement): HTMLIonTabElement|undefined {
    if (typeof tabOrIndex === 'string') {
      return this.tabs.find(tab => tab.getTabId() === tabOrIndex);
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
  getSelected(): HTMLIonTabElement | undefined {
    return this.selectedTab;
  }

  private initTabs() {
    const tabs = this.tabs = Array.from(this.el.querySelectorAll('ion-tab'));
    tabs.forEach(tab => {
      const id = `t-${this.tabsId}-${++this.ids}`;
      tab.btnId = 'tab-' + id;
      tab.id = 'tabpanel-' + id;
    });
  }

  private async initSelect(): Promise<void> {
    const tabs = this.tabs;
    if (this.useRouter) {
      if (Build.isDev) {
        const selectedTab = tabs.find(t => t.selected);
        if (selectedTab) {
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

  private loadConfig(attrKey: string, fallback: any) {
    const val = (this as any)[attrKey];
    if (typeof val === 'undefined') {
      (this as any)[attrKey] = this.config.get(attrKey, fallback);
    }
  }

  private setActive(selectedTab: HTMLIonTabElement): Promise<void> {
    if (this.transitioning) {
      return Promise.reject('transitioning already happening');
    }

    if (!selectedTab) {
      return Promise.reject('no tab is selected');
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
      this.ionChange.emit({tab: selectedTab});
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

  private shouldSwitch(selectedTab: HTMLIonTabElement|undefined): selectedTab is HTMLIonTabElement {
    const leavingTab = this.selectedTab;
    return !!(selectedTab && selectedTab !== leavingTab && !this.transitioning);
  }

  render() {
    const dom = [
      <div class="tabs-inner">
        <slot></slot>
      </div>
    ];

    if (!this.tabbarHidden) {
      console.log('render tabs');

      dom.push(
        <ion-tabbar
          tabs={this.tabs.slice()}
          color={this.color}
          selectedTab={this.selectedTab}
          highlight={this.tabbarHighlight}
          placement={this.tabbarPlacement}
          layout={this.tabbarLayout}
          translucent={this.translucent}
          scrollable={this.scrollable}>
        </ion-tabbar>
      );
    }
    return dom;
  }
}

let tabIds = -1;


