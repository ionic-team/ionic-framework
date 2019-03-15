import { Component, ComponentInterface, Element, Host, Prop, getMode, h } from '@stencil/core';

import { getContext } from '../../global/context';
import { Color, Mode } from '../../interface';
import { createColorClasses, openURL } from '../../utils/theme';

/**
 * @virtualProp {'ios' | 'md'} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-back-button',
  styleUrls: {
    ios: 'back-button.ios.scss',
    md: 'back-button.md.scss'
  },
  scoped: true
})
export class BackButton implements ComponentInterface {

  private config = getContext(this, 'config');
  private mode = getMode<Mode>(this);

  @Element() el!: HTMLElement;

  @Prop({ context: 'window' }) win!: Window;

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
   * The icon name to use for the back button.
   */
  @Prop() icon?: string | null;

  /**
   * The text to display in the back button.
   */
  @Prop() text?: string | null;

  private onClick = async (ev: Event) => {
    const nav = this.el.closest('ion-nav');
    ev.preventDefault();

    if (nav && await nav.canGoBack()) {
      return nav.pop({ skipIfBusy: true });
    }
    return openURL(this.win, this.defaultHref, ev, 'back');
  }

  render() {
    const showBackButton = this.defaultHref !== undefined;
    const defaultBackButtonText = this.mode === 'ios' ? 'Back' : null;
    const backButtonIcon = this.icon != null ? this.icon : this.config.get('backButtonIcon', 'arrow-back');
    const backButtonText = this.text != null ? this.text : this.config.get('backButtonText', defaultBackButtonText);

    return (
      <Host
        onClick={this.onClick}
        class={{
          ...createColorClasses(this.color),

          'button': true, // ion-buttons target .button
          'ion-activatable': true,
          'show-back-button': showBackButton
        }}
      >
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
      </Host>
    );
  }
}
