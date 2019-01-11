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

  hostData() {
    const showBackButton = this.defaultHref !== undefined;

    return {
      class: {
        ...createColorClasses(this.color),

        'button': true, // ion-buttons target .button
        'ion-activatable': true,
        'show-back-button': showBackButton
      }
    };
  }

  render() {
    const defaultBackButtonText = this.mode === 'ios' ? 'Back' : null;
    const backButtonIcon = this.icon != null ? this.icon : this.config.get('backButtonIcon', 'arrow-back');
    const backButtonText = this.text != null ? this.text : this.config.get('backButtonText', defaultBackButtonText);

    return (
      <button
        type="button"
        class="button-native"
      >
        <span class="button-inner">
          {backButtonIcon && <ion-icon icon={backButtonIcon} lazy={false}></ion-icon>}
          {backButtonText && <span class="button-text">{backButtonText}</span>}
        </span>
        {this.mode === 'md' && <ion-ripple-effect type="unbounded"></ion-ripple-effect>}
      </button>
    );
  }
}
