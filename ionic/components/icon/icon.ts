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
    '[attr.aria-hidden]': 'ariaHidden',
    'role': 'img'
  }
})
export class IconDirective {
  constructor(elementRef: ElementRef, @Optional() @Parent() parentButton: Button) {
    var ele = this.ele = elementRef.nativeElement;

    this.iconLeft = this.iconRight = this.iconOnly = false;
    this.ariaHidden = true;

    if (parentButton) {
      // this icon is within a button
      this.withinButton = true;

      // check if there is a sibling element (that's not aria hidden)
      let hasNextSiblingElement = ele.nextElementSibling && ele.nextElementSibling.getAttribute('aria-hidden') !== 'true';

      if (!hasNextSiblingElement) {
        // this icon is within a button, and doesn't have a sibling element
        // check for text nodes to the right and left of this icon element
        this.iconLeft = (ele.nextSibling && ele.nextSibling.textContent || '').trim() !== '';
        this.iconRight = (ele.previousSibling && ele.previousSibling.textContent || '').trim() !== '';
        this.iconOnly = !this.iconLeft && !this.iconRight;
      }

      // tell the button there's a child icon
      // the button will set the correct css classes on itself
      parentButton.registerIcon(this);
    }
  }

  onInit() {
    if (!this.name) return;

    // add the css class to show the icon font
    this.ele.classList.add(this.name);

    // hide the icon when it's within a button
    // and the button isn't an icon only button
    this.ariaHidden = (this.withinButton && !this.iconOnly);

    if (!this.ariaHidden) {
      // the icon is either not within a button
      // or the icon is within a button, and its an icon only button
      this.label = this.name.replace('ion-', '').replace('ios-', '').replace('md-', '').replace('-', '');
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
