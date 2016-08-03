import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';


/**
 * @private
 */
@Directive({selector: '[virtualHeader]'})
export class VirtualHeader {
  constructor(public templateRef: TemplateRef<Object>) {}
}


/**
 * @private
 */
@Directive({selector: '[virtualFooter]'})
export class VirtualFooter {
  constructor(public templateRef: TemplateRef<Object>) {}
}


/**
 * @private
 */
@Directive({selector: '[virtualItem]'})
export class VirtualItem {
  constructor(public templateRef: TemplateRef<Object>, public viewContainer: ViewContainerRef) {}
}
