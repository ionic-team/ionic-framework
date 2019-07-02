import { Component, ComponentInterface, Host, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, RouterDirection } from '../../interface';
import { createColorClasses, openURL } from '../../utils/theme';

/**
 * @deprecated Use `ion-router-link` instead.
 */
@Component({
  tag: 'ion-anchor',
  styleUrl: 'anchor.scss',
  shadow: true
})
export class Anchor implements ComponentInterface {

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

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

  componentDidLoad() {
    console.warn('The <ion-anchor> component has been deprecated. Please use an <ion-router-link> if you are using a vanilla JS or Stencil project or an <a> with the Angular router.');
  }

  private onClick = (ev: Event) => {
    openURL(this.href, ev, this.routerDirection);
  }

  render() {
    const mode = getIonMode(this);
    const attrs = {
      href: this.href,
      rel: this.rel
    };
    return (
      <Host
        onClick={this.onClick}
        class={{
          ...createColorClasses(this.color),
          [mode]: true,
          'ion-activatable': true
        }}
      >
        <a {...attrs}>
          <slot></slot>
        </a>
      </Host>
    );
  }
}
