import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-inputs-test-page',
  templateUrl: './inputs-test-page.component.html',
  styleUrls: ['./inputs-test-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InputsTestPageComponent implements OnInit {
  ionTextInput = 'This is the Ionic Text Input';
  stdTextInput = 'This is the HTML Text Input';

  ionCheckbox = true;
  stdCheckbox = true;

  constructor() {}

  ngOnInit() {}

  onBlur(evt) {
    console.log('blur: ', evt);
  }

  change(evt) {
    console.log('change: ', evt);
  }
}
