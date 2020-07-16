import { Injectable, IterableChangeRecord, IterableDiffers, TrackByFunction } from '@angular/core';

export interface VirtualScrollDiff {
  changeRangePositions: {
    offset: number;
    range: number;
  }[];
  dirtyCheckPosition: number | null;
  trackByArray: object[];
}

@Injectable({
  providedIn: 'root',
})
export class VirtualScrollController {
  constructor(private iterableDiffers: IterableDiffers) {}

  diff(recentArray: object[], incomingArray: object[], trackByFn: TrackByFunction<any>): VirtualScrollDiff {
    const differs = this.iterableDiffers.find(recentArray).create(trackByFn);
    differs.diff(recentArray);
    const changes = differs.diff(incomingArray);

    if (changes === null) {
      return {
        changeRangePositions: [],
        dirtyCheckPosition: null,
        trackByArray: recentArray,
      };
    }

    const changeObject: {
      type: 'create' | 'remove' | 'move';
      record: IterableChangeRecord<any>;
    }[] = [];

    changes.forEachOperation(
      (item: IterableChangeRecord<any>, adjustedPreviousIndex: number | null,
       currentIndex: number | null) => {
        let type: 'create' | 'remove' | 'move';
        if (item.previousIndex === null) {
          type = 'create';
        } else if (currentIndex === null) {
          type = 'remove';
        } else if (adjustedPreviousIndex !== null) {
          type = 'move';
        } else {
          throw new Error('IterableChangeRecord has no type');
        }
        changeObject.push({
          type,
          record: item
        });
      });

    const checkChange: number[] = [];
    const checkDirty: number[] = [];
    for (const changed of changeObject) {
      const newItemIndex = changed.record.currentIndex !== null ? changed.record.currentIndex : 0;
      if (['create'].includes(changed.type)) {
        checkDirty.push(newItemIndex);
      }
      if (['remove', 'change'].includes(changed.type)) {
        const currentItemIndex = recentArray.findIndex((e, i) => {
          return trackByFn(i, e) === trackByFn(i, changed.record.item);
        });
        recentArray.splice(currentItemIndex, 1);
        if (changed.type === 'remove') {
          checkDirty.push(currentItemIndex);
          continue;
        }
        if (changed.type === 'move') {
          checkChange.push(newItemIndex);
          checkChange.push(currentItemIndex);
        }
      }
      if (changed.record.currentIndex !== null) {
        recentArray.splice(changed.record.currentIndex, 0, changed.record.item);
      }
    }

    const uniqueChange = Array.from(new Set(checkChange));
    uniqueChange.sort();

    const changeRangePositions = uniqueChange.reduce((a: any[], c) => {
      if (a[a.length - 1] && a[a.length - 1].offset + a[a.length - 1].range === c) {
        a[a.length - 1].range ++;
      } else {
        a.push({ offset: c, range: 1 });
      }
      return a;
    }, []);

    /**
     * Check order of Array
     */
    const newOrder = recentArray.map((item, i) => trackByFn(i, item));
    const incomingOrder = incomingArray.map((item, i) => trackByFn(i, item));

    for (let i = 0; i < newOrder.length; i++) {
      if (newOrder[i] !== incomingOrder[i]) {
        checkDirty.push(i);
      }
    }

    return {
      trackByArray: recentArray,
      dirtyCheckPosition: checkDirty.length === 0 ? null : Math.min.apply(null, checkDirty),
      changeRangePositions,
    };
  }
}
