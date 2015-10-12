import {ElementRef, Pipe, NgControl, Renderer, FORM_DIRECTIVES, NgIf, NgClass} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {ConfigComponent} from '../../config/decorators';

/**
 * @name Search Bar
 * @description
 * The Search Bar service adds an input field which can be used to search or filter items.
 *
 * @usage
 * ```html
 * <ion-search-bar ng-control="searchQuery"></ion-search-bar>
 * ```
 */
@ConfigComponent({
  selector: 'ion-search-bar',
  inputs: [
    'list',
    'model: ngModel'
  ],
  defaultInputs: {
    'showCancel': false,
    'cancelText': 'Cancel',
    'placeholder': 'Search',
    'cancelAction': function(event, model) {
      // The cancel button now works on its own to blur the input
      console.log('Default Cancel');
    }
  },
  template:
    '<div class="search-bar-input-container" [class.left-align]="shouldLeftAlign">' +
      '<div class="search-bar-search-icon"></div>' +
      '<input (focus)="inputFocused()" (blur)="inputBlurred()" ' +
      '(input)="inputChanged($event)" class="search-bar-input" type="search" [attr.placeholder]="placeholder" [(ng-model)]="model">' +
      '<button clear *ng-if="model" class="search-bar-close-icon" (click)="clearInput($event)"></button>' +
    '</div>' +
    '<button *ng-if="showCancel" (click)="cancelAction($event, model)" class="search-bar-cancel" [class.left-align]="shouldLeftAlign">{{cancelText}}</button>',
  directives: [FORM_DIRECTIVES, NgIf, NgClass]
})

export class SearchBar extends Ion {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} config  TODO
   */
  constructor(
    elementRef: ElementRef,
    config: IonicConfig,
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

    ngControl.valueAccessor = this;

    this.query = '';
  }

  // Add the margin for iOS
  afterViewInit() {
    this.cancelButton = this.elementRef.nativeElement.querySelector('.search-bar-cancel');

    if (this.cancelButton) {
      this.cancelWidth = this.cancelButton.offsetWidth;
      this.cancelButton.style.marginRight = "-" + this.cancelWidth + "px";
    }

    // If the user passes in a value to the model we should left align
    this.shouldLeftAlign = this.model && this.model.trim() != '';
  }

  /**
   * Much like ngModel, this is called from our valueAccessor for the attached
   * ControlDirective to update the value internally.
   */
  writeValue(value) {
    this.model = value;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  inputChanged(event) {
    this.onChange(event.target.value);
  }

  inputFocused() {
    this.isFocused = true;
    this.shouldLeftAlign = true;

    if (this.cancelButton) {
      this.cancelButton.style.marginRight = "0px";
    }
  }

  inputBlurred() {
    this.isFocused = false;
    this.shouldLeftAlign = this.model && this.model.trim() != '';

    if (this.cancelButton) {
      this.cancelButton.style.marginRight = "-" + this.cancelWidth + "px";
    }
  }

  clearInput(event) {
    this.model = '';
    this.onChange(this.model);
  }
}

/*
export class SearchPipe extends Pipe {
  constructor() {
    super();
    this.state = 0;
  }

  supports(newValue) {
    return true;
  }

  transform(value, ...args) {
    return value;
    //return `${value} state:${this.state ++}`;
  }

  create(cdRef) {
    return new SearchPipe(cdRef);
  }
}
*/
