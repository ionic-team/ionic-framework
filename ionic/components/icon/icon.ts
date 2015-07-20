import {Directive, View, CSSClass, onInit, ElementRef} from 'angular2/angular2';

import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';
import {Ion} from '../ion';
import {Platform} from '../../platform/platform';


/*

Ionicons Font Icon
<icon name="home"></icon>
<icon class="ion-ios-home"></icon>
<icon class="ion-md-home"></icon>


Ionicons SVG
<icon svg="home"></icon>
<icon><svg>...ios...</svg></icon>
<icon><svg>...md...</svg></icon>


Custom SVG File
<icon svg-src="home.svg"></icon>


Custom Font Icon
<icon class="fa-home"></icon>

*/


@Directive({
  selector: 'icon',
  properties: [
    'name',
  ],
  host: {
    '[attr.aria-label]': 'label',
    'role': 'img'
  },
  lifecycle: [onInit]
})
export class IconDirective {
  constructor(elementRef: ElementRef) {
    this.ele = elementRef.nativeElement;
  }
  onInit() {
    if (this.name) {
      this.ele.classList.add(this.name);
      this.label = this.name;
    }
  }
}

@IonicComponent({
  selector: 'ion-icon',
  properties: [
    'md',
    'ios'
  ],
  host: {
    'mode': 'mode'
  }
})
@View({
  template: '<i class="icon" [class]="iconClass">',
  directives: [CSSClass]
})
export class Icon extends Ion {
  constructor(elementRef: ElementRef, ionicConfig: IonicConfig) {
    super(elementRef, ionicConfig);
  }
  onIonInit() {
    this.iconClass = this.ios;
    console.log('ICON', this.mode);
    setTimeout(() => {
      console.log('MODE', this.mode);
    });
  }
}
