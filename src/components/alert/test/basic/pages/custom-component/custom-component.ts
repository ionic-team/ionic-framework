import { Component } from '@angular/core';
import { IonicPage, NavParams } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'custom-component.html'
})
export class CustomInnerComponent {
    kind: string
    selectedValue: string

    constructor(navParams: NavParams) {
        this.kind = navParams.get('kind')
        this.selectedValue = navParams.get('val')
    }

    validValues() {
      if(this.kind === 'fruits')
        return ['Apple', 'Banana', 'Pear'];

      return ['one', 'two', 'three'];
    }
}
