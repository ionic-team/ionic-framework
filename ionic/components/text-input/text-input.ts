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
  private _relocated: boolean;

  type: string;

  @Input() ngModel;
  @Input() value: string;
  @Output() focusChange: EventEmitter<boolean> = new EventEmitter();
  @Output() valueChange: EventEmitter<string> = new EventEmitter();

  constructor(
    @Attribute('type') type: string,
    private _elementRef: ElementRef,
    private _renderer: Renderer
  ) {
    this.type = type || 'text';
  }

  /**
   * @private
   */
  ngOnInit() {
    if (this.ngModel) {
      this.value = this.ngModel;
    } else {
      this.value = this._elementRef.nativeElement.value;
    }
  }

  /**
   * @private
   */
  @HostListener('keyup', ['$event'])
  private _keyup(ev) {
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

  /**
   * @private
   */
  setFocus() {
    this.element().focus();
  }

  /**
   * @private
   */
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
        let clonedInputEle = focusedInputEle.parentElement.querySelector('.cloned-input');
        if (clonedInputEle) {
          clonedInputEle.parentNode.removeChild(clonedInputEle);
        }
      }

      this._relocated = shouldRelocate;
    }
  }

  /**
   * @private
   */
  hideFocus(shouldHideFocus: boolean) {
    let focusedInputEle = this.element();

    if (shouldHideFocus) {
      let clonedInputEle = cloneInput(focusedInputEle, 'cloned-hidden');

      focusedInputEle.classList.add('hide-focused-input');
      focusedInputEle.style[CSS.transform] = 'translate3d(-9999px,0,0)';
      focusedInputEle.parentNode.insertBefore(clonedInputEle, focusedInputEle);

    } else {
      focusedInputEle.classList.remove('hide-focused-input');
      focusedInputEle.style[CSS.transform] = '';
      let clonedInputEle = focusedInputEle.parentElement.querySelector('.cloned-hidden');
      if (clonedInputEle) {
        clonedInputEle.parentNode.removeChild(clonedInputEle);
      }
    }
  }

  hasFocus(): boolean {
    return hasFocus(this.element());
  }

  /**
   * @private
   */
  addClass(className: string) {
    this._renderer.setElementClass(this._elementRef.nativeElement, className, true);
  }

  hasClass(className): boolean {
    return this._elementRef.nativeElement.classList.contains(className);
  }

  /**
   * @private
   */
  element(): HTMLElement {
    return this._elementRef.nativeElement;
  }

}

function cloneInput(srcInput, addCssClass: string) {
  let clonedInputEle = srcInput.cloneNode(true);
  clonedInputEle.classList.add(addCssClass);
  clonedInputEle.classList.remove('hide-focused-input');
  clonedInputEle.setAttribute('aria-hidden', true);
  clonedInputEle.removeAttribute('aria-labelledby');
  clonedInputEle.tabIndex = -1;
  return clonedInputEle;
}
