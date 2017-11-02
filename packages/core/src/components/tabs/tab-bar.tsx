import { Component, Listen, Prop, State } from '@stencil/core';
import { HTMLIonTabElement } from '../../index';

@Component({
  tag: 'ion-tabbar',
  host: {
    theme: 'tabbar'
  }
})
export class TabBar {

  @State() hidden = false;

  @Prop() placement = 'bottom';
  @Prop() tabs: HTMLIonTabElement[];
  @Prop() selectedTab: HTMLIonTabElement;
  @Prop() layout: string = 'icon-top';
  @Prop() highlight: boolean = false;

  @Listen('body:keyboardWillHide')
  protected onKeyboardWillHide() {
    setTimeout(() => this.hidden = false, 50);
  }

  @Listen('body:keyboardWillShow')
  protected onKeyboardWillShow() {
    if (this.placement === 'bottom') {
      this.hidden = true;
    }
  }

  protected hostData() {
    const layoutClass = `layout-${this.layout}`;
    const placementClass = `placement-${this.placement}`;
    return {
      'role': 'tablist',
      'class': {
        'tabbar-hidden': this.hidden,
        [layoutClass]: true,
        [placementClass]: true
      }
    };
  }

  protected render() {
    const selectedTab = this.selectedTab;
    const dom = this.tabs.map(tab => (
      <ion-tab-button
        tab={tab}
        selected={selectedTab === tab}>
      </ion-tab-button>
    ));
    if (this.highlight) {
      dom.push(<ion-tab-highlight selectedTab={selectedTab}></ion-tab-highlight>);
    }
    return dom;
  }
}
