import { Component, Event, EventEmitter, Listen, Prop } from '@stencil/core';
import { HTMLIonTabElement } from '../../index';

@Component({
  tag: 'ion-tab-button'
})
export class TabbarButton {

  @Prop() selected: boolean = false;
  @Prop() tab: HTMLIonTabElement;

  @Event() ionTabbarClick: EventEmitter;

  @Listen('click')
  protected onClick(ev: UIEvent) {
    this.ionTabbarClick.emit(this.tab);
    ev.stopPropagation();
  }

  protected hostData() {
    const selected = this.selected;
    const tab = this.tab;
    const hasTitle = !!tab.title;
    const hasIcon = !! tab.icon;
    const hasTitleOnly = (hasTitle && !hasIcon);
    const hasIconOnly = (hasIcon && !hasTitle);
    const hasBadge = !!tab.badge;
    return {
      'role': 'tab',
      'id': tab.btnId,
      'aria-selected': selected,
      class: {
        'tab-selected': selected,
        'has-title': hasTitle,
        'has-icon': hasIcon,
        'has-title-only': hasTitleOnly,
        'has-icon-only': hasIconOnly,
        'has-badge': hasBadge,
        'tab-disabled': !tab.enabled,
        'tab-hidden': tab.hidden,
      }
    };
  }

  protected render() {
    const items = [];
    const tab = this.tab;

    if (tab.icon) {
      items.push(<ion-icon class='tab-button-icon' name={tab.icon}></ion-icon>);
    }
    if (tab.title) {
      items.push(<span class='tab-button-text'>{tab.title}</span>);
    }
    if (tab.badge) {
      items.push(<ion-badge class='tab-badge' color={tab.badgeStyle}>{tab.badge}</ion-badge>);
    }
    items.push(<div class='button-effect'></div>);

    return items;
  }
}
