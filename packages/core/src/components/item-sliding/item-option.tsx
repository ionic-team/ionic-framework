import { Component, Prop } from '@stencil/core';

/**
 * @name ItemOption
 * @description
 * The option button for an `ion-item-sliding`. Must be placed inside of an `<ion-item-options>`.
 * You can combine the `(ionSwipe)` event and the `expandable` directive to create a full swipe
 * action for the item.
 */
@Component({
  tag: 'ion-item-option',
  host: {
    theme: 'item-option'
  }
})
export class ItemOption {
  /**
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"`, `"md"`, or `"wp"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md' | 'wp';

  /**
   * @input {string} Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string;

  /**
   * @input {boolean} If true, sets the button into a disabled state.
   */
  @Prop() disabled: boolean = false;

  notCaptured() {
    // if (!clickedOptionButton(ev)) {
    //   this.closeOpened();
    // }
  }

  clickedOptionButton(ev: any): boolean {
    let el = ev.target.closest('ion-item-option');
    return !!el;
  }

  protected render() {

    const TagType = this.href ? 'a' : 'button';
    return [
      <TagType class='item-option-button' onClick={this.clickedOptionButton.bind(this)} disabled={this.disabled}></TagType>,
      <span class='button-inner'>
        <slot></slot>
       </span>
    ];
  }

}
