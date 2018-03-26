import { Component, Element, Prop } from '@stencil/core';
import { Config } from '../../index';
import { openURL } from '../../utils/theme';
import { RouterDirection } from '../router/utils/interfaces';

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
  @Prop() text: string|undefined;

  @Prop() icon: string;

  @Prop() defaultHref: string;

  @Prop({ context: 'config' }) config: Config;

  @Element() el: HTMLElement;

  private onClick(ev: Event) {
    const nav = this.el.closest('ion-nav');
    if (nav && nav.canGoBack()) {
      ev.preventDefault();
      nav.pop();
    } else if (this.defaultHref) {
      openURL(this.defaultHref, ev, RouterDirection.Back);
    }
  }

  hostData() {
    return {
      class: {
        'show-back-button': !!this.defaultHref
      }
    };
  }

  render() {
    const backButtonIcon = this.icon || this.config.get('backButtonIcon', 'arrow-back');
    const backButtonText = this.text != null ? this.text : this.config.get('backButtonText', this.mode === 'ios' ? 'Back' : '');

    return (
      <button
        class='back-button-inner'
        onClick={(ev) => this.onClick(ev)}>
        { backButtonIcon && <ion-icon name={backButtonIcon}/> }
        { backButtonText && <span class='button-text'>{backButtonText}</span> }
        { this.mode === 'md' && <ion-ripple-effect/> }
      </button>
    );
  }
}
