import { Component, ComponentInterface, Element, Prop } from '@stencil/core';

import { Color, Mode } from '../../interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-chip-button',
  styleUrl: 'chip-button.scss',
  shadow: true
})
export class ChipButton implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * If true, the user cannot interact with the chip button. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * Set to `"clear"` for a transparent button or to `"solid"` for a filled background.
   * Defaults to `"clear"`.
   */
  @Prop() fill: 'clear' | 'solid' = 'clear';

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href?: string;

  hostData() {
    return {
      class: {
        ...createColorClasses(this.color),
        [`chip-button-${this.fill}`]: true
      }
    };
  }

  render() {
    const TagType = this.href === undefined ? 'button' : 'a';

    return (
      <TagType
        type="button"
        class="button-native"
        disabled={this.disabled}
        href={this.href}
      >
        <span class="button-inner">
          <slot></slot>
        </span>
        {this.mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </TagType>
    );
  }
}
