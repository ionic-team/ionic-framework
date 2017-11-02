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
  mode: string;
  color: string;

  @Prop() href: string;

  /**
   * @Prop {boolean} If true, sets the button into a disabled state.
   */
  @Prop() disabled: boolean = false;

  notCaptured() {
    // if (!clickedOptionButton(ev)) {
    //   this.closeOpened();
    // }
  }

  clickedOptionButton(ev: any): boolean {
    let ele = ev.target.closest('ion-item-option');
    return !!ele;
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
