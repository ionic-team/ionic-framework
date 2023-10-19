import { Component } from '@angular/core';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
})
export class InputsComponent {

  datetime? = '1994-03-15';
  input? = 'some text';
  checkbox = true;
  radio = 'nes';
  toggle = true;
  select? = 'nes';
  changes = 0;

  setValues() {
    console.log('set values');
    this.datetime = '1994-03-15';
    this.input = 'some text';
    this.checkbox = true;
    this.radio = 'nes';
    this.toggle = true;
    this.select = 'nes';
  }

  resetValues() {
    console.log('reset values');
    this.datetime = undefined;
    this.input = undefined;
    this.checkbox = false;
    this.radio = undefined;
    this.toggle = false;
    this.select = undefined;
  }

  counter() {
    this.changes++;
    return Math.floor(this.changes / 2);
  }
}
