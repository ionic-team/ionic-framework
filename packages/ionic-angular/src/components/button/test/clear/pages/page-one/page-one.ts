import { Component } from '@angular/core';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  clearButton = true;

  toggleClear() {
    this.clearButton = !this.clearButton;
  }
}
