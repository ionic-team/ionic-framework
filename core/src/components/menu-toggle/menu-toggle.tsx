import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Listen, Prop, State, h } from '@stencil/core';
import { menuController } from '@utils/menu-controller';

import { getIonTheme } from '../../global/ionic-global';

import { updateVisibility } from './menu-toggle-util';

/**
 * @slot - Content is placed inside the toggle to act as the click target.
 */
@Component({
  tag: 'ion-menu-toggle',
  styleUrl: 'menu-toggle.scss',
  shadow: true,
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

  connectedCallback() {
    this.visibilityChanged();
  }

  @Listen('ionMenuChange', { target: 'body' })
  @Listen('ionSplitPaneVisible', { target: 'body' })
  async visibilityChanged() {
    this.visible = await updateVisibility(this.menu);
  }

  private onClick = () => {
    return menuController.toggle(this.menu);
  };

  render() {
    const theme = getIonTheme(this);
    const hidden = this.autoHide && !this.visible;

    return (
      <Host
        onClick={this.onClick}
        aria-hidden={hidden ? 'true' : null}
        class={{
          [theme]: true,
          'menu-toggle-hidden': hidden,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
