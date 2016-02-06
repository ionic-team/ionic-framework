import {Directive, Attribute, ElementRef, Renderer, Input, Output, EventEmitter, HostListener} from 'angular2/core';
import {NgControl} from 'angular2/common';

import {CSS, hasFocus, raf}  from '../../util/dom';


/**
 * @private
 */
@Directive({
  selector: '.text-input'
})
export class NativeInput {
  private _relocated: boolean;

  @Output() focusChange: EventEmitter<boolean> = new EventEmitter();
  @Output() valueChange: EventEmitter<string> = new EventEmitter();

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    public ngControl: NgControl
  ) {}

  /**
   * @private
   */
  @HostListener('input', ['$event'])
  private _change(ev) {
    this.valueChange.emit(ev.target.value);
  }

  /**
   * @private
   */
  @HostListener('focus')
  private _focus() {
    this.focusChange.emit(true);
  }

  /**
   * @private
   */
  @HostListener('blur')
  private _blur() {
    this.focusChange.emit(false);
    this.hideFocus(false);
  }

  labelledBy(val: string) {
    this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-labelledby', val);
  }

  isDisabled(val: boolean) {
    this._renderer.setElementAttribute(this._elementRef.nativeElement, 'disabled', val ? '' : null);
  }

  /**
   * @private
   */
  setFocus() {
    this.element().focus();
  }

  /**
   * @private
   */
  relocate(shouldRelocate: boolean, inputRelativeY: number) {
    console.debug('native input relocate', shouldRelocate, inputRelativeY);

    if (this._relocated !== shouldRelocate) {

      let focusedInputEle = this.element();
      if (shouldRelocate) {
        let clonedInputEle = cloneInput(focusedInputEle, 'cloned-focus');

        focusedInputEle.parentNode.insertBefore(clonedInputEle, focusedInputEle);
        focusedInputEle.style[CSS.transform] = `translate3d(-9999px,${inputRelativeY}px,0)`;
        focusedInputEle.style.opacity = '0';

        this.setFocus();

        raf(() => {
          focusedInputEle.classList.add('cloned-active');
        });

      } else {
        focusedInputEle.classList.remove('cloned-active');
        focusedInputEle.style[CSS.transform] = '';
        focusedInputEle.style.opacity = '';

        removeClone(focusedInputEle, 'cloned-focus');
      }

      this._relocated = shouldRelocate;
    }
  }

  /**
   * @private
   */
  hideFocus(shouldHideFocus: boolean) {
    console.debug('native input hideFocus', shouldHideFocus);

    let focusedInputEle = this.element();

    if (shouldHideFocus) {
      let clonedInputEle = cloneInput(focusedInputEle, 'cloned-move');

      focusedInputEle.classList.add('cloned-active');
      focusedInputEle.parentNode.insertBefore(clonedInputEle, focusedInputEle);

    } else {
      focusedInputEle.classList.remove('cloned-active');
      removeClone(focusedInputEle, 'cloned-move');
    }
  }

  hasFocus(): boolean {
    return hasFocus(this.element());
  }

  getValue(): string {
    return this.element().value;
  }

  /**
   * @private
   */
  element(): HTMLInputElement {
    return this._elementRef.nativeElement;
  }

}

function cloneInput(focusedInputEle, addCssClass) {
  let clonedInputEle = focusedInputEle.cloneNode(true);
  clonedInputEle.classList.add('cloned-input');
  clonedInputEle.classList.add(addCssClass);
  clonedInputEle.setAttribute('aria-hidden', true);
  clonedInputEle.removeAttribute('aria-labelledby');
  clonedInputEle.tabIndex = -1;
  clonedInputEle.style.width = (focusedInputEle.offsetWidth + 10) + 'px';
  return clonedInputEle;
}

function removeClone(focusedInputEle, queryCssClass) {
  let clonedInputEle = focusedInputEle.parentElement.querySelector('.' + queryCssClass);
  if (clonedInputEle) {
    clonedInputEle.parentNode.removeChild(clonedInputEle);
  }
}



/**
 * @private
 */
@Directive({
  selector: '[next-input]'
})
export class NextInput {
  @Output() focused: EventEmitter<boolean> = new EventEmitter();

  @HostListener('focus')
  receivedFocus() {
    this.focused.emit(true);
  }

}