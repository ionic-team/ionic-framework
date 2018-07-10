import { Component, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
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

  /** The tab component for the button */
  @Prop() tab!: HTMLIonTabElement;

  /** Emitted when the tab bar is clicked  */
  @Event() ionTabbarClick!: EventEmitter<HTMLIonTabElement>;

  /** Emitted when the tab button is loaded */
  @Event() ionTabButtonDidLoad!: EventEmitter<void>;

  /** Emitted when the tab button is destroyed */
  @Event() ionTabButtonDidUnload!: EventEmitter<void>;

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
    const hasTitle = !!tab.label;
    const hasIcon = !!tab.icon;
    const hasTitleOnly = (hasTitle && !hasIcon);
    const hasIconOnly = (hasIcon && !hasTitle);
    const hasBadge = !!tab.badge;
    return {
      'role': 'tab',
      'id': tab.btnId,
      'aria-selected': selected,
      'hidden': !tab.show,
      class: {
        ...createColorClasses(this.color),
        'tab-selected': selected,
        'has-title': hasTitle,
        'has-icon': hasIcon,
        'has-title-only': hasTitleOnly,
        'has-icon-only': hasIconOnly,
        'has-badge': hasBadge,
        'tab-button-disabled': tab.disabled,
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
        class="tab-button-native"
        onKeyUp={this.onKeyUp.bind(this)}
        onBlur={this.onBlur.bind(this)}>
        { tab.icon && <ion-icon class="tab-button-icon" icon={tab.icon}></ion-icon> }
        { tab.label && <span class="tab-button-text">{tab.label}</span> }
        { tab.badge && <ion-badge class="tab-badge" color={tab.badgeColor}>{tab.badge}</ion-badge> }
        { this.mode === 'md' && <ion-ripple-effect tapClick={true}/> }
      </a>
    ];
  }
}
