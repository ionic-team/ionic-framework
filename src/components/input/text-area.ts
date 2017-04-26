import { Component, Optional, ElementRef, EventEmitter, Input, Output, Renderer, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

import { Config } from '../../config/config';
import { Form } from '../../util/form';
import { BaseInput } from '../../util/base-input';
import { isTrueProperty } from '../../util/util';
import { Item } from '../item/item';


/**
 * @name TextArea
 * @description
 *
 * `ion-textarea` is used for multi-line text inputs. Ionic still
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
 * @demo /docs/demos/src/textarea/
 */
@Component({
  selector: 'ion-textarea',
  template:
  '<textarea class="text-input" [ngClass]="\'text-input-\' + _mode"' +
    '[(ngModel)]="value"' +
    '(focus) = "_fireFocus()" ' +
    '(blur)="_fireBlur()" ' +
    '(input)="ionInput.emit($event)" ' +
    '[placeholder]="placeholder" ' +
    '[disabled]="disabled" ' +
    '[readonly]="readonly">',
  encapsulation: ViewEncapsulation.None,
})
export class TextInput extends BaseInput<string> {

  private _autoComplete: string;
  private _autoCorrect: string;
  private _readonly: boolean = false;

  /**
   * @input {string} Instructional text that shows before the input has a value.
   */
  @Input() placeholder: string = '';

  /**
   * @input {boolean} If true, the user cannot modify the value.
   */
  @Input()
  get readonly() {
    return this._readonly;
  }
  set readonly(val: boolean) {
    this._readonly = isTrueProperty(val);
  }

  /**
   * @hidden
   */
  @Input() autocorrect: string;

  /**
   * @hidden
   */
  @Input() autocomplete: string;

  /**
   * @hidden
   */
  @Input() autofocus: string;

  /**
   * @hidden
   */
  @Output() ionInput = new EventEmitter<UIEvent>();

  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    form: Form,
    @Optional() item: Item,
    @Optional() ngControl: NgControl,
  ) {
    super(config, elementRef, renderer, 'input', '', form, item, ngControl);

    this._autoComplete = config.get('autocomplete', 'off');
    this._autoCorrect = config.get('autocorrect', 'off');
  }

  /**
  * @hidden
  */
  clearTextInput() {
    this.value = null;
  }

}

