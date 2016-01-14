import {Directive, Attribute, ElementRef, Renderer, Input, Output, EventEmitter, HostListener} from 'angular2/core';

import {CSS, hasFocus}  from '../../util/dom';


/**
 * @private
 */
@Directive({
  selector: 'textarea,input[type=text],input[type=password],input[type=number],input[type=search],input[type=email],input[type=url],input[type=tel],input[type=date],input[type=datetime],input[type=datetime-local],input[type=week],input[type=time]',
  host: {
    'class': 'text-input'
  }
})
export class TextInput {
  @Input() value: string;
  @Input() ngModel: any;
  @Output() valueChange: EventEmitter<string> = new EventEmitter();
  @Output() focusChange: EventEmitter<boolean> = new EventEmitter();
  public type: string;
  private _relocated: boolean;

  constructor(
    @Attribute('type') type: string,
    private _elementRef: ElementRef,
    private _renderer: Renderer
  ) {
    this.type = type || 'text';
  }

  ngOnInit() {
    if (this.ngModel) {
      this.value = this.ngModel;
    } else {
      this.value = this._elementRef.nativeElement.value;
    }
  }

  @HostListener('keyup', ['$event'])
  _keyup(ev) {
    this.valueChange.emit(ev.target.value);
  }

  @HostListener('focus')
  _focus() {
    this.focusChange.emit(true);
  }

  @HostListener('blur')
  _blur() {
    this.focusChange.emit(false);
    this.hideFocus(false);
  }

  labelledBy(val) {
    this._renderer.setElementAttribute(this._elementRef, 'aria-labelledby', val);
  }

  setFocus() {
    this.element().focus();
  }

  relocate(shouldRelocate: boolean, inputRelativeY?) {
    if (this._relocated !== shouldRelocate) {

      let focusedInputEle = this.element();
      if (shouldRelocate) {
        let clonedInputEle = cloneInput(focusedInputEle, 'cloned-input');

        focusedInputEle.classList.add('hide-focused-input');
        focusedInputEle.style[CSS.transform] = `translate3d(-9999px,${inputRelativeY}px,0)`;
        focusedInputEle.parentNode.insertBefore(clonedInputEle, focusedInputEle);

        this.setFocus();

      } else {
        focusedInputEle.classList.remove('hide-focused-input');
        focusedInputEle.style[CSS.transform] = '';
        let clonedInputEle = focusedInputEle.parentNode.querySelector('.cloned-input');
        if (clonedInputEle) {
          clonedInputEle.parentNode.removeChild(clonedInputEle);
        }
      }

      this._relocated = shouldRelocate;
    }
  }

  hideFocus(shouldHideFocus) {
    let focusedInputEle = this.element();

    if (shouldHideFocus) {
      let clonedInputEle = cloneInput(focusedInputEle, 'cloned-hidden');

      focusedInputEle.classList.add('hide-focused-input');
      focusedInputEle.style[CSS.transform] = 'translate3d(-9999px,0,0)';
      focusedInputEle.parentNode.insertBefore(clonedInputEle, focusedInputEle);

    } else {
      focusedInputEle.classList.remove('hide-focused-input');
      focusedInputEle.style[CSS.transform] = '';
      let clonedInputEle = focusedInputEle.parentNode.querySelector('.cloned-hidden');
      if (clonedInputEle) {
        clonedInputEle.parentNode.removeChild(clonedInputEle);
      }
    }
  }

  hasFocus() {
    return hasFocus(this.element());
  }

  addClass(className) {
    this._renderer.setElementClass(this._elementRef, className, true);
  }

  hasClass(className) {
    this._elementRef.nativeElement.classList.contains(className);
  }

  element() {
    return this._elementRef.nativeElement;
  }

}

function cloneInput(srcInput, addCssClass) {
  let clonedInputEle = srcInput.cloneNode(true);
  clonedInputEle.classList.add(addCssClass);
  clonedInputEle.classList.remove('hide-focused-input');
  clonedInputEle.setAttribute('aria-hidden', true);
  clonedInputEle.removeAttribute('aria-labelledby');
  clonedInputEle.tabIndex = -1;
  return clonedInputEle;
}
