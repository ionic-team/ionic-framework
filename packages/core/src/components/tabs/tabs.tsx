import { Component, Element, Event, EventEmitter, Listen, Method, Prop, State } from '@stencil/core';
import { Config, NavOutlet } from '../../index';


@Component({
  tag: 'ion-tabs',
  styleUrl: 'tabs.scss'
})
export class Tabs implements NavOutlet {
  private ids = -1;
  private transitioning = false;
  private tabsId: number = (++tabIds);

  @Element() el: HTMLElement;

  @State() tabs: HTMLIonTabElement[] = [];
  @State() selectedTab: HTMLIonTabElement | undefined;

  @Prop({ context: 'config' }) config: Config;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * A unique name for the tabs
   */
  @Prop() name: string;

  /**
   * If true, the tabbar
   */
  @Prop() tabbarHidden = false;

  /**
   * Set the tabbar layout: `icon-top`, `icon-start`, `icon-end`, `icon-bottom`, `icon-hide`, `title-hide`.
   */
  @Prop({ mutable: true }) tabbarLayout: string;

  /**
   * Set position of the tabbar: `top`, `bottom`.
   */
  @Prop({ mutable: true }) tabbarPlacement: string;

  /**
   * If true, show the tab highlight bar under the selected tab.
   */
  @Prop({ mutable: true }) tabbarHighlight: boolean;

  /**
   * If true, the tabs will be translucent.
   * Note: In order to scroll content behind the tabs, the `fullscreen`
   * attribute needs to be set on the content.
   * Defaults to `false`.
   */
  @Prop() translucent = false;

  @Prop() scrollable = false;

  /**
   * Emitted when the tab changes.
   */
  @Event() ionChange: EventEmitter;
  @Event() ionNavChanged: EventEmitter<any>;

  componentWillLoad() {
    this.loadConfig('tabsPlacement', 'bottom');
    this.loadConfig('tabsLayout', 'icon-top');
    this.loadConfig('tabsHighlight', true);
  }

  componentDidLoad() {
    return this.initTabs()
      .then(() => this.initSelect());
  }

  componentDidUnload() {
    this.tabs.length = 0;
    this.selectedTab = undefined;
  }

  @Listen('ionTabbarClick')
  protected tabChange(ev: CustomEvent) {
    const selectedTab = ev.detail as HTMLIonTabElement;
    this.select(selectedTab);
  }

  /**
   * @param {number|Tab} tabOrIndex Index, or the Tab instance, of the tab to select.
   */
  @Method()
  select(tabOrIndex: number | HTMLIonTabElement): Promise<boolean> {
    if (this.transitioning) {
      return Promise.resolve(false);
    }
    const selectedTab = (typeof tabOrIndex === 'number' ? this.getByIndex(tabOrIndex) : tabOrIndex);
    if (!selectedTab) {
      return Promise.resolve(false);
    }

    // Reset rest of tabs
    for (const tab of this.tabs) {
      if (selectedTab !== tab) {
        tab.selected = false;
      }
    }

    const leavingTab = this.selectedTab;
    this.transitioning = true;
    return selectedTab.setActive().then(() => {
      this.transitioning = false;
      selectedTab.selected = true;
      if (leavingTab !== selectedTab) {
        if (leavingTab) {
          leavingTab.active = false;
        }
        this.selectedTab = selectedTab;
        this.ionChange.emit(selectedTab);
        this.ionNavChanged.emit({isPop: false});
        return true;
      }
      return false;
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
  getSelected(): HTMLIonTabElement | undefined {
    return this.selectedTab;
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
  setRouteId(id: any): Promise<boolean> {
    if (this.selectedTab && this.selectedTab.getRouteId() === id) {
      return Promise.resolve(false);
    }
    const tab = this.tabs.find(t => id === t.getRouteId());
    return this.select(tab).then(() => true);
  }


  @Method()
  getRouteId(): string|null {
    if (this.selectedTab) {
      return this.selectedTab.getRouteId();
    }
    return null;
  }


  @Method()
  getContentElement(): HTMLElement {
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

  private initSelect() {
    if (document.querySelector('ion-router')) {
      return Promise.resolve();
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
    const promise = selectedTab ? selectedTab.setActive() : Promise.resolve();
    return promise.then(() => {
      this.selectedTab = selectedTab;
      if (selectedTab) {
        selectedTab.selected = true;
        selectedTab.active = true;
      }
    });
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


