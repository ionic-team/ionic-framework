import { Component, ComponentInterface, Element, Listen, Prop } from '@stencil/core';

import { Color, Mode } from '../../interface';
import { createColorClasses } from '../../utils/theme';

/**
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the option text in LTR, and to the right in RTL.
 * @slot top - Content is placed above the option text.
 * @slot icon-only - Should be used on an icon in an option that has no text.
 * @slot bottom - Content is placed below the option text.
 * @slot end - Content is placed to the right of the option text in LTR, and to the left in RTL.
 */
@Component({
  tag: 'ion-item-option',
  styleUrls: {
    ios: 'item-option.ios.scss',
    md: 'item-option.md.scss'
  },
  shadow: true
})
export class ItemOption implements ComponentInterface {

  @Element() el!: HTMLElement;

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
   * If `true`, the user cannot interact with the item option.
   */
  @Prop() disabled = false;

  /**
   * If `true`, the option will expand to take up the available width and cover any other options.
   */
  @Prop() expandable = false;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href?: string;

  @Listen('click')
  onClick(ev: Event) {
    const el = (ev.target as HTMLElement).closest('ion-item-option');
    if (el) {
      ev.preventDefault();
    }
  }

  hostData() {
    return {
      class: {
        ...createColorClasses(this.color),
        'item-option-expandable': this.expandable,
        'ion-activatable': true,
      }
    };
  }

  render() {
    const TagType = this.href === undefined ? 'button' : 'a' as any;

    return (
      <TagType
        type="button"
        class="button-native"
        disabled={this.disabled}
        href={this.href}
      >
        <span class="button-inner">
          <slot name="start"></slot>
          <slot name="top" />
          <slot name="icon-only" />
          <slot></slot>
          <slot name="bottom" />
          <slot name="end"></slot>
        </span>
        {this.mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </TagType>
    );
  }
}
