import {Directive, Renderer, ElementRef, Host, Optional, NgControl} from 'angular2/angular2';

import {Ion} from '../ion';
import {Config} from '../../config/config';


/**
 * @description
 * A Segment is a group of buttons, sometimes known as Segmented Controls, that allow the user to interact with a compact group of a number of controls.
 *
 * Segments provide functionality similar to tabs, selecting one will unselect all others. You should use a tab bar instead of a segmented control when you want to let the user move back and forth between distinct pages in your app.
 *
 * @usage
 * ```html
 * <ion-segment [(ng-model)]="relationship" danger>
 *   <ion-segment-button value="friends">
 *     Friends
 *   </ion-segment-button>
 *   <ion-segment-button value="enemies">
 *     Enemies
 *   </ion-segment-button>
 * </ion-segment>
 *
 *
 * <form [ng-form-model]="myForm">
 *   <ion-segment ng-control="mapStyle" danger>
 *     <ion-segment-button value="standard">
 *       Standard
 *     </ion-segment-button>
 *     <ion-segment-button value="hybrid">
 *       Hybrid
 *     </ion-segment-button>
 *     <ion-segment-button value="sat">
 *       Satellite
 *     </ion-segment-button>
 *   </ion-segment>
 * </form>
 * ```
 */
@Directive({
  selector: 'ion-segment'
})
export class Segment extends Ion {
  /**
   * @private
   */
  buttons: Array<SegmentButton> = [];

  constructor(
    @Optional() ngControl: NgControl,
    elementRef: ElementRef,
    config: Config
  ) {
    super(elementRef, config);

    this.onChange = (_) => {};
    this.onTouched = (_) => {};

    if (ngControl) ngControl.valueAccessor = this;
  }

  /**
   * @private
   */
  writeValue(value) {
    this.value = !value ? '' : value;
  }

  /**
   * @private
   */
  registerOnChange(fn) { this.onChange = fn; }

  /**
   * @private
   */
  registerOnTouched(fn) { this.onTouched = fn; }

  /**
   * @private
   * Called by child SegmentButtons to bind themselves to
   * the Segment.
   * @param {SegmentButton} segmentButton  The child SegmentButton to register.
   */
  register(segmentButton) {
    this.buttons.push(segmentButton);

    // If this button is registered and matches our value,
    // make sure to select it
    if (this.value == segmentButton.value) {
      this.selected(segmentButton);
    }
  }

  /**
   * @private
   * Select the button with the given value.
   * @param {string} value  Value of the button to select.
   */
  selectFromValue(value) {
    if (this.buttons.length == 0) {
      return;
    }
    this.buttons.forEach(function(button) {
      if (button.value === value) {
        button.isActive = true;
      }
    });
  }

  /**
   * @private
   * Indicate a button should be selected.
   * @param {SegmentButton} segmentButton  The button to select.
   */
  selected(segmentButton) {
    this.buttons.forEach(function(button) {
      button.isActive = false;
    });
    segmentButton.isActive = true;

    this.value = segmentButton.value;
    this.onChange(segmentButton.value);
  }
}


@Directive({
  selector: 'ion-segment-button',
  inputs: [
    'value'
  ],
  host: {
    '(click)': 'click($event)',
    '[class.activated]': 'isActive',
  }
})
export class SegmentButton {

  constructor(
    @Host() segment: Segment,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    this.segment = segment;

    renderer.setElementAttribute(elementRef, 'button', '');
    renderer.setElementAttribute(elementRef, 'outline', '');
  }

  /**
   * @private
   */
  onInit() {
    this.segment.register(this);
  }

  /**
   * @private
   */
  click(event) {
    this.segment.selected(this, event);
  }
}
