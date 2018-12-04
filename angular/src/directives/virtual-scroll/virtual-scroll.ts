import { ChangeDetectorRef, ContentChild, Directive, ElementRef, EmbeddedViewRef } from '@angular/core';
import { proxyInputs } from '../proxies';
import { VirtualItem } from './virtual-item';
import { VirtualHeader } from './virtual-header';
import { VirtualFooter } from './virtual-footer';
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

  @ContentChild(VirtualItem) itmTmp!: VirtualItem;
  @ContentChild(VirtualHeader) hdrTmp!: VirtualHeader;
  @ContentChild(VirtualFooter) ftrTmp!: VirtualFooter;

  constructor(
    private el: ElementRef,
    public cd: ChangeDetectorRef,
  ) {
    el.nativeElement.nodeRender = this.nodeRender.bind(this);

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

  private nodeRender(el: HTMLElement | null, cell: any, index: number) {
    if (!el) {
      const view = this.itmTmp.viewContainer.createEmbeddedView(
        this.getComponent(cell.type),
        { $implicit: null, index },
        index
      );
      el = getElement(view);
      (el as any)['$ionView'] = view;
    }
    const node = (el as any)['$ionView'];
    const ctx = node.context as VirtualContext;
    ctx.$implicit = cell.value;
    ctx.index = cell.index;
    node.detectChanges();
    return el;
  }

  private getComponent(type: number) {
    switch (type) {
      case 0: return this.itmTmp.templateRef;
      case 1: return this.hdrTmp.templateRef;
      case 2: return this.ftrTmp.templateRef;
    }
    throw new Error('template for virtual item was not provided');
  }
}

function getElement(view: EmbeddedViewRef<VirtualContext>): HTMLElement | null {
  const rootNodes = view.rootNodes;
  for (let i = 0; i < rootNodes.length; i++) {
    if (rootNodes[i].nodeType === 1) {
      return rootNodes[i];
    }
  }
  return null;
}
