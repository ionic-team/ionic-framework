import { Component, OnInit } from '@angular/core';
import { HeaderFn } from '@ionic/core';

@Component({
  selector: 'app-virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
})
export class VirtualScrollComponent {

  items = Array.from({length: 100}, (_, i) => `${i}`);

  itemHeight = () => 44;

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

  addItems() {
    this.items.push(
      'New Item 0',
      'New Item 1',
      'New Item 2',
      'New Item 3',
      'New Item 4',
      'New Item 5',
    );
  }
}
