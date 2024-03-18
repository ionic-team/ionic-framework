import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';
import { printIonWarning } from '@utils/logging';
import { eyeOff, eye }  from 'ionicons/icons';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-input-password-toggle',
  shadow: true,
})
export class InputPasswordToggle implements ComponentInterface {
  private inputElRef!: HTMLIonInputElement | null;

  @Element() el!: HTMLIonInputElement;

  /**
   * Set the icon that can be used to represent showing a password. Defaults to `eye`.
   */
  @Prop() showPasswordIcon?: string;

  /**
   * Set the icon that can be used to represent hiding a password. Defaults to `eyeOff`.
   */
  @Prop() hidePasswordIcon?: string;

  connectedCallback() {
    const { el } = this;

    const inputElRef = this.inputElRef = el.closest('ion-input');

    if (!inputElRef) {
      printIonWarning('No ancestor ion-input found for ion-input-password-toggle. This component must be slotted inside of an ion-input.', el);
    }
  }

  disconnectedCallback() {
    this.inputElRef = null;
  }

  private togglePasswordVisibility = () => {
    const { inputElRef } = this;

    if (!inputElRef) { return; }

    inputElRef.type = inputElRef.type === 'text' ? 'password' : 'text';
  };

  render() {
    // TODO aria-controls
    // TODO aria-checked
    // TOOD input icon toggle

    //const showPasswordIcon = this.showPasswordIcon ?? eye;
    const hidePasswordIcon = this.hidePasswordIcon ?? eyeOff;

    return (
      <Host>
        <ion-button
          fill="clear"
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
          <ion-icon slot="icon-only" aria-hidden="true" icon={hidePasswordIcon}></ion-icon>
        </ion-button>
      </Host>
    );
  }
}
