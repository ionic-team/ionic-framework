import { Component } from '@angular/core';
import { ionicBootstrap, Range } from '../../../../../src';


@Component({
  templateUrl: 'page1.html'
})
class Page1 {
  singleValue: number;
  singleValue2: number = 150;
  singleValue3: number = 64;
  singleValue4: number = 1300;
  dualValue: any;
  dualValue2 = {lower: 33, upper: 60};

  rangeChange(range: Range) {
    console.log(`range, change, ratio: ${range.ratio}, value: ${range.value}`);
  }

}

@Component({
  templateUrl: 'main.html'
})
class E2EApp {
  rootPage = Page1;
}

ionicBootstrap(E2EApp);
