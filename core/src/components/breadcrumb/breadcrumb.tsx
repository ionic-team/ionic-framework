import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color } from '../../interface';
import { createColorClasses, hostContext } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part native - The native HTML anchor or div element that wraps all child elements.
 * @part separator - The separator element between each breadcrumb.
 */
@Component({
  tag: 'ion-breadcrumb',
  styleUrl: 'breadcrumb.scss',
  shadow: true
})
export class Breadcrumb implements ComponentInterface {

  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * If `true`, the breadcrumb will take on a different look to show that
   * it is the currently active breadcrumb. Defaults to `true` for the
   * last breadcrumb if it is not set on any.
   */
  @Prop() active = false;

  /**
   * If `true`, the user cannot interact with the breadcrumb.
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
   * If true, show a separator between this breadcrumb and the next.
   * Defaults to `true` for all breadcrumbs except the last.
   */
  @Prop() separator?: boolean | undefined;

  /**
   * Specifies where to display the linked URL.
   * Only applies when an `href` is provided.
   * Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
   */
  @Prop() target: string | undefined;

  getSeparatorIcon = () => {
    const mode = getIonMode();

    if (mode === 'ios') {
      return (
        <ion-icon name="chevron-forward-outline"></ion-icon>
      )
    }

    return (
      <span>/</span>
    );
  }

  render() {
    const { color, active, disabled, download, el, href, separator, target } = this;
    const TagType = href === undefined ? 'span' : 'a' as any;
    const mode = getIonMode(this);
    const attrs = (TagType === 'span')
      ? { }
      : {
        download,
        href,
        target
      };

    return (
      <Host
        class={createColorClasses(color, {
          [mode]: true,
          'breadcrumb-active': active,
          'breadcrumb-disabled': disabled,
          'in-breadcrumbs-color': hostContext('ion-breadcrumbs[color]', el),
          'ion-activatable': true,
          'ion-focusable': true,
        })}
      >
        <TagType
          {...attrs}
          class="breadcrumb-native"
          part="native"
          disabled={disabled}
        >
          <slot name="start"></slot>
          <slot></slot>
          <slot name="end"></slot>
        </TagType>
        { separator &&
          <span class="breadcrumb-separator" part="separator">
            <slot name="separator">
              {this.getSeparatorIcon()}
            </slot>
          </span>
        }
      </Host>
    );
  }
}
