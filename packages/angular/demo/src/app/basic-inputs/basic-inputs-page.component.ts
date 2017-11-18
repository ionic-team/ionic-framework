import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-basic-inputs-page',
  templateUrl: './basic-inputs-page.component.html',
  styleUrls: ['./basic-inputs-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BasicInputsPageComponent implements OnInit {
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
