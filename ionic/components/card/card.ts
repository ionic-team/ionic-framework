import {ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicDirective} from '../../config/decorators';
import {ListVirtualScroll} from './virtual';
import * as util from 'ionic/util';

/**
 * TODO
 */
@IonicDirective({
  selector: 'ion-card'
})
export class Card extends Ion {
  /**
   * TODO
   * @param {ElementeRef} elementRef  TODO
   * @param {IonicConfig} ionicConfig  TODO
   */
  constructor(elementRef: ElementRef, ionicConfig: IonicConfig) {
    super(elementRef, ionicConfig);
  }
}
