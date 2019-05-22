import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Prop, QueueApi } from '@stencil/core';

import { Config, Mode, TabBarChangedEventDetail, TabButtonClickEventDetail, TabButtonLayout } from '../../interface';

@Component({
  tag: 'ion-tab-button',
  styleUrls: {
    ios: 'tab-button.ios.scss',
    md: 'tab-button.md.scss'
  },
  shadow: true
})
export class TabButton implements ComponentInterface {

  @Element() el!: HTMLElement;

  @Prop({ context: 'queue' }) queue!: QueueApi;
  @Prop({ context: 'document' }) doc!: Document;
  @Prop({ context: 'config' }) config!: Config;

  /**
   * The selected tab component
   */
  @Prop({ mutable: true }) selected = false;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  /**
   * Set the layout of the text and icon in the tab bar.
   * It defaults to `'icon-top'`.
   */
  @Prop({ mutable: true }) layout?: TabButtonLayout;

  /**
   * The URL which will be used as the `href` within this tab's button anchor.
   */
  @Prop() href?: string;

  /**
   * A tab id must be provided for each `ion-tab`. It's used internally to reference
   * the selected tab or by the router to switch between them.
   */
  @Prop() tab?: string;

  /**
   * The selected tab component
   */
  @Prop() disabled = false;

  /**
   * Emitted when the tab bar is clicked
   * @internal
   */
  @Event() ionTabButtonClick!: EventEmitter<TabButtonClickEventDetail>;

  @Listen('parent:ionTabBarChanged')
  onTabBarChanged(ev: CustomEvent<TabBarChangedEventDetail>) {
    this.selected = this.tab === ev.detail.tab;
  }

  @Listen('click')
  onClick(ev: Event) {
    if (this.tab !== undefined) {
      if (!this.disabled) {
        this.ionTabButtonClick.emit({
          tab: this.tab,
          href: this.href,
          selected: this.selected
        });
      }
      ev.preventDefault();
    }
  }

  componentWillLoad() {
    if (this.layout === undefined) {
      this.layout = this.config.get('tabButtonLayout', 'icon-top');
    }
  }

  private get hasLabel() {
    return !!this.el.querySelector('ion-label');
  }

  private get hasIcon() {
    return !!this.el.querySelector('ion-icon');
  }

  private get tabIndex() {
    if (this.disabled) { return -1; }

    const hasTabIndex = this.el.hasAttribute('tabindex');

    if (hasTabIndex) {
      return this.el.getAttribute('tabindex');
    }

    return 0;
  }

  hostData() {
    const { disabled, hasIcon, hasLabel, tabIndex, layout, selected, tab } = this;
    return {
      'tabindex': tabIndex,
      'role': 'tab',
      'aria-selected': selected ? 'true' : null,
      'id': tab !== undefined ? `tab-button-${tab}` : null,
      class: {
        [`${this.mode}`]: true,
        'tab-selected': selected,
        'tab-disabled': disabled,
        'tab-has-label': hasLabel,
        'tab-has-icon': hasIcon,
        'tab-has-label-only': hasLabel && !hasIcon,
        'tab-has-icon-only': hasIcon && !hasLabel,
        [`tab-layout-${layout}`]: true,
        'ion-activatable': true,
        'ion-selectable': true,
        'ion-focusable': true
      }
    };
  }

  render() {
    const { mode, href } = this;
    return (
      <a href={href} tabIndex={-1}>
        <slot></slot>
        {mode === 'md' && <ion-ripple-effect type="unbounded"></ion-ripple-effect>}
      </a>
    );
  }
}
