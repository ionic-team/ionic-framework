import {Component, ContentChildren, forwardRef, ViewChild, ContentChild, Renderer, ElementRef} from 'angular2/core';
import {NgIf} from 'angular2/common';

import {Button} from '../button/button';
import {Form} from '../../util/form';
import {Icon} from '../icon/icon';
import {Label} from '../label/label';


/**
 * @name Item
 * @description
 * Creates a list-item that can easily be swiped, deleted, reordered, edited, and more.
 *
 * There are three common ways to use an item:
 * - Use `<ion-item>` for something that is only non-clickable text.
 * - Use `<button ion-item>` for something that can be clicked/tapped. Typically this element will also have a `(click)` handler.
 * - Use `<a ion-item>` for when the item needs to contain a `href`.
 *
 * By default, `<button ion-item>` and `<a ion-item>` will receive a right arrow icon on iOS to signal that tapping the item will reveal more information.
 * To hide this icon, add the `detail-none` attribute to the item (eg: `<button ion-item detail-none>`). To add the icon when it is not displayed by default,
 * add the `detail-push` attribute (eg: `<ion-item detail-push>`).
 *
 *
 * @usage
 * ```html
 *
 * <ion-list>
 *
 *   // default item
 *   <ion-item>
 *     {{item.title}}
 *   </ion-item>
 *
 * </ion-list>
 *
 *  ```
 * @demo /docs/v2/demos/item/
 * @see {@link /docs/v2/components#lists List Component Docs}
 * @see {@link ../../list/List List API Docs}
 */
@Component({
  selector: 'ion-item,[ion-item]',
  template:
    '<ng-content select="[item-left],ion-checkbox"></ng-content>' +
    '<div class="item-inner">' +
      '<div class="input-wrapper">' +
        '<ng-content select="ion-label"></ng-content>' +
        '<ion-label *ngIf="_viewLabel">' +
          '<ng-content></ng-content>' +
        '</ion-label>' +
        '<ng-content select="ion-select,ion-input,ion-textarea"></ng-content>' +
      '</div>' +
      '<ng-content select="[item-right],ion-radio,ion-toggle"></ng-content>' +
    '</div>' +
    '<ion-button-effect></ion-button-effect>',
  host: {
    'class': 'item'
  },
  directives: [NgIf, Label]
})
export class Item {
  private _ids: number = -1;
  private _inputs: Array<string> = [];
  private _label: Label;
  private _viewLabel: boolean = true;

  /**
   * @private
   */
  id: string;

  /**
   * @private
   */
  labelId: string = null;

  constructor(form: Form, private _renderer: Renderer, private _elementRef: ElementRef) {
    this.id = form.nextId().toString();
  }

  /**
   * @private
   */
  registerInput(type: string) {
    this._inputs.push(type);
    return this.id + '-' + (++this._ids);
  }

  /**
   * @private
   */
  ngAfterContentInit() {
    if (this._viewLabel && this._inputs.length) {
      let labelText = this.getLabelText().trim();
      this._viewLabel = (labelText.length > 0);
    }

    if (this._inputs.length > 1) {
      this.setCssClass('item-multiple-inputs', true);
    }
  }

  /**
   * @private
   */
  setCssClass(cssClass: string, shouldAdd: boolean) {
    this._renderer.setElementClass(this._elementRef.nativeElement, cssClass, shouldAdd);
  }

  /**
   * @private
   */
  getLabelText(): string {
    return this._label ? this._label.text : '';
  }

  /**
   * @private
   */
  @ContentChild(Label)
  private set contentLabel(label: Label) {
    if (label) {
      this._label = label;
      this.labelId = label.id = ('lbl-' + this.id);
      if (label.type) {
        this.setCssClass('item-label-' + label.type, true);
      }
      this._viewLabel = false;
    }
  }

  /**
   * @private
   */
  @ViewChild(Label)
  private set viewLabel(label: Label) {
    if (!this._label) {
      this._label = label;
    }
  }

  /**
   * @private
   */
  @ContentChildren(Button)
  private set _buttons(buttons) {
    buttons.toArray().forEach(button => {
      // Don't add the item-button class if the user specifies
      // a different size button
      if (!button.isItem && !button._size) {
        button.addClass('item-button');
      }
    });
  }

  /**
   * @private
   */
  @ContentChildren(Icon)
  private set _icons(icons) {
    icons.toArray().forEach(icon => {
      icon.addClass('item-icon');
    });
  }
}
