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

<<<<<<< HEAD
<<<<<<< HEAD
  private custom = true;

  @Prop({ context: 'config' }) config: Config;

=======
  private mode: string;
>>>>>>> fix(): refactor back-button and menu-button
=======
  private mode: string;
>>>>>>> cf45637eafa02d63c5d4eca643f83e8afe5c613d
  /**
   * Optional property that maps to a Menu's `menuId` prop. Can also be `left` or `right` for the menu side. This is used to find the correct menu to toggle
   */
  @Prop() menu: string;

  /**
   * Automatically hides the menu button when the corresponding menu is not active
   */
  @Prop() autoHide = true;

  @Element() el: HTMLElement;


  render() {
    const menuIcon = this.config.get('menuIcon', 'menu');
    return (
      <ion-menu-toggle menu={this.menu} autoHide={this.autoHide}>
        <button class='menu-button-inner'>
          <ion-icon name={menuIcon}/>
          { this.mode === 'md' && <ion-ripple-effect/> }
        </button>
      </ion-menu-toggle>
    );
  }
}
