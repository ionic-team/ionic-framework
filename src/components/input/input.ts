import {Component, Optional, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgControl} from '@angular/common';

import {Config} from '../../config/config';
import {Content} from '../content/content';
import {Form} from '../../util/form';
import {InputBase} from './input-base';
import {App} from '../app/app';
import {Item} from '../item/item';
import {Label} from '../label/label';
import {NativeInput, NextInput} from './native-input';
import {NavController} from '../nav/nav-controller';
import {Platform} from '../../platform/platform';


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
 * @property [clearInput] - A clear icon will appear in the input which clears it
 *
 * @usage
 * ```html
 *  <ion-item>
 *    <ion-label>Username</ion-label>
 *    <ion-input></ion-input>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label fixed>Website</ion-label>
 *    <ion-input type="url"></ion-input>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label floating>Email</ion-label>
 *    <ion-input type="email"></ion-input>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label stacked>Phone</ion-label>
 *    <ion-input type="tel"></ion-input>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-input placeholder="Username" clearInput></ion-input>
 *  </ion-item>
 * ```
 *
 * @demo /docs/v2/demos/input/
 */
@Component({
  selector: 'ion-input',
  template:
    '<input [type]="type" [(ngModel)]="_value" (blur)="inputBlurred($event)" (focus)="inputFocused($event)" [placeholder]="placeholder" class="text-input">' +
    '<input [type]="type" aria-hidden="true" next-input *ngIf="_useAssist">' +
    '<button clear [hidden]="!clearInput" type="button" class="text-input-clear-icon" (click)="clearTextInput()" (mousedown)="clearTextInput()"></button>' +
    '<div (touchstart)="pointerStart($event)" (touchend)="pointerEnd($event)" (mousedown)="pointerStart($event)" (mouseup)="pointerEnd($event)" class="input-cover" tappable *ngIf="_useAssist"></div>',
  directives: [
    NextInput,
    NativeInput,
  ],
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
    @Optional() scrollView: Content,
    @Optional() nav: NavController,
    @Optional() ngControl: NgControl
  ) {
    super(config, form, item, app, platform, elementRef, scrollView, nav, ngControl);
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
 * Not that `<ion-textarea>` must load its value from the `value` or
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
 * ```
 *
 * @demo /docs/v2/demos/textarea/
 */
@Component({
  selector: 'ion-textarea',
  template:
    '<textarea [(ngModel)]="_value" (blur)="inputBlurred($event)" (focus)="inputFocused($event)" [placeholder]="placeholder" class="text-input"></textarea>' +
    '<input type="text" aria-hidden="true" next-input *ngIf="_useAssist">' +
    '<div (touchstart)="pointerStart($event)" (touchend)="pointerEnd($event)" (mousedown)="pointerStart($event)" (mouseup)="pointerEnd($event)" class="input-cover" tappable *ngIf="_useAssist"></div>',
  directives: [
    NextInput,
    NativeInput
  ],
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
    @Optional() scrollView: Content,
    @Optional() nav: NavController,
    @Optional() ngControl: NgControl
  ) {
    super(config, form, item, app, platform, elementRef, scrollView, nav, ngControl);
  }

  /**
   * @private
   */
  ngOnInit() {
    super.ngOnInit();
    if (this._item) {
      this._item.setCssClass('item-textarea', true);
    }
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
