import { Component, Prop } from '@stencil/core';
import { Color, Mode } from '../../interface';


@Component({
  tag: 'ion-item-option',
  host: {
    theme: 'item-option'
  },
  styleUrls: {
    ios: 'item-option.ios.scss',
    md: 'item-option.md.scss'
  }
})
export class ItemOption {
  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode!: Mode;

  /**
   * If true, the user cannot interact with the item option. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * If true, the option will expand to take up the available width and cover any other options. Defaults to `false`.
   */
  @Prop() expandable = false;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href?: string;

  private clickedOptionButton(ev: Event): boolean {
    const el = (ev.target as HTMLElement).closest('ion-item-option');
    return !!el;
  }

  hostData() {
    return {
      class: {
        'item-option-expandable': this.expandable
      }
    };
  }

  render() {
    const TagType = this.href ? 'a' : 'button';

    return (
      <TagType
        class="item-option-button"
        disabled={this.disabled}
        href={this.href}
        onClick={this.clickedOptionButton.bind(this)}>
        <span class="item-option-button-inner">
          <slot name="start"></slot>
          <slot name="top"></slot>
          <slot name="icon-only"></slot>
          <slot></slot>
          <slot name="bottom"></slot>
          <slot name="end"></slot>
        </span>
      </TagType>
    );
  }

}
