import { Injectable, IterableChangeRecord, IterableDiffers, TrackByFunction } from '@angular/core';

export interface VirtualScrollDiff {
  checkRange: {
    offset: number;
    range: number;
  }[];
  trackByArray: object[];
}

@Injectable({
  providedIn: 'root',
})
export class VirtualScrollController {
  constructor(private iterableDiffers: IterableDiffers) {}

  /**
   * Helper instead of trackBy
   * @param recentArray
   * @param incomingArray
   * @param trackByFn
   */
  diff(recentArray: object[], incomingArray: object[], trackByFn: TrackByFunction<any>): VirtualScrollDiff {
    const differs = this.iterableDiffers.find(recentArray).create(trackByFn);
    differs.diff(recentArray);
    const changes = differs.diff(incomingArray);

    if (changes === null) {
      return {
        checkRange: [],
        trackByArray: recentArray,
      }
    }

    const changeObject: {
      type: 'create' | 'remove' | 'change';
      record: IterableChangeRecord<any>;
    }[] = [];

    changes.forEachOperation(
      (item: IterableChangeRecord<any>, adjustedPreviousIndex: number|null,
       currentIndex: number|null) => {
        let type: 'create' | 'remove' | 'change';
        if (item.previousIndex == null) {
          type = 'create';
        } else if (currentIndex == null) {
          type = 'remove';
        } else if (adjustedPreviousIndex !== null) {
          type = 'change';
        } else {
          throw new Error('IterableChangeRecord has no type');
        }
        changeObject.push({
          type,
          record: item
        });
      });

    const checkNum = [];
    for (const changed of changeObject) {
      checkNum.push(changed.record.currentIndex);
      if (['change', 'remove'].includes(changed.type)) {
        const index = recentArray.findIndex((e, i) => {
          return trackByFn(i, e) === trackByFn(i, changed.record.item);
        });
        recentArray.slice(index, 1);
        if (changed.type === 'remove') {
          continue;
        }
      }
      if (changed.record.currentIndex !== null) {
        recentArray.splice(changed.record.currentIndex, 0, changed.record.item);
      }
    }

    const checkRange = checkNum.reduce((a: any[], c) => {
      if (a[a.length - 1] && a[a.length - 1].offset + a[a.length - 1].range === c) {
        a[a.length - 1].range ++;
      } else {
        a.push({ offset: c, range: 1 });
      }
      return a;
    }, []);

    return {
      checkRange,
      trackByArray: recentArray
    };
  }
}
