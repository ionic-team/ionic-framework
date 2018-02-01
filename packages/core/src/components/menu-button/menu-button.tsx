import { Component, Prop } from '@stencil/core';
import { getOrAppendElement } from '../../utils/helpers';
import { StencilElement } from '../..';

@Component({
  tag: 'ion-menu-button',
  styleUrls: {
    ios: 'menu-button.ios.scss',
    md: 'menu-button.md.scss'
  },
  host: {
    theme: 'back-button'
  }
})
export class MenuButton {

  /**
   * The name of the icon to use for the button. It defaults to menu.
   */
  @Prop() iconName = 'menu';

  /**
   * Optional property that maps to a Menu's `menuId` prop. Can also be `left` or `right` for the menu side. This is used to find the correct menu to toggle
   */
  @Prop() menu: string = null;

  toggleMenu() {
    const menuControllerElement = getOrAppendElement('ion-menu-controller') as HTMLIonMenuControllerElement;
    return (menuControllerElement as any as StencilElement).componentOnReady().then(() => {
      const menu = menuControllerElement.get(this.menu);
      if (menu) {
        menu.toggle();
      }
    });
  }

  render() {
    return [
      <ion-button onClick={() => {
        this.toggleMenu();
      }}>
        <ion-icon slot='icon-only' name={this.iconName}></ion-icon>
      </ion-button>
    ];
  }

}
