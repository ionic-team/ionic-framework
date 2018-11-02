import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Prop, QueueApi, State, Watch } from '@stencil/core';

import { Color, Mode, TabBarChangedDetail, TabButtonLayout } from '../../interface';
import { createColorClasses } from '../../utils/theme';

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
  @Prop({ context: 'document' }) doc!: Document;

  @State() keyboardVisible = false;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * Set the layout of the text and icon in the tab bar.
   */
  @Prop() layout: TabButtonLayout = 'icon-top';

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
  @Event() ionTabBarChanged!: EventEmitter<TabBarChangedDetail>;

  @Listen('body:keyboardWillHide')
  protected onKeyboardWillHide() {
    setTimeout(() => this.keyboardVisible = false, 50);
  }

  @Listen('body:keyboardWillShow')
  protected onKeyboardWillShow() {
    if (this.el.getAttribute('slot') === 'bottom') {
      this.keyboardVisible = true;
    }
  }

  componentWillLoad() {
    this.selectedTabChanged();
  }

  hostData() {
    const { color, translucent, keyboardVisible } = this;
    return {
      'role': 'tablist',
      'aria-hidden': keyboardVisible ? 'true' : null,
      class: {
        ...createColorClasses(color),
        'tabbar-translucent': translucent,
        'tabbar-hidden': keyboardVisible,
      }
    };
  }

  render() {
    return (
      <slot></slot>
    );
  }
}
