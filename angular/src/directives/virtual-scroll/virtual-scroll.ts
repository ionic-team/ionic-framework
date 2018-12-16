import { Component, ContentChild, ElementRef, EmbeddedViewRef, Input, IterableDiffer, IterableDiffers, NgZone, SimpleChanges, TrackByFunction, ChangeDetectionStrategy } from '@angular/core';
import { Cell, CellType } from '@ionic/core';

import { proxyInputs } from '../proxies';

import { VirtualFooter } from './virtual-footer';
import { VirtualHeader } from './virtual-header';
import { VirtualItem } from './virtual-item';
import { VirtualContext } from './virtual-utils';

@Component({
  selector: 'ion-virtual-scroll',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: [
    'approxItemHeight',
    'approxHeaderHeight',
    'approxFooterHeight',
    'headerFn',
    'footerFn',
    'items',
    'itemHeight'
  ]
})
export class IonVirtualScroll {

  private differ: IterableDiffer<any>;
  private nativeEl: HTMLIonVirtualScrollElement;
  private refMap = new WeakMap<HTMLElement, EmbeddedViewRef<VirtualContext>> ();

  @ContentChild(VirtualItem) itmTmp!: VirtualItem;
  @ContentChild(VirtualHeader) hdrTmp!: VirtualHeader;
  @ContentChild(VirtualFooter) ftrTmp!: VirtualFooter;

  /**
   * Same as `ngForTrackBy` which can be used on `ngFor`.
   */
  @Input() virtualTrackBy: TrackByFunction<any>;
  @Input() items: any;

  constructor(
    private zone: NgZone,
    private iterableDiffers: IterableDiffers,
    el: ElementRef,
  ) {
    this.nativeEl = el.nativeElement as HTMLIonVirtualScrollElement;
    this.nativeEl.nodeRender = this.nodeRender.bind(this);

    proxyInputs(this, this.nativeEl, [
      'approxItemHeight',
      'approxHeaderHeight',
      'approxFooterHeight',
      'headerFn',
      'footerFn',
      'items',
      'itemHeight'
    ]);
    // proxyMethods(this, this.nativeEl)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('items' in changes) {
      // React on virtualScroll changes only once all inputs have been initialized
      const value = changes['items'].currentValue;
      if (this.differ == null && value != null) {
        try {
          this.differ = this.iterableDiffers.find(value).create(this.virtualTrackBy);
        } catch (e) {
          throw new Error(
            `Cannot find a differ supporting object '${value}'. VirtualScroll only supports binding to Iterables such as Arrays.`);
        }
      }
    }
  }

  ngDoCheck() {
    // and if there actually are changes
    const changes = this.differ != null ? this.differ.diff(this.items) : null;
    if (changes == null) {
      return;
    }

    debugger;
    // changes.forEachOperation((_, pindex, cindex) => {
    //   // add new record after current position
    //   if (pindex === null && (cindex < lastRecord)) {
    //     console.debug('virtual-scroll', 'adding record before current position, slow path');
    //     needClean = true;
    //     return;
    //   }
    //   // remove record after current position
    //   if (pindex < lastRecord && cindex === null) {
    //     console.debug('virtual-scroll', 'removing record before current position, slow path');
    //     needClean = true;
    //     return;
    //   }
    // });
  }

  private nodeRender(el: HTMLElement | null, cell: Cell, index: number): HTMLElement {
    return this.zone.run(() => {
      if (!el) {
        const view = this.itmTmp.viewContainer.createEmbeddedView(
          this.getComponent(cell.type),
          { $implicit: null, index },
          index
        );
        el = getElement(view);
        this.refMap.set(el, view);
      }
      const node = this.refMap.get(el)!;
      const ctx = node.context as VirtualContext;
      ctx.$implicit = cell.value;
      ctx.index = cell.index;
      this.zone.run(() => node.markForCheck());
      return el;
    });
  }

  private getComponent(type: CellType) {
    switch (type) {
      case 'item': return this.itmTmp.templateRef;
      case 'header': return this.hdrTmp.templateRef;
      case 'footer': return this.ftrTmp.templateRef;
    }
    throw new Error('template for virtual item was not provided');
  }
}

function getElement(view: EmbeddedViewRef<VirtualContext>): HTMLElement {
  const rootNodes = view.rootNodes;
  for (let i = 0; i < rootNodes.length; i++) {
    if (rootNodes[i].nodeType === 1) {
      return rootNodes[i];
    }
  }
  throw new Error('virtual element was not created');
}
