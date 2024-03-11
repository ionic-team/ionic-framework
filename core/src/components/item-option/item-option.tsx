import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';
import type { AnchorInterface, ButtonInterface } from '@utils/element-interface';
import { createColorClasses } from '@utils/theme';

import { getIonTheme } from '../../global/ionic-global';
import type { Color } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of components.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the option text in LTR, and to the right in RTL.
 * @slot top - Content is placed above the option text.
 * @slot icon-only - Should be used on an icon in an option that has no text.
 * @slot bottom - Content is placed below the option text.
 * @slot end - Content is placed to the right of the option text in LTR, and to the left in RTL.
 *
 * @part native - The native HTML button or anchor element that wraps all child elements.
 */
@Component({
  tag: 'ion-item-option',
  styleUrls: {
    ios: 'item-option.ios.scss',
    md: 'item-option.md.scss',
    ionic: 'item-option.md.scss',
  },
  shadow: true,
})
export class ItemOption implements ComponentInterface, AnchorInterface, ButtonInterface {
  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * If `true`, the user cannot interact with the item option.
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
   * If `true`, the option will expand to take up the available width and cover any other options.
   */
  @Prop() expandable = false;

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
   * Specifies where to display the linked URL.
   * Only applies when an `href` is provided.
   * Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
   */
  @Prop() target: string | undefined;

  /**
   * The type of the button.
   */
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  private onClick = (ev: Event) => {
    const el = (ev.target as HTMLElement).closest('ion-item-option');
    if (el) {
      ev.preventDefault();
    }
  };

  render() {
    const { disabled, expandable, href } = this;
    const TagType = href === undefined ? 'button' : ('a' as any);
    const theme = getIonTheme(this);
    const attrs =
      TagType === 'button'
        ? { type: this.type }
        : {
            download: this.download,
            href: this.href,
            target: this.target,
          };

    return (
      <Host
        onClick={this.onClick}
        class={createColorClasses(this.color, {
          [theme]: true,
          'item-option-disabled': disabled,
          'item-option-expandable': expandable,
          'ion-activatable': true,
        })}
      >
        <TagType {...attrs} class="button-native" part="native" disabled={disabled}>
          <span class="button-inner">
            <slot name="top"></slot>
            <div class="horizontal-wrapper">
              <slot name="start"></slot>
              <slot name="icon-only"></slot>
              <slot></slot>
              <slot name="end"></slot>
            </div>
            <slot name="bottom"></slot>
          </span>
          {theme === 'md' && <ion-ripple-effect></ion-ripple-effect>}
        </TagType>
      </Host>
    );
  }
}
