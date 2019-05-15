import { Component, ComponentInterface, Prop } from '@stencil/core';

import { Color, Mode, RouterDirection } from '../../interface';
import { createColorClasses, openURL } from '../../utils/theme';

@Component({
  tag: 'ion-card',
  styleUrls: {
    ios: 'card.ios.scss',
    md: 'card.md.scss'
  },
  scoped: true
})
export class Card implements ComponentInterface {

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
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href?: string;

  /**
   * When using a router, it specifies the transition direction when navigating to
   * another page using `href`.
   */
  @Prop() routerDirection: RouterDirection = 'forward';

  private isClickable(): boolean {
    return (this.href !== undefined || this.button);
  }

  hostData() {
    return {
      class: {
        [`${this.mode}`]: true,

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

    const { href, mode, win, routerDirection, type } = this;
    const TagType = clickable ? (href === undefined ? 'button' : 'a') : 'div' as any;
    const attrs = TagType === 'button' ? { type } : { href };

    return (
      <TagType
        {...attrs}
        class="card-native"
        disabled={this.disabled}
        onClick={(ev: Event) => openURL(win, href, ev, routerDirection)}
      >
        <slot></slot>
        {clickable && mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </TagType>
    );
  }
}
