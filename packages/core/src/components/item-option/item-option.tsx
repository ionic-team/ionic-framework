import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'ion-item-option',
  host: {
    theme: 'item-option'
  }
})
export class ItemOption {
  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string;

  /**
   * If true, sets the button into a disabled state.
   */
  @Prop() disabled = false;

  notCaptured() {
    // if (!clickedOptionButton(ev)) {
    //   this.closeOpened();
    // }
  }

  clickedOptionButton(ev: any): boolean {
    const el = ev.target.closest('ion-item-option');
    return !!el;
  }

  render() {

    const TagType = this.href ? 'a' : 'button';

    // TODO TagType should wrap button-inner
    return [
      <TagType
        class='item-option-button'
        disabled={this.disabled}
        href={this.href}
        onClick={this.clickedOptionButton.bind(this)}></TagType>,
      <span class='button-inner'>
        <slot></slot>
      </span>
    ];
  }

}
