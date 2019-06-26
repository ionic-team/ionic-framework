import { Component, ComponentInterface, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, RouterDirection } from '../../interface';
import { AnchorInterface, ButtonInterface } from '../../utils/element-interface';
import { createColorClasses, openURL } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-card',
  styleUrls: {
    ios: 'card.ios.scss',
    md: 'card.md.scss'
  },
  scoped: true
})
export class Card implements ComponentInterface, AnchorInterface, ButtonInterface {

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

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
   * Specifies where to display the linked URL.
   * Only applies when an `href` is provided.
   * Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
   */
  @Prop() target: string | undefined;

  private isClickable(): boolean {
    return (this.href !== undefined || this.button);
  }

  hostData() {
    const mode = getIonMode(this);
    return {
      class: {
        [mode]: true,

        ...createColorClasses(this.color),
        'card-disabled': this.disabled,
        'ion-activatable': this.isClickable()
      }
    };
  }

  render() {
    const clickable = this.isClickable();

    if (!clickable) {
      return [
        <slot></slot>
      ];
    }
    const mode = getIonMode(this);
    const { href, routerDirection } = this;
    const TagType = clickable ? (href === undefined ? 'button' : 'a') : 'div' as any;
    const attrs = (TagType === 'button')
      ? { type: this.type }
      : {
        download: this.download,
        href: this.href,
        rel: this.rel,
        target: this.target
      };

    return (
      <TagType
        {...attrs}
        class="card-native"
        disabled={this.disabled}
        onClick={(ev: Event) => openURL(href, ev, routerDirection)}
      >
        <slot></slot>
        {clickable && mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </TagType>
    );
  }
}
