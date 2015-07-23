import {Directive, View, CSSClass, ElementRef, Optional, Parent} from 'angular2/angular2';

import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';
import {Ion} from '../ion';
import {Platform} from '../../platform/platform';
import {Button} from '../button/button';


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
    '[attr.role]': 'role',
    '[attr.aria-hidden]': 'hidden'
  }
})
export class IconDirective {
  constructor(elementRef: ElementRef, @Optional() @Parent() parentButton: Button) {
    var ele = this.ele = elementRef.nativeElement;

    this.previousText = (ele.previousSibling && ele.previousSibling.textContent || '').trim();
    this.nextText = (ele.nextSibling && ele.nextSibling.textContent || '').trim();

    if (parentButton) {
      this.withinButton = true;
      this.iconLeft = !!this.nextText;
      this.iconRight = !!this.previousText;
      this.iconOnly = !this.iconLeft && !this.iconRight;

      parentButton.registerIcon(this);
    }
  }

  onInit() {
    if (!this.name) return;

    // add the css class
    this.ele.classList.add(this.name);


    if (this.withinButton && !this.iconOnly) {
      // icon's within a button that has text
      this.hidden = true;

    } else {
      // either not within a button, or it's not a icon only button
      this.role = 'img';
      this.hidden = false;
      this.label = this.name.replace('ion-', '').replace('ios-', '').replace('md-', '').replace('-', '');
    }


    if (this.iconOnly) {
      // this is an icon within a button that has not text label

    } else {

    }



  }

  onDestroy() {
    this.ele = null;
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
