import { Directive, TemplateRef } from '@angular/core';

import { VirtualContext } from './virtual-utils';

/**
 * @hidden
 */
@Directive({ selector: '[virtualHeader]' })
export class VirtualHeader {
  constructor(public templateRef: TemplateRef<VirtualContext>) {}
}
