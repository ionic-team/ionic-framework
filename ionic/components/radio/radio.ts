import {ElementRef, Host, Optional, NgControl, Query, QueryList} from 'angular2/angular2';

import {IonicDirective, IonicComponent, IonicView} from '../../config/annotations';
import {IonicConfig} from '../../config/config';
import {Ion} from '../ion';
import {TapClick} from '../button/button';
import {ListHeader} from '../list/list';

/**
 * A radio group component.
 */
@IonicDirective({
  selector: 'ion-radio-group',
  host: {
    'class': 'list',
    'role': 'radiogroup',
    '[attr.aria-activedescendant]': 'activeId',
    '[attr.aria-describedby]': 'describedById'
  }
})
export class RadioGroup extends Ion {
  radios: Array<RadioButton> = [];

  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} config  TODO
   * @param {NgControl=} ngControl  TODO
   * @param {QueryList<ListHeader>} headerQuery  TODO
   */
  constructor(
    elementRef: ElementRef,
    config: IonicConfig,
    @Optional() ngControl: NgControl,
    @Query(ListHeader) private headerQuery: QueryList<ListHeader>
  ) {
    super(elementRef, config);
    this.id = ++radioGroupIds;
    this.radioIds = -1;
    this.onChange = (_) => {};
    this.onTouched = (_) => {};

    if (ngControl) ngControl.valueAccessor = this;
  }

  onInit() {
    let header = this.headerQuery.first;
    if (header) {
      if (!header.id) {
        header.id = 'radio-header-' + this.id;
      }
      this.describedById = header.id;
    }
  }

  /**
   * Register the specified radio button with the radio group.
   * @param {RadioButton} radio  The radio button to register.
   */
  registerRadio(radio) {
    radio.id = radio.id || ('radio-' + this.id + '-' + (++this.radioIds));
    this.radios.push(radio);

    if (radio.checked) {
      this.value = radio.value;
      this.activeId = radio.id;
    }
  }

  /**
   * Update which radio button in the group is checked, unchecking all others.
   * @param {RadioButton} checkedRadio  The radio button to check.
   */
  update(checkedRadio) {
    this.value = checkedRadio.value;
    this.activeId = checkedRadio.id;

    for (let radio of this.radios) {
      radio.checked = (radio === checkedRadio);
    }

    this.onChange(this.value);
  }

  /**
   * @private
   * Angular2 Forms API method called by the model (Control) on change to update
   * the checked value.
   * https://github.com/angular/angular/blob/master/modules/angular2/src/forms/directives/shared.ts#L34
   */
  writeValue(value) {
    this.value = value;
    for (let radio of this.radios) {
      radio.checked = (radio.value == value);
    }
  }

  /**
   * @private
   * Angular2 Forms API method called by the view (NgControl) to register the
   * onChange event handler that updates the model (Control).
   * https://github.com/angular/angular/blob/master/modules/angular2/src/forms/directives/shared.ts#L27
   * @param {Function} fn  the onChange event handler.
   */
  registerOnChange(fn) { this.onChange = fn; }

  /**
   * @private
   * Angular2 Forms API method called by the the view (NgControl) to register
   * the onTouched event handler that marks the model (Control) as touched.
   * @param {Function} fn  onTouched event handler.
   */
  registerOnTouched(fn) { this.onTouched = fn; }
}

/**
 * A radio button component.
 */
@IonicComponent({
  selector: 'ion-radio',
  properties: [
    'value',
    'checked',
    'disabled',
    'id'
  ],
  host: {
    'class': 'item',
    'role': 'radio',
    '[attr.id]': 'id',
    '[attr.tab-index]': 'tabIndex',
    '[attr.aria-checked]': 'checked',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-labelledby]': 'labelId',
    '(^click)': 'click($event)'
  }
})
@IonicView({
  template:
  '<ion-item-content id="{{labelId}}">' +
    '<ng-content></ng-content>' +
  '</ion-item-content>' +
  '<div item-right class="item-media media-radio">' +
    '<div class="radio-icon"></div>' +
  '</div>'
})
export class RadioButton extends Ion {
  /**
   * Radio button constructor.
   * @param {RadioGroup=} group  The parent radio group, if any.
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} config  TODO
   * @param {TapClick} tapClick  TODO
   */
  constructor(
    @Host() @Optional() group: RadioGroup,
    elementRef: ElementRef,
    config: IonicConfig,
    tapClick: TapClick
  ) {
    super(elementRef, config);
    this.tapClick = tapClick;
    this.group = group;
    this.tabIndex = 0;
  }

  onInit() {
    super.onInit();
    this.group.registerRadio(this);
    this.labelId = 'label-' + this.id;
  }

  click(ev) {
    if (this.tapClick.allowClick(ev)) {
      ev.preventDefault();
      ev.stopPropagation();
      this.check();
    }
  }

  /**
   * Update the checked state of this radio button.
   * TODO: Call this toggle? Since unchecks as well
   */
  check() {
    this.checked = !this.checked;
    this.group.update(this);
  }

}

let radioGroupIds = -1;
