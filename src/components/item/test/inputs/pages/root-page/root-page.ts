import { Component } from '@angular/core';

@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  disabled = false;
  datetime = '2016-12-09';
  toggle = true;
  select = 'n64';
  text = 'Text';
  checkbox = true;
  range = 10;

  boolDisabled(): boolean {
    return this.disabled;
  }

  strDisabled(): string {
    return this.disabled + '';
  }
}
