import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { VirtualContext } from './virtual-util';

/**
 * @hidden
 */
@Directive({selector: '[virtualItem]'})
export class VirtualItem {
  constructor(public templateRef: TemplateRef<VirtualContext>, public viewContainer: ViewContainerRef) {}
}
