import {ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicDirective} from '../../config/annotations';
import {ListVirtualScroll} from './virtual';
import * as util from 'ionic/util';


@IonicDirective({
  selector: 'ion-card',
  host: {
    'class': 'list'
  }
})
export class Card extends Ion {
  constructor(elementRef: ElementRef, ionicConfig: IonicConfig) {
    super(elementRef, ionicConfig);
  }
}
