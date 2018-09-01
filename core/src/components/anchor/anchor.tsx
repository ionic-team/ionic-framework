import { Component, Prop } from '@stencil/core';

import { Color, RouterDirection } from '../../interface';
import { createColorClasses, openURL } from '../../utils/theme';

@Component({
  tag: 'ion-anchor',
  styleUrl: 'anchor.scss',
  shadow: true
})
export class Anchor {

  @Prop({ context: 'window' }) win!: Window;

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
  @Prop() href?: string;

  /**
   * When using a router, it specifies the transition direction when navigating to
   * another page using `href`.
   */
  @Prop() routerDirection?: RouterDirection;

  hostData() {
    return {
      class: createColorClasses(this.color)
    };
  }

  render() {
    return (
      <a
        href={this.href}
        onClick={ev => openURL(this.win, this.href, ev, this.routerDirection)}
      >
        <slot></slot>
      </a>
    );
  }
}
