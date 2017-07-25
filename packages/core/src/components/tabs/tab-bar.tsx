import { Component, Prop } from '@stencil/core';



@Component({
  tag: 'ion-tab-bar',
  host: {
    theme: 'tabbar'
  }
})
export class TabBar {
  @Prop() tabs: any;

  @Prop() onTabSelected: Function;

  @Prop() selectedIndex: number = 0;

  /**
   * @prop {string} Set the tabbar layout: `icon-top`, `icon-start`, `icon-end`, `icon-bottom`, `icon-hide`, `title-hide`.
   */
  @Prop() tabsLayout: string = 'icon-top'
  /*

  hostData() {
    return {
      attrs: {
        'role': 'tablist'
      },
      class: {
        'tabbar': true
      }
    }
  }

  handleTabButtonClick(tab, index) {
    this.onTabSelected && this.onTabSelected(tab, index);
  }

  render() {
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
