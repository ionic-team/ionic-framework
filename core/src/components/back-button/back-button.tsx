import { Component, ComponentInterface, Element, Listen, Prop } from '@stencil/core';

import { Color, Config, Mode } from '../../interface';
import { createColorClasses, openURL } from '../../utils/theme';

@Component({
  tag: 'ion-back-button',
  styleUrls: {
    ios: 'back-button.ios.scss',
    md: 'back-button.md.scss'
  },
  scoped: true
})
export class BackButton implements ComponentInterface {

  @Element() el!: HTMLElement;

  @Prop({ context: 'config' }) config!: Config;
  @Prop({ context: 'window' }) win!: Window;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  /**
   * The url to navigate back to by default when there is no history.
   */
  @Prop() defaultHref?: string;

  /**
   * The icon name to use for the back button.
   */
  @Prop() icon?: string | null;

  /**
   * The text to display in the back button.
   */
  @Prop() text?: string | null;

  @Listen('click')
  async onClick(ev: Event) {
    const nav = this.el.closest('ion-nav');
    ev.preventDefault();

    if (nav && await nav.canGoBack()) {
      return nav.pop({ skipIfBusy: true });
    }
    return openURL(this.win, this.defaultHref, ev, 'back');
  }

  private get backButtonIcon() {
    return this.icon != null ? this.icon : this.config.get('backButtonIcon', 'arrow-back');
  }

  private get backButtonText() {
    const defaultBackButtonText = this.mode === 'ios' ? 'Back' : null;
    return this.text != null ? this.text : this.config.get('backButtonText', defaultBackButtonText);
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

  hostData() {
    const showBackButton = this.defaultHref !== undefined;

    return {
      class: {
        ...createColorClasses(this.color),
        [`${this.mode}`]: true,

        'button': true, // ion-buttons target .button
        'back-button-has-icon-only': this.hasIconOnly,
        'ion-activatable': true,
        'ion-focusable': true,
        'show-back-button': showBackButton
      }
    };
  }

  render() {
    const { backButtonIcon, backButtonText } = this;

    return (
      <button type="button" class="button-native">
        <span class="button-inner">
          {backButtonIcon && <ion-icon icon={backButtonIcon} lazy={false}></ion-icon>}
          {backButtonText && <span class="button-text">{backButtonText}</span>}
        </span>
        {this.mode === 'md' && <ion-ripple-effect type={this.rippleType}></ion-ripple-effect>}
      </button>
    );
  }
}
