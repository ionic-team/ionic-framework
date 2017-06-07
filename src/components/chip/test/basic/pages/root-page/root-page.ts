import { Component } from '@angular/core';


@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  delete(chip: Element) {
    chip.remove();
  }
}
