import { Component, ComponentInterface, Element, Host, Listen, Prop, State, h } from '@stencil/core';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { Color } from '../../interface';
import { ButtonInterface } from '../../utils/element-interface';
import { menuController } from '../../utils/menu-controller';
import { createColorClasses, hostContext } from '../../utils/theme';
import { updateVisibility } from '../menu-toggle/menu-toggle-util';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part native - The native HTML button element that wraps all child elements.
 * @part icon - The menu button icon (uses ion-icon).
 */
@Component({
  tag: 'ion-menu-button',
  styleUrls: {
    ios: 'menu-button.ios.scss',
    md: 'menu-button.md.scss'
  },
  shadow: true
})
export class MenuButton implements ComponentInterface, ButtonInterface {
  @Element() el!: HTMLIonSegmentElement;

  @State() visible = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

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

  componentDidLoad() {
    this.visibilityChanged();
  }

  @Listen('ionMenuChange', { target: 'body' })
  @Listen('ionSplitPaneVisible', { target: 'body' })
  async visibilityChanged() {
    this.visible = await updateVisibility(this.menu);
  }

  private onClick = async () => {
    return menuController.toggle(this.menu);
  }

  render() {
    const { color, disabled } = this;
    const mode = getIonMode(this);
    const menuIcon = config.get('menuIcon', mode === 'ios' ? 'menu-outline' : 'menu-sharp');
    const hidden = this.autoHide && !this.visible;

    const attrs = {
      type: this.type
    };

    return (
      <Host
        onClick={this.onClick}
        aria-disabled={disabled ? 'true' : null}
        aria-hidden={hidden ? 'true' : null}
        class={createColorClasses(color, {
          [mode]: true,
          'button': true,  // ion-buttons target .button
          'menu-button-hidden': hidden,
          'menu-button-disabled': disabled,
          'in-toolbar': hostContext('ion-toolbar', this.el),
          'in-toolbar-color': hostContext('ion-toolbar[color]', this.el),
          'ion-activatable': true,
          'ion-focusable': true
        })}
      >
        <button
          {...attrs}
          disabled={disabled}
          class="button-native"
          part="native"
          aria-label="menu"
        >
          <span class="button-inner">
            <slot>
              <ion-icon part="icon" icon={menuIcon} mode={mode} lazy={false} aria-hidden="true"></ion-icon>
            </slot>
          </span>
          {mode === 'md' && <ion-ripple-effect type="unbounded"></ion-ripple-effect>}
        </button>
      </Host>
    );
  }
}
