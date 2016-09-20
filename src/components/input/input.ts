import { Component, Optional, ElementRef, EventEmitter, Input, Output, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { Content } from '../content/content';
import { Form } from '../../util/form';
import { InputBase } from './input-base';
import { isTrueProperty } from '../../util/util';
import { Item } from '../item/item';
import { NativeInput, NextInput } from './native-input';
import { NavController } from '../../navigation/nav-controller';
import { Platform } from '../../platform/platform';


/**
 * @name Input
 * @description
 *
 * `ion-input` is meant for text type inputs only, such as `text`,
 * `password`, `email`, `number`, `search`, `tel`, and `url`. Ionic
 * still uses an actual `<input type="text">` HTML element within the
 * component, however, with Ionic wrapping the native HTML input
 * element it's able to better handle the user experience and
 * interactivity.
 *
 * Similarily, `<ion-textarea>` should be used in place of `<textarea>`.
 *
 * An `ion-input` is **not** used for non-text type inputs, such as a
 * `checkbox`, `radio`, `toggle`, `range`, `select`, etc.
 *
 * @property [type] - The HTML input type (text, password, email, number, search, tel, or url)
 * @property [clearInput] - A clear icon will appear in the input when there is a value. Clicking it clears the input.
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item>
 *     <ion-label color="primary">Inline Label</ion-label>
 *     <ion-input placeholder="Text Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" fixed>Fixed Label</ion-label>
 *     <ion-input type="tel" placeholder="Tel Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-input type="number" placeholder="Number Input with no label"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" stacked>Stacked Label</ion-label>
 *     <ion-input type="email" placeholder="Email Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" stacked>Stacked Label</ion-label>
 *     <ion-input type="password" placeholder="Password Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" floating>Floating Label</ion-label>
 *     <ion-input></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-input placeholder="Clear Input" clearInput></ion-input>
 *   </ion-item>
 * </ion-list>
 * ```
 *
 * @demo /docs/v2/demos/src/input/
 */
@Component({
  selector: 'ion-input',
  template:
    '<input [type]="type" [(ngModel)]="_value" (blur)="inputBlurred($event)" (focus)="inputFocused($event)" [placeholder]="placeholder" class="text-input" [ngClass]="\'text-input-\' + _mode">' +
    '<input [type]="type" aria-hidden="true" next-input *ngIf="_useAssist">' +
    '<button ion-button clear [hidden]="!clearInput" type="button" class="text-input-clear-icon" (click)="clearTextInput()" (mousedown)="clearTextInput()"></button>' +
    '<div (touchstart)="pointerStart($event)" (touchend)="pointerEnd($event)" (mousedown)="pointerStart($event)" (mouseup)="pointerEnd($event)" class="input-cover" tappable *ngIf="_useAssist"></div>',
  encapsulation: ViewEncapsulation.None,
})
export class TextInput extends InputBase {

  constructor(
    config: Config,
    form: Form,
    @Optional() item: Item,
    app: App,
    platform: Platform,
    elementRef: ElementRef,
    renderer: Renderer,
    @Optional() scrollView: Content,
    @Optional() nav: NavController,
    @Optional() ngControl: NgControl
  ) {
    super(config, form, item, app, platform, elementRef, renderer, scrollView, nav, ngControl);

    this.mode = config.get('mode');
  }

  /**
   * @private
   */
  _clearInput: boolean = false;

  /**
   * @private
   */
  @Input() placeholder: string = '';

  /**
   * @private
   */
  @Input()
  get clearInput() {
    return this._clearInput;
  }
  set clearInput(val: any) {
    this._clearInput = isTrueProperty(val);
  }

  /**
   * @private
   */
  @Input()
  get value() {
    return this._value;
  }
  set value(val: any) {
    super.setValue(val);
  }

  /**
   * @private
   */
  @Input()
  get type() {
    return this._type;
  }
  set type(val: any) {
    super.setType(val);
  }

  /**
   * @private
   */
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(val: any) {
    super.setDisabled(val);
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode('input', val);
  }

  /**
   * @private
   */
  @ViewChild(NativeInput)
  set _nativeInput(nativeInput: NativeInput) {
    super.setNativeInput(nativeInput);
  }

  /**
   * @private
   */
  @ViewChild(NextInput)
  set _nextInput(nextInput: NextInput) {
    super.setNextInput(nextInput);
  }

  /**
   * @private
   */
  @Output() blur: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * @private
   */
  @Output() focus: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * @private
   */
  inputBlurred(ev: UIEvent) {
    this.blur.emit(ev);
  }

  /**
   * @private
   */
  inputFocused(ev: UIEvent) {
    this.focus.emit(ev);
  }
  /**
   * @private
   */
  ngOnInit() {
    if (this._item) {
      this._item.setElementClass('item-input', true);
      this._item.registerInput(this._type);
    }
  }

  /**
   * @private
   */
  ngAfterContentChecked() {
    this.setItemInputControlCss();
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
  }

  /**
   * @private
   */
  clearTextInput() {
    console.debug('Should clear input');
    this._value = '';
    this.onChange(this._value);
    this.writeValue(this._value);
  }
}



/**
 * @name TextArea
 * @description
 *
 * `ion-textarea` is is used for multi-line text inputs. Ionic still
 * uses an actual `<textarea>` HTML element within the component;
 * however, with Ionic wrapping the native HTML text area element, Ionic
 * is able to better handle the user experience and interactivity.
 *
 * Note that `<ion-textarea>` must load its value from the `value` or
 * `[(ngModel)]` attribute. Unlike the native `<textarea>` element,
 * `<ion-textarea>` does not support loading its value from the
 * textarea's inner content.
 *
 * When requiring only a single-line text input, we recommend using
 * `<ion-input>` instead.
 *
 * @usage
 * ```html
 *  <ion-item>
 *    <ion-label>Comments</ion-label>
 *    <ion-textarea></ion-textarea>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label stacked>Message</ion-label>
 *    <ion-textarea [(ngModel)]="msg"></ion-textarea>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label floating>Description</ion-label>
 *    <ion-textarea></ion-textarea>
 *  </ion-item>
 *
 * <ion-item>
 *    <ion-label>Long Description</ion-label>
 *    <ion-textarea rows="6" placeholder="enter long description here..."></ion-textarea>
 *  </ion-item>
 * ```
 *
 * @demo /docs/v2/demos/src/textarea/
 */
@Component({
  selector: 'ion-textarea',
  template:
    '<textarea [(ngModel)]="_value" (blur)="inputBlurred($event)" (focus)="inputFocused($event)" [placeholder]="placeholder" class="text-input" [ngClass]="\'text-input-\' + _mode"></textarea>' +
    '<input type="text" aria-hidden="true" next-input *ngIf="_useAssist">' +
    '<div (touchstart)="pointerStart($event)" (touchend)="pointerEnd($event)" (mousedown)="pointerStart($event)" (mouseup)="pointerEnd($event)" class="input-cover" tappable *ngIf="_useAssist"></div>',
  encapsulation: ViewEncapsulation.None,
})
export class TextArea extends InputBase {
  constructor(
    config: Config,
    form: Form,
    @Optional() item: Item,
    app: App,
    platform: Platform,
    elementRef: ElementRef,
    renderer: Renderer,
    @Optional() scrollView: Content,
    @Optional() nav: NavController,
    @Optional() ngControl: NgControl
  ) {
    super(config, form, item, app, platform, elementRef, renderer, scrollView, nav, ngControl);

    this.mode = config.get('mode');
  }

  /**
   * @private
   */
  @Input() placeholder: string = '';

  /**
   * @private
   */
  @Input()
  get value() {
    return this._value;
  }
  set value(val: any) {
    super.setValue(val);
  }

  /**
   * @private
   */
  @Input()
  get type() {
    return this._type;
  }
  set type(val: any) {
    super.setType(val);
  }

  /**
   * @private
   */
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(val: any) {
    super.setDisabled(val);
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode('input', val);
  }

  /**
   * @private
   */
  @ViewChild(NativeInput)
  set _nativeInput(nativeInput: NativeInput) {
    super.setNativeInput(nativeInput);
  }

  /**
   * @private
   */
  @ViewChild(NextInput)
  set _nextInput(nextInput: NextInput) {
    super.setNextInput(nextInput);
  }

  /**
   * @private
   */
  @Output() blur: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * @private
   */
  @Output() focus: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * @private
   */
  ngOnInit() {
    if (this._item) {
      this._item.setElementClass('item-textarea', true);
      this._item.setElementClass('item-input', true);
      this._item.registerInput(this._type);
    }
  }

  /**
   * @private
   */
  ngAfterContentChecked() {
    this.setItemInputControlCss();
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
  }

  /**
   * @private
   */
  inputBlurred(ev: UIEvent) {
    this.blur.emit(ev);
  }

  /**
   * @private
   */
  inputFocused(ev: UIEvent) {
    this.focus.emit(ev);
  }
}
