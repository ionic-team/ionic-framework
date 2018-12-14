import { Component, OnInit } from '@angular/core';
import { HeaderFn } from '@ionic/core';

@Component({
  selector: 'app-virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
})
export class VirtualScrollComponent {

  items = Array.from({length: 1000}, (_, i) => i);

  myHeaderFn: HeaderFn = (_, index) => {
    if ((index % 10) === 0) {
      return `Header ${index}`;
    }
  }

  myFooterFn: HeaderFn = (_, index) => {
    if ((index % 5) === 0) {
      return `Footer ${index}`;
    }
  }
}
