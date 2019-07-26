import { Component, ComponentInterface, Host, Listen, Prop, State, h } from '@stencil/core';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { Color } from '../../interface';
import { ButtonInterface } from '../../utils/element-interface';
import { createColorClasses } from '../../utils/theme';
import { toggleMenu, updateVisibility } from '../menu-toggle/menu-toggle-util';

@Component({
  tag: 'ion-menu-button',
  styleUrls: {
    ios: 'menu-button.ios.scss',
    md: 'menu-button.md.scss'
  },
  shadow: true
})
export class MenuButton implements ComponentInterface, ButtonInterface {

  @State() visible = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * If `true`, the user cannot interact with the menu button.
   */
  @Prop() disabled = false;

  /**
   * Optional property that maps to a Menu's `menuId` prop. Can also be `start` or `end` for the menu side. This is used to find the correct menu to toggle
   */
  @Prop() menu?: string;

  /**
   * Automatically hides the menu button when the corresponding menu is not active
   */
  @Prop() autoHide = true;

  /**
   * The type of the button.
   */
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

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
    const { color, disabled } = this;
    const mode = getIonMode(this);
    const menuIcon = config.get('menuIcon', 'menu');
    const hidden = this.autoHide && !this.visible;

    const attrs = {
      type: this.type
    };

    return (
      <Host
        onClick={this.onClick}
        aria-disabled={disabled ? 'true' : null}
        aria-hidden={hidden ? 'true' : null}
        class={{
          [mode]: true,

          ...createColorClasses(color),

          'button': true,  // ion-buttons target .button
          'menu-button-hidden': hidden,
          'menu-button-disabled': disabled,
          'ion-activatable': true,
          'ion-focusable': true
        }}
      >
        <button
          {...attrs}
          disabled={this.disabled}
          class="button-native"
        >
          <slot>
            <ion-icon icon={menuIcon} mode={mode} lazy={false}></ion-icon>
          </slot>
          {mode === 'md' && <ion-ripple-effect type="unbounded"></ion-ripple-effect>}
        </button>
      </Host>
    );
  }
}
