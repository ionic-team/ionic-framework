import type { ComponentInterface } from '@stencil/core';
import { Element, Component, Host, Prop, h } from '@stencil/core';
import type { AnchorInterface, ButtonInterface } from '@utils/element-interface';
import type { Attributes } from '@utils/helpers';
import { inheritAttributes } from '@utils/helpers';
import { createColorClasses, openURL } from '@utils/theme';

import { getIonTheme } from '../../global/ionic-global';
import type { AnimationBuilder, Color, Theme } from '../../interface';
import type { RouterDirection } from '../router/utils/interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of components.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the appearance of components.
 *
 * @part native - The native HTML button, anchor, or div element that wraps all child elements.
 */
@Component({
  tag: 'ion-card',
  styleUrls: {
    ios: 'card.ios.scss',
    md: 'card.md.scss',
    ionic: 'card.md.scss',
  },
  shadow: true,
})
export class Card implements ComponentInterface, AnchorInterface, ButtonInterface {
  private inheritedAriaAttributes: Attributes = {};

  @Element() el!: HTMLElement;
  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * If `true`, a button tag will be rendered and the card will be tappable.
   */
  @Prop() button = false;

  /**
   * The type of the button. Only used when an `onclick` or `button` property is present.
   */
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  /**
   * If `true`, the user cannot interact with the card.
   */
  @Prop() disabled = false;

  /**
   * This attribute instructs browsers to download a URL instead of navigating to
   * it, so the user will be prompted to save it as a local file. If the attribute
   * has a value, it is used as the pre-filled file name in the Save prompt
   * (the user can still change the file name if they want).
   */
  @Prop() download: string | undefined;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string | undefined;

  /**
   * Specifies the relationship of the target object to the link object.
   * The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).
   */
  @Prop() rel: string | undefined;

  /**
   * When using a router, it specifies the transition direction when navigating to
   * another page using `href`.
   */
  @Prop() routerDirection: RouterDirection = 'forward';

  /**
   * When using a router, it specifies the transition animation when navigating to
   * another page using `href`.
   */
  @Prop() routerAnimation: AnimationBuilder | undefined;

  /**
   * Specifies where to display the linked URL.
   * Only applies when an `href` is provided.
   * Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
   */
  @Prop() target: string | undefined;

  componentWillLoad() {
    this.inheritedAriaAttributes = inheritAttributes(this.el, ['aria-label']);
  }

  private isClickable(): boolean {
    return this.href !== undefined || this.button;
  }

  private renderCard(theme: Theme) {
    const clickable = this.isClickable();

    if (!clickable) {
      return [<slot></slot>];
    }
    const { href, routerAnimation, routerDirection, inheritedAriaAttributes } = this;
    const TagType = clickable ? (href === undefined ? 'button' : 'a') : ('div' as any);
    const attrs =
      TagType === 'button'
        ? { type: this.type }
        : {
            download: this.download,
            href: this.href,
            rel: this.rel,
            target: this.target,
          };

    return (
      <TagType
        {...attrs}
        {...inheritedAriaAttributes}
        class="card-native"
        part="native"
        disabled={this.disabled}
        onClick={(ev: Event) => openURL(href, ev, routerDirection, routerAnimation)}
      >
        <slot></slot>
        {clickable && theme === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </TagType>
    );
  }

  render() {
    const theme = getIonTheme(this);

    return (
      <Host
        class={createColorClasses(this.color, {
          [theme]: true,
          'card-disabled': this.disabled,
          'ion-activatable': this.isClickable(),
        })}
      >
        {this.renderCard(theme)}
      </Host>
    );
  }
}
