import {Component, View, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';


@Component({
  selector: 'ion-content',
  properties: [
    'parallax'
  ]
})
@View({
  template: '<div class="scroll-content"><content></content></div>'
})
export class Content extends Ion {
  constructor(elementRef: ElementRef, ionicConfig: IonicConfig) {
    super(elementRef, ionicConfig);
  }

  onIonInit() {
    this.scrollElement = this.getNativeElement().children[0];
  }

  addScrollEventListener(handler) {
    if(!this.scrollElement) { return; }

    this.scrollElement.addEventListener('scroll', handler);

    return () => {
      this.scrollElement.removeEventListener('scroll', handler);
    }
  }
}
