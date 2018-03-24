import { Component, Listen, Prop, State } from '@stencil/core';

@Component({
  tag: 'ion-menu-toggle',
  styleUrl: 'menu-toggle.scss'
})
export class MenuToggle {

  @State() visible = false;

  /**
   * Optional property that maps to a Menu's `menuId` prop. Can also be `left` or `right` for the menu side. This is used to find the correct menu to toggle
   */
  @Prop() menu: string;

  /**
   * Automatically hides the content when the corresponding menu is not
   * active
   */
  @Prop() autoHide = true;

  componentDidLoad() {
    this.updateVisibility();
  }

  @Listen('child:click')
  async onClick() {
    const menuCtrl = await getMenuController();
    if (menuCtrl) {
      const menu = menuCtrl.get(this.menu);
      if (menu && menu.isActive()) {
        return menuCtrl.toggle(this.menu);
      }
    }
    return false;
  }

  @Listen('body:ionMenuChange')
  @Listen('body:ionSplitPaneVisible')
  async updateVisibility() {
    const menuCtrl = await getMenuController();
    if (menuCtrl) {
      const menu = menuCtrl.get(this.menu);
      if (menu && menu.isActive()) {
        this.visible = true;
        return;
      }
    }
    this.visible = false;
  }

  hostData() {
    const hidden = this.autoHide && !this.visible;
    return {
      class:  {
        'menu-toggle-hidden': hidden
      }
    };
  }

}

function getMenuController(): Promise<HTMLIonMenuControllerElement|undefined> {
  const menuControllerElement = document.querySelector('ion-menu-controller');
  if (!menuControllerElement) {
    return Promise.resolve(undefined);
  }
  return menuControllerElement.componentOnReady();
}
