import { Component, ViewChild } from '@angular/core';
import { MyCmpTest2 } from './my-component-two';

@Component({
  selector: 'my-cmp',
  template: `<my-cmp2></my-cmp2> <span style="color:green">{{value}}</span>`
})
export class MyCmpTest {

  @ViewChild(MyCmpTest2) _label: MyCmpTest2;

  label: MyCmpTest2;
  value: string = 'Test Failed';

  ngOnInit() {
    this.label = this._label;
  }
}
