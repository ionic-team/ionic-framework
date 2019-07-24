import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { Color } from '../../interface';
import { ButtonInterface } from '../../utils/element-interface';
import { createColorClasses, openURL } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-back-button',
  styleUrls: {
    ios: 'back-button.ios.scss',
    md: 'back-button.md.scss'
  },
  scoped: true
})
export class BackButton implements ComponentInterface, ButtonInterface {

  private mode = getIonMode(this);
  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The url to navigate back to by default when there is no history.
   */
  @Prop() defaultHref?: string;

  /**
   * If `true`, the user cannot interact with the button.
   */
  @Prop({ reflectToAttr: true }) disabled = false;

  /**
   * The icon name to use for the back button.
   */
  @Prop() icon?: string | null;

  /**
   * The text to display in the back button.
   */
  @Prop() text?: string | null;

  /**
   * The type of the button.
   */
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  private get backButtonIcon() {
    return this.icon != null ? this.icon : config.get('backButtonIcon', 'arrow-back');
  }

  private get backButtonText() {
    const defaultBackButtonText = this.mode === 'ios' ? 'Back' : null;
    return this.text != null ? this.text : config.get('backButtonText', defaultBackButtonText);
  }

  private get hasIconOnly() {
    return this.backButtonIcon && !this.backButtonText;
  }

  private get rippleType() {
    // If the button only has an icon we use the unbounded
    // "circular" ripple effect
    if (this.hasIconOnly) {
      return 'unbounded';
    }

    return 'bounded';
  }

  private onClick = async (ev: Event) => {
    const nav = this.el.closest('ion-nav');
    ev.preventDefault();

    if (nav && await nav.canGoBack()) {
      return nav.pop({ skipIfBusy: true });
    }
    return openURL(this.defaultHref, ev, 'back');
  }

  render() {
    const { color, defaultHref, disabled, type, mode, hasIconOnly, backButtonIcon, backButtonText } = this;
    const showBackButton = defaultHref !== undefined;

    return (
      <Host
        onClick={this.onClick}
        class={{
          ...createColorClasses(color),
          [mode]: true,

          'button': true, // ion-buttons target .button
          'back-button-disabled': disabled,
          'back-button-has-icon-only': hasIconOnly,
          'ion-activatable': true,
          'ion-focusable': true,
          'show-back-button': showBackButton
        }}
      >
        <button type={type} disabled={disabled} class="button-native">
          <span class="button-inner">
            {backButtonIcon && <ion-icon icon={backButtonIcon} lazy={false}></ion-icon>}
            {backButtonText && <span class="button-text">{backButtonText}</span>}
          </span>
          {mode === 'md' && <ion-ripple-effect type={this.rippleType}></ion-ripple-effect>}
        </button>
      </Host>
    );
  }
}
