import { ContentChildren, Directive, ElementRef, EventEmitter, Input, Output, Optional, QueryList, Renderer } from '@angular/core';
import { NgControl } from '@angular/forms';

import { Config } from '../../config/config';
import { Ion } from '../ion';
import { isPresent, isTrueProperty } from '../../util/util';

import { SegmentButton } from './segment-button';

/**
 * @name Segment
 * @description
 * A Segment is a group of buttons, sometimes known as Segmented Controls, that allow the user to interact with a compact group of a number of controls.
 * Segments provide functionality similar to tabs, selecting one will unselect all others. You should use a tab bar instead of a segmented control when you want to let the user move back and forth between distinct pages in your app.
 * You could use Angular 2's `ngModel` or `FormBuilder` API. For an overview on how `FormBuilder` works, checkout [Angular 2 Forms](http://learnangular2.com/forms/), or [Angular FormBuilder](https://angular.io/docs/ts/latest/api/forms/index/FormBuilder-class.html)
 *
 *
 * ```html
 * <!-- Segment in a header -->
 * <ion-header>
 *   <ion-toolbar>
 *     <ion-segment [(ngModel)]="icons" color="secondary">
 *       <ion-segment-button value="camera">
 *         <ion-icon name="camera"></ion-icon>
 *       </ion-segment-button>
 *       <ion-segment-button value="bookmark">
 *         <ion-icon name="bookmark"></ion-icon>
 *       </ion-segment-button>
 *     </ion-segment>
 *   </ion-toolbar>
 * </ion-header>
 *
 * <ion-content>
 *   <!-- Segment in content -->
 *   <ion-segment [(ngModel)]="relationship" color="primary">
 *     <ion-segment-button value="friends" (ionSelect)="selectedFriends()">
 *       Friends
 *     </ion-segment-button>
 *     <ion-segment-button value="enemies" (ionSelect)="selectedEnemies()">
 *       Enemies
 *     </ion-segment-button>
 *   </ion-segment>
 *
 *   <!-- Segment in a form -->
 *   <form [formGroup]="myForm">
 *     <ion-segment formControlName="mapStyle" color="danger">
 *       <ion-segment-button value="standard">
 *         Standard
 *       </ion-segment-button>
 *       <ion-segment-button value="hybrid">
 *         Hybrid
 *       </ion-segment-button>
 *       <ion-segment-button value="sat">
 *         Satellite
 *       </ion-segment-button>
 *     </ion-segment>
 *   </form>
 * </ion-content>
 * ```
 *
 *
 * @demo /docs/demos/src/segment/
 * @see {@link /docs/components#segment Segment Component Docs}
 * @see [Angular 2 Forms](http://learnangular2.com/forms/)
 */
@Directive({
  selector: 'ion-segment'
})
export class Segment extends Ion {
  _disabled: boolean = false;

  /**
   * @hidden
   */
  value: string;

  /**
   * @output {Any} Emitted when a segment button has been changed.
   */
  @Output() ionChange: EventEmitter<SegmentButton> = new EventEmitter<SegmentButton>();


  /**
   * @hidden
   */
  @ContentChildren(SegmentButton) _buttons: QueryList<SegmentButton>;

  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    @Optional() ngControl: NgControl
  ) {
    super(config, elementRef, renderer, 'segment');

    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  /**
   * @input {boolean} If true, the user cannot interact with any of the buttons in the segment.
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(val: boolean) {
    this._disabled = isTrueProperty(val);

    if (this._buttons) {
      this._buttons.forEach(button => {
        button._setElementClass('segment-button-disabled', this._disabled);
      });
    }
  }

  /**
   * @hidden
   * Write a new value to the element.
   */
  writeValue(value: any) {
    this.value = isPresent(value) ? value : '';
    if (this._buttons) {
      let buttons = this._buttons.toArray();
      for (let button of buttons) {
        button.isActive = (button.value === this.value);
      }
    }
  }

  /**
   * @hidden
   */
  ngAfterViewInit() {
   this._buttons.forEach(button => {
     button.ionSelect.subscribe((selectedButton: any) => {
       this.writeValue(selectedButton.value);
       this.onChange(selectedButton.value);
       this.ionChange.emit(selectedButton);
     });

     if (isPresent(this.value)) {
       button.isActive = (button.value === this.value);
     }

     if (isTrueProperty(this._disabled)) {
       button._setElementClass('segment-button-disabled', this._disabled);
     }
   });
  }

  /**
   * @hidden
   */
  onChange = (_: any) => {};
  /**
   * @hidden
   */
  onTouched = (_: any) => {};

  /**
   * @hidden
   * Set the function to be called when the control receives a change event.
   */
  registerOnChange(fn: any) { this.onChange = fn; }

  /**
   * @hidden
   * Set the function to be called when the control receives a touch event.
   */
  registerOnTouched(fn: any) { this.onTouched = fn; }

}
