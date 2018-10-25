import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Prop, QueueApi, State, Watch } from '@stencil/core';

import { Color, Mode, TabbarChangedDetail, TabbarLayout, TabbarPlacement } from '../../interface';
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
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * Set the layout of the text and icon in the tabbar.
   */
  @Prop() layout: TabbarLayout = 'icon-top';

  /**
   * Set the position of the tabbar, relative to the content.
   */
  @Prop() placement: TabbarPlacement = 'bottom';

  /**
   * The selected tab component
   */
  @Prop() selectedTab?: string;
  @Watch('selectedTab')
  selectedTabChanged() {
    this.ionTabbarChanged.emit({
      tab: this.selectedTab
    });
  }

  /**
   * If `true`, the tabbar will be translucent. Defaults to `false`.
   */
  @Prop() translucent = false;

  /** @internal */
  @Event() ionTabbarChanged!: EventEmitter<TabbarChangedDetail>;

  @Listen('body:keyboardWillHide')
  protected onKeyboardWillHide() {
    setTimeout(() => this.keyboardVisible = false, 50);
  }

  @Listen('body:keyboardWillShow')
  protected onKeyboardWillShow() {
    if (this.placement === 'bottom') {
      this.keyboardVisible = true;
    }
  }

  componentWillLoad() {
    this.selectedTabChanged();
  }

  hostData() {
    const { color, translucent, placement, keyboardVisible } = this;
    return {
      role: 'tablist',
      'aria-hidden': keyboardVisible ? 'true' : null,
      'slot': 'tabbar',
      class: {
        ...createColorClasses(color),
        'tabbar-translucent': translucent,
        [`placement-${placement}`]: true,
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
