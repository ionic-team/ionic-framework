import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';


/**
 * @internal
 */
@Directive({selector: '[virtualHeader]'})
export class VirtualHeader {
  constructor(public templateRef: TemplateRef<Object>) {}
}


/**
 * @internal
 */
@Directive({selector: '[virtualFooter]'})
export class VirtualFooter {
  constructor(public templateRef: TemplateRef<Object>) {}
}


/**
 * @internal
 */
@Directive({selector: '[virtualItem]'})
export class VirtualItem {
  constructor(public templateRef: TemplateRef<Object>, public viewContainer: ViewContainerRef) {}
}
