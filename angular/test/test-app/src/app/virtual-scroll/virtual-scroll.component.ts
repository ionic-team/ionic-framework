import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderFn } from '@ionic/core';
import { IonVirtualScroll } from '@ionic/angular';

@Component({
  selector: 'app-virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
})
export class VirtualScrollComponent {

  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;

  items = Array.from({length: 100}, (_, i) => ({ name: `${i}`, checked: true}));

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
    console.log('adding items');
    this.items.push(
      { name: `New Item`, checked: true}
    );
    this.virtualScroll.checkEnd();
  }
}
