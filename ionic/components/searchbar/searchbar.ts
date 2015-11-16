import {ElementRef, Pipe, NgControl, Renderer, FORM_DIRECTIVES, NgIf, NgClass} from 'angular2/angular2';

import {Ion} from '../ion';
import {Config} from '../../config/config';
import {ConfigComponent} from '../../config/decorators';
import {Icon} from '../icon/icon';

/**
 * @description
 * The Search Bar service adds an input field which can be used to search or filter items.
 *
 * @usage
 * ```html
 * <ion-searchbar ng-control="searchQuery"></ion-searchbar>
 * ```
 */
@ConfigComponent({
  selector: 'ion-searchbar',
  defaultInputs: {
    'showCancel': false,
    'cancelText': 'Cancel',
    'placeholder': 'Search',
    'cancelAction': function(event, query) {
      this.element = this.elementRef.nativeElement.querySelector('input');
      this.element.blur();
      this.clearInput();
    }
  },
  host: {
   '[class.left-align]': 'shouldLeftAlign',
   '[class.focused]': 'isFocused',
  },
  template:
    '<div class="searchbar-input-container">' +
      '<button (click)="cancelAction($event, query)" clear dark class="searchbar-cancel-icon"><icon arrow-back></icon></button>' +
      '<div class="searchbar-search-icon"></div>' +
      '<input [(value)]="query" (focus)="inputFocused()" (blur)="inputBlurred()" ' +
      '(input)="inputChanged($event)" class="searchbar-input" type="search" [attr.placeholder]="placeholder">' +
      '<button clear *ng-if="query" class="searchbar-close-icon" (click)="clearInput($event)"></button>' +
    '</div>' +
    '<button *ng-if="showCancel" (click)="cancelAction($event, query)" class="searchbar-cancel">{{cancelText}}</button>',
  directives: [FORM_DIRECTIVES, NgIf, NgClass, Icon]
})
export class SearchBar extends Ion {
  /**
   * @private
   */
  query: string;

  constructor(
    elementRef: ElementRef,
    config: Config,
    ngControl: NgControl,
    renderer: Renderer
  ) {
    super(elementRef, config);
    this.renderer = renderer;
    this.elementRef = elementRef;
    if(!ngControl) {
      // They don't want to do anything that works, so we won't do anything that breaks
      return;
    }

    this.ngControl = ngControl;
    this.ngControl.valueAccessor = this;
  }

  /**
   * @private
   */
  afterViewInit() {
    this.cancelButton = this.elementRef.nativeElement.querySelector('.searchbar-cancel');

    if (this.cancelButton) {
      this.cancelWidth = this.cancelButton.offsetWidth;
      this.cancelButton.style.marginRight = "-" + this.cancelWidth + "px";
    }

    // If the user passes in a value to the model we should left align
    this.shouldLeftAlign = this.ngControl.value && this.ngControl.value.trim() != '';
    this.query = this.ngControl.value || '';
  }

  /**
   * @private
   * Much like ngModel, this is called from our valueAccessor for the attached
   * ControlDirective to update the value internally.
   */
  writeValue(value) {
    this.query = value;
  }

  /**
   * @private
   */
  registerOnChange(fn) {
    this.onChange = fn;
  }

  /**
   * @private
   */
  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  /**
   * @private
   */
  inputChanged(event) {
    this.writeValue(event.target.value);
    this.onChange(event.target.value);
  }

  /**
   * @private
   */
  inputFocused() {
    this.isFocused = true;
    this.shouldLeftAlign = true;

    if (this.cancelButton) {
      this.cancelButton.style.marginRight = "0px";
    }
  }

  /**
   * @private
   */
  inputBlurred() {
    this.isFocused = false;
    this.shouldLeftAlign = this.ngControl.value && this.ngControl.value.trim() != '';

    if (this.cancelButton) {
      this.cancelButton.style.marginRight = "-" + this.cancelWidth + "px";
    }
  }

  clearInput(event) {
    this.writeValue('');
    this.onChange('');
  }
}
