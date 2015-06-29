import {ElementRef} from 'angular2/angular2';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';

import {Routable, NavController, IonicView} from 'ionic/ionic';


@Component({selector: 'ion-view'})
@IonicView({
  templateUrl: 'pages/app.html'
})
class AppPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  doLogin() {
  }
}


/**
 * Main app entry point
 */
@Component({ selector: 'ion-app' })
@IonicView({
  directives: [ParallaxEffect],
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    this.rootView = AppPage

    this.menuOpenAmount = 0;
  }

  onMenuOpening(amt) {
    this.menuOpenAmount = amt;
  }
}

@Directive({
  selector: '[parallax]',
  properties: [
    'parallax'
  ]
})
export class ParallaxEffect {
  constructor(
    elementRef: ElementRef
  ) {
    this.ele = elementRef.nativeElement;

    setTimeout(() => {
      Object.observe(this, (changes) => {
        changes.forEach((change) => {
          if(change.name == 'parallax') {
            this.parallaxItems();
          }
        });
      });
    });
  }
  parallaxItems() {
    let list = this.ele;
    console.log('Moving items', this.parallax);
    var x = Math.max(0, (1 - this.parallax) * 20);
    var y = 0;//Math.max(0, (1 - this.parallax) * 10);
    var scale = Math.min(1, (0.9 + 0.1 * this.parallax));
    list.style['opacity'] = Math.min(this.parallax, 1);
    list.style['transform'] = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scale + ')';
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
