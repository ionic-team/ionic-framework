import {Directive, Renderer, ElementRef, Host, Optional, EventEmitter, HostBinding, Input, Output, ContentChildren, HostListener} from 'angular2/core';
import {NgControl} from 'angular2/common';

import {Config} from '../../config/config';
import {isDefined} from '../../util/util';


/**
 * @name SegmentButton
 * @description
 * The child buttons of the `ion-segment` component. Each `ion-segment-button` must have a value.
 * @property {string} [value] - the value of the segment-button. Required.
 * @usage
 * ```html
 * <ion-segment [(ngModel)]="relationship" primary>
 *   <ion-segment-button value="friends" (select)="selectedFriends()">
 *     Friends
 *   </ion-segment-button>
 *   <ion-segment-button value="enemies" (select)="selectedEnemies()">
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
 * @demo /docs/v2/demos/segment/
 * @see {@link /docs/v2/components#segment Segment Component Docs}
 * @see {@link /docs/v2/api/components/segment/Segment/ Segment API Docs}
 */
@Directive({
  selector: 'ion-segment-button',
  host: {
    'tappable': '',
    'class': 'segment-button',
    'role': 'button'
  }
})
export class SegmentButton {
  @Input() value: string
  @Output() select: EventEmitter<any> = new EventEmitter();

  constructor(private _renderer: Renderer, private _elementRef: ElementRef) {}

  /**
   * @private
   * On click of a SegmentButton
   */
  @HostListener('click', ['$event'])
  private onClick(ev) {
    console.debug('SegmentButton, select', this.value);
    this.select.emit(ev, this.value);
  }

  ngOnInit() {
    if (!isDefined(this.value)) {
      console.warn('<ion-segment-button> requires a "value" attribute');
    }
  }

  public set isActive(isActive) {
    this._renderer.setElementClass(this._elementRef, 'segment-activated', isActive);
    this._renderer.setElementAttribute(this._elementRef, 'aria-pressed', isActive);
  }

}


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
 * @demo /docs/v2/demos/segment/
 * @see {@link /docs/v2/components#segment Segment Component Docs}
 * @see [Angular 2 Forms](http://learnangular2.com/forms/)
 */
@Directive({
  selector: 'ion-segment'
})
export class Segment {
  @Output() change: EventEmitter<any> = new EventEmitter();

  @ContentChildren(SegmentButton) buttons;

  value: any;

  constructor(
    @Optional() ngControl: NgControl
  ) {
    this.onChange = (_) => {};
    this.onTouched = (_) => {};

    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  /**
   * @private
   * Write a new value to the element.
   */
  writeValue(value) {
    this.value = !value ? '' : value;
    if (this.buttons) {
      let buttons = this.buttons.toArray();
      for (let button of buttons) {
        button.isActive = (button.value === this.value);
      }
    }
  }

  /**
   * @private
   */
  ngAfterViewInit() {
   let buttons = this.buttons.toArray();
   for (let button of buttons) {
     button.select.subscribe(() => {
       this.writeValue(button.value);
       this.onChange(button.value);
       this.change.emit(this.value);
     });

     if (isDefined(this.value)) {
       button.isActive = (button.value === this.value);
     }
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

}
