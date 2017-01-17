import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IonicApp, IonicModule, Range } from '../../../../../ionic-angular';


@Component({
  templateUrl: 'page1.html'
})
export class Page1 {
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

@Component({
  templateUrl: 'main.html'
})
export class E2EApp {
  rootPage = Page1;
}

@NgModule({
  declarations: [
    E2EApp,
    Page1
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    Page1
  ]
})
export class AppModule {}
