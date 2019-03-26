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
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  /**
   * The selected tab component
   */
  @Prop() disabled = false;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href?: string;

  /**
   * Set the layout of the text and icon in the tab bar.
   * It defaults to `'icon-top'`.
   */
  @Prop({ mutable: true }) layout?: TabButtonLayout;

  /**
   * The selected tab component
   */
  @Prop({ mutable: true }) selected = false;

  /**
   * A tab id must be provided for each `ion-tab`. It's used internally to reference
   * the selected tab or by the router to switch between them.
   */
  @Prop() tab?: string;

  /**
   * Specifies where to display the linked URL.
   * Only applies when an `href` is provided.
   * Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
   */
  @Prop() target?: string;

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

  hostData() {
    const { disabled, hasIcon, hasLabel, layout, selected, tab } = this;
    return {
      'role': 'tab',
      'aria-selected': selected ? 'true' : null,
      'id': tab !== undefined ? `tab-button-${tab}` : null,
      class: {
        'tab-selected': selected,
        'tab-disabled': disabled,
        'tab-has-label': hasLabel,
        'tab-has-icon': hasIcon,
        'tab-has-label-only': hasLabel && !hasIcon,
        'tab-has-icon-only': hasIcon && !hasLabel,
        [`tab-layout-${layout}`]: true,
        'ion-activatable': true,
      }
    };
  }

  render() {
    const { mode, href, target } = this;

    return (
      <a href={href} target={target}>
        <slot></slot>
        {mode === 'md' && <ion-ripple-effect type="unbounded"></ion-ripple-effect>}
      </a>
    );
  }
}
