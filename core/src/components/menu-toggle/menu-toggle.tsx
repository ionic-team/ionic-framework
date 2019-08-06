import { Component, ComponentInterface, Host, Listen, Prop, State, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

import { toggleMenu, updateVisibility } from './menu-toggle-util';

@Component({
  tag: 'ion-menu-toggle',
  styleUrl: 'menu-toggle.scss',
  shadow: true
})
export class MenuToggle implements ComponentInterface {

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

  async componentDidLoad() {
    await this.setVisibility();
  }

  @Listen('ionMenuChange', { target: 'body' })
  @Listen('ionSplitPaneVisible', { target: 'body' })
  async visibilityChanged() {
    await this.setVisibility();
  }

  private setVisibility = async () => {
    this.visible = await updateVisibility(this.menu);
  }

  private onClick = async () => {
    await toggleMenu(this.menu);
  }

  render() {
    const mode = getIonMode(this);
    const hidden = this.autoHide && !this.visible;

    return (
      <Host
        onClick={this.onClick}
        aria-hidden={hidden ? 'true' : null}
        class={{
          [mode]: true,
          'menu-toggle-hidden': hidden,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
