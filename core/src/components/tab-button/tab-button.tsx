import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Prop, QueueApi, State } from '@stencil/core';

import { Color, Mode, TabbarClickDetail, TabbarLayout } from '../../interface';
import { createColorClasses } from '../../utils/theme';
import { TabbarChangedDetail } from '../tab-bar/tab-bar-interface';

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

  /**
   * The selected tab component
   */
  @State() selected = false;

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
  @Event() ionTabButtonClick!: EventEmitter<TabbarClickDetail>;

  @Listen('parent:ionTabBarChanged')
  onTabbarChanged(ev: CustomEvent<TabbarChangedDetail>) {
    this.selected = this.tab === ev.detail.tab;
  }

  @Listen('click')
  onClick(ev: Event) {
    if (!this.disabled) {
      this.ionTabButtonClick.emit({
        tab: this.tab,
        href: this.href
      });
    }
    ev.preventDefault();
  }

  componentWillLoad() {
    if (this.tab === undefined) {
      console.warn(`ion-tab-button needs a tab name, so it can be selected.
  <ion-tab-button tab="TAB_NAME">`);
    }
  }

  private get hasLabel() {
    return !!this.el.querySelector('ion-label');
  }

  private get hasIcon() {
    return !!this.el.querySelector('ion-icon');
  }

  hostData() {
    const { color, tab, selected, layout, disabled, hasLabel, hasIcon } = this;
    return {
      'role': 'tab',
      'ion-activatable': true,
      'aria-selected': selected ? 'true' : null,
      'id': `tab-button-${tab}`,
      'aria-controls': `tab-view-${tab}`,
      class: {
        ...createColorClasses(color),

        'tab-selected': selected,
        'tab-disabled': disabled,
        'tab-has-label': hasLabel,
        'tab-has-icon': hasIcon,
        'tab-has-label-only': hasLabel && !hasIcon,
        'tab-has-icon-only': hasIcon && !hasLabel,
        [`tab-layout-${layout}`]: true,
      }
    };
  }

  render() {
    const { mode, href } = this;
    return (
      <a href={href || '#'}>
        <slot></slot>
        {mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </a>
    );
  }
}
