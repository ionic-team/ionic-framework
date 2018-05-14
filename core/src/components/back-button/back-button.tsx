import { Component, Element, Prop } from '@stencil/core';
import { Color, Config, Mode } from '../../interface';
import { createThemedClasses, getElementClassMap, openURL } from '../../utils/theme';

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

  @Element() el!: HTMLElement;

  @Prop({ context: 'config' }) config!: Config;
  @Prop({ context: 'window' }) win!: Window;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
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


  private onClick(ev: Event) {
    const nav = this.el.closest('ion-nav');
    if (nav && nav.canGoBack()) {
      ev.preventDefault();
      nav.pop();
    } else if (this.defaultHref) {
      openURL(this.win, this.defaultHref, ev, 'back');
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
    const backButtonText = this.text != null ? this.text : this.config.get('backButtonText', 'Back');
    const themedClasses = createThemedClasses(this.mode, this.color, 'back-button');

    const backButtonClasses = {
      ...themedClasses,
      ...getElementClassMap(this.el.classList),
    };

    return (
      <button
        class={backButtonClasses}
        onClick={(ev) => this.onClick(ev)}>
        <span class="back-button-inner">
          { backButtonIcon && <ion-icon name={backButtonIcon}/> }
          { this.mode === 'ios' && backButtonText && <span class="button-text">{backButtonText}</span> }
          { this.mode === 'md' && <ion-ripple-effect tapClick={true}/> }
        </span>
      </button>
    );
  }
}
