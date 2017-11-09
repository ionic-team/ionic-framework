import { Component, Listen, Prop, PropDidChange, State } from '@stencil/core';

import { ComponentEvent } from '../../index';

import { Tab } from './tab';

@Component({
  tag: 'ion-tabs',
  styleUrls: {
    ios: 'tabs.ios.scss',
    md: 'tabs.md.scss',
    wp: 'tabs.wp.scss'
  },
  host: {
    theme: 'tabs'
  }
})
export class Tabs {
  // Current list of tabs
  @State() tabs: any;

  /**
   * @state {number} The selected tab
   */
  @State() selectedTab: any;

  /**
   * @state {number} The selected tab index
   */
  @State() selectedIndex: number = 0;

  /**
   * @input {string} Set the tabbar layout: `icon-top`, `icon-start`, `icon-end`, `icon-bottom`, `icon-hide`, `title-hide`.
   */
  @Prop() tabsLayout: string = 'icon-top';

  /**
   * @input {string} Set position of the tabbar: `top`, `bottom`.
   */
  @Prop() tabsPlacement: string = 'bottom';

  /**
   * @input {boolean} If true, show the tab highlight bar under the selected tab.
   */
  @Prop() tabsHighlight: boolean = false;

  /**
   * @output {Event} Emitted when the tab changes.
   */
  // TODO should this be an event?
  @Prop() ionChange: Function;

  /**
   * If selectedIndex was changed, grab the reference to the tab it points to.
   */
  @PropDidChange('selectedIndex')
  protected selectedIndexChanged() {
    this.selectedTab = this.tabs[this.selectedIndex];
  }

  @Listen('ionTabDidLoad')
  tabDidLoad(ev: ComponentEvent<Tab>) {
    const tab = ev.detail.component;

    // First tab? Select it
    if (this.tabs.length === 0) {
      this.handleOnTabSelected(tab, 0);
    }

    this.tabs = [ ...this.tabs, tab ];
  }

  @Listen('ionTabDidUnload')
  tabDidUnload(ev: any) {
    this.tabs = this.tabs.filter((t: any) => t !== ev.detail.tab);
  }

  handleOnTabSelected(tab: any, index: number) {
    // Select just this tab
    this.tabs.forEach((t: any) => t.isSelected = false);
    tab.isSelected = true;

    // Store the selected tab and index
    this.selectedTab = tab;
    this.selectedIndex = index;

    // Fire a change event
    this.ionChange && this.ionChange(tab);
  }

  protected render() {
    return [
      <ion-tab-bar
        tabs={this.tabs}
        onTabSelected={this.handleOnTabSelected.bind(this)}
        selectedIndex={this.selectedIndex} />,
      <slot></slot>
    ];
  }
}
