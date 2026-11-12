import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, forceUpdate, h } from '@stencil/core';
import type { AttributeController } from '@utils/attribute-controller';
import { createTabindexController } from '@utils/attribute-controller';
import { openURL } from '@utils/helpers';
import { createColorClasses } from '@utils/theme';

import { config } from '../../global/config';
import type { AnimationBuilder, Color } from '../../interface';
import type { Hue } from '../../themes/themes.interfaces';
import type { RouterDirection } from '../router/utils/interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 */
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
   * Set to `"bold"` for a router link with vibrant, bold colors or to `"subtle"` for
   * a router link with muted, subtle colors.
   *
   * Defaults to `"bold"` if both the hue property and theme config are unset.
   */
  @Prop() hue?: Hue;

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

  /**
   * Gets the router link hue. Uses the `hue` property if set, otherwise
   * checks the theme config and falls back to 'bold' if neither is provided.
   */
  get hueValue(): Hue {
    const hueConfig = config.getObjectValue('IonRouterLink.hue', 'bold') as Hue;

    return this.hue || hueConfig;
  }

  private onClick = (ev: Event) => {
    openURL(this.href, ev, this.routerDirection, this.routerAnimation);
  };

  render() {
    const { color, href, hueValue, rel, target } = this;
    const tabindexAttributes = this.tabindexController?.attributes ?? {};
    const attrs = {
      href,
      rel,
      target,
    };
    return (
      <Host
        onClick={this.onClick}
        class={createColorClasses(color, {
          [`router-link-hue-${hueValue}`]: true,
          'ion-activatable': true,
          'ion-focusable': true,
        })}
      >
        <a {...attrs} {...tabindexAttributes}>
          <slot></slot>
        </a>
      </Host>
    );
  }
}
