import { Component, Element, Prop, State } from '@stencil/core';
import { Config } from '../../index';

@Component({
  tag: 'ion-menu-button',
  styleUrls: {
    ios: 'menu-button.ios.scss',
    md: 'menu-button.md.scss'
  },
  host: {
    theme: 'menu-button'
  }
})
export class MenuButton {

  @State() custom: boolean;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * Optional property that maps to a Menu's `menuId` prop. Can also be `left` or `right` for the menu side. This is used to find the correct menu to toggle
   */
  @Prop() menu: string;

  /**
   * Automatically hides the content when the corresponding menu is not
   * active
   */
  @Prop() autoHide = true;


  @Prop({ context: 'config' }) config: Config;

  @Element() el: HTMLElement;

  componentWillLoad() {
    this.custom = this.el.childElementCount > 0;
  }

  render() {
    const menuIcon = this.config.get('menuIcon', 'menu');

    if (this.custom) {
      return (
        <ion-menu-toggle menu={this.menu} autoHide={this.autoHide}>
          <slot />
        </ion-menu-toggle>
      );
    } else {
      return (
        <ion-menu-toggle menu={this.menu} autoHide={this.autoHide}>
          <ion-button>
            <ion-icon slot='icon-only' name={menuIcon}></ion-icon>
          </ion-button>
        </ion-menu-toggle>
      );
    }
  }
}
