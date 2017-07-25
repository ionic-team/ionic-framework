import { Component, Prop } from '@stencil/core';
import { createThemedClasses } from '../../utils/theme';


/**
 * @name ItemOption
 * @description
 * The option button for an `ion-item-sliding`. Must be placed inside of an `<ion-item-options>`.
 * You can combine the `(ionSwipe)` event and the `expandable` directive to create a full swipe
 * action for the item.
 */
@Component({
  tag: 'ion-item-option'
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

  render() {
    const themedClasses = createThemedClasses(this.mode, this.color, 'item-option-button');

    const TagType = this.href ? 'a' : 'button';

    return (
      <TagType class={themedClasses} onClick={this.clickedOptionButton.bind(this)} disabled={this.disabled}>
        <span class='button-inner'>
          <slot></slot>
        </span>
        <div class='button-effect'></div>
      </TagType>
    );
  }

}