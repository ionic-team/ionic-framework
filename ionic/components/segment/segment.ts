import {Directive, Renderer, ElementRef, Host, Optional, EventEmitter, Output} from 'angular2/core';
import {NgControl} from 'angular2/common';

import {Ion} from '../ion';
import {Config} from '../../config/config';


/**
 * @name Segment
 * @description
 * A Segment is a group of buttons, sometimes known as Segmented Controls, that allow the user to interact with a compact group of a number of controls.
 * Segments provide functionality similar to tabs, selecting one will unselect all others. You should use a tab bar instead of a segmented control when you want to let the user move back and forth between distinct pages in your app.
 * You could use Angular 2's `ngModel` or `FormBuilder` API. For an overview on how `FormBuilder` works, checkout [Angular 2 Forms](http://learnangular2.com/forms/), or [Angular FormBuilder](https://angular.io/docs/ts/latest/api/common/FormBuilder-class.html)
 *
 *
 * @usage
 * ```html
 * <ion-segment [(ngModel)]="relationship" (change)="onSegmentChanged($event)" danger>
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
 * <form [ngFormModel]="myForm">
 *   <ion-segment ngControl="mapStyle" danger>
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
 *
 * @property {Any} [change] - expression to evaluate when a segment button has been changed
 *
 * @see {@link /docs/v2/components#segment Segment Component Docs}
 * @see [Angular 2 Forms](http://learnangular2.com/forms/)
 */
@Directive({
  selector: 'ion-segment'
})
export class Segment extends Ion {
  @Output() change: EventEmitter<any> = new EventEmitter();

  /**
   * @private
   * {Array<SegmentButton>} buttons  The children SegmentButton's
   */
  buttons: Array<SegmentButton> = [];
  value: any;

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
   * Write a new value to the element.
   */
  writeValue(value) {
    this.value = !value ? '' : value;
    for (let button of this.buttons) {
      button.isActive = (button.value === value);
    }
  }

  /**
   * @private
   * Set the function to be called when the control receives a change event.
   */
  registerOnChange(fn) { this.onChange = fn; }

  /**
   * @private
   * Set the function to be called when the control receives a touch event.
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
    this.change.emit(this.value);
  }
}


/**
 * @name SegmentButton
 * @description
 * The child buttons of the `ion-segment` component. Each `ion-segment-button` must have a value.
 * @property {string} [value] - the value of the segment-button.
 * @usage
 * ```html
 * <ion-segment [(ngModel)]="relationship" primary>
 *   <ion-segment-button value="friends" (click)="clickedFriends()">
 *     Friends
 *   </ion-segment-button>
 *   <ion-segment-button value="enemies" (click)="clickedEnemies()">
 *     Enemies
 *   </ion-segment-button>
 * </ion-segment>
 *```
 *
 * Or with `FormBuilder`
 *
 *```html
 * <form [ngFormModel]="myForm">
 *   <ion-segment ngControl="mapStyle" danger>
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
 *
 * @property {Any} [click] - expression to evaluate when a segment button has been clicked
 *
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
   * Runs after the first check only
   */
  ngOnInit() {
    this.segment.register(this);
  }

  /**
   * @private
   * On click of a SegmentButton
   * @param {MouseEvent} event  The event that happens on click.
   */
  click(event) {
    this.segment.selected(this, event);
  }
}
