import {Component, Element, Event, EventEmitter, Listen, Prop} from '@stencil/core';


@Component({
  tag: 'ion-tab-button',
  styleUrls: {
    ios: 'tab-button.ios.scss',
    md: 'tab-button.md.scss'
  }
})
export class TabButton {

  @Element() el: HTMLElement;

  mode: string;

  @Prop() selected = false;
  @Prop() tab: HTMLIonTabElement;

  @Event() ionTabbarClick: EventEmitter<HTMLIonTabElement>;
  @Event() ionTabButtonDidLoad: EventEmitter<void>;
  @Event() ionTabButtonDidUnload: EventEmitter<void>;

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
    const tab = this.tab;
    return [
      <button type='button' class='tab-cover' disabled={tab.disabled}>
        { tab.icon && <ion-icon class='tab-button-icon' name={tab.icon}></ion-icon> }
        { tab.title && <span class='tab-button-text'>{tab.title}</span> }
        { tab.badge && <ion-badge class='tab-badge' color={tab.badgeStyle}>{tab.badge}</ion-badge> }
        { this.mode === 'md' && <ion-ripple-effect/> }
      </button>
    ];
  }
}
