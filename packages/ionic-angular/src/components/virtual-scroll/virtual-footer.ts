import { Directive, TemplateRef } from '@angular/core';
import { VirtualContext } from './virtual-util';

/**
 * @hidden
 */
@Directive({selector: '[virtualFooter]'})
export class VirtualFooter {
  constructor(public templateRef: TemplateRef<VirtualContext>) {}
}
