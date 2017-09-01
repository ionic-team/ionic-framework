import { Component, Element, Event, EventEmitter, HostElement, Prop , State} from '@stencil/core';

import { Radio } from './radio';

import { isCheckedProperty } from '../../utils/helpers';

/**
 * @name RadioGroup
 * @description
 * A radio group is a group of [radio buttons](../RadioButton). It allows
 * a user to select at most one radio button from a set. Checking one radio
 * button that belongs to a radio group unchecks any previous checked
 * radio button within the same group.
 *
 * See the [Angular Forms Docs](https://angular.io/docs/ts/latest/guide/forms.html)
 * for more information on forms and inputs.
 *
 * @usage
 * ```html
 * <ion-list radio-group [(ngModel)]="autoManufacturers">
 *
 *   <ion-list-header>
 *     Auto Manufacturers
 *   </ion-list-header>
 *
 *   <ion-item>
 *     <ion-label>Cord</ion-label>
 *     <ion-radio value="cord"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Duesenberg</ion-label>
 *     <ion-radio value="duesenberg"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Hudson</ion-label>
 *     <ion-radio value="hudson"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Packard</ion-label>
 *     <ion-radio value="packard"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Studebaker</ion-label>
 *     <ion-radio value="studebaker"></ion-radio>
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 * @demo /docs/demos/src/radio/
 * @see {@link /docs/components#radio Radio Component Docs}
 * @see {@link ../RadioButton RadioButton API Docs}
*/
@Component({
  tag: 'ion-radio-group'
})
export class RadioGroup {
  radios: Radio[];

  @Element() el: HTMLElement;

  @State() activeId: string;
  @State() headerId: string;


  /**
   * @output {any} Emitted when the selected button has changed.
   */
  @Event() ionChange: EventEmitter;

  /*
   * @input {boolean} If true, the radios can be deselected. Default false.
   */
  @Prop() allowEmptySelection: boolean = false;

  /*
   * @input {boolean} If true, the user cannot interact with this element. Default false.
   */
  @Prop({ state: true }) disabled: boolean = false;

  /**
   * @input {string} the value of the radio.
   */
  @Prop({ state: true }) value: string;


  ionViewWillLoad() {
    let radioGroupId = ++radioGroupIds;
    let radioId = 0;

    const radios = this.el.querySelectorAll('ion-radio') as NodeListOf<HostElement>;

    for (var i = 0; i < radios.length; i++) {
      const radio = radios[i].$instance;

      if (radio) {
        radio.id = 'rb-' + radioGroupId + '-' + (++radioId);

        if (radio.checked) {
          this.activeId = radio.id;
        }
      } else {
      }
    }

    // Get the list header if it exists and set the id
    const header = this.el.querySelector('ion-list-header') as HostElement;

    if (header) {
      if (!header.id) {
        header.id = 'rg-hdr-' + radioGroupId;
      }
      this.headerId = header.id;
    }

  }


  /**
   * @hidden
   */
  update() {
    // loop through each of the radios
    let hasChecked = false;
    this.radios.forEach(radio => {

      // check this radiobutton if its value is
      // the same as the radiogroups value
      radio.checked = isCheckedProperty(this.value, radio.value) && !hasChecked;

      if (radio.checked) {
        // if this button is checked, then set it as
        // the radiogroup's active descendant
        this.activeId = radio.id;
        hasChecked = true;
      }
    });
  }

  hostData() {
    return {
      attrs: {
        'role': 'radiogroup',
        'aria-activedescendant': this.activeId,
        'aria-describedby': this.headerId
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}

let radioGroupIds = -1;
