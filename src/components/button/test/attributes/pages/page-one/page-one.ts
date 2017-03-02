import { Component } from '@angular/core';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  isFull: boolean = true;
  isBlock: boolean = true;
  isBarClear: boolean = true;

  // Styles
  isSolid: boolean = true;
  isOutline: boolean = true;
  isClear: boolean = true;

  // Colors
  isSecondary: string = 'secondary';
  isDanger: string = 'danger';
  isDark: string = 'dark';

  toggleBlock() {
    this.isFull = !this.isFull;
    this.isBlock = !this.isBlock;
  }

  // Toggles solid, outline, and clear buttons
  toggleStyles() {
    this.isSolid = !this.isSolid;
    this.isOutline = !this.isOutline;
    this.isClear = !this.isClear;
  }

  // Toggles the colors on the buttons (secondary, danger, dark)
  toggleColors() {
    this.isSecondary = (this.isSecondary === 'secondary' ? '' : 'secondary');
    this.isDanger = (this.isDanger === 'danger' ? '' : 'danger');
    this.isDark = (this.isDark === 'dark' ? '' : 'dark');
  }

  toggleBarClear() {
    this.isBarClear = !this.isBarClear;
  }

  removeColors() {
    this.isSecondary = null;
    this.isDanger = null;
    this.isDark = null;
  }
}
