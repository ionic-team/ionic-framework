import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h, Watch } from '@stencil/core';
import { printIonWarning } from '@utils/logging';
import { createColorClasses } from '@utils/theme';
import { eyeOff, eye } from 'ionicons/icons';

import { getIonMode } from '../../global/ionic-global';
import type { Color, TextFieldTypes } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-input-password-toggle',
  /**
   * Empty CSS files are required in order for the mode to be inherited to the
   * inner ion-button. Otherwise, the setMode callback provided to Stencil will not get called
   * and we will default to MD mode.
   */
  styleUrls: {
    ios: 'input-password-toggle.scss',
    md: 'input-password-toggle.scss',
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
  @Prop() showIcon?: string;

  /**
   * The icon that can be used to represent hiding a password. If not set, the "eyeOff" Ionicon will be used.
   */
  @Prop() hideIcon?: string;

  /**
   * @internal
   */
  @Prop({ mutable: true }) type: TextFieldTypes = 'password';

  /**
   * Whenever the input type changes we need to re-run validation to ensure the password
   * toggle is being used with the correct input type. If the application changes the type
   * outside of this component we also need to re-render so the correct icon is shown.
   */
  @Watch('type')
  onTypeChange(newValue: TextFieldTypes) {
    if (newValue !== 'text' && newValue !== 'password') {
      printIonWarning(
        `ion-input-password-toggle only supports inputs of type "text" or "password". Input of type "${newValue}" is not compatible.`,
        this.el
      );

      return;
    }
  }

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

    /**
     * Important: Set the type in connectedCallback because the default value
     * of this.type may not always be accurate. Usually inputs have the "password" type
     * but it is possible to have the input to initially have the "text" type. In that scenario
     * the wrong icon will show briefly before switching to the correct icon. Setting the
     * type here allows us to avoid that flicker.
     */
    this.type = inputElRef.type;
  }

  disconnectedCallback() {
    this.inputElRef = null;
  }

  private togglePasswordVisibility = () => {
    const { inputElRef } = this;

    if (!inputElRef) {
      return;
    }

    inputElRef.type = inputElRef.type === 'text' ? 'password' : 'text';
  };

  render() {
    const { color, type } = this;

    const mode = getIonMode(this);

    const showPasswordIcon = this.showIcon ?? eye;
    const hidePasswordIcon = this.hideIcon ?? eyeOff;

    const isPasswordVisible = type === 'text';

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
          shape="round"
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
