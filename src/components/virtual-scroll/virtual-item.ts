import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { VirtualContext } from './virtual-util';


/**
 * @private
 */
@Directive({selector: '[virtualHeader]'})
export class VirtualHeader {
  constructor(public templateRef: TemplateRef<VirtualContext>) {}
}


/**
 * @private
 */
@Directive({selector: '[virtualFooter]'})
export class VirtualFooter {
  constructor(public templateRef: TemplateRef<VirtualContext>) {}
}


/**
 * @private
 */
@Directive({selector: '[virtualItem]'})
export class VirtualItem {
  constructor(public templateRef: TemplateRef<VirtualContext>, public viewContainer: ViewContainerRef) {}
}
