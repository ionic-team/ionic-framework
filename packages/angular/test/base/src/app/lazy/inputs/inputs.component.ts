import { Component } from '@angular/core';

@Component({
    selector: 'app-inputs',
    templateUrl: './inputs.component.html',
    standalone: false
})
export class InputsComponent {

  datetime? = '1994-03-15';
  input? = 'some text';
  inputOtp? = '1234';
  checkbox = true;
  radio? = 'nes';
  toggle = true;
  select? = 'nes';
  changes = 0;
  range? = 50;

  setValues() {
    console.log('set values');
    this.datetime = '1994-03-15';
    this.input = 'some text';
    this.inputOtp = '1234';
    this.checkbox = true;
    this.radio = 'nes';
    this.toggle = true;
    this.select = 'nes';
    this.range = 50;
  }

  resetValues() {
    console.log('reset values');
    this.datetime = undefined;
    this.input = undefined;
    this.inputOtp = undefined;
    this.checkbox = false;
    this.radio = undefined;
    this.toggle = false;
    this.select = undefined;
    this.range = undefined;
  }

  counter() {
    this.changes++;
    return Math.floor(this.changes / 2);
  }
}
