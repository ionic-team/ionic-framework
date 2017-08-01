import { Component } from '@angular/core';
import { TextInput } from '../../../../../../';

@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  ngvalue1: any;
  ngvalue2: any;
  value2: any;
  value3: any;
  value4: any;
  value5: any;
  value6: any;

  input2() {
    this.value2 = this.ngvalue2;
    console.log('value2', this.value2);
  }

  input3(ref: TextInput) {
    this.value3 = ref.value;
    console.log('value3', this.value3);
  }

  input4(value: string) {
    this.value4 = value;
    console.log('value4', this.value4);
  }

  input5(ev: any) {
    this.value5 = ev.target.value;
    console.log('value5', this.value5);
  }

  input6(value: string) {
    this.value6 = value;
    console.log('value6', this.value6);
  }
}
