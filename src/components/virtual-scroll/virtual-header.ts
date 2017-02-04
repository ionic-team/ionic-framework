import { Directive, TemplateRef } from '@angular/core';
import { VirtualContext } from './virtual-util';

/**
 * @private
 */
@Directive({selector: '[virtualHeader]'})
export class VirtualHeader {
  constructor(public templateRef: TemplateRef<VirtualContext>) {}
}
