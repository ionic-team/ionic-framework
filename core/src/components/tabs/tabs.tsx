import { Build, Component, Element, Event, EventEmitter, Listen, Method, Prop, State } from '@stencil/core';
import { Color, Config, NavOutlet, RouteID, RouteWrite } from '../../interface';
import { TabbarLayout, TabbarPlacement } from '../tabbar/tabbar';


@Component({
  tag: 'ion-tabs',
  styleUrl: 'tabs.scss'
})
export class Tabs implements NavOutlet {

  private ids = -1;
  private transitioning = false;
  private tabsId = (++tabIds);
  private leavingTab?: HTMLIonTabElement;

  @Element() el!: HTMLElement;

  @State() tabs: HTMLIonTabElement[] = [];
  @State() selectedTab?: HTMLIonTabElement;

  @Prop({ context: 'config' }) config!: Config;
  @Prop({ context: 'document' }) doc!: Document;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color?: Color;

  /**
   * A unique name for the tabs
   */
  @Prop() name?: string;

  /**
   * If true, the tabbar
   */
  @Prop() tabbarHidden = false;

  /**
   * Set the tabbar layout: `icon-top`, `icon-start`, `icon-end`, `icon-bottom`, `icon-hide`, `title-hide`.
   */
  @Prop({ mutable: true }) tabbarLayout?: TabbarLayout;

  /**
   * Set position of the tabbar: `top`, `bottom`.
   */
  @Prop({ mutable: true }) tabbarPlacement?: TabbarPlacement;

  /**
   * If true, show the tab highlight bar under the selected tab.
   */
  @Prop({ mutable: true }) tabbarHighlight?: boolean;

  /**
   * If true, the tabs will be translucent.
   * Note: In order to scroll content behind the tabs, the `fullscreen`
   * attribute needs to be set on the content.
   * Defaults to `false`.
   */
  @Prop() translucent = false;

  @Prop() scrollable = false;

  @Prop({ mutable: true }) useRouter = false;

  /**
   * Emitted when the tab changes.
   */
  @Event() ionChange!: EventEmitter<{tab: HTMLIonTabElement}>;
  @Event() ionNavWillLoad!: EventEmitter<void>;
  @Event() ionNavWillChange!: EventEmitter<void>;
  @Event() ionNavDidChange!: EventEmitter<void>;

  componentWillLoad() {
    if (!this.useRouter) {
      this.useRouter = !!this.doc.querySelector('ion-router') && !this.el.closest('[no-router]');
    }

    this.loadConfig('tabbarLayout', 'bottom');
    this.loadConfig('tabbarLayout', 'icon-top');
    this.loadConfig('tabbarHighlight', false);

    this.ionNavWillLoad.emit();
  }

  async componentDidLoad() {
    await this.initTabs();
    await this.initSelect();
  }

  componentDidUnload() {
    this.tabs.length = 0;
    this.selectedTab = this.leavingTab = undefined;
  }

  @Listen('ionTabbarClick')
  protected tabChange(ev: CustomEvent<HTMLIonTabElement>) {
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
   * @param {number|Tab} tabOrIndex Index, or the Tab instance, of the tab to select.
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

  @Method()
  getRouteId(): RouteID|undefined {
    const id = this.selectedTab && this.selectedTab.getTabId();
    return id ? {id, element: this.selectedTab} : undefined;
  }

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
   * @return {HTMLIonTabElement} Returns the currently selected tab
   */
  @Method()
  getSelected(): HTMLIonTabElement | undefined {
    return this.selectedTab;
  }

  private initTabs() {
    const tabs = this.tabs = Array.from(this.el.querySelectorAll('ion-tab'));
    const tabPromises = tabs.map(tab => {
      const id = `t-${this.tabsId}-${++this.ids}`;
      tab.btnId = 'tab-' + id;
      tab.id = 'tabpanel-' + id;
      return tab.componentOnReady();
    });

    return Promise.all(tabPromises);
  }

  private async initSelect(): Promise<void> {
    if (this.useRouter) {
      if (Build.isDev) {
        const selectedTab = this.tabs.find(t => t.selected);
        if (selectedTab) {
          console.warn('When using a router (ion-router) <ion-tab selected="true"> makes no difference' +
          'Define routes properly the define which tab is selected');
        }
      }
      return;
    }
    // find pre-selected tabs
    const selectedTab = this.tabs.find(t => t.selected) ||
      this.tabs.find(t => t.show && !t.disabled);

    // reset all tabs none is selected
    for (const tab of this.tabs) {
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
      dom.push(
        <ion-tabbar
          tabs={this.tabs}
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


