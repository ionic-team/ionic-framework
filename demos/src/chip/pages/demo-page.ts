import { Component } from '@angular/core';

@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  delete(chip: Element) {
    chip.remove();
  }
}
