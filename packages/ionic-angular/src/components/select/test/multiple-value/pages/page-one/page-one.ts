import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IonicPage } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  toppings: Array<string>;
  carFeatures: Array<string>;
  pets: Array<string>;
  petOptions: Array<{text: string, value: string}>;
  authForm: FormGroup;
  status: string;

  constructor() {
    this.toppings = ['bacon', 'xcheese'];
    this.carFeatures = [];
    this.pets = ['cat', 'dog'];
    this.petOptions = [
      { text: 'Bird', value: 'bird' },
      { text: 'Cat', value: 'cat' },
      { text: 'Dog', value: 'dog' },
      { text: 'Honey Badger', value: 'honeybadger' },
      { text: 'Pig', value: 'pig' },
    ];
    this.status = 'selected';

    this.authForm = new FormGroup({
      name: new FormControl(''),
      select: new FormControl([1, '3'])
    });
  }

  carChange(selectedValues: any) {
    console.log('carChange', selectedValues);
  }

  onSubmit(data: any) {
    console.log('onSubmit', data);
  }

  toppingsSelect(selectedValue: any) {
    console.log('Selected', selectedValue);
  }

}
