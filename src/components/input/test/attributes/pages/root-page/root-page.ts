import { Component, ViewChild } from '@angular/core';
import { TextInput } from '../../../../../../';

@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {

  input1Valid: boolean;
  input2Valid: boolean;

  @ViewChild('input1') input1: TextInput;

  ionViewDidEnter() {
    this.input1Valid = this.checkInput1();
  }

  checkInput1(): boolean {
    const nativeEle = <HTMLElement>this.input1._native.nativeElement;

    return testAttributes(nativeEle, {
      id: null,
      type: 'number',
      placeholder: 'Placeholder',
      name: 'holaa',
      min: '0',
      max: '10000',
      step: '2',
      autocomplete: 'on',
      autocorrect: 'on',
      autocapitalize: 'on',
      spellcheck: 'true',
      maxLength: '4',
      'aria-labelledby': 'lbl-0',
      readOnly: true,
      disabled: true
    });
  }
}

function testAttributes(ele: HTMLElement, attributes: any): boolean {
  for (let attr in attributes) {
    const expected = attributes[attr];
    const value = (<any>ele)[attr];

    if (expected === null) {
      if (ele.hasAttribute(attr) || value !== '') {
        console.error(`Element should NOT have "${attr}"`);
        return false;
      }
    } else {
      if (expected !== value && expected !== ele.getAttribute(attr)) {
        console.error(`Value "${attr}" does not match: ${expected} != ${value}`);
        return false;
      }
    }
  }
  return true;
}
