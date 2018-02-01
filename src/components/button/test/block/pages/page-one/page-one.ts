import { Component } from '@angular/core';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  blockButton = true;

  toggleBlock() {
    this.blockButton = !this.blockButton;
  }
}
