import {Component, Element, Event, EventEmitter, Listen, Prop} from '@stencil/core';


@Component({
  tag: 'ion-tab-button'
})
export class TabButton {

  @Element() el: HTMLElement;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  @Prop() selected = false;
  @Prop() tab: HTMLIonTabElement;

  @Event() ionTabbarClick: EventEmitter<TabButtonEventDetail>;
  @Event() ionTabButtonDidLoad: EventEmitter<TabButtonEventDetail>;
  @Event() ionTabButtonDidUnload: EventEmitter<TabButtonEventDetail>;

  componentDidLoad() {
    this.ionTabButtonDidLoad.emit();
  }

  componentDidUnload() {
    this.ionTabButtonDidUnload.emit();
  }

  @Listen('click')
  protected onClick(ev: UIEvent) {
    this.ionTabbarClick.emit(this.tab);
    ev.stopPropagation();
  }

  hostData() {
    const selected = this.selected;
    const tab = this.tab;
    const hasTitle = !!tab.title;
    const hasIcon = !!tab.icon;
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
        'tab-disabled': tab.disabled,
        'tab-hidden': tab.hidden,
      }
    };
  }

  render() {
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
    if (this.mode === 'md') {
      items.push(<ion-ripple-effect />);
    }
    return items;
  }
}

export interface TabButtonEvent extends CustomEvent {
  detail: TabButtonEventDetail;
}

export interface TabButtonEventDetail extends HTMLIonTabElement {

}
