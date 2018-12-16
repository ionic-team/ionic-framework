import { ContentChild, Directive, ElementRef, EmbeddedViewRef, NgZone } from '@angular/core';
import { Cell, CellType } from '@ionic/core';

import { proxyInputs } from '../proxies';

import { VirtualFooter } from './virtual-footer';
import { VirtualHeader } from './virtual-header';
import { VirtualItem } from './virtual-item';
import { VirtualContext } from './virtual-utils';

@Directive({
  selector: 'ion-virtual-scroll',
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
export class VirtualScroll {

  private refMap = new WeakMap<HTMLElement, EmbeddedViewRef<VirtualContext>> ();

  @ContentChild(VirtualItem) itmTmp!: VirtualItem;
  @ContentChild(VirtualHeader) hdrTmp!: VirtualHeader;
  @ContentChild(VirtualFooter) ftrTmp!: VirtualFooter;

  constructor(
    private el: ElementRef,
    private zone: NgZone,
  ) {
    const nativeEl = el.nativeElement as HTMLIonVirtualScrollElement;
    nativeEl.nodeRender = this.nodeRender.bind(this);

    proxyInputs(this, this.el.nativeElement, [
      'approxItemHeight',
      'approxHeaderHeight',
      'approxFooterHeight',
      'headerFn',
      'footerFn',
      'items',
      'itemHeight'
    ]);
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
      node.markForCheck();
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
