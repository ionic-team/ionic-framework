import { Component, Element, Prop } from '@stencil/core';
import { Color, Config, Mode } from '../../interface';
import { createThemedClasses, openURL } from '../../utils/theme';

@Component({
  tag: 'ion-back-button',
  styleUrls: {
    ios: 'back-button.ios.scss',
    md: 'back-button.md.scss'
  }
})
export class BackButton {

  @Element() el!: HTMLElement;

  @Prop({ context: 'config' }) config!: Config;
  @Prop({ context: 'window' }) win!: Window;

  /**
   * The color the button should be.
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
    return {
      class: {
        ...createThemedClasses(this.mode, this.color, 'back-button'),
        'show-back-button': !!this.defaultHref
      },
      'tappable': '',
    };
  }

  render() {
    const backButtonIcon = this.icon || this.config.get('backButtonIcon', 'arrow-back');
    const backButtonText = this.text != null ? this.text : this.config.get('backButtonText', 'Back');

    return (
      <button
        class="back-button-native"
        onClick={(ev) => this.onClick(ev)}>
        <span class="back-button-inner">
          { backButtonIcon && <ion-icon icon={backButtonIcon}/> }
          { this.mode === 'ios' && backButtonText && <span class="button-text">{backButtonText}</span> }
          { this.mode === 'md' && <ion-ripple-effect tapClick={true} parent={this.el}/> }
        </span>
      </button>
    );
  }
}
