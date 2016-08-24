import { Directive, ElementRef, Input, Renderer } from '@angular/core';

/**
  * @name Chip
  * @module ionic
  * @description
  * Chips represent complex entities in small blocks, such as a contact.
  *
  *
  * @usage
  *
  * ```html
  * <ion-chip>
  *   <ion-label>Default</ion-label>
  * </ion-chip>
  *
  * <ion-chip>
  *   <ion-label color="secondary">Secondary Label</ion-label>
  * </ion-chip>
  *
  * <ion-chip color="secondary">
  *   <ion-label color="dark">Secondary w/ Dark label</ion-label>
  * </ion-chip>
  *
  * <ion-chip color="danger">
  *   <ion-label>Danger</ion-label>
  * </ion-chip>
  *
  * <ion-chip>
  *   <ion-icon name="pin"></ion-icon>
  *   <ion-label>Default</ion-label>
  * </ion-chip>
  *
  * <ion-chip>
  *   <ion-icon name="heart" color="dark"></ion-icon>
  *   <ion-label>Default</ion-label>
  * </ion-chip>
  *
  * <ion-chip>
  *   <ion-avatar>
  *     <img src="img/my-img.png">
  *   </ion-avatar>
  *   <ion-label>Default</ion-label>
  * </ion-chip>
  * ```
  *
  *
  * @advanced
  *
  * ```html
  * <ion-chip #chip1>
  *   <ion-label>Default</ion-label>
  *   <button ion-button clear color="light" (click)="delete(chip1)">
  *     <ion-icon name="close-circle"></ion-icon>
  *   </button>
  * </ion-chip>
  *
  * <ion-chip #chip2>
  *   <ion-icon name="pin" color="primary"></ion-icon>
  *   <ion-label>With Icon</ion-label>
  *   <button ion-button (click)="delete(chip2)">
  *     <ion-icon name="close"></ion-icon>
  *   </button>
  * </ion-chip>
  *
  * <ion-chip #chip3>
  *   <ion-avatar>
  *     <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==">
  *   </ion-avatar>
  *   <ion-label>With Avatar</ion-label>
  *   <button ion-button clear color="dark" (click)="delete(chip3)">
  *     <ion-icon name="close-circle"></ion-icon>
  *   </button>
  * </ion-chip>
  * ```
  *
  * ```ts
  * @Component({
  *   templateUrl: 'main.html'
  * })
  * class E2EPage {
  *   delete(chip: Element) {
  *     chip.remove();
  *   }
  * }
  * ```
  *
  * @demo /docs/v2/demos/chip/
 **/
@Directive({
  selector: 'ion-chip'
})
export class Chip {
  /** @internal */
  _color: string;

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._updateColor(value);
  }

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer
  ) { }

  /**
   * @internal
   */
  _updateColor(newColor: string) {
    this._setElementColor(this._color, false);
    this._setElementColor(newColor, true);
    this._color = newColor;
  }

  /**
   * @internal
   */
  _setElementColor(color: string, isAdd: boolean) {
    if (color !== null && color !== '') {
      this._renderer.setElementClass(this._elementRef.nativeElement, `chip-${color}`, isAdd);
    }
  }

}
