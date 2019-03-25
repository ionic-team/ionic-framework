import { Component, ComponentInterface, Listen, Prop } from '@stencil/core';

import { Color, Mode, RouterDirection } from '../../interface';
import { createColorClasses, openURL } from '../../utils/theme';

@Component({
  tag: 'ion-anchor',
  styleUrl: 'anchor.scss',
  shadow: true
})
export class Anchor implements ComponentInterface {
  mode!: Mode;

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
  @Prop() routerDirection: RouterDirection = 'forward';

  @Listen('click')
  onClick(ev: Event) {
    openURL(this.win, this.href, ev, this.routerDirection);
  }

  hostData() {
    return {
      class: {
        ...createColorClasses(this.color),
        [`${this.mode}`]: true,
        'ion-activatable': true
      }
    };
  }

  render() {
    return (
      <a href={this.href}>
        <slot></slot>
      </a>
    );
  }
}
