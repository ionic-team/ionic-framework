import { Component, OnInit, ViewChild } from '@angular/core';
import { IonVirtualScroll, VirtualScrollController } from '@ionic/angular';

@Component({
  selector: 'app-virtual-scroll',
  templateUrl: './virtual-scroll-track-by.component.html',
})
export class VirtualScrollTrackByComponent {
  constructor(
    private virtualScrollController: VirtualScrollController,
  ) {}

  @ViewChild(IonVirtualScroll, { static: true }) virtualScroll: IonVirtualScroll;

  items = Array.from({length: 100}, (_, i) => ({ id: i, name: `${i}`}));

  itemHeight = () => 44;

  addItems() {
    console.log('adding items');
    const lastId = this.items[this.items.length - 1].id + 1;
    const newItem = this.items.concat([{ id: lastId, name: `New Item` }]);
    const { trackByArray, checkRange } = this.virtualScrollController.diff(this.items, newItem, this.trackByFn);
    this.items = trackByArray as any;
    checkRange.forEach(range => {
      this.virtualScroll.checkRange(range.offset, range.range);
    });
  }

  trackByFn = (index, item) => item.id;
}
