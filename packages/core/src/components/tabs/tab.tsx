import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';


@Component({
  tag: 'ion-tab',
  host: {
    theme: 'tab'
  }
})
export class Tab {

  /**
   * @prop {Page} Set the root component for this tab.
   */
  @Prop() root: string;

  /**
   * @prop {object} Any nav-params to pass to the root componentof this tab.
   */
  @Prop() rootParams: any;

  /**
   * @prop {boolean} If true, the tab is selected
   */
  @State() isSelected: Boolean = false;

  /**
   * @prop {string} The title of the tab button.
   */
  @Prop() tabTitle: string;

  /**
   * @prop {string} The icon for the tab button.
   */
  @Prop() tabIcon: string;

  /**
   * @prop {string} The badge for the tab button.
   */
  @Prop() tabBadge: string;

  /**
   * @prop {string} The badge color for the tab button.
   */
  @Prop() tabBadgeStyle: string;

  /**
   * @prop {boolean} If true, enable the tab. If false,
   * the user cannot interact with this element.
   * Default: `true`.
   */
  @Prop() enabled: boolean = true;

  /**
   * @prop {boolean} If true, the tab button is visible within the
   * tabbar. Default: `true`.
   */
  @Prop() shown: boolean = true;

  /**
   * @prop {boolean} If true, hide the tabs on child pages.
   */
  @Prop() tabsHideOnSubPages: boolean = false;

  /**
   * @prop {Tab} Emitted when the current tab is selected.
   */
  @Prop() onSelected: Function;

  @Event() ionTabDidLoad: EventEmitter;

  hostData() {
    return {
      style: {
        display: !this.isSelected && 'none' || ''
      },
      attrs: {
        'role': 'tabpanel'
        //'id': _tabId,
        //aria-labelledby: _btnId
      },
      class: {
      }
    };
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.ionTabDidLoad.emit({ tab: this })
    }, 0)
  }

  ionViewDidUnload() {
    this.ionTabDidLoad.emit({ tab: this })
  }

  render() {
    const RootComponent = this.root;
    return [
      <RootComponent />,
      <div class="nav-decor"></div>
    ]
  }
}
