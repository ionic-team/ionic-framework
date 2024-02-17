import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';
import type { ButtonInterface } from '@utils/element-interface';
import type { Attributes } from '@utils/helpers';
import { inheritAriaAttributes } from '@utils/helpers';
import { createColorClasses, hostContext, openURL } from '@utils/theme';
import { arrowBackSharp, chevronBack } from 'ionicons/icons';

import { config } from '../../global/config';
import { getIonTheme } from '../../global/ionic-global';
import type { AnimationBuilder, Color } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part native - The native HTML button element that wraps all child elements.
 * @part icon - The back button icon (uses ion-icon).
 * @part text - The back button text.
 */
@Component({
  tag: 'ion-back-button',
  styleUrls: {
    ios: 'back-button.ios.scss',
    md: 'back-button.md.scss',
  },
  shadow: true,
})
export class BackButton implements ComponentInterface, ButtonInterface {
  private inheritedAttributes: Attributes = {};

  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * The url to navigate back to by default when there is no history.
   */
  @Prop({ mutable: true }) defaultHref?: string;

  /**
   * If `true`, the user cannot interact with the button.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * The built-in named SVG icon name or the exact `src` of an SVG file
   * to use for the back button.
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

  /**
   * When using a router, it specifies the transition animation when navigating to
   * another page.
   */
  @Prop() routerAnimation: AnimationBuilder | undefined;

  componentWillLoad() {
    this.inheritedAttributes = inheritAriaAttributes(this.el);

    if (this.defaultHref === undefined) {
      this.defaultHref = config.get('backButtonDefaultHref');
    }
  }

  get backButtonIcon() {
    const icon = this.icon;
    if (icon != null) {
      // icon is set on the component or by the config
      return icon;
    }

    if (getIonTheme(this) === 'ios') {
      // default ios back button icon
      return config.get('backButtonIcon', chevronBack);
    }

    // default md back button icon
    return config.get('backButtonIcon', arrowBackSharp);
  }

  get backButtonText() {
    const defaultBackButtonText = getIonTheme(this) === 'ios' ? 'Back' : null;
    return this.text != null ? this.text : config.get('backButtonText', defaultBackButtonText);
  }

  get hasIconOnly() {
    return this.backButtonIcon && !this.backButtonText;
  }

  get rippleType() {
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

    if (nav && (await nav.canGoBack())) {
      return nav.pop({ animationBuilder: this.routerAnimation, skipIfBusy: true });
    }
    return openURL(this.defaultHref, ev, 'back', this.routerAnimation);
  };

  render() {
    const {
      color,
      defaultHref,
      disabled,
      type,
      hasIconOnly,
      backButtonIcon,
      backButtonText,
      icon,
      inheritedAttributes,
    } = this;
    const showBackButton = defaultHref !== undefined;
    const theme = getIonTheme(this);
    const ariaLabel = inheritedAttributes['aria-label'] || backButtonText || 'back';

    return (
      <Host
        onClick={this.onClick}
        class={createColorClasses(color, {
          [theme]: true,
          button: true, // ion-buttons target .button
          'back-button-disabled': disabled,
          'back-button-has-icon-only': hasIconOnly,
          'in-toolbar': hostContext('ion-toolbar', this.el),
          'in-toolbar-color': hostContext('ion-toolbar[color]', this.el),
          'ion-activatable': true,
          'ion-focusable': true,
          'show-back-button': showBackButton,
        })}
      >
        <button type={type} disabled={disabled} class="button-native" part="native" aria-label={ariaLabel}>
          <span class="button-inner">
            {backButtonIcon && (
              <ion-icon
                part="icon"
                icon={backButtonIcon}
                aria-hidden="true"
                lazy={false}
                flip-rtl={icon === undefined}
              ></ion-icon>
            )}
            {backButtonText && (
              <span part="text" aria-hidden="true" class="button-text">
                {backButtonText}
              </span>
            )}
          </span>
          {theme === 'md' && <ion-ripple-effect type={this.rippleType}></ion-ripple-effect>}
        </button>
      </Host>
    );
  }
}
