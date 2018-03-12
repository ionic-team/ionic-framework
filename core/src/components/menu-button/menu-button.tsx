import { Component, Element, Prop } from '@stencil/core';
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

  private custom = true;

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
    return (
      <ion-menu-toggle menu={this.menu} autoHide={this.autoHide}>
        <ion-button>
          {this.custom
            ? <slot/>
            : <ion-icon slot='icon-only' name={menuIcon}/>}
        </ion-button>
      </ion-menu-toggle>
    );
  }
}
