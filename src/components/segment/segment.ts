import { Component, ContentChildren, Directive, ElementRef, EventEmitter, HostListener, Input, Output, Optional, QueryList, Renderer, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';

import { Config } from '../../config/config';
import { Ion } from '../ion';
import { isPresent, isTrueProperty } from '../../util/util';


/**
 * @name SegmentButton
 * @description
 * The child buttons of the `ion-segment` component. Each `ion-segment-button` must have a value.
 *
 * @usage
 *
 * ```html
 * <ion-content>
 *   <!-- Segment buttons with icons -->
 *   <ion-segment [(ngModel)]="icons" color="secondary">
 *     <ion-segment-button value="camera">
 *       <ion-icon name="camera"></ion-icon>
 *     </ion-segment-button>
 *     <ion-segment-button value="bookmark">
 *       <ion-icon name="bookmark"></ion-icon>
 *     </ion-segment-button>
 *   </ion-segment>
 *
 *   <!-- Segment buttons with text -->
 *   <ion-segment [(ngModel)]="relationship" color="primary">
 *     <ion-segment-button value="friends" (ionSelect)="selectedFriends()">
 *       Friends
 *     </ion-segment-button>
 *     <ion-segment-button value="enemies" (ionSelect)="selectedEnemies()">
 *       Enemies
 *     </ion-segment-button>
 *   </ion-segment>
 * </ion-content>
 * ```
 *
 *
 * @demo /docs/v2/demos/src/segment/
 * @see {@link /docs/v2/components#segment Segment Component Docs}
 * @see {@link /docs/v2/api/components/segment/Segment/ Segment API Docs}
 */
@Component({
  selector: 'ion-segment-button',
  template:
    '<ng-content></ng-content>' +
    '<div class="button-effect"></div>',
  host: {
    'tappable': '',
    'class': 'segment-button',
    'role': 'button'
  },
  encapsulation: ViewEncapsulation.None,
})
export class SegmentButton {
  _disabled: boolean = false;

  /**
   * @input {string} the value of the segment button. Required.
   */
  @Input() value: string;

  /**
   * @output {SegmentButton} expression to evaluate when a segment button has been clicked
   */
  @Output() ionSelect: EventEmitter<SegmentButton> = new EventEmitter<SegmentButton>();

  constructor(private _renderer: Renderer, private _elementRef: ElementRef) {}

  /**
   * @private
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(val: boolean) {
    this._disabled = isTrueProperty(val);
    this._setElementClass('segment-button-disabled', this._disabled);
  }

  /**
   * @private
   */
  _setElementClass(cssClass: string, shouldAdd: boolean) {
    this._renderer.setElementClass(this._elementRef.nativeElement, cssClass, shouldAdd);
  }

  /**
   * @private
   * On click of a SegmentButton
   */
  @HostListener('click')
  onClick() {
    console.debug('SegmentButton, select', this.value);
    this.ionSelect.emit(this);
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
  set isActive(isActive: any) {
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
 * @demo /docs/v2/demos/src/segment/
 * @see {@link /docs/v2/components#segment Segment Component Docs}
 * @see [Angular 2 Forms](http://learnangular2.com/forms/)
 */
@Directive({
  selector: 'ion-segment'
})
export class Segment extends Ion {
  _disabled: boolean = false;

  /**
   * @private
   */
  value: string;

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._setColor('segment', val);
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  set mode(val: string) {
    this._setMode('segment', val);
  }

  /**
   * @output {Any}  expression to evaluate when a segment button has been changed
   */
  @Output() ionChange: EventEmitter<SegmentButton> = new EventEmitter<SegmentButton>();


  /**
   * @private
   */
  @ContentChildren(SegmentButton) _buttons: QueryList<SegmentButton>;

  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    @Optional() ngControl: NgControl
  ) {
    super(config, elementRef, renderer);

    this.mode = config.get('mode');

    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  /**
   * @private
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
   * @private
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
   * @private
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
   * @private
   */
  onChange = (_: any) => {};
  /**
   * @private
   */
  onTouched = (_: any) => {};

  /**
   * @private
   * Set the function to be called when the control receives a change event.
   */
  registerOnChange(fn: any) { this.onChange = fn; }

  /**
   * @private
   * Set the function to be called when the control receives a touch event.
   */
  registerOnTouched(fn: any) { this.onTouched = fn; }

}
