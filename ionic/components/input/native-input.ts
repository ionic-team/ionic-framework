import {Directive, Attribute, ElementRef, Renderer, Input, Output, EventEmitter, HostListener} from 'angular2/core';
import {NgControl} from 'angular2/common';

import {Config} from '../../config/config';
import {CSS, hasFocus, raf}  from '../../util/dom';


/**
 * @private
 */
@Directive({
  selector: '.text-input'
})
export class NativeInput {
  private _relocated: boolean;
  private _clone: boolean;

  @Output() focusChange: EventEmitter<boolean> = new EventEmitter();
  @Output() valueChange: EventEmitter<string> = new EventEmitter();

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    config: Config,
    public ngControl: NgControl
  ) {
    this._clone = config.getBoolean('inputCloning', false);
  }

  @HostListener('input', ['$event'])
  private _change(ev) {
    this.valueChange.emit(ev.target.value);
  }

  @HostListener('focus')
  private _focus() {
    this.focusChange.emit(true);
  }

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

  setFocus() {
    // let's set focus to the element
    // but only if it does not already have focus
    if (document.activeElement !== this.element()) {
      this.element().focus();
    }
  }

  beginFocus(shouldFocus: boolean, inputRelativeY: number) {
    if (this._relocated !== shouldFocus) {
      var focusedInputEle = this.element();
      if (shouldFocus) {
        // we should focus into this element

        if (this._clone) {
          // this platform needs the input to be cloned
          // this allows for the actual input to receive the focus from
          // the user's touch event, but before it receives focus, it
          // moves the actual input to a location that will not screw
          // up the app's layout, and does not allow the native browser
          // to attempt to scroll the input into place (messing up headers/footers)
          // the cloned input fills the area of where native input should be
          // while the native input fakes out the browser by relocating itself
          // before it receives the actual focus event
          var clonedInputEle = cloneInput(focusedInputEle, 'cloned-focus');
          focusedInputEle.parentNode.insertBefore(clonedInputEle, focusedInputEle);

          // move the native input to a location safe to receive focus
          // according to the browser, the native input receives focus in an
          // area which doesn't require the browser to scroll the input into place
          focusedInputEle.style[CSS.transform] = `translate3d(-9999px,${inputRelativeY}px,0)`;
          focusedInputEle.style.opacity = '0';
        }

        // let's now set focus to the actual native element
        // at this point it is safe to assume the browser will not attempt
        // to scroll the input into view itself (screwing up headers/footers)
        this.setFocus();

        if (this._clone) {
          focusedInputEle.classList.add('cloned-active');
        }

      } else {
        // should remove the focus
        if (this._clone) {
          // should remove the cloned node
          focusedInputEle.classList.remove('cloned-active');
          focusedInputEle.style[CSS.transform] = '';
          focusedInputEle.style.opacity = '';
          removeClone(focusedInputEle, 'cloned-focus');
        }
      }

      this._relocated = shouldFocus;
    }
  }

  hideFocus(shouldHideFocus: boolean) {
    let focusedInputEle = this.element();

    console.debug(`native input hideFocus, shouldHideFocus: ${shouldHideFocus}, input value: ${focusedInputEle.value}`);

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
  clonedInputEle.style.height = focusedInputEle.offsetHeight + 'px';
  clonedInputEle.value = focusedInputEle.value;
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
    console.debug('native-input, next-input received focus');
    this.focused.emit(true);
  }

}