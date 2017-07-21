import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'ion-tab-button',
  host: {
    theme: 'tab-button'
  }
})
export class TabButton {
  @Prop() tab: any;

  @Prop() layout: string;

  @Prop() selectedIndex: number;

  @Prop() index: number;

  hostData() {
    const tab = this.tab;
    if(!tab) return {};

    // attr.id
    // attr.aria-controls

    const hasTitle = !!tab.tabTitle;
    const hasIcon = !!tab.tabIcon && this.layout !== 'icon-hide';
    const hasTitleOnly = (hasTitle && !hasIcon);
    const hasIconOnly = (hasIcon && !hasTitle);
    const hasBadge = !!tab.tabBadge;
    // class.disable-hover
    // class.tab-disabled
    // class.tab-hidden

    return {
      attrs: {
        'aria-selected': this.selectedIndex == this.index
      },
      class: {
        'has-title': hasTitle,
        'has-icon': hasIcon,
        'has-title-only': hasTitleOnly,
        'has-icon-only': hasIconOnly,
        'has-badge': hasBadge
      }
    };
  }

  render() {
    if(!this.tab) {
      return null;
    }

    const tab = this.tab

    // TODO: Apply these on host?
    /*
    let { id, ariaControls, ariaSelected, hasTitle, hasIcon, hasTitleOnly,
    iconOnly, hasBadge, disableHover, tabDisabled, tabHidden } = {};
    */

    const items = []

    if(tab.tabIcon) {
      items.push(<ion-icon class="tab-button-icon" name={tab.tabIcon}></ion-icon>);
    }

    if(tab.tabTitle) {
      items.push(<span class="tab-button-text">{tab.tabTitle}</span>);
    }

    if(tab.tabBadge) {
      items.push(<ion-badge class="tab-badge" color={tab.tabBadgeStyle}>{tab.tabBadge}</ion-badge>);
    }

    items.push(<div class="button-effect"></div>);

    return (items)
  }
}
