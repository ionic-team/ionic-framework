import { Directive, ElementRef, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';


/**
  * @hidden
  */
@Directive({
  selector: 'ion-card'
})
export class Card extends Ion {

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer, 'card');
  }
}
