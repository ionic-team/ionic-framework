import { Component, Prop } from '@stencil/core';
import { Config, Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';

@Component({
  tag: 'ion-menu-button',
  styleUrls: {
    ios: 'menu-button.ios.scss',
    md: 'menu-button.md.scss'
  }
})
export class MenuButton {

  mode!: Mode;

  @Prop({ context: 'config' }) config!: Config;

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
      class: createThemedClasses(this.mode, 'menu-button')
    };
  }

  render() {
    const menuIcon = this.config.get('menuIcon', 'menu');
    return (
      <ion-menu-toggle menu={this.menu} autoHide={this.autoHide}>
        <ion-button>
          <slot>
            <ion-icon icon={menuIcon} slot="icon-only" />
          </slot>
        </ion-button>
      </ion-menu-toggle>
    );
  }
}
