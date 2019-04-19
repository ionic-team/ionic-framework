import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Listen, Prop, QueueApi, State, Watch, h } from '@stencil/core';

import { Color, TabBarChangedEventDetail } from '../../interface';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-tab-bar',
  styleUrls: {
    ios: 'tab-bar.ios.scss',
    md: 'tab-bar.md.scss'
  },
  shadow: true
})
export class TabBar implements ComponentInterface {

  @Element() el!: HTMLElement;

  @Prop({ context: 'queue' }) queue!: QueueApi;

  @State() keyboardVisible = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The selected tab component
   */
  @Prop() selectedTab?: string;
  @Watch('selectedTab')
  selectedTabChanged() {
    this.ionTabBarChanged.emit({
      tab: this.selectedTab
    });
  }

  /**
   * If `true`, the tab bar will be translucent.
   */
  @Prop() translucent = false;

  /** @internal */
  @Event() ionTabBarChanged!: EventEmitter<TabBarChangedEventDetail>;

  @Listen('keyboardWillHide', { target: 'window' })
  protected onKeyboardWillHide() {
    setTimeout(() => this.keyboardVisible = false, 50);
  }

  @Listen('keyboardWillShow', { target: 'window' })
  protected onKeyboardWillShow() {
    if (this.el.getAttribute('slot') !== 'top') {
      this.keyboardVisible = true;
    }
  }

  componentWillLoad() {
    this.selectedTabChanged();
  }

  render() {
    return (
      <Host
        role="tablist"
        aria-hidden={this.keyboardVisible ? 'true' : null}
        class={{
          ...createColorClasses(this.color),
          'tab-bar-translucent': this.translucent,
          'tab-bar-hidden': this.keyboardVisible,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
