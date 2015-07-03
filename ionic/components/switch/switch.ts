import {ElementRef} from 'angular2/angular2';
import {ControlGroup, ControlDirective} from 'angular2/forms';

import {IonicComponent, IonicView} from '../../config/annotations';


@IonicComponent({
  selector: 'ion-switch',
  properties: [
    'checked'
  ],
  host: {
    '(click)': 'switchClicked($event)'
  }
})
@IonicView({
  template: `
  <div class="item-content">
    <div class="item-title">
      <content></content>
    </div>
    <div class="item-media media-switch">
      <div class="switch-toggle"></div>
    </div>
  </div>`
})
export class Switch {
  constructor(
    elementRef: ElementRef,
    cd: ControlDirective
  ) {
    this.ele = elementRef.nativeElement
    this.config = Switch.config.invoke(this)
    this.controlDirective = cd;
    cd.valueAccessor = this;

    // TODO: These are temporary until we figure out what to do
    // with @PropertSetter
    //let setAriaRole = (v) => { this.ele.setAttribute('aria-role', v) }
    //let setAriaChecked = (v) => { this.ele.setAttribute('aria-checked', v) }
    //let setAriaInvalid = (v) => { this.ele.setAttribute('aria-invalid', v) }
    //let setAriaDisabled = (v) => { this.ele.setAttribute('aria-disabled', v) }

    //let setChecked = (v) => this.ele.setAttribute('checked', v);

    this.ele.classList.add('item')

    // TODO: These rely on the commented-out PropertySetter's above
    //setAriaRole('checkbox')
    //setInvalid('false')
    //setDisabled('false')
    //this.setCheckedProperty = setAriaChecked
  }

  /**
   * Much like ngModel, this is called from our valueAccessor for the attached
   * ControlDirective to update the value internally.
   */
  writeValue(value) {
    // Convert it to a boolean
    this.checked = !!value;
  }

  set checked(checked) {
    this._checked = checked
    //this.setCheckedProperty(checked)
    this.controlDirective._control().updateValue(this._checked);
  }

  get checked() {
    return this._checked
  }

  switchClicked(event) {
    this.checked = !this.checked;
  }
}
