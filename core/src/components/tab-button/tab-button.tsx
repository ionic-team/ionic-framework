import {Component, Element, Event, EventEmitter, Listen, Prop, State} from '@stencil/core';


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

  @State() keyFocus = false;

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
    if (!this.tab.disabled) {
      this.ionTabbarClick.emit(this.tab);
    }
    ev.stopPropagation();
    ev.preventDefault();
  }

  private onKeyUp() {
    this.keyFocus = true;
  }

  private onBlur() {
    this.keyFocus = false;
  }

  hostData() {
    const selected = this.selected;
    const tab = this.tab;
    const hasTitle = !!tab.tabTitle;
    const hasIcon = !!tab.tabIcon;
    const hasTitleOnly = (hasTitle && !hasIcon);
    const hasIconOnly = (hasIcon && !hasTitle);
    const hasBadge = !!tab.tabBadge;
    return {
      'role': 'tab',
      'id': tab.btnId,
      'aria-selected': selected,
      'hidden': !tab.show,
      class: {
        'tab-selected': selected,
        'has-title': hasTitle,
        'has-icon': hasIcon,
        'has-title-only': hasTitleOnly,
        'has-icon-only': hasIconOnly,
        'has-badge': hasBadge,
        'tab-btn-disabled': tab.disabled,
        'focused': this.keyFocus
      }
    };
  }

  render() {
    const tab = this.tab;
    const href = tab.href || '#';

    return [
      <a
        href={href}
        class='tab-cover'
        onKeyUp={this.onKeyUp.bind(this)}
        onBlur={this.onBlur.bind(this)}>
        { tab.tabIcon && <ion-icon class='tab-button-icon' name={tab.tabIcon}></ion-icon> }
        { tab.tabTitle && <span class='tab-button-text'>{tab.tabTitle}</span> }
        { tab.tabBadge && <ion-badge class='tab-badge' color={tab.tabBadgeStyle}>{tab.tabBadge}</ion-badge> }
        { this.mode === 'md' && <ion-ripple-effect useTapClick={true}/> }
      </a>
    ];
  }
}
