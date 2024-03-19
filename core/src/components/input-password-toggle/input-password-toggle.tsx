import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h, forceUpdate } from '@stencil/core';
import { printIonWarning } from '@utils/logging';
import { createColorClasses } from '@utils/theme';
import { eyeOff, eye } from 'ionicons/icons';

import { getIonMode } from '../../global/ionic-global';
import type { Color } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-input-password-toggle',
  styleUrls: {
    ios: 'input-password-toggle.ios.scss',
    md: 'input-password-toggle.md.scss',
  },
  shadow: true,
})
export class InputPasswordToggle implements ComponentInterface {
  private inputElRef!: HTMLIonInputElement | null;

  @Element() el!: HTMLIonInputElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * The icon that can be used to represent showing a password. If not set, the "eye" Ionicon will be used.
   */
  @Prop() showPasswordIcon?: string;

  /**
   * The icon that can be used to represent hiding a password. If not set, the "eyeOff" Ionicon will be used.
   */
  @Prop() hidePasswordIcon?: string;

  connectedCallback() {
    const { el } = this;

    const inputElRef = (this.inputElRef = el.closest('ion-input'));

    if (!inputElRef) {
      printIonWarning(
        'No ancestor ion-input found for ion-input-password-toggle. This component must be slotted inside of an ion-input.',
        el
      );

      return;
    }

    inputElRef.addEventListener('ionTypeChange', this.onTypeChange);
  }

  disconnectedCallback() {
    this.inputElRef?.addEventListener('ionTypeChange', this.onTypeChange);
    this.inputElRef = null;
  }

  private togglePasswordVisibility = () => {
    const { inputElRef } = this;

    if (!inputElRef) {
      return;
    }

    inputElRef.type = inputElRef.type === 'text' ? 'password' : 'text';
  };

  /**
   * Whenever the input type changes we need to re-run validation to ensure the password
   * toggle is being used with the correct input type. If the application changes the type
   * outside of this component we also need to re-render so the correct icon is shown.
   */
  private onTypeChange = () => {
    const { el, inputElRef } = this;

    if (!inputElRef) return;

    if (inputElRef.type !== 'text' && inputElRef.type !== 'password') {
      printIonWarning(
        `ion-input-password-toggle only supports inputs that accept plain text. Input of type "${inputElRef.type}" is not compatible.`,
        el
      );

      return;
    }

    forceUpdate(this);
  };

  render() {
    const { color, inputElRef } = this;

    const mode = getIonMode(this);

    const showPasswordIcon = this.showPasswordIcon ?? eye;
    const hidePasswordIcon = this.hidePasswordIcon ?? eyeOff;

    const isPasswordVisible = inputElRef?.type === 'text';

    return (
      <Host
        class={createColorClasses(color, {
          [mode]: true,
        })}
      >
        <ion-button
          mode={mode}
          color={color}
          fill="clear"
          aria-checked={isPasswordVisible ? 'true' : 'false'}
          aria-label="show password"
          role="switch"
          type="button"
          onPointerDown={(ev) => {
            /**
             * This prevents mobile browsers from
             * blurring the input when the password toggle
             * button is activated.
             */
            ev.preventDefault();
          }}
          onClick={this.togglePasswordVisibility}
        >
          <ion-icon
            slot="icon-only"
            aria-hidden="true"
            icon={isPasswordVisible ? hidePasswordIcon : showPasswordIcon}
          ></ion-icon>
        </ion-button>
      </Host>
    );
  }
}
