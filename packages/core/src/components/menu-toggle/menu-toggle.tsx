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

  @Prop() autoHide = true;

  componentDidLoad() {
    this.updateVisibility();
  }

  @Listen('child:click')
  onClick() {
    getMenuController().then(menuCtrl => {
      if (menuCtrl) {
        return menuCtrl.toggle(this.menu);
      }
      return false;
    });
  }

  @Listen('body:ionMenuDisable')
  @Listen('body:ionSplitPaneVisible')
  updateVisibility() {
    getMenuController().then(menuCtrl => {
      if (menuCtrl) {
        const menu = menuCtrl.get(this.menu);
        if (menu && menu.isActive()) {
          this.visible = true;
          return;
        }
      }
      this.visible = false;
    });
  }

  hostData() {
    const hidden = this.autoHide && !this.visible;
    return {
      class:  {
        'menu-toggle-hidden': hidden
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}

function getMenuController(): Promise<HTMLIonMenuControllerElement> {
  const menuControllerElement = document.querySelector('ion-menu-controller');
  if (!menuControllerElement) {
    return Promise.resolve(null);
  }
  return menuControllerElement.componentOnReady();
}
