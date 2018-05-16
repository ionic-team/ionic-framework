import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-basic-inputs-page',
  templateUrl: './basic-inputs-page.component.html',
  encapsulation: ViewEncapsulation.None
})
export class BasicInputsPageComponent {
  disableInputs = false;

  datetimeValue = '2017-11-18T14:17:45-06:00';
  textareaValue = 'This is the Textarea Input';
  textValue = 'This is the Text Input';
  numericValue = 1138;
  selectValue = 'pineapple';

  checkboxValue = true;
  toggleValue = false;

  rangeValue = 15;

  searchValue: string;

  typeOf(v: any): string {
    return typeof v;
  }
}
