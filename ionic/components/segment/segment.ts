import {Directive, Renderer, ElementRef, Host, Optional, NgControl} from 'angular2/angular2';

import {Ion} from '../ion';
import {Config} from '../../config/config';


/**
 * @name Segment
 * @description
 * A Segment is a group of buttons, sometimes known as Segmented Controls, that allow the user to interact with a compact group of a number of controls.
 * Segments provide functionality similar to tabs, selecting one will unselect all others. You should use a tab bar instead of a segmented control when you want to let the user move back and forth between distinct pages in your app.
 * You could use Angular 2's `ng-model` or `FormBuilder` API. For an overview on how `FormBuilder` works, checkout [Angular 2 Forms](http://learnangular2.com/forms/), or [Angular FormBuilder](https://angular.io/docs/ts/latest/api/common/FormBuilder-class.html)
 *
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
 *```
 *
 * Or with `FormBuilder`
 *
 *```html
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
 * @demo /docs/v2/demos/segment/
 * @see {@link /docs/v2/components#segment Segment Component Docs}
 * @see [Angular 2 Forms](http://learnangular2.com/forms/)
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
    for (let button of this.buttons) {
      button.isActive = (button.value === value);
    }
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
    for (let button of this.buttons) {
      button.isActive = (button.value === value);
    }
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


/**
 * @name SegmentButton
 * @description
 * The child buttons of the `ion-segment` component. Each `ion-segment-button` must have a value.
 * @property {string} [value] - the value of the segment-button.
 * @usage
 * ```html
 * <ion-segment [(ng-model)]="relationship" primary>
 *   <ion-segment-button value="friends">
 *     Friends
 *   </ion-segment-button>
 *   <ion-segment-button value="enemies">
 *     Enemies
 *   </ion-segment-button>
 * </ion-segment>
 *```
 *
 * Or with `FormBuilder`
 *
 *```html
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
 * @see {@link /docs/v2/components#segment Segment Component Docs}
 * @see {@link /docs/v2/api/components/segment/Segment/ Segment API Docs}
 */
@Directive({
  selector: 'ion-segment-button',
  inputs: [
    'value'
  ],
  host: {
    '(click)': 'click($event)',
    '[class.segment-activated]': 'isActive'
  }
})
export class SegmentButton {

  constructor(
    @Host() segment: Segment,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    this.segment = segment;

    renderer.setElementClass(elementRef, 'segment-button', true);
    renderer.setElementAttribute(elementRef, 'tappable', '');
  }

  /**
   * @private
   */
  ngOnInit() {
    this.segment.register(this);
  }

  /**
   * @private
   */
  click(event) {
    this.segment.selected(this, event);
  }
}
