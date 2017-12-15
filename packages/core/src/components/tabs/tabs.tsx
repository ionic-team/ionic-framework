import { Component, Element, Event, EventEmitter, Listen, Method, Prop, State } from '@stencil/core';
import { Config, NavState, RouterEntries } from '../../index';

export interface NavOptions { }


@Component({
  tag: 'ion-tabs',
  styleUrls: {
    ios: 'tabs.ios.scss',
    md: 'tabs.md.scss'
  }
})
export class Tabs {
  private ids: number = -1;
  private tabsId: number = (++tabIds);

  @Element() el: HTMLElement;

  @State() tabs: HTMLIonTabElement[] = [];
  @State() selectedTab: HTMLIonTabElement;

  @Prop({ context: 'config' }) config: Config;

  /**
   * @input {string} A unique name for the tabs
   */
  @Prop() name: string;

  /**
   * @input {boolean} If true, the tabbar
   */
  @Prop() tabbarHidden = false;

  /**
   * @input {string} Set the tabbar layout: `icon-top`, `icon-start`, `icon-end`, `icon-bottom`, `icon-hide`, `title-hide`.
   */
  @Prop({ mutable: true }) tabbarLayout: string;

  /**
   * @input {string} Set position of the tabbar: `top`, `bottom`.
   */
  @Prop({ mutable: true }) tabbarPlacement: string;

  /**
   * @input {boolean} If true, show the tab highlight bar under the selected tab.
   */
  @Prop({ mutable: true }) tabbarHighlight: boolean;

  /**
   * @input {boolean} If true, adds transparency to the tabbar.
   * Note: In order to scroll content behind the tabbar, the `fullscreen`
   * attribute needs to be set on the content.
   * Only affects `ios` mode. Defaults to `false`.
   */
  @Prop() translucent: boolean = false;

  @Prop() scrollable: boolean = false;

  /**
   * @output {any} Emitted when the tab changes.
   */
  @Event() ionChange: EventEmitter;
  @Event() ionNavChanged: EventEmitter;

  componentDidLoad() {
    this.loadConfig('tabsPlacement', 'bottom');
    this.loadConfig('tabsLayout', 'icon-top');
    this.loadConfig('tabsHighlight', true);

    this.initTabs();
    const useRouter = this.config.getBoolean('useRouter', false);
    if (!useRouter) {
      this.initSelect();
    }
  }

  componentDidUnload() {
    this.tabs = this.selectedTab = null;
  }

  @Listen('ionTabbarClick')
  // @Listen('ionSelect')
  protected tabChange(ev: CustomEvent) {
    const selectedTab = ev.detail as HTMLIonTabElement;
    this.select(selectedTab);
  }

  /**
   * @param {number|Tab} tabOrIndex Index, or the Tab instance, of the tab to select.
   */
  @Method()
  select(tabOrIndex: number | HTMLIonTabElement): Promise<any> {
    const selectedTab = (typeof tabOrIndex === 'number' ? this.getByIndex(tabOrIndex) : tabOrIndex);
    if (!selectedTab) {
      return Promise.resolve();
    }

    // Reset rest of tabs
    for (let tab of this.tabs) {
      if (selectedTab !== tab) {
        tab.selected = false;
      }
    }
    selectedTab.selected = true;

    // The same selected was selected
    // we need to set root in the nested ion-nav if it exist
    if (this.selectedTab === selectedTab) {
      return selectedTab.goToRoot();
    }

    const leavingTab = this.selectedTab;
    this.selectedTab = selectedTab;

    let promise = selectedTab._setActive(true);
    if (leavingTab) {
      promise = promise.then(() => leavingTab._setActive(false));
    }

    return promise.then(() => {
      this.ionChange.emit(selectedTab);
      this.ionNavChanged.emit({ isPop: false });
    });
  }


   /**
   * @param {number} index Index of the tab you want to get
   * @returns {HTMLIonTabElement} Returns the tab who's index matches the one passed
   */
  @Method()
  getByIndex(index: number): HTMLIonTabElement {
    return this.tabs[index];
  }

  /**
   * @return {HTMLIonTabElement} Returns the currently selected tab
   */
  @Method()
  getSelected(): HTMLIonTabElement {
    return this.tabs.find((tab) => tab.selected);
  }

  @Method()
  getIndex(tab: HTMLIonTabElement): number {
    return this.tabs.indexOf(tab);
  }

  @Method()
  getTabs(): HTMLIonTabElement[] {
    return this.tabs;
  }

  @Method()
  getState(): NavState {
    const selectedTab = this.getSelected();
    if (!selectedTab) {
      return null;
    }
    return {
      path: selectedTab.getPath(),
      focusNode: selectedTab
    };
  }

  @Method()
  getRoutes(): RouterEntries {
    debugger;
    const a = this.tabs.map(t => {
      return {
        path: t.getPath(),
        id: t
      };
    });
    return a;
  }

  @Method()
  setRouteId(id: any, _: any = {}): Promise<void> {
    if (this.selectedTab === id) {
      return Promise.resolve();
    }
    return this.select(id);
  }

  private initTabs() {
    const tabs = this.tabs = Array.from(this.el.querySelectorAll('ion-tab'));
    for (let tab of tabs) {
      const id = `t-${this.tabsId}-${++this.ids}`;
      tab.btnId = 'tab-' + id;
      tab.id = 'tabpanel-' + id;
    }
  }

  private initSelect() {
    // find pre-selected tabs
    let selectedTab = this.tabs.find(t => t.selected);

    // reset all tabs none is selected
    for (let tab of this.tabs) {
      tab.selected = false;
    }

    // find a tab candidate in case, the selected in null
    if (!selectedTab) {
      selectedTab = this.tabs.find(t => t.show && t.enabled);
    }
    selectedTab._setActive(true);
    this.selectedTab = selectedTab;
  }

  private loadConfig(attrKey: string, fallback: any) {
    const val = (this as any)[attrKey];
    if (typeof val === 'undefined') {
      (this as any)[attrKey] = this.config.get(attrKey, fallback);
    }
  }

  render() {
    const dom = [
      <div class='tabs-inner'>
        <slot></slot>
      </div>
    ];

    if (!this.tabbarHidden) {
      dom.push(
        <ion-tabbar
          tabs={this.tabs}
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
