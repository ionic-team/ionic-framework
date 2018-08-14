import { Component, Element, Prop } from '@stencil/core';

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
export class BackButton {

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
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * The url to navigate back to by default when there is no history.
   */
  @Prop() defaultHref?: string;

  /**
   * The icon name to use for the back button.
   */
  @Prop() icon?: string;

  /**
   * The text to display in the back button.
   */
  @Prop() text?: string;

  private async onClick(ev: Event) {
    const nav = this.el.closest('ion-nav');
    if (nav && nav.canGoBack()) {
      ev.preventDefault();
      if (!nav.isAnimating()) {
        nav.pop();
      }
    } else if (this.defaultHref) {
      openURL(this.win, this.defaultHref, ev, 'back');
    }
  }

  hostData() {
    const showBackButton = !!this.defaultHref;

    return {
      class: {
        ...createColorClasses(this.color),
        'button': true,
        'show-back-button': showBackButton
      },
      'ion-activable': true,
    };
  }

  render() {
    const backButtonIcon = this.icon || this.config.get('backButtonIcon', 'arrow-back');
    const backButtonText = this.text != null ? this.text : this.config.get('backButtonText', 'Back');

    return (
      <button
        type="button"
        class="back-button-native"
        onClick={ev => this.onClick(ev)}>
        <span class="back-button-inner">
          { backButtonIcon && <ion-icon icon={backButtonIcon} lazy={false}/> }
          { this.mode === 'ios' && backButtonText && <span class="button-text">{backButtonText}</span> }
          { this.mode === 'md' && <ion-ripple-effect tapClick={true} parent={this.el}/> }
        </span>
      </button>
    );
  }
}
