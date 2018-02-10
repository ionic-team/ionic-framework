import { Component, Listen, Prop } from '@stencil/core';

@Component({
  tag: 'ion-menu-toggle',
  styleUrls: {
    ios: 'menu-toggle.ios.scss',
    md: 'menu-toggle.md.scss'
  },
  host: {
    theme: 'menu-toggle'
  }
})
export class MenuToggle {

  /**
   * Optional property that maps to a Menu's `menuId` prop. Can also be `left` or `right` for the menu side. This is used to find the correct menu to toggle
   */
  @Prop() menu: string;

  @Listen('child:click')
  onClick() {
    const menuControllerElement = document.querySelector('ion-menu-controller');
    if (!menuControllerElement) {
      return;
    }
    menuControllerElement.componentOnReady().then(() => {
      const menu = menuControllerElement.get(this.menu);
      if (menu) {
        menu.toggle();
      }
    });
  }

  render() {
    return <slot></slot>;
  }

}
