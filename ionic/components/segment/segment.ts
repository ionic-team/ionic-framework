import {Directive, Component, ElementRef, Renderer, Optional, EventEmitter, Input, Output, HostListener, ContentChildren, QueryList} from 'angular2/core';
import {NgControl} from 'angular2/common';

import {isPresent} from '../../util/util';


/**
 * @name SegmentButton
 * @description
 * The child buttons of the `ion-segment` component. Each `ion-segment-button` must have a value.
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
 *
 * @demo /docs/v2/demos/segment/
 * @see {@link /docs/v2/components#segment Segment Component Docs}
 * @see {@link /docs/v2/api/components/segment/Segment/ Segment API Docs}
 */
@Component({
  selector: 'ion-segment-button',
  template:
    '<ng-content></ng-content>' +
    '<ion-button-effect></ion-button-effect>',
  host: {
    'tappable': '',
    'class': 'segment-button',
    'role': 'button'
  }
})
export class SegmentButton {

  /**
   * @input {string} the value of the segment button. Required.
   */
  @Input() value: string;

  /**
   * @output {SegmentButton} expression to evaluate when a segment button has been clicked
   */
  @Output() select: EventEmitter<SegmentButton> = new EventEmitter();

  constructor(private _renderer: Renderer, private _elementRef: ElementRef) {}

  /**
   * @private
   * On click of a SegmentButton
   */
  @HostListener('click', ['$event'])
  private onClick(ev) {
    console.debug('SegmentButton, select', this.value);
    this.select.emit(this);
  }

  /**
   * @private
   */
  ngOnInit() {
    if (!isPresent(this.value)) {
      console.warn('<ion-segment-button> requires a "value" attribute');
    }
  }

  /**
   * @private
   */
  set isActive(isActive) {
    this._renderer.setElementClass(this._elementRef.nativeElement, 'segment-activated', isActive);
    this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-pressed', isActive);
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
 *
 * @demo /docs/v2/demos/segment/
 * @see {@link /docs/v2/components#segment Segment Component Docs}
 * @see [Angular 2 Forms](http://learnangular2.com/forms/)
 */
@Directive({
  selector: 'ion-segment'
})
export class Segment {

  /**
   * @private
   */
  value: string;


  /**
   * @output {Any}  expression to evaluate when a segment button has been changed
   */
  @Output() change: EventEmitter<SegmentButton> = new EventEmitter();


  /**
   * @private
   */
  @ContentChildren(SegmentButton) _buttons: QueryList<SegmentButton>;

  constructor(@Optional() ngControl: NgControl) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  /**
   * @private
   * Write a new value to the element.
   */
  writeValue(value) {
    this.value = isPresent(value) ? value : '';
    if (this._buttons) {
      let buttons = this._buttons.toArray();
      for (let button of buttons) {
        button.isActive = (button.value === this.value);
      }
    }
  }

  /**
   * @private
   */
  ngAfterViewInit() {
   let buttons = this._buttons.toArray();
   for (let button of buttons) {
     button.select.subscribe((selectedButton) => {
       this.writeValue(selectedButton.value);
       this.onChange(selectedButton.value);
       this.change.emit(selectedButton);
     });

     if (isPresent(this.value)) {
       button.isActive = (button.value === this.value);
     }
   }
  }

  /**
   * @private
   */
  onChange = (_) => {};
  /**
   * @private
   */
  onTouched = (_) => {};

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
