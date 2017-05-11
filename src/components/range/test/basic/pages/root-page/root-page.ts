import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Range } from '../../../../../..';

@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  singleValue: number;
  singleValue2: number = 150;
  singleValue3: number = 64;
  singleValue4: number = 1300;
  dualValue: any;
  dualValue2 = {lower: 33, upper: 60};

  rangeCtrl = new FormControl({value: '66', disabled: true});
  dualRangeCtrl = new FormControl({value: {lower: 33, upper: 60}, disabled: true});

  rangeForm = new FormGroup({
    'range': this.rangeCtrl,
    'dualRange': this.dualRangeCtrl
  });

  rangeChange(range: Range) {
    console.log(`range, change, ratio: ${range.ratio}, value: ${range.value}`);
  }

}
