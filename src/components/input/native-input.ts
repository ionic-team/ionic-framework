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
  @Output() keydown: EventEmitter<string> = new EventEmitter<string>();

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

  @HostListener('keydown', ['$event'])
  _keyDown(ev: any) {
    if (ev) {
      ev.target && this.keydown.emit(ev.target.value);
    }
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
      console.debug(`native-input, blurring enabled`);

      document.addEventListener('touchend', docTouchEnd, true);
      self._unrefBlur = function() {
        console.debug(`native-input, blurring disabled`);
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
      const focusedInputEle = this.element();
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
          cloneInputComponent(focusedInputEle);

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

      } else {
        // should remove the focus
        if (this._clone) {
          // should remove the cloned node
          removeClone(focusedInputEle);
        }
      }

      this._relocated = shouldFocus;
    }
  }

  hideFocus(shouldHideFocus: boolean) {
    let focusedInputEle = this.element();

    console.debug(`native-input, hideFocus, shouldHideFocus: ${shouldHideFocus}, input value: ${focusedInputEle.value}`);

    if (shouldHideFocus) {
      cloneInputComponent(focusedInputEle);
      focusedInputEle.style.transform = 'scale(0)';

    } else {
      removeClone(focusedInputEle);
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

function cloneInputComponent(srcNativeInputEle: HTMLInputElement) {
  // given a native <input> or <textarea> element
  // find its parent wrapping component like <ion-input> or <ion-textarea>
  // then clone the entire component
  const srcComponentEle = <HTMLElement>srcNativeInputEle.closest('ion-input,ion-textarea');
  if (srcComponentEle) {
    // DOM READ
    const srcTop = srcComponentEle.offsetTop;
    const srcLeft = srcComponentEle.offsetLeft;
    const srcWidth = srcComponentEle.offsetWidth;
    const srcHeight = srcComponentEle.offsetHeight;

    // DOM WRITE
    // not using deep clone so we don't pull in unnecessary nodes
    const clonedComponentEle = <HTMLElement>srcComponentEle.cloneNode(false);
    clonedComponentEle.classList.add('cloned-input');
    clonedComponentEle.setAttribute('aria-hidden', 'true');
    clonedComponentEle.style.pointerEvents = 'none';
    clonedComponentEle.style.position = 'absolute';
    clonedComponentEle.style.top = srcTop + 'px';
    clonedComponentEle.style.left = srcLeft + 'px';
    clonedComponentEle.style.width = srcWidth + 'px';
    clonedComponentEle.style.height = srcHeight + 'px';

    const clonedNativeInputEle = <HTMLInputElement>srcNativeInputEle.cloneNode(false);
    clonedNativeInputEle.value = srcNativeInputEle.value;
    clonedNativeInputEle.tabIndex = -1;

    clonedComponentEle.appendChild(clonedNativeInputEle);
    srcComponentEle.parentNode.appendChild(clonedComponentEle);

    srcComponentEle.style.pointerEvents = 'none';
  }

  srcNativeInputEle.style.transform = 'scale(0)';
}

function removeClone(srcNativeInputEle: HTMLElement) {
  const srcComponentEle = <HTMLElement>srcNativeInputEle.closest('ion-input,ion-textarea');
  if (srcComponentEle && srcComponentEle.parentElement) {
    const clonedInputEles = srcComponentEle.parentElement.querySelectorAll('.cloned-input');
    for (var i = 0; i < clonedInputEles.length; i++) {
      clonedInputEles[i].parentNode.removeChild(clonedInputEles[i]);
    }

    srcComponentEle.style.pointerEvents = '';
  }
  srcNativeInputEle.style.transform = '';
  srcNativeInputEle.style.opacity = '';
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
