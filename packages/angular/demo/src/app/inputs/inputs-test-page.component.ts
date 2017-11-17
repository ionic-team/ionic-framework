import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-inputs-test-page',
  templateUrl: './inputs-test-page.component.html',
  styleUrls: ['./inputs-test-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InputsTestPageComponent implements OnInit {
  textareaValue = 'This is the Textarea Input';
  textValue = 'This is the Text Input';

  checkboxValue = true;
  toggleValue = false;

  selectValue = 'brains';

  constructor() {}

  ngOnInit() {}

  onBlur(evt) {
    console.log('blur: ', evt);
  }

  change(evt) {
    console.log('change: ', evt);
  }
}
