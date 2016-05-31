import {App, Page} from '../../../../../src';


@Page({
  templateUrl: 'page1.html'
})
class Page1 {
  singleValue: number;
  singleValue2: number = 150;
  singleValue3: number = 64;
  singleValue4: number = 1300;
  dualValue: any;
  dualValue2 = {lower: 33, upper: 60};

  rangeChange(ev) {
    console.log(`range, change, ratio: ${ev.ratio}, value: ${ev.value}`);
  }

}


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  rootPage = Page1;
}
