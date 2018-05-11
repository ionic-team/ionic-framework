import { Component, Prop } from '@stencil/core';
import { RouterDirection } from '../../interface';
import { openURL } from '../../utils/theme';


@Component({
  tag: 'ion-anchor'
})
export class Anchor {

  @Prop({ context: 'window' }) win!: Window;

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

  render() {
    return <a
      href={this.href}
      onClick={(ev) => openURL(this.win, this.href, ev, this.routerDirection)}>
        <slot/>
      </a>;
  }
}
