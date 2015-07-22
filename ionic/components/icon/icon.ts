import {Directive, View, CSSClass, ElementRef} from 'angular2/angular2';

import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';
import {Ion} from '../ion';
import {Platform} from '../../platform/platform';


/*

'home': {
  ios: ['ion-ios-home', 'ion-ios-home-outline'],
  md: 'ion-md-home'
}

1-for-1 swap
Map of stuff that's 1-for-1
<icon name="home"></icon>
<icon class="ion-ios-home"></icon>
<icon class="ion-md-home"></icon>


Always use the same no matter what
Cuz it's not in the map of 1-for-1's
<icon name="alert"></icon>
<icon class="ion-alert"></icon>


Different between modes
Used different attributes
<icon ios-name="search3" md-name="search2"></icon>
<icon class="ion-ios-search3"></icon>
<icon class="ion-md-search2"></icon>



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
    'iconName'
  ],
  host: {
    '[attr.aria-label]': 'label',
    'role': 'img'
  }
})
export class IconDirective {
  constructor(elementRef: ElementRef) {
    this.ele = elementRef.nativeElement;
  }

  onInit() {
    if (this.name) {
      this.ele.classList.add(this.name);
      this.label = this.name.replace('ion-', '').replace('ios-', '').replace('md-', '').replace('-', '');
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
