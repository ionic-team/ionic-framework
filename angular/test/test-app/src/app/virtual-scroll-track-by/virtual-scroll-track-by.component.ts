import { Component, OnInit, ViewChild } from '@angular/core';
import { IonVirtualScroll, VirtualScrollController } from '@ionic/angular';

@Component({
  selector: 'app-virtual-scroll',
  templateUrl: './virtual-scroll-track-by.component.html',
})
export class VirtualScrollTrackByComponent {

  @ViewChild(IonVirtualScroll, { static: true }) virtualScroll: IonVirtualScroll;
  items = Array.from({length: 10}, (_, i) => ({ id: i, name: `${i}`}));
  itemHeight = () => 44;
  itemId = 10;

  constructor(
    private virtualScrollController: VirtualScrollController,
  ) {}

  addItems(position: 'top' | 'last') {
    this.itemId ++;
    const newItem = (position === 'top') ?
      [{ id: this.itemId, name: `TopItem-${this.itemId}` }].concat(this.items)
      : this.items.concat([{ id: this.itemId, name: `BottomItem-${this.itemId}` }]);

    const { trackByArray, dirtyCheckPosition } = this.virtualScrollController.diff(this.items, newItem, this.trackByFn);
    this.items = trackByArray as any;
    if (dirtyCheckPosition !== null) {
      this.virtualScroll.checkRange(dirtyCheckPosition);
    }
  }

  changeItems(itemId: number) {
    const newItem = this.items.map(d => {
      if (d.id === itemId) {
        d.name = 'ChangeItem-' + d.id;
      }
      return d;
    });

    const { trackByArray, changeRangePositions } = this.virtualScrollController.diff(this.items, newItem, this.trackByFn);
    this.items = trackByArray as any;
    changeRangePositions.forEach(range => {
      this.virtualScroll.checkRange(range.offset, range.range);
    });
  }

  deleteItems(itemId: number) {
    const newItem = this.items.filter(d => {
      return d.id !== itemId
    });

    const { trackByArray, dirtyCheckPosition } = this.virtualScrollController.diff(this.items, newItem, this.trackByFn);
    this.items = trackByArray as any;
    if (dirtyCheckPosition !== null) {
      this.virtualScroll.checkRange(dirtyCheckPosition);
    }
  }

  trackByFn = (index, item) => item.id;
}
