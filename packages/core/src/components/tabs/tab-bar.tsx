import { Component, Prop } from '@stencil/core';



@Component({
  tag: 'ion-tab-bar',
  host: {
    theme: 'tabbar'
  }
})
export class TabBar {

  /**
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"`, `"md"`, or `"wp"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md' | 'wp';

  @Prop() tabs: any;

  @Prop() onTabSelected: Function;

  @Prop() selectedIndex: number = 0;

  /**
   * @input {string} Set the tabbar layout: `icon-top`, `icon-start`, `icon-end`, `icon-bottom`, `icon-hide`, `title-hide`.
   */
  @Prop() tabsLayout: string = 'icon-top';
  /*

  hostData() {
    return {
      'role': 'tablist'
      class: {
        'tabbar': true
      }
    }
  }

  handleTabButtonClick(tab, index) {
    this.onTabSelected && this.onTabSelected(tab, index);
  }

  protected render() {
    return (
      <div class="tabbar" role="tablist">
        {this.tabs.map((tab, index) => {
        return (
          <ion-tab-button role="tab"
                          tab={tab}
                          selectedIndex={this.selectedIndex}
                          index={index}
                          onClick={this.handleTabButtonClick.bind(this, tab, index)}
                          layout={this.tabsLayout}></ion-tab-button>
        )
        })}
      </div>
    )
  }
  */
}
