import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer } from '@angular/core';
import { NgControl } from '@angular/forms';

import { Config } from '../../config/config';
import { CSS, hasFocus }  from '../../util/dom';


/**
 * @private
 */
@Directive({
  selector: '.text-input'
})
export class NativeInput {
  _relocated: boolean;
  _clone: boolean;
  _blurring: boolean;
  _unrefBlur: Function;

  @Output() focusChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    public _elementRef: ElementRef,
    public _renderer: Renderer,
    config: Config,
    public ngControl: NgControl
  ) {
    this._clone = config.getBoolean('inputCloning', false);
    this._blurring = config.getBoolean('inputBlurring', false);
  }

  @HostListener('input', ['$event'])
  _change(ev: any) {
    this.valueChange.emit(ev.target.value);
  }

  @HostListener('focus')
  _focus() {
    var self = this;

    self.focusChange.emit(true);

    function docTouchEnd(ev: TouchEvent) {
      var tapped = <HTMLElement>ev.target;
      if (tapped && self.element()) {
        if (tapped.tagName !== 'INPUT' && tapped.tagName !== 'TEXTAREA' && !tapped.classList.contains('input-cover')) {
          self.element().blur();
        }
      }
    }

    if (self._blurring) {
      // automatically blur input if:
      // 1) this input has focus
      // 2) the newly tapped document element is not an input
      console.debug('input blurring enabled');

      document.addEventListener('touchend', docTouchEnd, true);
      self._unrefBlur = function() {
        console.debug('input blurring disabled');
        document.removeEventListener('touchend', docTouchEnd, true);
      };
    }
  }

  @HostListener('blur')
  _blur() {
    this.focusChange.emit(false);
    this.hideFocus(false);

    this._unrefBlur && this._unrefBlur();
    this._unrefBlur = null;
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
          (<any>focusedInputEle.style)[CSS.transform] = `translate3d(-9999px,${inputRelativeY}px,0)`;
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
          (<any>focusedInputEle.style)[CSS.transform] = '';
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

  setElementClass(cssClass: string, shouldAdd: boolean) {
    this._renderer.setElementClass(this._elementRef.nativeElement, cssClass, shouldAdd);
  }

  element(): HTMLInputElement {
    return this._elementRef.nativeElement;
  }

  ngOnDestroy() {
    this._unrefBlur && this._unrefBlur();
  }

}

function cloneInput(focusedInputEle: any, addCssClass: string) {
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

function removeClone(focusedInputEle: any, queryCssClass: string) {
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
  @Output() focused: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('focus')
  receivedFocus() {
    console.debug('native-input, next-input received focus');
    this.focused.emit(true);
  }

}
