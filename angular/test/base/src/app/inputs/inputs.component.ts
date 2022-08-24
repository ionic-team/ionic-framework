import { Component } from '@angular/core';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
})
export class InputsComponent {

  datetime = '1994-03-15';
  input = 'some text';
  checkbox = true;
  toggle = true;
  select = 'nes';
  range = 10;
  changes = 0;

  setValues() {
    console.log('set values');
    this.datetime = '1994-03-15';
    this.input = 'some text';
    this.checkbox = true;
    this.toggle = true;
    this.select = 'nes';
    this.range = 10;
  }

  resetValues() {
    console.log('reset values');
    this.datetime = undefined;
    this.input = undefined;
    this.checkbox = false;
    this.toggle = false;
    this.select = undefined;
    this.range = undefined;
  }
  counter() {
    this.changes++;
    return Math.floor(this.changes / 2);
  }
}
