import { Directive, TemplateRef } from '@angular/core';

import { VirtualContext } from './virtual-utils';

/**
 * @hidden
 */
@Directive({ selector: '[virtualFooter]' })
export class VirtualFooter {
  constructor(public templateRef: TemplateRef<VirtualContext>) {}
}
