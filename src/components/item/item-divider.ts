import { Directive, ElementRef, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Form } from '../../util/form';
import { Ion } from '../ion';

/**
 * @hidden
 */
@Directive({
  selector: 'ion-item-divider',
  host: {
    'class': 'item-divider'
  }
})
export class ItemDivider extends Ion {

  constructor(form: Form, config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer, 'item-divider');
  }
}
