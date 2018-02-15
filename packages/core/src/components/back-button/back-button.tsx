import { Component, Element, Prop, State } from '@stencil/core';
import { Config } from '../../index';

@Component({
  tag: 'ion-back-button',
  styleUrls: {
    ios: 'back-button.ios.scss',
    md: 'back-button.md.scss'
  },
  host: {
    theme: 'back-button'
  }
})
export class BackButton {

  @State() custom: boolean;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * The text property is used to provide custom text for the back button while using the
   * default look-and-feel
   */
  @Prop() text: string = null;

  @Prop({ context: 'config' }) config: Config;

  @Element() el: HTMLElement;

  componentWillLoad() {
    this.custom = this.el.childElementCount > 0;
  }

  render() {
    const backButtonIcon = this.config.get('backButtonIcon', 'arrow-back');
    const defaultBackButtonText = this.config.get('backButtonText', 'Back');
    const backButtonText = this.text || defaultBackButtonText;

    if (this.custom) {
      return (
        <ion-nav-pop>
          <slot />
        </ion-nav-pop>
      );
    } else {
      return (
        <ion-nav-pop>
          <button class='back-button-inner-default'>
          <span class='button-inner'>
          <ion-icon name={backButtonIcon} slot='start' />
          <span class='button-text'>{backButtonText}</span>
          </span>
          { this.mode === 'md' && <ion-ripple-effect/> }
          </button>
        </ion-nav-pop>
      );
    }
  }
}
