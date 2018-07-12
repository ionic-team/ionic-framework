import { Component, Element, Prop, State } from '@stencil/core';
import { Color, Mode } from '../../interface';
import { createColorClasses } from '../../utils/theme';


@Component({
  tag: 'ion-tab-button',
  styleUrls: {
    ios: 'tab-button.ios.scss',
    md: 'tab-button.md.scss'
  },
  shadow: true
})
export class TabButton {

  @Element() el!: HTMLElement;

  @Prop() mode!: Mode;
  @Prop() color?: Color;

  @State() keyFocus = false;

  /**
   * If true, the tab button will be selected. Defaults to `false`.
   */
  @Prop() selected = false;
  @Prop() label?: string;
  @Prop() icon?: string;
  @Prop() badge?: string;
  @Prop() disabled?: boolean;
  @Prop() badgeColor?: string;
  @Prop() href?: string;

  private onKeyUp() {
    this.keyFocus = true;
  }

  private onBlur() {
    this.keyFocus = false;
  }

  hostData() {
    const selected = this.selected;
    const hasLabel = !!this.label;
    const hasIcon = !!this.icon;
    const hasLabelOnly = (hasLabel && !hasIcon);
    const hasIconOnly = (hasIcon && !hasLabel);
    const hasBadge = !!this.badge;
    return {
      'role': 'tab',
      'aria-selected': selected,
      class: {
        ...createColorClasses(this.color),
        'tab-selected': selected,
        'has-label': hasLabel,
        'has-icon': hasIcon,
        'has-label-only': hasLabelOnly,
        'has-icon-only': hasIconOnly,
        'has-badge': hasBadge,
        'tab-button-disabled': this.disabled,
        'focused': this.keyFocus
      }
    };
  }

  render() {
    const { icon, label, href, badge, badgeColor, mode } = this;

    return [
      <a
        href={href || '#'}
        class="tab-button-native"
        onKeyUp={this.onKeyUp.bind(this)}
        onBlur={this.onBlur.bind(this)}>
        { icon && <ion-icon class="tab-button-icon" icon={icon}></ion-icon> }
        { label && <span class="tab-button-text">{label}</span> }
        { badge && <ion-badge class="tab-badge" color={badgeColor}>{badge}</ion-badge> }
        { mode === 'md' && <ion-ripple-effect tapClick={true}/> }
      </a>
    ];
  }
}
