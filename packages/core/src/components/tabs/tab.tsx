import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';


@Component({
  tag: 'ion-tab',
  host: {
    theme: 'tab'
  }
})
export class Tab {

  /**
   * @input {Page} Set the root component for this tab.
   */
  @Prop() root: string;

  /**
   * @input {object} Any nav-params to pass to the root componentof this tab.
   */
  @Prop() rootParams: any;

  /**
   * @input {boolean} If true, the tab is selected
   */
  @State() isSelected: Boolean = false;

  /**
   * @input {string} The title of the tab button.
   */
  @Prop() tabTitle: string;

  /**
   * @input {string} The icon for the tab button.
   */
  @Prop() tabIcon: string;

  /**
   * @input {string} The badge for the tab button.
   */
  @Prop() tabBadge: string;

  /**
   * @input {string} The badge color for the tab button.
   */
  @Prop() tabBadgeStyle: string;

  /**
   * TODO why isn't this disabled like other components?
   * @input {boolean} If true, enable the tab. If false,
   * the user cannot interact with the tab.
   * Default: `true`.
   */
  @Prop() enabled: boolean = true;

  /**
   * @input {boolean} If true, the tab button is visible within the
   * tabbar. Default: `true`.
   */
  @Prop() shown: boolean = true;

  /**
   * @input {boolean} If true, hide the tabs on child pages.
   */
  @Prop() tabsHideOnSubPages: boolean = false;

  /**
   * @input {Tab} Emitted when the current tab is selected.
   */
  @Prop() onSelected: Function;

  /**
   * @output {TabEvent} Emitted after the tab has loaded.
   */
  @Event() ionTabDidLoad: EventEmitter;

  hostData() {
    return {
      style: {
        display: !this.isSelected && 'none' || ''
      },
      'role': 'tabpanel'
    };
  }

  protected ionViewDidLoad() {
    setTimeout(() => {
      this.ionTabDidLoad.emit({ tab: this });
    }, 0);
  }

  protected ionViewDidUnload() {
    this.ionTabDidLoad.emit({ tab: this });
  }

  protected render() {
    const RootComponent = this.root;
    return [
      <RootComponent />,
      <div class='nav-decor'></div>
    ];
  }
}

export interface TabEvent extends Event {
  detail: {
    tab: Tab
  }
}
