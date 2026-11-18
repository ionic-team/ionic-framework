import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, forceUpdate, h } from '@stencil/core';
import type { AttributeController } from '@utils/attribute-controller';
import { createTabindexController } from '@utils/attribute-controller';
import { createColorClasses, openURL } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { AnimationBuilder, Color } from '../../interface';
import type { RouterDirection } from '../router/utils/interface';

@Component({
  tag: 'ion-router-link',
  styleUrl: 'router-link.scss',
  shadow: true,
})
export class RouterLink implements ComponentInterface {
  private tabindexController?: AttributeController;

  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

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
    this.tabindexController = createTabindexController(this.el, () => forceUpdate(this));
  }

  connectedCallback() {
    this.tabindexController?.init();
  }

  disconnectedCallback() {
    this.tabindexController?.destroy();
  }

  private onClick = (ev: Event) => {
    openURL(this.href, ev, this.routerDirection, this.routerAnimation);
  };

  render() {
    const mode = getIonMode(this);
    const tabindexAttributes = this.tabindexController?.attributes ?? {};
    const attrs = {
      href: this.href,
      rel: this.rel,
      target: this.target,
    };
    return (
      <Host
        onClick={this.onClick}
        class={createColorClasses(this.color, {
          [mode]: true,
          'ion-activatable': true,
        })}
      >
        <a {...attrs} {...tabindexAttributes}>
          <slot></slot>
        </a>
      </Host>
    );
  }
}
