import { Component } from '@angular/core';

@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {

  onSlideWillChange(s: any) {
    console.log(`onSlideWillChange: ${s}`);
  }

  onSlideDidChange(s: any) {
    console.log(`onSlideDidChange: ${s}`);
  }

  onSlideDrag(s: any) {
    console.log(`onSlideDrag: ${s}`);
  }

}
