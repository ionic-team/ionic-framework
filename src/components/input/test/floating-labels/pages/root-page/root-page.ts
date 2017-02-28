import { Component } from '@angular/core';

@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  myParam = '';
  minValue = 8;
  maxValue = 12;
  stepValue = 2;

  myValues = {
    value1: 'Dynamic Input',
    value2: 'Dynamic Textarea'
  };

  toggleValues() {
    this.minValue === 8 ? this.minValue = 4 : this.minValue = 8;
    this.maxValue === 12 ? this.maxValue = 20 : this.maxValue = 12;
    this.stepValue === 2 ? this.stepValue = 4 : this.stepValue = 2;
  }
}
