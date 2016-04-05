import {Directive, TemplateRef, ViewContainerRef} from 'angular2/core';


/**
 * @private
 */
@Directive({selector: '[virtualHeader]'})
export class VirtualHeader {
  constructor(public templateRef: TemplateRef) {}
}


/**
 * @private
 */
@Directive({selector: '[virtualFooter]'})
export class VirtualFooter {
  constructor(public templateRef: TemplateRef) {}
}


/**
 * @private
 */
@Directive({selector: '[virtualItem]'})
export class VirtualItem {
  constructor(public templateRef: TemplateRef, public viewContainer: ViewContainerRef) {}
}
