import { Component, Prop } from '@stencil/core';
import { Color, Config, Mode } from '../../interface';

@Component({
  tag: 'ion-menu-button',
  styleUrls: {
    ios: 'menu-button.ios.scss',
    md: 'menu-button.md.scss'
  },
  shadow: true
})
export class MenuButton {

  @Prop({ context: 'config' }) config!: Config;

  /**
   * The color to use for the background of the item.
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * Optional property that maps to a Menu's `menuId` prop. Can also be `left` or `right` for the menu side. This is used to find the correct menu to toggle
   */
  @Prop() menu?: string;

  /**
   * Automatically hides the menu button when the corresponding menu is not active
   */
  @Prop() autoHide = true;

  hostData() {
    return {
      class: {
        'button': true
      }
    };
  }

  render() {
    const menuIcon = this.config.get('menuIcon', 'menu');
    return (
      <ion-menu-toggle menu={this.menu} autoHide={this.autoHide}>
        <button>
          <slot>
            <ion-icon icon={menuIcon} mode={this.mode} color={this.color} lazy={false} />
          </slot>
        </button>
      </ion-menu-toggle>
    );
  }
}
