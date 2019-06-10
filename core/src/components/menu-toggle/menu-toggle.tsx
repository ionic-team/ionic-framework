import { Component, ComponentInterface, Listen, Prop, State } from '@stencil/core';

import { Mode } from '../../interface';

@Component({
  tag: 'ion-menu-toggle',
  styleUrl: 'menu-toggle.scss',
  shadow: true
})
export class MenuToggle implements ComponentInterface {
  mode!: Mode;

  @Prop({ context: 'document' }) doc!: Document;

  @State() visible = false;

  /**
   * Optional property that maps to a Menu's `menuId` prop.
   * Can also be `start` or `end` for the menu side.
   * This is used to find the correct menu to toggle.
   *
   * If this property is not used, `ion-menu-toggle` will toggle the
   * first menu that is active.
   */
  @Prop() menu?: string;

  /**
   * Automatically hides the content when the corresponding menu is not active.
   *
   * By default, it's `true`. Change it to `false` in order to
   * keep `ion-menu-toggle` always visible regardless the state of the menu.
   */
  @Prop() autoHide = true;

  componentDidLoad() {
    return this.updateVisibility();
  }

  @Listen('click')
  async onClick() {
    const menuCtrl = await getMenuController(this.doc);
    if (menuCtrl) {
      const menu = await menuCtrl.get(this.menu);
      if (menu) {
        menuCtrl.toggle(this.menu);
      }
    }
  }

  @Listen('body:ionMenuChange')
  @Listen('body:ionSplitPaneVisible')
  async updateVisibility() {
    const menuCtrl = await getMenuController(this.doc);
    if (menuCtrl) {
      const menu = await menuCtrl.get(this.menu);
      if (menu && await menu.isActive()) {
        this.visible = true;
        return;
      }
    }
    this.visible = false;
  }

  hostData() {
    const hidden = this.autoHide && !this.visible;
    return {
      'aria-hidden': hidden ? 'true' : null,
      class: {
        [`${this.mode}`]: true,
        'menu-toggle-hidden': hidden,
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}

function getMenuController(doc: Document): Promise<HTMLIonMenuControllerElement | undefined> {
  const menuControllerElement = doc.querySelector('ion-menu-controller');
  if (!menuControllerElement) {
    return Promise.resolve(undefined);
  }
  return menuControllerElement.componentOnReady();
}
